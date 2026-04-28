import { Event, Event$, License, Record$ } from '@competition-manager/schemas';
import { z } from 'zod';
import { env } from '../env';
import { closePage, getBrowser } from './browserPool';

export const BeathleticsResults$ = z.record(
  Event$.shape.name,
  z.array(Record$),
);
export type BeathleticsResults = z.infer<typeof BeathleticsResults$>;

/**
 * Fetches athlete results from Beathletics using Puppeteer.
 * This approach bypasses Cloudflare protection by using a real browser.
 */
export const getResults = async (
  license: License,
  events: Event['name'][],
  from: Date = new Date(0),
  to: Date = new Date(),
) => {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // Step 1: Navigate to the main site to trigger and solve Cloudflare challenge
    await page.goto('https://www.beathletics.be', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Step 2: Wait a bit to ensure Cloudflare challenge is fully resolved
    await new Promise((r) => setTimeout(r, 2000));

    // Step 3: Make the API call from within the browser context
    const data = await page.evaluate(
      (apiUrl: string, lic: string) => {
        return fetch(`${apiUrl}/athlete/new/${lic}`).then((res) => {
          if (!res.ok) throw new Error(`API returned ${res.status}`);
          return res.json();
        });
      },
      env.RECORDS_API,
      license,
    );

    const results = data.results;
    let records: BeathleticsResults = {};

    for (let result of results) {
      if (!result.result.discipline.eventType) continue;
      let discipline = result.result.discipline.eventType.name_fr;
      if (!events.includes(discipline)) continue;
      let date = new Date(result.result.discipline.competition.startDate);
      if (date < from || date > to) continue;
      if (result.result.newTrials && result.result.newTrials.length > 0) {
        for (let j = 0; j < result.result.newTrials.length; j++) {
          if (result.result.newTrials[j].homologationBest) {
            if (!records[discipline]) records[discipline] = [];

            records[discipline].push(
              Record$.parse({
                date: date,
                perf: parseFloat(result.result.newTrials[j].rankingPerf),
              }),
            );
          }
        }
      }
    }

    return BeathleticsResults$.parse(records);
  } catch (err) {
    console.error(`Error fetching results for license ${license}:`, err);
    throw err;
  } finally {
    await closePage(page);
  }
};

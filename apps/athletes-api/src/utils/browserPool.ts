import puppeteer, { Browser } from 'puppeteer';

let browserInstance: Browser | null = null;

/**
 * Gets or creates a singleton browser instance.
 * Reuses the same browser across requests to avoid expensive launches.
 */
export async function getBrowser(): Promise<Browser> {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Important for Docker environments
      ],
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      closeBrowser();
    });
  }

  return browserInstance;
}

/**
 * Closes the browser instance gracefully.
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

/**
 * Closes a page safely.
 */
export async function closePage(page: any): Promise<void> {
  try {
    await page.close();
  } catch (err) {
    // Page might already be closed, ignore
  }
}

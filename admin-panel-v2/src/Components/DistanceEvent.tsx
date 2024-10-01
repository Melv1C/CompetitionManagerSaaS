import React, { useEffect, useState } from "react";

import {
  Result,
  Competition,
  Competition_Event,
  Athlete,
  formatResult,
  compareResult,
} from "cm-data";

import {
  Table,
  newColumn,
  Button,
  toast,
  Select,
  RowContainer,
  confirm,
  openOrderListModal
} from "ui-kit";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { openAddAthletesModal } from "./Modals/AddAthletesModal";

import myAxios, { MySQLQuery } from "../AxiosHandler";

interface DistanceEventProps {
  competition: Competition;
}

async function SQLQuery(query: string, values: any[] = []) {
  const response = await MySQLQuery(query, values);
  return response;
}

const DistanceEvent: React.FC<DistanceEventProps> = ({ competition }) => {
  const [event, setEvent] = useState<Competition_Event | undefined>(undefined);
  const [events, setEvents] = useState<Competition_Event[]>([]);

  useEffect(() => {
    SQLQuery("SELECT * FROM competition_events WHERE competition_id = ?", [
      competition.id,
    ]).then((data) => {
      setEvents(
        data
          .map((data: any) => Competition_Event.fromJson(data))
          .filter(
            (event: Competition_Event) => event.event_resultType === "Distance"
          )
      );
    });
  }, [competition]);

  useEffect(() => {
    if (events.length > 0) {
      setEvent(events[0]);
    }
  }, [events]);

  const [columns, _] = useState([
    newColumn({ title: "Order", link: "order", width: 50 }),
    newColumn({ title: "Place", link: "place", width: 50 }),
    newColumn({ title: "Dossard", link: "bib", width: 75 }),
    newColumn({ title: "Nom", link: "name" }),
    newColumn({ title: "Club", link: "club", width: 75 }),
    newColumn({ title: "Best", link: "result", width: 100 }),
    newColumn({
      title: "Attempt 1",
      link: "1",
      editable: true,
      type: "number",
      width: 100,
      valueFormatter: (value: any) =>
        value ? formatResult(value, "Distance") : "",
    }),
    newColumn({
      title: "Attempt 2",
      link: "2",
      editable: true,
      type: "number",
      width: 100,
      valueFormatter: (value: any) =>
        value ? formatResult(value, "Distance") : "",
    }),
    newColumn({
      title: "Attempt 3",
      link: "3",
      editable: true,
      type: "number",
      width: 100,
      valueFormatter: (value: any) =>
        value ? formatResult(value, "Distance") : "",
    }),
    newColumn({
      title: "Attempt 4",
      link: "4",
      editable: true,
      type: "number",
      width: 100,
      valueFormatter: (value: any) =>
        value ? formatResult(value, "Distance") : "",
    }),
    newColumn({
      title: "Attempt 5",
      link: "5",
      editable: true,
      type: "number",
      width: 100,
      valueFormatter: (value: any) =>
        value ? formatResult(value, "Distance") : "",
    }),
    newColumn({
      title: "Attempt 6",
      link: "6",
      editable: true,
      type: "number",
      width: 100,
      valueFormatter: (value: any) =>
        value ? formatResult(value, "Distance") : "",
    }),
    newColumn({
      title: "Delete",
      link: "delete",
      width: 75,
      content(row) {
        return (
          <Button
            variant="danger"
            onClick={() => {
              confirm("Are you sure you want to delete this athlete?", () => {
                setResults((prev) =>
                  prev.filter((result) => result.bib !== row.bib)
                );
              });
            }}
            rounded
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        );
      },
    }),
  ]);

  const [tableData, setTableData] = useState<any[]>([]);

  const [results, setResults] = useState<Result[]>([]);
  const [inscriptions, setInscriptions] = useState<Athlete[]>([]);

  useEffect(() => {
    if (!competition || !event) return;
    myAxios
      .get(
        `https://competitionmanager.be/api/results/${competition.name}/${event?.name}`
      )
      .then((res) => {
        //console.log(res.data.data.sort((a: any, b: any) => a.initialOrder - b.initialOrder).map((data: any) => data.firstName + " " + data.lastName));
        setResults(res.data.data.sort((a: any, b: any) => a.initialOrder - b.initialOrder).map((data: any) => Result.fromJson(data)));
      });

    myAxios
      .get(`https://competitionmanager.be/api/inscriptions/9f121efa21`)
      .then((res) => {
        const licences = res.data.data
          .filter((inscription: any) => inscription.event === event?.name)
          .sort((a: any, b: any) => a.record - b.record)
          .map((inscription: any) => inscription.athleteId);
        // console.log(licences);
        SQLQuery("SELECT * FROM athletes WHERE licence IN (?)", [
          licences,
        ]).then((data) => {
          // console.log(data);
          setInscriptions(data.sort((a: any, b: any) => licences.indexOf(a.licence) - licences.indexOf(b.licence)).map((data: any) => Athlete.fromJson(data)));
        });
      });
  }, [competition, event]);

  async function updateResult(newData: any) {
    console.log(newData);
    console.log(results);
    const result = results[newData._GridId];
    if (!result) return;
    for (let attemptIndex = 1; attemptIndex <= 6; attemptIndex++) {
      if (newData[attemptIndex]) {
        // find the result detail if it exists
        const resultDetail = result.details.find(
          (detail) => detail.trynum === attemptIndex.toString()
        );
        if (resultDetail) {
          resultDetail.value = newData[attemptIndex];
          resultDetail.result = formatResult(
            newData[attemptIndex],
            event!.event_resultType
          );
        } else {
          // create a new result detail
          const newResultDetail = result.newDetail();
          newResultDetail.trynum = attemptIndex.toString();
          newResultDetail.value = newData[attemptIndex];
          newResultDetail.result = formatResult(
            newData[attemptIndex],
            event!.event_resultType
          );
        }
      }
    }

    result.getBest();
    setResults([...results]);

    // send the result to the server
    if (result.details.length > 0) {
      // const devURL = "http://localhost:3001/api/results";
      const devURL = "https://competitionmanager.be/api/results";

      if (result.id > 0) {
        // update the result
        myAxios
          .put(
            `${devURL}/${result.id}`,
            result.toJson()
          )
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        // create the result
        myAxios
          .post(
            `${devURL}`,
            result.toJson()
          )
          .then((res) => {
            console.log(res.data);
            result.id = res.data.data.id;
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }

  useEffect(() => {

    const _results = [...results].sort((a, b) => compareResult("Distance", a.value, b.value));
    for (let i = 0; i < _results.length; i++) {
      if (_results[i].value <= 0) {
        _results[i].place = undefined;
      } else {
        _results[i].place = i + 1;
      }
    }
    _results.sort((a, b) => a.initialOrder - b.initialOrder);

    setTableData(
      _results.map((result) => {
        let data: any = {
          bib: result.bib,
          name: result.lastName + ", " + result.firstName,
          club: result.club,
          result: result.result,
          place: result.place,
          order: result.initialOrder
        };
        result.details.forEach((detail) => {
          data[detail.trynum] = detail.value;
        });

        return data;
      })
    );
  }, [results]);

  async function createResult(athlete: Athlete) {
    athlete.birthDate = new Date(athlete.birthDate);

    // if already in the results
    if (results.find((result) => result.athlete_ref === athlete.licence)) {
      toast({ type: "error", message: "Athlete already in the results" });
      return;
    }

    // Create a result
    const result = new Result();
    // need to define a temp result id
    result.id = 0;
    result.setAthlete(athlete);
    result.competition_id = competition.id;
    result.setEvent(event!);

    setResults((prev) => {
      result.initialOrder = prev.length + 1;
      return [...prev, result];
    });
  }

  return (
    <div>
      <h1>Distance Event</h1>

      <RowContainer>
        <Select
          options={events.map((event) => ({
            label: event.name,
            value: event.id,
          }))}
          value={event ? { label: event.name, value: event.id } : undefined}
          onChange={(value) => {
            const eventId = value?.value;
            const tempEvent = events.find((c) => c.id === eventId);
            setEvent(tempEvent);
          }}
        />
        {/* add athletes */}
        <Button
          onClick={() =>
            openAddAthletesModal({
              inscriptions: inscriptions,
              onAddAthletes: (athletes: Athlete[]) => {
                athletes.forEach((athlete: Athlete) => {
                  createResult(athlete);
                });
              },
            })
          }
        >
          Ajouter des Athlètes
        </Button>

        {/* order list */}
        <Button
          onClick={() => {
            openOrderListModal(results.map(result => result.bib + " - " + result.firstName + " " + result.lastName), (orderList) => {
              setResults((prev) => {
                orderList.forEach((name, index) => {
                  const result = prev.find(result => result.bib + " - " + result.firstName + " " + result.lastName === name);
                  if (result) {
                    result.initialOrder = index + 1;
                  }
                });
                prev.sort((a, b) => a.initialOrder - b.initialOrder);
                return [...prev];
              });
            });
          }}
          disabled={results.length === 0}
        >
          Changer l'ordre
        </Button>

      </RowContainer>

      <RowContainer>
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          {/* Code: -1 = X, -2 = -, -3 = DNS, -7 = NM, -8 = r */}
          <div>Codes: </div>
          <div>-1 = X</div>
          <div>|</div>
          <div>-2 = -</div>
          <div>|</div>
          <div>-3 = DNS</div>
          <div>|</div>
          <div>-7 = NM</div>
          <div>|</div>
          <div>-8 = r</div>
        </div>
      </RowContainer>


      {event && (
        <Table
          columns={columns}
          data={tableData}
          UpdateData={updateResult}
          height={500}
        />
      )}
    </div>
  );
};

export default DistanceEvent;

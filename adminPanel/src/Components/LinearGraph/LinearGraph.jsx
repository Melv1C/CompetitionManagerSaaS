import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';


function dateToString(date) {
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  return dd + '/' + mm + '/' + yyyy;
}

function stringToDate(str) {
  const parts = str.split('/');
  const dd = parseInt(parts[0]);
  const mm = parseInt(parts[1]);
  const yyyy = parseInt(parts[2]);
  return new Date(yyyy, mm - 1, dd);
}

function removeYearDicDates(Dic) {
  const newDic = {};
  for (let key in Dic) {
    const newKey = key.substring(0, key.lastIndexOf('/'));
    newDic[newKey] = Dic[key];
  }
  return newDic;
}

export const LinearGraph = ({ inscriptions, type, dataName }) => {
  const chartContainer = useRef(null);

  useEffect(() => {
    let newChartInstance = null;
    

    if (inscriptions && inscriptions.length > 0) {
      let inscriptionsByDay = inscriptions.reduce((acc, inscription) => {
        const date = new Date(inscription.timestamp);
        const day = dateToString(date);
        if (dataName === 'Inscription par jour' || dataName ===  'Nouveaux athlètes par jour') {
          acc[day] = (acc[day] || 0) + 1;
        }else if (dataName === '€ par jour') {
          acc[day] = (acc[day] || 0) + inscription.cost;
        }else{
          console.error('Invalid dataName');
        }
        return acc;
      }, {});

      // add missing days with 0 inscriptions
      const firstDay = Object.keys(inscriptionsByDay)[0];
      const lastDay = dateToString(new Date());
      const allDays = {};
      let currentDate = stringToDate(firstDay);
      while (dateToString(currentDate) !== lastDay) {
        allDays[dateToString(currentDate)] = 0;
        currentDate.setDate(currentDate.getDate() + 1);
      }
      inscriptionsByDay = { ...allDays, ...inscriptionsByDay };
      if (type === 'line') {
        for (const day in inscriptionsByDay) {
          if (day !== Object.keys(inscriptionsByDay)[0]) {
            inscriptionsByDay[day] += inscriptionsByDay[Object.keys(inscriptionsByDay)[Object.keys(inscriptionsByDay).indexOf(day) - 1]];
          }
        }
      }
      inscriptionsByDay = removeYearDicDates(inscriptionsByDay);
      const labels = Object.keys(inscriptionsByDay);
      const counts = labels.map(day => inscriptionsByDay[day]);

      const dataset = {
        label: dataName,
        data: counts,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0,
      };

      const ctx = chartContainer.current.getContext('2d');
      newChartInstance = new Chart(ctx, {
        type: type,
        data: {
          labels,
          datasets: [dataset],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    // Cleanup function to destroy existing Chart instance
    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, [inscriptions, type, dataName]);

  return <canvas className='canvas-linear-graph' ref={chartContainer}></canvas>;
};
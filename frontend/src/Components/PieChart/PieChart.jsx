import React, { useState, useEffect } from 'react'

import './PieChart.css'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({data, title}) => {

    if (!data) {
        return <div>Loading...</div>
    }

    const values = Object.values(data).map(val => val.value);
    const labels = Object.values(data).map(val => val.key);
    
    const chartdata = {
        labels: labels,
        datasets: [
          {
            label: '# of Athletes',
            data: values,
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)',
            ],
          },
        ],   
      };

    return (
        <div className="pie-chart-item">
            <h2>{title}</h2>
            <div>
                <Pie 
                    data={chartdata}
                    width={200}
                    height={200}
                    options={
                        { 
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                },
                                datalabels: {
                                    color: 'black',
                                    formatter: (value, ctx) => {

                                        // if (value)

                                        const label = ctx.chart.legend.legendItems[ctx.dataIndex].text;
                                        return label;
                                    },
                                }
                            }
                            
                        }
                    }
                    plugins={[ChartDataLabels]}
                    
                />
            </div>
        </div>
    )
}

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function Graph1({ tweets }) {
  // Count positive/negative/neutral based on labels
  const positive = tweets.filter(tweet => tweet.OpenAI_Label_Comment === 0).length;
  const negative = tweets.filter(tweet => tweet.OpenAI_Label_Comment === 1).length;
console.log("Positive:", positive, "Negative:", negative);
  const data = {
    labels: [ 'Positive', 'Negative'],
    datasets: [
      {
        label: 'Sentiment Distribution',
        data: [ positive, negative],
        backgroundColor: [ '#4caf50', '#f44336'], // yellow, green, red
        borderColor: ['#fff', '#fff'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '400px', height: '400px', margin: 'auto' }}>
      <Pie data={data} />
    </div>
  );
}

export default Graph1;

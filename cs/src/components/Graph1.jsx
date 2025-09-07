import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Graph1({ tweets }) {
  const positive_cmnts = tweets.filter(tweet => tweet.OpenAI_Label_Comment === 0).length;
  const negative_cmnts = tweets.filter(tweet => tweet.OpenAI_Label_Comment === 1).length;

  const positive_posts = tweets.filter(tweet => tweet.OpenAI_Label_Post === 0).length; // assuming 0 = positive
  const negative_posts = tweets.filter(tweet => tweet.OpenAI_Label_Post === 1).length; // assuming 1 = negative

  const data = [
    {
      name: 'Positive',
      posts: positive_posts,
      comments: positive_cmnts,
    },
    {
      name: 'Negative',
      posts: negative_posts,
      comments: negative_cmnts,
    },
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="posts" fill="#4caf50" />
          <Bar dataKey="comments" fill="#f44336" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Graph1;

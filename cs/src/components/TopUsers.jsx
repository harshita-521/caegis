import React, { useEffect, useState } from 'react';

function TopUsers({ userData }) {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    try {
      if (!userData || !Array.isArray(userData)) return;

      // Create a map to accumulate scores per user
      const userScoresMap = userData.reduce((acc, item) => {
        const author = item.User;

        const commentScore = item.OpenAI_Label_Comment || 0;
        const postScore = item.OpenAI_Label_Post || 0;
        const totalScore = commentScore + postScore;

        if (author) {
          if (acc[author]) {
            acc[author] += totalScore;
          } else {
            acc[author] = totalScore;
          }
        }

        return acc;
      }, {});

      // Convert map to array of objects and sort by score descending
      const sortedTopUsers = Object.entries(userScoresMap)
        .map(([author, score]) => ({ author, score }))
        .sort((a, b) => b.score - a.score);

      setTopUsers(sortedTopUsers);

    } catch (error) {
      console.error('Error computing top users:', error);
    }
  }, [userData]);

  return (
    <div>
      <h2>Top Users</h2>
      <ul>
        {topUsers.map((user, index) => (
          <li key={index}>
            {user.author}: {user.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopUsers;

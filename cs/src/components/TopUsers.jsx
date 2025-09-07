import React from 'react'

function TopUsers({userData}) {

  try {
    const activityData = userData;  // Assuming userData is already set from the API

    // Create a map to accumulate scores per user
    const userScoresMap = activityData.reduce((acc, item) => {
      const author = item.User;

      const commentScore = item.OpenAI_Label_Comment || 0;
      const postScore = item.OpenAI_Label_Post || 0;
      const totalScore = commentScore + postScore;

      if (acc[author]) {
        acc[author] += totalScore;
      } else {
        acc[author] = totalScore;
      }

      return acc;
    }, {});

    // Convert map to array of objects and sort by score descending
    const topUsers = Object.entries(userScoresMap)
      .map(([author, score]) => ({ author, score }))
      .sort((a, b) => b.score - a.score);

    setTopUsers(topUsers);

  } catch (error) {
    console.error('Error computing top users:', error);
  }


  return (
    <div>
     
    </div>
  )
}

export default TopUsers;

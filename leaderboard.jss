const db = firebase.firestore();

function submitScore(levelId, timeTaken) {
  db.collection("leaderboards").add({
    level: levelId,
    time: timeTaken,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

function loadLeaderboard(levelId) {
  const boardDiv = document.getElementById("leaderboardList");
  boardDiv.innerHTML = "Loading top pilots...";

  db.collection("leaderboards")
    .where("level", "==", levelId)
    .orderBy("time")
    .limit(5)
    .get()
    .then(snapshot => {
      let html = "<h3>Top Times</h3><ol>";
      snapshot.forEach(doc => {
        const data = doc.data();
        html += `<li>${data.time}s</li>`;
      });
      html += "</ol>";
      boardDiv.innerHTML = html;
    });
}

const voteCountElement = document.getElementById("vote-count");
const thankYouMsg = document.getElementById("thank-you-msg");

const deviceId = localStorage.getItem("akankshaVotedId") || generateDeviceId();

function generateDeviceId() {
  const id = "device-" + Math.random().toString(36).substring(2, 12);
  localStorage.setItem("akankshaVotedId", id);
  return id;
}

fetch("/api/votes")
  .then(res => res.json())
  .then(data => {
    voteCountElement.innerText = data.count;
  });

function pledgeVote() {
  if (localStorage.getItem("akankshaVoted") === "true") {
    alert("❌ You already voted from this device.");
    return;
  }

  fetch("/api/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId })
  })
    .then(res => {
      if (res.status === 403) throw new Error("Already voted");
      return res.json();
    })
    .then(data => {
      voteCountElement.innerText = data.newCount;
      thankYouMsg.innerText = "🎉 Thanks for your vote!";
      localStorage.setItem("akankshaVoted", "true");
    })
    .catch(err => {
      console.error(err);
      thankYouMsg.innerText = "❌ You already voted.";
    });
}

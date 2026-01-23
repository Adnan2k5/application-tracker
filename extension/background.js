chrome.runtime.onMessage.addListner((msg) => {
  if (msg.type === "APPLICATION_DETECTED") {
    console.log("Application detected:", msg.payload);
  }
  fetch("http://localhost:3000/api/application", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(msg.payload),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Server response:", data);
    })
    .catch((err) => {
      console.error("Error sending application data:", err);
    });
});

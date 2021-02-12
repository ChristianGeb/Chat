const messagesList = document.querySelector("#messages"); // <ul> with all the <li> messages
const messageForm = document.querySelector("#message-form"); // Input form
const inputField = document.querySelector("#msg-input");
const sendButton = document.querySelector("#msg-btn");
const db = firebase.firestore();
const chats = db.collection("chats"); // Reference to the chats folder on firebase

/*     var test = localStorage.getItem("username");
    console.log(test); */


// Check for username, if not enter and save to local storage for future
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("username")) {
    const username = prompt("Username eingeben")
    localStorage.setItem("username", username)
  }
});

// Getting messages from the database
function addChatOnScreen(chat) {
  const localUsername = localStorage.getItem("username")
  /* let time = chat.created.toDate();
   */

  // Messages load, display, check if its local user
  let html = `
        <li class="${chat.username === localUsername ? "msg to-right": "msg"}">
        <span class = "msg-span">
        <div class = "name">${chat.username}
        <span class = "time">${chat.created.toDate().toLocaleTimeString()}</span>
        </div>
        ${chat.messageText}
        </span>
        </li>
      `
  // Adding the generated list item message to the chat
  messagesList.innerHTML += html;

  // Scroll to bottom
  let window = document.querySelector("#messages-window");
  window.scrollTop = window.scrollHeight - window.clientHeight;
}

// Look for added or removed documents in database
chats.orderBy("created", "asc").onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    const doc = change.doc;
    if (change.type === "added") {
      addChatOnScreen(doc.data());
    }
  });
});

// Listen to the Senden button
messageForm.addEventListener('submit', sendMessage);
// Create object with name and messagetext, before check if text is empty
function sendMessage(e) {
  e.preventDefault();
  const messageText = inputField.value;

  // If message not empty send object to the firebase
  if (messageText.trim()) {
    const username = localStorage.getItem("username")
    const now = new Date();
    const message = {
      username: username,
      messageText: messageText,
      created: firebase.firestore.Timestamp.fromDate(now)
    }
    chats.add(message);
  };
  // Clear form after sending
  messageForm.reset();
}
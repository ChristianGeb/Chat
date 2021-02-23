const messagesList = document.querySelector("#messages"); // <ul> with all the <li> messages
const messageForm = document.querySelector("#message-form"); // Input form
const inputField = document.querySelector("#msg-input");
const signOutBtn = document.querySelector("#sign-out-btn");
const settingsBtn = document.querySelector("#settings-btn");
const rooms = document.querySelector(".chat-rooms");
let localUsername;
const db = firebase.firestore();
var chats = db.collection("general");

// Check if user is logged in
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    localUsername = user.displayName;
  } else {
    // If not logged in redirect to loginpage
    window.location.replace("login.html");
  }
});

/* .orderBy("created", "asc").limitToLast(50)
 */

// Select the Channel
rooms.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    chats = db.collection(e.target.getAttribute("id"));
    messagesList.innerHTML = "";
    console.log(chats);
    chats.get().then((doc) => {
      if (doc.exists) {
        console.log(doc)
        /*         addChatOnScreen(doc.data());
         */
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }
});


// Getting messages from the database
function addChatOnScreen(chat) {

  // Time right now and when was the message created
  let now = new Date();
  let createdAt = chat.created.toDate();
  const oneDay = 60 * 60 * 24 * 1000

  // Is the message older than one 24 hours?
  var oldMessage = (now - createdAt) > oneDay;

  // If true convert to full date (e.g. 12.2.2021), if false convert to time (e.g. 19:23:15)
  const messageDate = oldMessage ? chat.created.toDate().getDate() +
    "." + (chat.created.toDate().getMonth() + 1) +
    "." + chat.created.toDate().getFullYear() :
    chat.created.toDate().toLocaleTimeString();

  // Messages load, display, check if its local user
  let html = `
        <li class="${chat.username === localUsername ? "msg to-right": "msg"}">
        <span class = "${chat.username === localUsername ? "msg-span color-right": "msg-span"}">
        <div class = "name">${chat.username}
        <span class = "time">${messageDate}</span>
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
chats.orderBy("created", "asc").limitToLast(50).onSnapshot(snapshot => {
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

    const now = new Date();
    const message = {
      username: localUsername,
      messageText: messageText,
      created: firebase.firestore.Timestamp.fromDate(now)
    }
    chats.add(message);
  };
  // Clear form after sending
  messageForm.reset();
}

signOutBtn.addEventListener("click", signOut);

function signOut() {
  firebase.auth().signOut().then(() => {
    console.log("You have been signed out");
    window.location.replace("login.html");
  }).catch((error) => {
    console.log("There was an error!")
  });
}
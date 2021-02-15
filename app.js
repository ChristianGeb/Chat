const messagesList = document.querySelector("#messages"); // <ul> with all the <li> messages
const messageForm = document.querySelector("#message-form"); // Input form
const inputField = document.querySelector("#msg-input");
const sendButton = document.querySelector("#msg-btn");
const signedIn = document.querySelector("#signed-in");
const signedOut = document.querySelector("#signed-out");
const signInBtn = document.querySelector("#sign-in-btn");

const db = firebase.firestore();
const chats = db.collection("chats"); // Reference to the chats folder on firebase

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
  signInOptions: [{
    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    requireDisplayName: false
  }]
});

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: 'loggedIn.html',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID

  ],

};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);


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
    const messagesList = document.querySelector("messages"); // <ul> with all the <li> messages
    const messageForm = document.querySelector("message-form"); // Input form
    const inputField = document.querySelector("msg-input");
    const sendButton = document.querySelector("msg-btn");
    const db = firebase.firestore();
    const chats = db.ref("/chats"); // Reference to the chats folder on firebase

    /*     var test = localStorage.getItem("username");
        console.log(test); */


    // Check for username, if not enter and save to local storage for future
    document.addEventListener("DOMContentLoaded", () => {
      if (!localStorage.getItem("username")) {
        const username = prompt("Username eingeben")
        localStorage.setItem("username", username)
        return username;
      }
    });

    // Listen to the Senden button
    messageForm.addEventListener('submit', sendMessage);
    // Create object with name and messagetext, before check if text is empty
    function sendMessage(e) {
      e.preventDefault();
      const messageText = inputField.value;

      if (messageText.trim());
      const message = {
        username: username,
        messageText: messageText
      };

      msgRef.push(msg);
      inputField.reset();
    }
import * as signalR from '@aspnet/signalr';
import { AZURE_CONF } from './configuration';

export const configureSignalR = () => {
  document.addEventListener('DOMContentLoaded', function () {

    function generateRandomName() {
      return Math.random().toString(36).substring(2, 10);
    }

    // Get the user name and store it to prepend to messages.
    var username = generateRandomName();
    var messageInput = {
      value: "Hello W!"
    }

    var timeStampInMs = undefined;

    function getTimestamp() {
      return window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
    }

    function bindConnectionMessage(connection) {
      var messageCallback = function (name, message) {

        if (!message) return;
        // Html encode display name and message.
        var encodedName = name;
        var encodedMsg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        var messageBox = document.getElementById('messages');
        messageBox.innerHTML = "";
        if (encodedMsg !== undefined && encodedMsg !== null) {
          try {

            if (timeStampInMs === undefined) {
              timeStampInMs = getTimestamp();
            }

            const mess = JSON.parse(encodedMsg);

            const previousTimestamp = timeStampInMs;
            timeStampInMs = getTimestamp();

            console.log(timeStampInMs, Number(mess.Timestamp), Number((timeStampInMs - Number(mess.Timestamp))));


            console.log("Diff : " + Number(timeStampInMs - previousTimestamp));
            let messageHtml = "<p>Currency :" + mess.CurrencyType + "</p>";
            messageHtml += "<p>Price :" + mess.Price + "</p>";
            messageHtml += "<p>Mess N°" + mess.Id + "</p>";
            messageBox.innerHTML = messageHtml;
          } catch (error) {
            messageBox.innerText = encodedMsg;
          }

        }
      };
      // Create a function that the hub can call to broadcast messages.
      connection.on('broadcastMessage', messageCallback);
      connection.on('echo', messageCallback);
      connection.onclose(onConnectionError);
    }

    function onConnected(connection) {
      console.log('connection started');
      connection.send('broadcastMessage', '_SYSTEM_', 'Connection started, waiting for streaming');
      connection.send("AddGroup");
    }


    function onConnectionError(error) {
      if (error && error.message) {
        console.error(error.message);
      }
    }

    var connection = new signalR.HubConnectionBuilder()
      .withUrl(AZURE_CONF.hubEndpoint)
      .build();
    bindConnectionMessage(connection);
    connection.start()
      .then(function () {
        onConnected(connection);
      })
      .catch(function (error) {
        console.error(error.message);
      });
  });
}
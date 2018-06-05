import * as signalR from '@aspnet/signalr';
import { AZURE_CONF } from './configuration';
import * as metrics from '../metrics/metrics';
import * as hdr from "hdr-histogram-js";
import * as histogram from "../histogram/utils"


export const configureSignalR = (componentState) => {
  document.addEventListener('DOMContentLoaded', function () {

    const latencyHistogram = hdr.build();
    const deltaBtwMessHistogram = hdr.build();
    let newTimestamp = metrics.getTimestampInMs();
    function bindConnectionMessage(connection) {
      var messageCallback = function (name, message) {

        if (!message) return;

        var encodedMsg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");


        if (encodedMsg !== undefined && encodedMsg !== null) {
          try {
            const receivedMessage = JSON.parse(encodedMsg);

            const previousTimestamp = newTimestamp;
            newTimestamp = metrics.getTimestampInMs();
            histogram.updateLatencyHistogram(latencyHistogram, componentState, metrics.getRoundTripMessageResultInMs(receivedMessage.Timestamp, newTimestamp));
            histogram.updateDeltaBtwMessHistogram(deltaBtwMessHistogram, componentState, Number(newTimestamp - previousTimestamp));
            
            let id = "";
            switch (receivedMessage.CurrencyType) {
              case "EUR/USD": id = "messages-eur_usd";
                break;
              case "EUR/JPY": id = "messages-eur_jpy";
                break;
              case "EUR/GBP": id = "messages-eur_gbp";
                break;
              case "USD/JPY": id = "messages-usd_jpy";
                break;
              case "USD/GBP": id = "messages-usd_gbp";
            }
            var messageBox = document.getElementById(id);
            messageBox.innerHTML = "";



            let messageHtml = "<p>Currency :" + receivedMessage.CurrencyType + "</p>";
            messageHtml += "<p>Price :" + receivedMessage.Price + "</p>";
            messageHtml += "<p>Mess N°" + receivedMessage.Id + "</p>";
            messageBox.innerHTML = messageHtml;
          } catch (error) {
            //messageBox.innerText = encodedMsg;
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
      connection.send("AddCurrencyPair", "EUR/USD");
      connection.send("AddCurrencyPair", "EUR/JPY");
      connection.send("AddCurrencyPair", "EUR/GBP");
      connection.send("AddCurrencyPair", "USD/GBP");
      connection.send("AddCurrencyPair", "USD/JPY");
    }


    function onConnectionError(error) {
      if (error && error.message) {
        console.error(error.message);
        latencyHistogram.outputPercentileDistribution();
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

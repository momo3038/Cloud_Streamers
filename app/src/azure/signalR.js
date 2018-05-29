import * as signalR from '@aspnet/signalr';
import { AZURE_CONF } from './configuration';
import * as metrics from '../metrics/metrics';
import * as hdr from "hdr-histogram-js";

export const configureSignalR = (componentState) => {
  document.addEventListener('DOMContentLoaded', function () {

    function generateRandomName() {
      return Math.random().toString(36).substring(2, 10);
    }

    // Get the user name and store it to prepend to messages.
    var username = generateRandomName();
    var messageInput = {
      value: "Hello W!"
    }

    const latencyHistogram = hdr.build();
    const deltaBtwMessHistogram = hdr.build();

    let timeStampInMs = metrics.getTimestampInMs();

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
            const mess = JSON.parse(encodedMsg);

            const previousTimestamp = timeStampInMs;

            timeStampInMs = metrics.getTimestampInMs();
            var rez = metrics.getDisplayResult(mess.Timestamp, timeStampInMs);
            updateLatencyHistogram(latencyHistogram, componentState, rez);
            updateDeltaBtwMessHistogram(deltaBtwMessHistogram, componentState, Number(timeStampInMs - previousTimestamp));
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

function updateLatencyHistogram(histogram, componentState, newLatencyValue) {
  histogram.recordValue(newLatencyValue);
  componentState.setState({
    latencyResult: createResultObj(newLatencyValue, histogram),
    ...componentState
  });
}

function updateDeltaBtwMessHistogram(histogram, componentState, newLatencyValue) {
  histogram.recordValue(newLatencyValue);
  componentState.setState({
    latencyBtwMessageResult: createResultObj(newLatencyValue, histogram),
    ...componentState
  });
}

function createResultObj(newValue, histogram) {
  return {
    lastLatency: newValue,
    numberOfMessage: histogram.getTotalCount(),
    maxLatency: histogram.maxValue,
    threeNinePercentile: histogram.getValueAtPercentile(99.9),
    twoNinePercentile: histogram.getValueAtPercentile(99),
    oneNinePercentile: histogram.getValueAtPercentile(90),
    minLatency: histogram.minNonZeroValue
  }
}

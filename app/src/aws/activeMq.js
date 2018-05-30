import { AWS_MQ_CONF } from './mqConfiguration';
import {client } from 'stompjs';
import * as metrics from '../metrics/metrics';
import * as hdr from "hdr-histogram-js";
import * as histogram from "../histogram/utils"

export const startClient = (componentState) => {


  var clientStomp = client(AWS_MQ_CONF.activeMqEndpoint, "v11.stomp");

  const latencyHistogram = hdr.build();
  const deltaBtwMessHistogram = hdr.build();
  let newTimestamp = metrics.getTimestampInMs();

  clientStomp.connect(AWS_MQ_CONF.login, AWS_MQ_CONF.mdp,
    function () {
      clientStomp.subscribe("Consumer.client1.VirtualTopic.eur_usd",
        function (message) {
          try {
            console.log(message);
            const receivedMessage = JSON.parse(message.body);

            const previousTimestamp = newTimestamp;
            newTimestamp = metrics.getTimestampInMs();
            histogram.updateLatencyHistogram(latencyHistogram, componentState, metrics.getRoundTripMessageResultInMs(receivedMessage.Timestamp, newTimestamp));
            histogram.updateDeltaBtwMessHistogram(deltaBtwMessHistogram, componentState, Number(newTimestamp - previousTimestamp));

            var messageBox = document.getElementById('messages');
            let messageHtml = "<p>Currency :" + receivedMessage.CurrencyType + "</p>";
            messageHtml += "<p>Price :" + receivedMessage.Price + "</p>";
            messageHtml += "<p>Mess N°" + receivedMessage.Id + "</p>";
            messageBox.innerHTML = messageHtml;
          } catch (error) {
console.log(error);
          }
        })
    }
  );

};
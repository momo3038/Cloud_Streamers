import { AWS_MQ_CONF } from './mqConfiguration';
import { client } from 'stompjs';
import * as metrics from '../metrics/metrics';
import * as hdr from "hdr-histogram-js";
import * as histogram from "../histogram/utils"

function getMessage(message, latencyHistogram, deltaBtwMessHistogram, newTimestamp, componentState) {
  try {
    console.log(message);
    const receivedMessage = JSON.parse(message.body);

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
    console.log(error);
  }
}

export const startClient = (componentState) => {


  var clientStomp = client(AWS_MQ_CONF.activeMqEndpoint, "v11.stomp");

  const latencyHistogram = hdr.build();
  const deltaBtwMessHistogram = hdr.build();
  let newTimestamp = metrics.getTimestampInMs();

  clientStomp.connect(AWS_MQ_CONF.login, AWS_MQ_CONF.mdp, () => {
    const pairs = ["EUR/USD", "EUR/JPY", "EUR/GBP", "USD/JPY", "USD/GBP"]
    pairs.forEach(pair => {
      clientStomp.subscribe(`Consumer.Morgan.VirtualTopic.${pair}`, (message) => getMessage(message, latencyHistogram, deltaBtwMessHistogram, newTimestamp, componentState))
    });
  }
  );

};
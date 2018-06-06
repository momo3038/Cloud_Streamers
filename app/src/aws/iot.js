


import { AWS_IOT_CONF } from './iotConfiguration';
import { client } from 'stompjs';
import * as metrics from '../metrics/metrics';
import * as hdr from "hdr-histogram-js";
import * as histogram from "../histogram/utils"
import * as AWS from 'aws-sdk';
import { device as _device } from "aws-iot-device-sdk";

function getMessage(message, latencyHistogram, deltaBtwMessHistogram, newTimestamp, componentState) {
  try {
    // console.log(message);
    const receivedMessage = JSON.parse(message);

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


  const latencyHistogram = hdr.build();
  const deltaBtwMessHistogram = hdr.build();
  let newTimestamp = metrics.getTimestampInMs();

  var device = _device({
    host: AWS_IOT_CONF.iotEndpoint,
    protocol: "wss",
    clientId: 'subscriber',
    accessKeyId: AWS_IOT_CONF.AccessKey,
    secretKey: AWS_IOT_CONF.Secret,
    region: 'eu-west-1'
  });

  device
    .on('connect', function () {
      console.log('connect');
      device.subscribe('EUR/USD');
    });

  device
    .on('message', function (topic, payload) {
      getMessage(payload,latencyHistogram, deltaBtwMessHistogram, newTimestamp, componentState);
    });

};



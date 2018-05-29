import gql from "graphql-tag";
import AWSAppSyncClient from "aws-appsync";
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import { AWS_CONF } from './configuration';
import * as metrics from '../metrics/metrics';
import * as hdr from "hdr-histogram-js";
import * as histogram from "../histogram/utils"


const appSyncClient = new AWSAppSyncClient({
    url: AWS_CONF.graphQlEndpoint,
    region: AWS_CONF.region,
    auth: {
        type: AUTH_TYPE.API_KEY,
        apiKey: AWS_CONF.apiKey,
    }
});

const getPriceQuery = gql(`
query getPrice {
getPrice(id: 1)  {
  __typename
  id
  typeCurrency
  price
  timestampInMs
}
}`);

const updatePriceSubscriptionQuery = gql(`
subscription updatedPrice {
updatedPrice(id:1) {
  __typename
}
}`);


export const startAppSyncClient = (componentState) => {

    const latencyHistogram = hdr.build();
    const deltaBtwMessHistogram = hdr.build();


    appSyncClient.hydrated().then(function (client) {
        client.query({ query: getPriceQuery })
            .then(function logData(data) {
                console.log('results of query: ', data);
            })
            .catch(console.error);
        const observable = client.subscribe({ query: updatePriceSubscriptionQuery });
        let newTimestamp = metrics.getTimestampInMs();

        const realtimeResults = function realtimeResults(data) {
            var updatedData = data.data.updatedPrice;

            const previousTimestamp = newTimestamp;
            newTimestamp = metrics.getTimestampInMs();
            histogram.updateLatencyHistogram(latencyHistogram, componentState, metrics.getRoundTripMessageResultInMs(updatedData.timestampInMs, newTimestamp));
            histogram.updateDeltaBtwMessHistogram(deltaBtwMessHistogram, componentState, Number(newTimestamp - previousTimestamp));

            var messageBox = document.getElementById('messages');
            let messageHtml = "<p>Currency :" + updatedData.typeCurrency + "</p>";
            messageHtml += "<p>Price :" + updatedData.price + "</p>";
            messageHtml += "<p>Mess N°" + updatedData.id + "</p>";
            messageBox.innerHTML = messageHtml;
        };
        observable.subscribe({
            next: realtimeResults,
            complete: console.log,
            error: console.log,
        });
    });
}
import gql from "graphql-tag";
import AWSAppSyncClient from "aws-appsync";
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import { AWS_APP_SYNC_CONF_WITH_ADD } from './appSyncConfiguration';
import * as metrics from '../metrics/metrics';
import * as hdr from "hdr-histogram-js";
import * as histogram from "../histogram/utils"


const appSyncClient = new AWSAppSyncClient({
    url: AWS_APP_SYNC_CONF_WITH_ADD.graphQlEndpoint,
    region: AWS_APP_SYNC_CONF_WITH_ADD.region,
    auth: {
        type: AUTH_TYPE.API_KEY,
        apiKey: AWS_APP_SYNC_CONF_WITH_ADD.apiKey,
    }
});

const updatePriceSubscriptionQuery = gql(`
subscription addPrice {
    addPrice(currencyType:"EUR/USD") {
  __typename
}
}`);


export const startClient = (componentState) => {

    const latencyHistogram = hdr.build();
    const deltaBtwMessHistogram = hdr.build();

    appSyncClient.hydrated().then(function (client) {
        const observable = client.subscribe({ query: updatePriceSubscriptionQuery });
        let newTimestamp = metrics.getTimestampInMs();

        const realtimeResults = function realtimeResults(data) {
            var updatedData = data.data.addPrice;

            const previousTimestamp = newTimestamp;
            newTimestamp = metrics.getTimestampInMs();
            histogram.updateLatencyHistogram(latencyHistogram, componentState, metrics.getRoundTripMessageResultInMs(updatedData.timestampInMs, newTimestamp));
            histogram.updateDeltaBtwMessHistogram(deltaBtwMessHistogram, componentState, Number(newTimestamp - previousTimestamp));

            var messageBox = document.getElementById('messages');
            let messageHtml = "<p>Currency :" + updatedData.currencyType + "</p>";
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

import React, { Component } from 'react';
import '../App.css';
import { SimplePricer } from './SimplePricer';
import * as signalr from '../azure/signalR'
import { AZURE_CONF } from '../azure/configuration';
import { Histogram } from '../histogram/Histogram';
import * as HistogrammUtils from '../histogram/utils';
import { StartStream } from './StartStream';


class PricerAzureSignalR extends Component {
    constructor(props) {
        super(props);
        this.state = HistogrammUtils.initState();
    }

    componentDidMount() {
        signalr.configureSignalR(this);
    }

    componentWillUnmount() {

    }

    render(props) {
        return (
            <div>
                <StartStream fetchUrl={AZURE_CONF.fetchStreamUrl} />
                <div className="pricers">
                    <SimplePricer pair="EUR/USD" id="messages-eur_usd" />
                    <SimplePricer pair="EUR/JPY" id="messages-eur_jpy" />
                    <SimplePricer pair="EUR/GBP" id="messages-eur_gbp" />
                    <SimplePricer pair="USD/JPY" id="messages-usd_jpy" />
                    <SimplePricer pair="USD/GBP" id="messages-usd_gbp" />
                </div>

                <div className="histograms">
                    <Histogram {...this.state.latencyResult} title="Message Latency (Back -> CSP -> Front)" />
                    <Histogram {...this.state.latencyBtwMessageResult} title="Delta between Message (Back = 50 ms)" />
                </div>
            </div>
        );
    }
}

export default PricerAzureSignalR;
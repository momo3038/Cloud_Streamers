
import React, { Component } from 'react';
import '../App.css';
import { SimplePricer } from './SimplePricer';
import * as signalr from '../azure/signalR'
import { AZURE_CONF } from '../azure/configuration';
import { Histogram } from '../histogram/Histogram';
import  * as HistogrammUtils from '../histogram/utils';


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

    askForStream() {
        fetch(AZURE_CONF.fetchStreamUrl)
            .then(function (response) {

            });
    }

    render(props) {
        return (
            <div>
                <button className="btn btn-success" onClick={this.askForStream}>Start streaming</button>
                <div className="pricers">
                    <SimplePricer pair="EUR/USD" />
                    <SimplePricer pair="USD/JPY" />
                    <SimplePricer pair="EUR/JPY" />
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
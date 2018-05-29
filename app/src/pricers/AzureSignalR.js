
import React, { Component } from 'react';
import '../App.css';
import { SimplePricer } from './SimplePricer';
import * as signalr from '../azure/signalR'
import { AZURE_CONF } from '../azure/configuration';

class PricerAzureSignalR extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        signalr.configureSignalR();
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
                <button class="btn btn-success" onClick={this.askForStream}>Start streaming</button>
                <div className="pricers">
                    <SimplePricer pair="EUR/USD" />
                    <SimplePricer pair="USD/JPY" />
                    <SimplePricer pair="EUR/JPY" />
                </div>
            </div>
        );
    }
}

export default PricerAzureSignalR;

import React, { Component } from 'react';
import '../App.css';
import { SimplePricer } from './SimplePricer';
import * as signalr from '../azure/signalR'
import { AZURE_CONF } from '../azure/configuration';
import * as HistogrammUtils from '../histogram/utils';
import { StartStream } from './StartStream';
import { Histograms } from '../histogram/Histograms';


class PricerAzureSignalR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            histograms: HistogrammUtils.initState()
        }
    }

    componentDidMount() {
        signalr.configureSignalR(this);
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

                <Histograms {...this.state.histograms} />
            </div>
        );
    }
}

export default PricerAzureSignalR;
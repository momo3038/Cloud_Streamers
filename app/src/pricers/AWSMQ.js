
import React, { Component } from 'react';
import '../App.css';
import { SimplePricer } from './SimplePricer';
import { AWS_MQ_CONF } from '../aws/mqConfiguration';
import * as HistogrammUtils from '../histogram/utils';
import * as activeMq from '../aws/activeMq';
import { StartStream } from './StartStream';
import { Histograms } from '../histogram/Histograms';


class PricerAWSMQ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            histograms: HistogrammUtils.initState()
        }
    }

    componentDidMount() {
        activeMq.startClient(this);
    }

    render(props) {
        return (
            <div>
                <StartStream fetchUrl={AWS_MQ_CONF.fetchStreamUrl} />
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

export default PricerAWSMQ;

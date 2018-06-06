
import React, { Component } from 'react';
import '../App.css';
import { SimplePricer } from './SimplePricer';
import { AWS_IOT_CONF } from '../aws/iotConfiguration';
import * as HistogrammUtils from '../histogram/utils';
import * as iot from '../aws/iot';
import { StartStream } from './StartStream';
import { Histograms } from '../histogram/Histograms';


class PricerAWSIot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            histograms: HistogrammUtils.initState()
        }
    }

    componentDidMount() {
        iot.startClient(this);
    }

    render(props) {
        return (
            <div>
                <StartStream fetchUrl={AWS_IOT_CONF.fetchStreamUrl} />
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

export default PricerAWSIot;

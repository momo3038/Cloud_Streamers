
import React, { Component } from 'react';
import '../App.css';
import { SimplePricer } from './SimplePricer';
import { AWS_MQ_CONF } from '../aws/mqConfiguration';
import { Histogram } from '../histogram/Histogram'
import * as HistogrammUtils from '../histogram/utils';
import * as activeMq from '../aws/activeMq';
import { StartStream } from './StartStream';


class PricerAWSMQ extends Component {
    constructor(props) {
        super(props);
        this.state = HistogrammUtils.initState();
    }

    componentDidMount() {
        activeMq.startClient(this);
    }

    render(props) {
        return (
            <div>
                <StartStream fetchUrl={AWS_MQ_CONF.fetchStreamUrl} />
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

export default PricerAWSMQ;

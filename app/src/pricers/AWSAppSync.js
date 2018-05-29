
import React, { Component } from 'react';
import '../App.css';
import { SimplePricer } from './SimplePricer';
import { AWS_CONF } from '../aws/configuration';
import * as graphQl from '../aws/graphql';
import { Histogram } from '../histogram/Histogram'
import  * as HistogrammUtils from '../histogram/utils';


class PricerAWSAppSync extends Component {
    constructor(props) {
        super(props);
        this.state = HistogrammUtils.initState();
    }

    componentDidMount() {
        graphQl.startAppSyncClient(this);
    }

    askForStream() {
        fetch(AWS_CONF.fetchStreamUrl)
            .then(function (response) {

            });
    }

    render(props) {
        return (
            <div>
                <button className="btn btn-success" onClick={this.askForStream} >Start streaming</button>
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

export default PricerAWSAppSync;

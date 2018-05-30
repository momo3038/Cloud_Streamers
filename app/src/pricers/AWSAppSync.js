
import React, { Component } from 'react';
import '../App.css';
import { SimplePricer } from './SimplePricer';
import { AWS_APP_SYNC_CONF } from '../aws/appSyncConfiguration';
import * as graphQl from '../aws/graphql';
import { Histogram } from '../histogram/Histogram'
import * as HistogrammUtils from '../histogram/utils';
import { StartStream } from './StartStream';


class PricerAWSAppSync extends Component {
    constructor(props) {
        super(props);
        this.state = HistogrammUtils.initState();
    }

    componentDidMount() {
        graphQl.startClient(this);
    }

    render(props) {
        return (
            <div>
                <StartStream fetchUrl={AWS_APP_SYNC_CONF.fetchStreamUrl} />

                <div className="pricers">
                    <SimplePricer pair="EUR/USD" />
                    <SimplePricer pair="USD/JPY" />
                    <SimplePricer pair="EUR/JPY" />
                </div>

                <div className="histograms">
                    <Histogram {...this.state.latencyResult} title="Message Latency (Back -> CSP -> Front)" />
                    <Histogram {...this.state.latencyBtwMessageResult} title="Delta between Message (Back = 50 ms)" />
                </div>
            </div >
        );
    }
}

export default PricerAWSAppSync;

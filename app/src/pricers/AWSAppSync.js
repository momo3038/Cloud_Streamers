
import React, { Component } from 'react';
import '../App.css';
import { SimplePricer } from './SimplePricer';
import { AWS_CONF } from '../aws/configuration';
import * as graphQl from '../aws/graphql';

class PricerAWSAppSync extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
       graphQl.startAppSyncClient();
    }

    askForStream() {
        fetch(AWS_CONF.fetchStreamUrl)
            .then(function (response) {

            });
    }

    render(props) {
        return (
            <div>
                <button class="btn btn-success" onClick={this.askForStream} >Start streaming</button>
                <div className="pricers">
                    <SimplePricer pair="EUR/USD" />
                    <SimplePricer pair="USD/JPY" />
                    <SimplePricer pair="EUR/JPY" />
                </div>
            </div>
        );
    }
}

export default PricerAWSAppSync;

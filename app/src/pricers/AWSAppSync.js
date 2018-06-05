
import React, { Component } from 'react';
import '../App.css';
import { SimplePricer } from './SimplePricer';
import { AWS_APP_SYNC_CONF_WITH_UPDATE, AWS_APP_SYNC_CONF_WITH_ADD } from '../aws/appSyncConfiguration';
import * as graphQl from '../aws/graphq-with-add';
import * as HistogrammUtils from '../histogram/utils';
import { StartStream } from './StartStream';
import { Histograms } from '../histogram/Histograms';


class PricerAWSAppSync extends Component {
    constructor(props) {
        super(props);
        this.state = {
            histograms: HistogrammUtils.initState(),
            method: "Add"
        }
    }

    componentDidMount() {
        graphQl.startClient(this);
    }

    setMethod = (e) => {
        this.setState({ method: e.currentTarget.dataset.method, ...this.state });
    }

    render(props) {
        return (
            <div>
                <StartStream fetchUrl={AWS_APP_SYNC_CONF_WITH_ADD.fetchStreamUrl} />
                <button type="button" className={this.state.method === "Add" ? "btn btn-primary btn-sm" : "btn btn-outline-primary btn-sm"} onClick={this.setMethod} data-csp="Add" >With Add</button>
                <button type="button" className={this.state.method === "Update" ? "btn btn-primary btn-sm" : "btn btn-outline-primary btn-sm"} onClick={this.setMethod} data-csp="Update">With Update</button>
                <div className="pricers">
                    <SimplePricer pair="EUR/USD" />
                    <SimplePricer pair="USD/JPY" />
                    <SimplePricer pair="EUR/JPY" />
                </div>

                <Histograms {...this.state.histograms} />
            </div >
        );
    }
}

export default PricerAWSAppSync;

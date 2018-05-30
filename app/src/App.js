import React, { Component } from 'react';
import './App.css';
import PricerAzureSignalR from './pricers/AzureSignalR';
import PricerAWSAppSync from './pricers/AWSAppSync';
import PricerAWSMQ from './pricers/AWSMQ';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { csp: "AzureSignalR" };
  }

  setCSP = (e) => {
    this.setState({ csp: e.currentTarget.dataset.csp });
  }

  render(props) {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Cloud White App with {this.state.csp}</h1>
          <button type="button" className={this.state.csp === "AWSAppSync" ? "btn btn-primary btn-sm" : "btn btn-outline-primary btn-sm"}  onClick={this.setCSP} data-csp="AWSAppSync" >AWS App Sync</button>
          <button type="button" className={this.state.csp === "AzureSignalR" ? "btn btn-primary btn-sm" : "btn btn-outline-primary btn-sm"}  onClick={this.setCSP} data-csp="AzureSignalR"> Azure Signal R</button>
          <button type="button" className={this.state.csp === "AWSMQ" ? "btn btn-primary btn-sm" : "btn btn-outline-primary btn-sm"}  onClick={this.setCSP} data-csp="AWSMQ"> AWS MQ</button>
        </header>

        <div  >
          {this.state.csp === "AzureSignalR" && <PricerAzureSignalR />}
          {this.state.csp === "AWSAppSync" && <PricerAWSAppSync />}
          {this.state.csp === "AWSMQ" && <PricerAWSMQ />}
        </div>
      </div>
    );
  }
}

export default App;

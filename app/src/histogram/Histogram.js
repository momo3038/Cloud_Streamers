
import React from 'react';

function Histogram(props) {
  return (
    <form>
      <h4>{props.title}</h4>
      <div className="form-group row">
        <label htmlFor="lastPingValue" className="col-sm-6 col-form-label">Last value (ms)</label>
        <div className="col-sm-3">
          <input type="number" className="form-control form-control-sm" value={props.lastLatency} id="lastLatency" placeholder="Last latency" readOnly="" />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="pingNumber" className="col-sm-6 col-form-label">Number of messages</label>
        <div className="col-sm-3">
          <input type="number" className="form-control form-control-sm" value={props.numberOfMessage} id="pingNumber" placeholder="Number of Mess" readOnly="" />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="maxPingValue" className="col-sm-6 col-form-label">Max</label>
        <div className="col-sm-3">
          <input type="number" className="form-control form-control-sm" id="maxPingValue" value={props.maxLatency} placeholder="Max Latency Value" readOnly="" />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="threeNinePercentile" className="col-sm-6 col-form-label">99.9%</label>
        <div className="col-sm-3">
          <input type="number" className="form-control form-control-sm" value={props.threeNinePercentile} id="threeNinePercentile" placeholder="99.9%" readOnly="" />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="twoNinePercentile" className="col-sm-6 col-form-label">99%</label>
        <div className="col-sm-3">
          <input type="number" className="form-control form-control-sm" id="twoNinePercentile" value={props.twoNinePercentile} placeholder="99%" readOnly="" />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="oneNinePercentile" className="col-sm-6 col-form-label">90%</label>
        <div className="col-sm-3">
          <input type="number" className="form-control form-control-sm" id="oneNinePercentile" value={props.oneNinePercentile}  placeholder="90%" readOnly="" />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="minPingValue" className="col-sm-6 col-form-label">Min</label>
        <div className="col-sm-3">
          <input type="number" className="form-control form-control-sm" id="minPingValue" value={props.minLatency} placeholder="Min Latency Value" readOnly="" />
        </div>
      </div>
    </form>
  );
}

export { Histogram }

import React from 'react';

function Histogram(props) {
  return (
    <form>
      <h4>{props.title}</h4>
      <div class="form-group row">
        <label for="lastPingValue" class="col-sm-6 col-form-label">Last value (ms)</label>
        <div class="col-sm-3">
          <input type="number" class="form-control form-control-sm" value={props.lastLatency} id="lastLatency" placeholder="Last latency" readonly="" />
        </div>
      </div>
      <div class="form-group row">
        <label for="pingNumber" class="col-sm-6 col-form-label">Number of messages</label>
        <div class="col-sm-3">
          <input type="number" class="form-control form-control-sm" value={props.numberOfMessage} id="pingNumber" placeholder="Number of Mess" readonly="" />
        </div>
      </div>
      <div class="form-group row">
        <label for="maxPingValue" class="col-sm-6 col-form-label">Max</label>
        <div class="col-sm-3">
          <input type="number" class="form-control form-control-sm" id="maxPingValue" value={props.maxLatency} placeholder="Max Latency Value" readonly="" />
        </div>
      </div>
      <div class="form-group row">
        <label for="threeNinePercentile" class="col-sm-6 col-form-label">99.9%</label>
        <div class="col-sm-3">
          <input type="number" class="form-control form-control-sm" value={props.threeNinePercentile} id="threeNinePercentile" placeholder="99.9%" readonly="" />
        </div>
      </div>
      <div class="form-group row">
        <label for="twoNinePercentile" class="col-sm-6 col-form-label">99%</label>
        <div class="col-sm-3">
          <input type="number" class="form-control form-control-sm" id="twoNinePercentile" value={props.twoNinePercentile} placeholder="99%" readonly="" />
        </div>
      </div>
      <div class="form-group row">
        <label for="oneNinePercentile" class="col-sm-6 col-form-label">90%</label>
        <div class="col-sm-3">
          <input type="number" class="form-control form-control-sm" id="oneNinePercentile" value={props.oneNinePercentile}  placeholder="90%" readonly="" />
        </div>
      </div>
      <div class="form-group row">
        <label for="minPingValue" class="col-sm-6 col-form-label">Min</label>
        <div class="col-sm-3">
          <input type="number" class="form-control form-control-sm" id="minPingValue" value={props.minLatency} placeholder="Min Latency Value" readonly="" />
        </div>
      </div>
    </form>
  );
}

export { Histogram }
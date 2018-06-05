import React from 'react';
import { Histogram } from './Histogram';


function Histograms(props) {
    return (
      <div className="histograms">
      <Histogram {...props.latencyResult} />
      <Histogram {...props.latencyBtwMessageResult} />
  </div>
    );
}

export { Histograms }
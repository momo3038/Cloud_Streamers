
export function updateLatencyHistogram(histogram, componentState, newLatencyValue) {
  histogram.recordValue(newLatencyValue);
  componentState.setState({
    latencyResult: createResultObj(newLatencyValue, histogram),
    ...componentState
  });
}

export function updateDeltaBtwMessHistogram(histogram, componentState, newLatencyValue) {
  histogram.recordValue(newLatencyValue);
  componentState.setState({
    latencyBtwMessageResult: createResultObj(newLatencyValue, histogram),
    ...componentState
  });
}

export function initState(){
  return {
    latencyResult: {
      lastLatency: "",
      numberOfMessage: "",
      maxLatency: "",
      threeNinePercentile: "",
      twoNinePercentile: "",
      oneNinePercentile: "",
      minLatency: ""
    },
    latencyBtwMessageResult: {
      lastLatency: "",
      numberOfMessage: "",
      maxLatency: "",
      threeNinePercentile: "",
      twoNinePercentile: "",
      oneNinePercentile: "",
      minLatency: ""
    }
  }
}

function createResultObj(newValue, histogram) {
  return {
    lastLatency: newValue,
    numberOfMessage: histogram.getTotalCount(),
    maxLatency: histogram.maxValue,
    threeNinePercentile: histogram.getValueAtPercentile(99.9),
    twoNinePercentile: histogram.getValueAtPercentile(99),
    oneNinePercentile: histogram.getValueAtPercentile(90),
    minLatency: histogram.minNonZeroValue
  }
}

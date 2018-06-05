
export function updateLatencyHistogram(histogram, componentState, newLatencyValue) {
  histogram.recordValue(newLatencyValue);
  componentState.setState({
    ...componentState.state,
    histograms: {
      latencyResult: { ...componentState.state.histograms.latencyResult, ...createResultObj(newLatencyValue, histogram) },
      latencyBtwMessageResult: componentState.state.histograms.latencyBtwMessageResult,
    },
  });
}

export function updateDeltaBtwMessHistogram(histogram, componentState, newLatencyValue) {
  histogram.recordValue(newLatencyValue);
  componentState.setState({
    ...componentState.state,
    histograms: {
      latencyBtwMessageResult: { ...componentState.state.histograms.latencyBtwMessageResult, ...createResultObj(newLatencyValue, histogram) },
      latencyResult: componentState.state.histograms.latencyResult
    },
  });
}

export function initState() {
  return {
    latencyResult: {
      title: "Message Latency (Back -> CSP -> Front)",
      lastLatency: "",
      numberOfMessage: "",
      maxLatency: "",
      threeNinePercentile: "",
      twoNinePercentile: "",
      oneNinePercentile: "",
      minLatency: "",
      mean: "",
      fiftyPercentile: ""
    },
    latencyBtwMessageResult: {
      title: "Delta between Message (Back = 50 ms)",
      lastLatency: "",
      numberOfMessage: "",
      maxLatency: "",
      threeNinePercentile: "",
      twoNinePercentile: "",
      oneNinePercentile: "",
      minLatency: "",
      mean: "",
      fiftyPercentile: ""
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
    minLatency: histogram.minNonZeroValue,
    mean: histogram.getMean(),
    fiftyPercentile: histogram.getValueAtPercentile(50)
  }
}

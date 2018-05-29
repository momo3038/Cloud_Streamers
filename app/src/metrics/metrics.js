export const getTimestampInMs = () => window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
export const getRoundTripMessageResultInMs = (backendTimestamp, frontendTimestamp) => Number(Number(frontendTimestamp)-Number(backendTimestamp));
export const getDisplayResult =  (backendTimestamp, frontendTimestamp)  => {
  const result =getRoundTripMessageResultInMs(backendTimestamp, frontendTimestamp);
  console.log(result + "ms");
  return result;
}
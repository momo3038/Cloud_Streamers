# Front-end App
- Add Key and Endpoint value to aws/configuration.js file.
- Add / Modify Keys values to Azure/configuration.js file.
- npm i
- npm start

# Backend Configuration

1 - Get API Key and SignalR Endpoint URL from the Azure Console
2 - Setup backend conf by editing file secrets.json
3 - Start bridge
- dotnet restore
- run !

```json
{
  "Streamer:Aws:AppSync:Scenario1:Endpoint": "https://ENDPOINT.appsync-api.eu-west-1.amazonaws.com/graphql",
  "Streamer:Aws:AppSync:Scenario1:Key": "KEY",
  "Streamer:Aws:AppSync:Scenario2:Endpoint": "https://ENDPOINT.appsync-api.eu-west-1.amazonaws.com/graphql",
  "Streamer:Aws:AppSync:Scenario2:Key": "KEY",
  "Streamer:Aws:Mq:Login": "LOGIN",
  "Streamer:Aws:Mq:Mdp": "PASSWORD",
  "Streamer:Aws:Mq:Endpoint": "activemq:ssl://ENDPOINT.mq.eu-west-1.amazonaws.com:61617",
  "Streamer:Azure:Endpoint": "Endpoint=https://ENDPOINT.service.signalr.net;AccessKey=ACCESS_KEY",
  "Streamer:Http:CORS": "http://localhost:3000"
}
```

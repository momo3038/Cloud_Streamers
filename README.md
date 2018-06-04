# Front-end App
- Add Key and Endpoint value to aws/configuration.js file.
- Add / Modify Keys values to Azure/configuration.js file.
- npm i
- npm start

# Backend Configuration
## AWS
1 - Get API Key and Graph QL Endpoint URL from the AWS Console
2 - Setup backend conf
In the CS Proj folder :
- dotnet user-secrets set Streamer:Aws:AppSync:Scenario1:Key YOUR_API_KEY
- dotnet user-secrets set Streamer:Aws:AppSync:Scenario1:Endpoint https://YOUR_END_POINT.appsync-api.REGION.amazonaws.com/graphql
- dotnet user-secrets set Streamer:Aws:AppSync:Scenario2:Key YOUR_API_KEY
- dotnet user-secrets set Streamer:Aws:AppSync:Scenario2:Endpoint https://YOUR_END_POINT.appsync-api.REGION.amazonaws.com/graphql


- dotnet user-secrets set Streamer:Aws:Mq:Endpoint https://YOUR_END_POINT.appsync-api.REGION.amazonaws.com/graphql
- dotnet user-secrets set Streamer:Aws:Mq:Login https://YOUR_END_POINT.appsync-api.REGION.amazonaws.com/graphql
- dotnet user-secrets set Streamer:Aws:Mq:Mdp https://YOUR_END_POINT.appsync-api.REGION.amazonaws.com/graphql

## Azure
1 - Get API Key and SignalR Endpoint URL from the Azure Console
2 - Setup backend conf
In the CS Proj folder :
- dotnet user-secrets set Streamer:Azure:Endpoint Endpoint=https://MY_STREAMER.service.signalr.net;AccessKey=MY_KEY;
- dotnet user-secrets set Streamer:Http:CORS http://localhost:3000
3 - Start bridge
- dotnet restore
- run !

# Run baby, run
3 - Start bridge
- dotnet restore
- run !

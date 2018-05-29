# Front-end App
- Add Key and Endpoint value to aws/configuration.js file.
- Add / Modify Keys values to Azure/configuration.js file.
- npm i
- npm start

# Backend AWS Configuration
1 - Get API Key and Graph QL Endpoint URL from the AWS Console
2 - Setup backend conf
In the CS Proj folder :
- dotnet user-secrets set aws_app_sync_key YOUR_API_KEY
- dotnet user-secrets set graphql_endpoint https://YOUR_END_POINT.appsync-api.REGION.amazonaws.com/graphql
3 - Start bridge
- dotnet restore
- run !

# Backend Azure Configuration
1 - Get API Key and Graph QL Endpoint URL from the Azure Console
2 - Setup backend conf
In the CS Proj folder :
- dotnet user-secrets set azure_streamer_endpoint Endpoint=https://MY_STREAMER.service.signalr.net;AccessKey=MY_KEY;
- dotnet user-secrets set localhost_url http://localhost:3000
3 - Start bridge
- dotnet restore
- run !

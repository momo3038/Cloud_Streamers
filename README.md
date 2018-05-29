# AWS Configuration
1 - Get API Key and Graph QL Endpoint URL from the AWS Console

2 - Setup backend conf
In the CS Proj folder :
- dotnet user-secrets set aws_app_sync_key YOUR_API_KEY
- dotnet user-secrets set graphql_endpoint https://YOUR_END_POINT.appsync-api.REGION.amazonaws.com/graphql

# Azure Configuration
1 - Get API Key and Graph QL Endpoint URL from the Azure Console

2 - Setup backend conf
In the CS Proj folder :
- dotnet user-secrets set azure_streamer_endpoint Endpoint=https://MY_STREAMER.service.signalr.net;AccessKey=MY_KEY;
- dotnet user-secrets set localhost_url http://localhost:3000

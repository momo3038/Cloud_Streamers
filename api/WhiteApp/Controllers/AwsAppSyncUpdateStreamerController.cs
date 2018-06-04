using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Apache.NMS;
using Apache.NMS.ActiveMQ.Commands;
using WhiteApp;
using HdrHistogram;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using AwsWhiteApp;

namespace WhiteApp.Controllers
{
  public class AwsAppSyncUpdateStreamerController : Controller
  {
    private string ApiKey;
    private string GraphQlEndpoint;

    public AwsAppSyncUpdateStreamerController(IConfiguration configuration)
    {
      Configuration = configuration;
      ApiKey = Configuration.GetValue<string>("Streamer:Aws:AppSync:Scenario1:Key");
      GraphQlEndpoint = Configuration.GetValue<string>("Streamer:Aws:AppSync:Scenario1:Endpoint");
    }

    public IConfiguration Configuration { get; }


    [Route("/api/appsync-streamer-with-update/")]
    [HttpGet]
    public void AppSyncStreamer([FromQuery]int messageToSend = 10, [FromQuery]int delayBtwMessageInMs = 50)
    {
      AwsAppSyncUtils.Stream(CreateQuery, messageToSend, delayBtwMessageInMs, ApiKey, GraphQlEndpoint);
    }

    public string CreateQuery(string value, string timestamp, Random r)
    {
      return @"{
                                    ""query"": ""mutation UpdatePrice($arg1: ID!,$arg2:String!) { updatePrice(id: $arg1, timestampInMs: $arg2){id, typeCurrency, price, timestampInMs }}"",
                                    ""operationName"": ""UpdatePrice"",
                                    ""variables"": { ""arg1"": 1, ""arg2"": " + timestamp.ToString() + @"}
                              }
                ";
    }
  }
}

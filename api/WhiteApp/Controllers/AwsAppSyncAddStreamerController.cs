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
  public class AwsAppSyncAddStreamerController : Controller
  {
    private string ApiKey;
    private string GraphQlEndpoint;

    public AwsAppSyncAddStreamerController(IConfiguration configuration)
    {
      Configuration = configuration;
      ApiKey = Configuration.GetValue<string>("Streamer:Aws:AppSync:Scenario2:Key");
      GraphQlEndpoint = Configuration.GetValue<string>("Streamer:Aws:AppSync:Scenario2:Endpoint");
    }

    public IConfiguration Configuration { get; }

    [Route("/api/appsync-streamer-with-add/")]
    [HttpGet]
    public void AppSyncAddStreamer([FromQuery]int messageToSend = 10, [FromQuery]int delayBtwMessageInMs = 50)
    {
      AwsAppSyncUtils.Stream(CreateQuery, messageToSend, delayBtwMessageInMs, ApiKey, GraphQlEndpoint);
    }

    public string CreateQuery(string value, string timestamp, Random r)
    {
      var nfi = new NumberFormatInfo();
      nfi.NumberDecimalSeparator = ".";
      return @"{
                                            ""query"": ""mutation AddPrice($arg1: Int!,$arg2:String!,$arg3: String!,$arg4: Float!) { addPrice(id: $arg1, timestampInMs: $arg2, currencyType: $arg3, price: $arg4){id, currencyType, price, timestampInMs }}"",
                                            ""operationName"": ""AddPrice"",
                                            ""variables"": { ""arg1"": " + value + @", ""arg2"": " + timestamp + @", ""arg3"": ""EUR/USD"", ""arg4"": " + r.NextDouble().ToString(nfi) + @"}
                                      }
                        ";
    }
  }
}

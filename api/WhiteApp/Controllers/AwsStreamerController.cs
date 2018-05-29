﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using HdrHistogram;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace WhiteApp.Controllers
{
  public class AwsStreamerController : Controller
  {
    private string ApiKey;
    private string GraphQlEndpoint;

    public AwsStreamerController(IConfiguration configuration)
    {
      Configuration = configuration;
      ApiKey = Configuration.GetValue<string>("aws_app_sync_key");
      GraphQlEndpoint = Configuration.GetValue<string>("graphql_endpoint");
    }

    public IConfiguration Configuration { get; }


    [Route("/api/appsync-streamer/")]
    [HttpGet]
    public void AppSyncStreamer()
    {
      var client = new HttpClient();

      System.Net.ServicePointManager.SecurityProtocol =
          SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;

      var histogram = new LongHistogram(TimeStamp.Hours(1), 3);

      var writer = new StringWriter();

      var messages = 200;
      Task.Run(async () =>
      {

        for (var i = 1; i < messages; i++)
        {
          var req = new HttpRequestMessage();
          req.Headers.TryAddWithoutValidation("x-api-key", ApiKey);
          req.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
          req.Headers.TryAddWithoutValidation("Content-Type", "application/json");
          var getPrice = @"{
                                    ""query"": ""query GetPrice { getPrice(id: 1){id, typeCurrency, price }}""
                              }";

          req.Method = HttpMethod.Post;
          req.RequestUri =
                    new Uri(GraphQlEndpoint);

          long startTimestamp = Stopwatch.GetTimestamp();
          long milliseconds = DateTimeOffset.Now.ToUnixTimeMilliseconds();
          var updatePrice = @"{
                                    ""query"": ""mutation UpdatePrice($arg1: ID!,$arg2:String!) { updatePrice(id: $arg1, timestampInMs: $arg2){id, typeCurrency, price, timestampInMs }}"",
                                    ""operationName"": ""UpdatePrice"",
                                    ""variables"": { ""arg1"": 1, ""arg2"": " + milliseconds.ToString() + @"}
                              }
                ";

          req.Content = new StringContent(updatePrice, Encoding.UTF8, "application/json");

          await client.SendAsync((req)).ConfigureAwait(false);


          long elapsed = Stopwatch.GetTimestamp() - startTimestamp;
          histogram.RecordValue(elapsed);
          await Task.Delay(50).ConfigureAwait(false);
        }

        var scalingRatio = OutputScalingFactor.TimeStampToMilliseconds;
        histogram.OutputPercentileDistribution(
                  writer,
                  outputValueUnitScalingRatio: scalingRatio);
        System.IO.File.WriteAllText(@"d:\cloud\appsync.txt", writer.ToString());
      });

    }


  }
}

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
using System.Security.Cryptography;
using Amazon;
using Amazon.IotData;
using Amazon.Runtime;

namespace WhiteApp.Controllers
{
  public class AwsIotStreamerController : Controller
  {
    private string IotEndpoint;
    private string IotAccessKey;
    private string IotSecret;

    public AwsIotStreamerController(IConfiguration configuration)
    {
      Configuration = configuration;
      IotEndpoint = Configuration.GetValue<string>("Streamer:Aws:Iot:Endpoint");
      IotAccessKey = Configuration.GetValue<string>("Streamer:Aws:Iot:AccessKey");
      IotSecret = Configuration.GetValue<string>("Streamer:Aws:Iot:Secret");
    }

    public IConfiguration Configuration { get; }


    [Route("/api/iot-streamer/")]
    [HttpGet]
    public async void AmazonIotStreamer([FromQuery]int messageToSend = 10, [FromQuery]int delayBtwMessageInMs = 50)
    {
      var rd = new Random(100);

      var histogram = new LongHistogram(TimeStamp.Hours(1), 3);

      var writer = new StringWriter();

      var messages = messageToSend;
      Task.Run(async () =>
      {
        var publisher = new AmazonIotDataClient(IotEndpoint, new BasicAWSCredentials(IotAccessKey, IotSecret));

        for (var i = 1; i <= messages; i++)
        {
          long startTimestamp = Stopwatch.GetTimestamp();
          long timestamp = DateTimeOffset.Now.ToUnixTimeMilliseconds();

          var currency = new Currency()
          {
            Id = i,
            CurrencyType = "EUR/USD",
            Price = rd.NextDouble(),
            Timestamp = DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString(),
            Ladders = new LadderFactory().Build(10)
          };

          var cur = JsonConvert.SerializeObject(currency);

          publisher.PublishAsync(new Amazon.IotData.Model.PublishRequest()
          {
            Topic = "EUR/USD",
            Payload = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(cur)),
            Qos = 1
          });

          long elapsed = Stopwatch.GetTimestamp() - startTimestamp;
          histogram.RecordValue(elapsed);
          await Task.Delay(delayBtwMessageInMs).ConfigureAwait(false);
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

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
  public class AwsMqStreamerController : Controller
  {
    private string ActiveMqEndpoint;
    private string ActiveMqLogin;
    private string ActiveMqMdp;

    public AwsMqStreamerController(IConfiguration configuration)
    {
      Configuration = configuration;
      ActiveMqEndpoint = Configuration.GetValue<string>("Streamer:Aws:Mq:Endpoint");
      ActiveMqLogin = Configuration.GetValue<string>("Streamer:Aws:Mq:Login");
      ActiveMqMdp = Configuration.GetValue<string>("Streamer:Aws:Mq:Mdp");
    }

    public IConfiguration Configuration { get; }

    [Route("/api/amq-streamer/")]
    [HttpGet]
    public async void AmazonMQStreamer([FromQuery]int messageToSend = 10, [FromQuery]int delayBtwMessageInMs = 50)
    {
      NMSConnectionFactory factory = new NMSConnectionFactory(ActiveMqEndpoint);

      var rd = new Random(100);

      var histogram = new LongHistogram(TimeStamp.Hours(1), 3);

      var writer = new StringWriter();

      using (var connection = factory.CreateConnection(ActiveMqLogin, ActiveMqMdp))
      {
        connection.Start();

        var session = connection.CreateSession(AcknowledgementMode.AutoAcknowledge);

        var topic = new ActiveMQTopic("VirtualTopic.eur_usd");

        var producer = session.CreateProducer(topic);

        producer.DeliveryMode = MsgDeliveryMode.NonPersistent;


        for (var i = 0; i <= messageToSend; i++)
        {
          var currency = new Currency()
          {
            Id = i,
            CurrencyType = "EUR/USD",
            Price = rd.NextDouble(),
            Timestamp = DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString()
          };

          var cur = JsonConvert.SerializeObject(currency);
          long startTimestamp = Stopwatch.GetTimestamp();

          producer.Send(session.CreateTextMessage(cur));

          long elapsed = Stopwatch.GetTimestamp() - startTimestamp;
          histogram.RecordValue(elapsed);
          await Task.Delay(delayBtwMessageInMs).ConfigureAwait(false);
        }
        session.Close();
        connection.Close();

        var scalingRatio = OutputScalingFactor.TimeStampToMilliseconds;
        histogram.OutputPercentileDistribution(
            writer,
            outputValueUnitScalingRatio: scalingRatio);
        System.IO.File.WriteAllText(@"d:\cloud\amq.txt", writer.ToString());
      }

    }
  }
}

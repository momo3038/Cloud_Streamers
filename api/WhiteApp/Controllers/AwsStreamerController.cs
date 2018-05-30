using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Apache.NMS;
using Apache.NMS.ActiveMQ.Commands;
using AwsWhiteApp;
using HdrHistogram;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;


namespace WhiteApp.Controllers
{
  public class AwsStreamerController : Controller
  {
    private string ApiKey;
    private string GraphQlEndpoint;
    private string ActiveMqEndpoint;
    private string ActiveMqLogin;
    private string ActiveMqMdp;

    public AwsStreamerController(IConfiguration configuration)
    {
      Configuration = configuration;
      ApiKey = Configuration.GetValue<string>("aws_app_sync_key");
      GraphQlEndpoint = Configuration.GetValue<string>("graphql_endpoint");
      ActiveMqEndpoint = Configuration.GetValue<string>("activemq_endpoint");
      ActiveMqLogin = Configuration.GetValue<string>("activemq_login");
      ActiveMqMdp = Configuration.GetValue<string>("activemq_mdp");
    }

    public IConfiguration Configuration { get; }


    [Route("/api/appsync-streamer/")]
    [HttpGet]
    public void AppSyncStreamer([FromQuery]int messageToSend = 10, [FromQuery]int delayBtwMessageInMs = 50)
    {
      var client = new HttpClient();

      System.Net.ServicePointManager.SecurityProtocol =
          SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;

      var histogram = new LongHistogram(TimeStamp.Hours(1), 3);

      var writer = new StringWriter();

      Task.Run(async () =>
      {
        for (var i = 0; i <= messageToSend; i++)
        {
          var req = new HttpRequestMessage();
          req.Headers.TryAddWithoutValidation("x-api-key", ApiKey);
          req.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
          req.Headers.TryAddWithoutValidation("Content-Type", "application/json");

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
          await Task.Delay(delayBtwMessageInMs).ConfigureAwait(false);
        }

        var scalingRatio = OutputScalingFactor.TimeStampToMilliseconds;
        histogram.OutputPercentileDistribution(
                  writer,
                  outputValueUnitScalingRatio: scalingRatio);
        System.IO.File.WriteAllText(@"d:\cloud\appsync.txt", writer.ToString());
      });

    }



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

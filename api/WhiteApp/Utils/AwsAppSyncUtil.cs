using System;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using HdrHistogram;

namespace WhiteApp
{
  public static class AwsAppSyncUtils
  {
    public static void Stream(Func<string, string, Random, string> createQuery, int messageToSend, int delayBtwMessageInMs, string apiKey, string endpointUrl)
    {
      var client = new HttpClient();

      System.Net.ServicePointManager.SecurityProtocol =
          SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;

      var rd = new Random(100);

      var histogram = new LongHistogram(TimeStamp.Hours(1), 3);

      var writer = new StringWriter();

      var messages = messageToSend;
      Task.Run(async () =>
      {
        for (var i = 1; i <= messages; i++)
        {
          var req = new HttpRequestMessage();
          req.Headers.TryAddWithoutValidation("x-api-key", apiKey);

          req.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
          req.Headers.TryAddWithoutValidation("Content-Type", "application/json");

          req.Method = HttpMethod.Post;
          req.RequestUri = new Uri(endpointUrl);

          long startTimestamp = Stopwatch.GetTimestamp();
          long timestamp = DateTimeOffset.Now.ToUnixTimeMilliseconds();

          req.Content = new StringContent(createQuery(i.ToString(), timestamp.ToString(), rd), Encoding.UTF8, "application/json");

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
  }
}
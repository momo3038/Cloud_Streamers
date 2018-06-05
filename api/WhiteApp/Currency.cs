using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AwsWhiteApp
{
    public class Currency
    {
        public int Id { get; set; }
        public string CurrencyType { get; set; }
        public double Price { get; set; }
        public string Timestamp { get; set; }
         public List<Ladder> Ladders {get;set;}
    }

    public class LadderFactory
  {
    public List<Ladder> Build(int count)
    {
      var rd = new Random();
      var ladders = new List<Ladder>();
      for (int i = 0; i < count; i++)
      {
        ladders.Add(new Ladder
        {
          ClientAsk = rd.NextDouble(),
          ClientBid = rd.NextDouble(),
          TraderAsk = rd.NextDouble(),
          TraderBid = rd.NextDouble(),
          thresholdAsk = rd.NextDouble(),
          thresholdBid = rd.NextDouble(),
          MarginAsk = rd.NextDouble(),
          MarginBid = rd.NextDouble(),
          Valid = true
        });
      }
      return ladders;
    }
  }

  public class Ladder
  {
    public double ClientBid { get; set; }
    public double ClientAsk { get; set; }
    public double TraderBid { get; set; }
    public double TraderAsk { get; set; }
    public double MarginBid { get; set; }
    public double MarginAsk { get; set; }
    public bool Valid { get; set; }
    public double thresholdBid { get; set; }
    public double thresholdAsk { get; set; }
  }
}
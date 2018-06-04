using Microsoft.AspNetCore.SignalR;

namespace WhiteApp.Hub
{
    public class Streamer : Microsoft.AspNetCore.SignalR.Hub
    {
        private readonly IHubContext<Streamer> hubContext;

        public Streamer(IHubContext<Streamer> hubContext) : base()
        {
            this.hubContext = hubContext;
        }

        public void BroadcastMessage(string name, string message)
        {
            Clients.All.SendAsync("broadcastMessage", name, message);
        }

        public void Echo(string name, string message)
        {
            Clients.Client(Context.ConnectionId).SendAsync("echo", name, message + " (echo from server)");
        }

        public void AddCurrencyPair(string currencyPair)
        {
            this.hubContext.Groups.AddToGroupAsync(Context.ConnectionId, currencyPair);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AzureWhiteApp.Hub;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.SignalR;

namespace AzureWhiteApp
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
      var apiKey = Configuration.GetValue<string>("Streamer:Azure:Endpoint");

      services.AddCors();
      services.AddMvc();
      services.AddSignalR()
              .AddAzureSignalR(apiKey);
    }

    public void Configure(IApplicationBuilder app,  IHostingEnvironment env)
    {
      var localhostUrl = Configuration.GetValue<string>("Streamer:Http:CORS");
      
      app.UseCors("AllowAllCorsPolicy");
      app.UseMvc();
      app.UseFileServer();
      // Middleware component #1
      app.Use(async (context, nextMiddleware) =>
      {
        context.Response.Headers.Add("Access-Control-Allow-Origin", localhostUrl);
        context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
        context.Response.Headers.Add("Access-Control-Allow-Headers", "X-Requested-With");

        await nextMiddleware();

        context.Response.Headers.Remove("X-Requested-With");
      });
      app.UseAzureSignalR(routes =>
      {
        routes.MapHub<Streamer>("/streamer");
        
      });
      app.UseCors(builder =>
         builder.WithOrigins(localhostUrl)
                .AllowAnyHeader()
         );
    }
  }
}

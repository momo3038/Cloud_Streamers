using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WhiteApp.Hub;

namespace WhiteApp
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {

      var apiKey = Configuration.GetValue<string>("Streamer:Azure:Endpoint");

      services.AddCors();
      services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
      services.AddSignalR()
              .AddAzureSignalR(apiKey);
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
      var localhostUrl = Configuration.GetValue<string>("Streamer:Http:CORS");

      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseHsts();
      }

      app.UseHttpsRedirection();
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
       );
    }
  }
}

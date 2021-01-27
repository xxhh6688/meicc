using meicc.API;
using Microsoft.Restier.Publishers.OData;
using Microsoft.Restier.Publishers.OData.Batch;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace meicc
{
    public class WebApiConfig
    {
        public async static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}",
                defaults: new { id = RouteParameter.Optional }
            );

            await config.MapRestierRoute<API.ODataAPI>(
                "model",
                "tables",
                new RestierBatchHandler(GlobalConfiguration.DefaultServer));

            config.Filters.Add(new AuthoritherFilter());
        }
    }
}
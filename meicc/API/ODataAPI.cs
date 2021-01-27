using meicc.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Restier.Providers.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.OData.Query;

namespace meicc.API
{
    public class ODataAPI : EntityFrameworkApi<Context>
    {
        protected override IServiceCollection ConfigureApi(IServiceCollection services)
        {
            Func<IServiceProvider, ODataValidationSettings> validationSettingFactory = (sp) => new ODataValidationSettings
            {
                MaxAnyAllExpressionDepth = 5,
                MaxExpansionDepth = 4,
            };

            return base.ConfigureApi(services).AddSingleton<ODataValidationSettings>(validationSettingFactory);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Web.OData.Extensions;

namespace meicc.API
{
    public class AuthoritherFilter : IAuthorizationFilter
    {


        public bool AllowMultiple
        {
            get { return true; }
        }

        public Task<HttpResponseMessage> ExecuteAuthorizationFilterAsync(HttpActionContext actionContext, CancellationToken cancellationToken, Func<Task<HttpResponseMessage>> continuation)
        {
            var odataProps = actionContext.Request.ODataProperties();
            //throw new NotImplementedException();
            return continuation();
        }
    }
}
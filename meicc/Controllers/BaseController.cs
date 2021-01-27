using meicc.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace meicc.Controllers
{
    public class BaseController : ApiController
    {
        protected Context DB { get; set; }
        public BaseController()
        {
            DB = new Context();
        }

        protected override void Dispose(bool disposing)
        {
            DB.Dispose();
            base.Dispose(disposing);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace meicc.Models
{
    public class Response
    {
        public int StatusCode { get; set; }
        public object Object { get; set; }

        public Response(int code, object obj)
        {
            this.StatusCode = code;
            this.Object = obj;
        }
    }
}
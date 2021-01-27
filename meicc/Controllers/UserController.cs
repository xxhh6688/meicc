using meicc.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace meicc.Controllers
{
    public class UserController : BaseController
    {
        [HttpPost]
        public object Login([FromBody] LoginObj obj)
        {
            var password = obj.Password;
            var cellphone = obj.Cellphone;

            var res = DB.Users.Where((usr) =>
                (usr.Cellphone.Equals(cellphone) && usr.Password.Equals(password))
            ).ToArray();

            if (res.Length > 0)
            {
                return new Response(0, res[0].Id.ToString());
            }
            else
            {
                return new Response(404, "用户名密码错误");
            }
        }

        [HttpGet]
        public object GetUserInfo()
        {
            var cookie = Request.Headers.GetCookies(ConfigurationManager.AppSettings["token"]).FirstOrDefault();
            if (null == cookie)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }

            // get user from cache by the cookie token
            var tokenValue = cookie[ConfigurationManager.AppSettings["token"]].Value;
            int userId = Int32.Parse(tokenValue);
            var res = DB.Users.Where((usr) => (usr.Id == userId)).ToArray();

            if (res.Length > 0)
            {
                User user = new User()
                {
                    Id = res[0].Id,
                    Name = res[0].Name,
                    Cellphone = res[0].Cellphone,
                    CreateTime = res[0].CreateTime,
                    Type = res[0].Type,
                };
                res[0].Password = string.Empty;
                return new Response(0, user);
            }
            else
            {
                return new Response(404, "用户名密码错误");
            }
        }

        public class LoginObj
        {
            public string Cellphone { get; set; }
            public string Password { get; set; }
        }

        public class RegisterObj
        {
            public string Cellphone { get; set; }
            public string Password { get; set; }
            public int Type { get; set; }
        }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace meicc.Models
{
    [Table("User")]
    public class User
    {
        public int Id { get; set; }
        public string Cellphone { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public int Type { get; set; }
        public DateTime CreateTime { get; set; }
    }
}
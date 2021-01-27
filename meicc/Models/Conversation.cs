using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace meicc.Models
{
    [Table("Conversation")]
    public class Conversation
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreateTime { get; set; }
        public int? CreateBy { get; set; }
        public string Token { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace meicc.Models
{
    [Table("Cert")]
    public class Cert
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CertId { get; set; }
        public string Content { get; set; }
        public DateTime CreateTime { get; set; }
    }
}
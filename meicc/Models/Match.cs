using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace meicc.Models
{
    [Table("Match")]
    public class Match
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string LogoImage { get; set; }
        public string Description { get; set; }
        [ForeignKey("MatchId")]
        public virtual List<Event> Events { get; set; }
    }
}
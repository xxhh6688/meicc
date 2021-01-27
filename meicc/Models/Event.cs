using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace meicc.Models
{
    [Table("Event")]
    public class Event
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreateTime { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Location { get; set; }
        public string BannerImage { get; set; }
        public int? MatchId { get; set; }

        [ForeignKey("MatchId")]
        public virtual Match Match { get; set; }
    }
}
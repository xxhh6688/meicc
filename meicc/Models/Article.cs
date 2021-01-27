using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace meicc.Models
{
    [Table("Article")]
    public class Article
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public bool SetTop { get; set; }
        public bool InList { get; set; }
        public DateTime CreateTime { get; set; }
        public int? CreateBy { get; set; }
        public int? EventId { get; set; }
        public string TypeInEvent { get; set; }
        public bool SetStory { get; set; }
        public string StoryImage { get; set; }
        public string StoryLink { get; set; }
        public string Thumbnail { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace meicc.Models
{
    [Table("conversation_reply")]
    public class ConversationReply
    {
        public int Id { get; set; }
        public int? ReplyId { get; set; }
        public string Content { get; set; }
        public DateTime CreateTime { get; set; }
        public int? CreateBy { get; set; }
    }
}
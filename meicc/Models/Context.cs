using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace meicc.Models
{
    public class Context: DbContext
    {
        public Context()
                : base("name=DBContext")
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<Cert> Certs { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ConversationReply> ConversationReplies { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Match> Matches { get; set; }
    }
}
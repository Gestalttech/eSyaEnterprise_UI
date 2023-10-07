using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.EndUser.Models
{
    public class DO_UserFormAction
    {
        public int UserID { get; set; }
        public int BusinessKey { get; set; }
        public int MenuKey { get; set; }
        public int ActionID { get; set; }
        public string? ActionDesc { get; set; }
        public string Active { get; set; }
        public bool ActiveStatus { get; set; }
        public string? FormId { get; set; }
        public int UserId { get; set; }
        public string? TerminalId { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.TokenSystem.Models
{
    public class DO_DisplaySystemConfig
    {
        public int BusinessKey { get; set; }
        public int DisplayId { get; set; }
        public string DisplayIPAddress { get; set; }
        public int SerialNumber { get; set; }
        public string DisplayScreenType { get; set; }
        public string DisplayURL { get; set; }
        public string QueryString { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedOn { get; set; }
        public string TerminalID { get; set; }
    }
}

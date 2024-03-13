using eSyaEnterprise_UI.Areas.ProductSetup.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.ConfigureSMS.Models
{
    public class DO_SMSHeader
    {
        public string Smsid { get; set; }
        public int FormId { get; set; }
        public string Smsdescription { get; set; }
        public bool IsVariable { get; set; }
        public int TEventID { get; set; }
        public string? TEventDesc { get; set; }
        public string? Tevent { get; set; }
        public string Smsstatement { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }

        public List<DO_eSyaParameter> l_SMSParameter { get; set; }
    }
    public class DO_SMSTEvent
    {
        public int TEventID { get; set; }
        public string TEventDesc { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string FormID { get; set; }
    }
    public class DO_BusinessLocation
    {
        public int BusinessKey { get; set; }
        public string LocationDescription { get; set; }
    }
}

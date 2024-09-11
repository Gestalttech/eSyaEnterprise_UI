using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.Vendor.Models
{
    public class DO_BusinessKey
    {
        public string BusinessSegment { get; set; }
        public string BusinessLocation { get; set; }
        public int BusinessKey { get; set; }
        public bool ActiveStatus { get; set; }
    }
    public class DO_ApplicationCodes
    {
        public int ApplicationCode { get; set; }
        public int CodeType { get; set; }
        public string CodeDesc { get; set; }
    }
    public class DO_States
    {
        public int StateCode { get; set; }
        public string StateDesc { get; set; }
    }
    public class DO_CountryISDCodes
    {
        public int Isdcode { get; set; }
        public string MobileNumberPattern { get; set; }
        public string CountryFlag { get; set; }
        public string CountryName { get; set; }
        public string CountryCode { get; set; }
        public string DomainName { get; set; }
    }
}

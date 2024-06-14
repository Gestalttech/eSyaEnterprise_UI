using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.Vendor.Models
{
    public class DO_VendorLocation
    {
        public int VendorId { get; set; }
        public int VendorLocationId { get; set; }
        public string VendorLocation { get; set; } = null!;
        public bool IsLocationDefault { get; set; }
        public string VendorAddress { get; set; } = null!;
        public int StateCode { get; set; }
        public int Isdcode { get; set; }
        public string MobileNumber { get; set; } = null!;
        public int WIsdcode { get; set; }
        public string WhatsappNumber { get; set; } = null!;
        public string ContactPerson { get; set; } = null!;
        public string EMailId { get; set; } = null!;
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }

    }
}

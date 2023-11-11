using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.Vendor.Models
{
    public class DO_VendorBusinessLink
    {
        public int VendorId { get; set; }
        public int BusinessKey { get; set; }
        public bool ActiveStatus { get; set; }
        public List<int> Businesslink { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }

        //public int VendorCode { get; set; }
       
    }
}

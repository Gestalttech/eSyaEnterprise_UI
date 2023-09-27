using eSyaEnterprise_UI.Areas.ProductSetup.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ProductSetup.Models
{
    public class DO_CountryStatutoryDetails
    {
        public int Isdcode { get; set; }
        public int StatutoryCode { get; set; }
        public string StatShortCode { get; set; }
        public string StatutoryDescription { get; set; }
        public string StatPattern { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public List<DO_eSyaParameter>? l_FormParameter { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ProductSetup.Models
{
    public class DO_TaxIdentification
    {
        public int Isdcode { get; set; }
        public int TaxCode { get; set; }
        public string? TaxDesc { get; set; }
        public int TaxIdentificationId { get; set; }
        public string TaxIdentificationDesc { get; set; }
        public string StateCode { get; set; }
        public int InsertStatus { get; set; }

        public bool IsUt { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
    
}

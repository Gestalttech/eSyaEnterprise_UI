using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.Admin.Models
{
    public class DO_States
    {
        public int Isdcode { get; set; }
        public int StateCode { get; set; }
        public string StateDesc { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
    public class DO_InventoryRules
    {
        public string InventoryRuleId { get; set; }
        public string InventoryRuleDesc { get; set; }
        public int InventoryRule { get; set; }
        public bool ApplyToSrn { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public int Isadd { get; set; }
    }
    public class DO_UnitofMeasure
    {
        public int UnitOfMeasure { get; set; }
        public string Uompurchase { get; set; }
        public string Uomstock { get; set; }
        public string Uompdesc { get; set; }
        public string Uomsdesc { get; set; }
        public decimal ConversionFactor { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string FormId { get; set; }
    }
}

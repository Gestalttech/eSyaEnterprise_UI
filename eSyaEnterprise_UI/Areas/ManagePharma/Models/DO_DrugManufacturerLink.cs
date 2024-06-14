using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ManagePharma.Models
{
    public class DO_DrugManufacturerLink
    {
        public int BusinessKey { get; set; }
        public int TradeID { get; set; }
        public int ManufacturerID { get; set; }
        public string? TradeName { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public decimal PurchaseRate { get; set; }
        public decimal MRP { get; set; }
        public DateTime? LastMRPDate { get; set; }
        public DateTime? EffectiveTill { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedOn { get; set; }
        public string TerminalID { get; set; }
    }
}

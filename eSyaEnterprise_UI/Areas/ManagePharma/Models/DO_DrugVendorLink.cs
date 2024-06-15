using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ManagePharma.Models
{
    public class DO_DrugVendorLink
    {
        public int BusinessKey { get; set; }
        public int TradeID { get; set; }
        public int VendorID { get; set; }
        public string? VendorName { get; set; }
        public decimal MinimumSupplyQty { get; set; }
        public decimal BusinessSharePerc { get; set; }
        public string? TradeName { get; set; }
        public string? PartNumber { get; set; }
        public string? PartDesc { get; set; }
        public decimal LastPurchaseRate { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedOn { get; set; }
        public string TerminalID { get; set; }
    }
}

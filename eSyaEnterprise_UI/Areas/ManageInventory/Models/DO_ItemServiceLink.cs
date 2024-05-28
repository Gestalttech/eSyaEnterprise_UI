using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ManageInventory.Models
{
    public class DO_ItemServiceLink
    {
        public int BusinessKey { get; set; }
        public int ServiceClass { get; set; }
        public int ServiceID { get; set; }
        public int SKUID { get; set; }
        public string? SKUType { get; set; }
        public string? ItemDescription { get; set; }
        public decimal Quantity { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

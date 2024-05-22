using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ManageInventory.Models
{
    public class DO_ItemStoreLink
    {
        public int BusinessKey { get; set; }
        public int ItemCode { get; set; }
        public int StoreCode { get; set; }
        public string? StoreDesc { get; set; }
        public int PortfolioId { get; set; }
        public string? PortfolioDesc { get; set; }
        public bool ActiveStatus { get; set; }
        public string? FormId { get; set; }
        public int UserID { get; set; }
        public string? TerminalID { get; set; }
        //public List<DO_ItemStoreLink>? lst_itemStoreLink { get; set; }
    }
}

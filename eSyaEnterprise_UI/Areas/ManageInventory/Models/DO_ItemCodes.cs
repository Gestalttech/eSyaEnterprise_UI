
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.ManageInventory.Models
{
    public class DO_ItemCodes
    {
        public int ItemCode { get; set; }
        public int ItemGroup { get; set; }
        public int ItemCategory { get; set; }
        public int ItemSubCategory { get; set; }
        public string ItemDescription { get; set; }
        public int UnitOfMeasure { get; set; }
        public int PackUnit { get; set; }
        public string? PackUnitDesc { get; set; }
        public int PackSize { get; set; }
        public string InventoryClass { get; set; }
        public string ItemClass { get; set; }
        public string ItemSource { get; set; }
        public string ItemCriticality { get; set; }
        public string? BarCodeID { get; set; }
        public bool UsageStatus { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedOn { get; set; }
        public string TerminalID { get; set; }

        public List<DO_eSyaParameter> l_FormParameter { get; set; }
        //SKU Related properties
        public int Skuid { get; set; }
        //public int Skugroup { get; set; }
        //public int Skucategory { get; set; }
        //public int SkusubCategory { get; set; }
        public string? Skutype { get; set; }
        public int Skucode { get; set; }
    }
}

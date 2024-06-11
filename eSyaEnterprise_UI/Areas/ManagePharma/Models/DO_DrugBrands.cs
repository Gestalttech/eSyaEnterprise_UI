using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ManagePharma.Models
{
    public class DO_DrugBrands
    {
        public int Skuid { get; set; }
        public string Skutype { get; set; }
        public int Skucode { get; set; }
        public int CompositionID { get; set; }
        public int FormulationID { get; set; }
        public int TradeID { get; set; }
        public string TradeName { get; set; }
        public int PackSize { get; set; }
        public int Packing { get; set; }
        public string PackingDesc { get; set; }
        public int ManufacturerID { get; set; }
        public int ISDCode { get; set; }
        public string BarcodeID { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedOn { get; set; }
        public string TerminalID { get; set; }
        public int BusinessKey { get; set; }
        public string LocationDescription { get; set; }
        public List<DO_eSyaParameter> l_FormParameter { get; set; }
    }
}

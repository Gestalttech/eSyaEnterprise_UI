using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.Stores.Models
{
    public class DO_StoreMaster
    {
        public int StoreCode { get; set; }
        public int StoreType { get; set; }
        public string StoreDesc { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? StoreTypeDesc { get; set; }

        public List<DO_eSyaParameter> l_FormParameter { get; set; }
    }
   
}

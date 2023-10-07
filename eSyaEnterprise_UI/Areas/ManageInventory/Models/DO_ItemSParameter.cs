using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ManageInventory.Models
{
    public class DO_ItemSParameter
    {
        public int ItemSptype { get; set; }
        public string ItemSptypeDesc { get; set; }
        public bool? ActiveStatus { get; set; }
    }
}

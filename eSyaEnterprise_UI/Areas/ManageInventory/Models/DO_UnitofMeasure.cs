using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.ManageInventory.Models
{
    public class DO_UnitofMeasure
    {
        public int UnitOfMeasure { get; set; }
        public string UnitOfMeasureDesc { get; set; }
        public decimal ConversionFactor { get; set; }
        public bool ActiveStatus { get; set; }
    }
}

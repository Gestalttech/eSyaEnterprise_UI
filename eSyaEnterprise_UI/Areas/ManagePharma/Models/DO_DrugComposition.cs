using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ManagePharma.Models
{
    public class DO_DrugComposition
    {
        public int CompositionId { get; set; }
        public string DrugCompDesc { get; set; }
        public int FormulationID { get; set; }
        public string FormulationDesc { get; set; }
        public int ManufacturerId { get; set; }
        public string ManufacturerName { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.Stores.Models
{
    public class DO_FormSubParameter
    {
        public int FormId { get; set; }
        public int ParameterId { get; set; }
        public string ParameterValue { get; set; }
        public string ParameterDesc { get; set; }
        public bool ParmAction { get; set; }
        public bool ActiveStatus { get; set; }
    }
}

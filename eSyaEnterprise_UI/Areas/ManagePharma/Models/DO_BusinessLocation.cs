using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.ManagePharma.Models
{
    public class DO_BusinessLocation
    {
        public int BusinessKey { get; set; }
        public string? LocationDescription { get; set; }
        public int TradeID { get; set; }
        public bool ActiveStatus { get; set; }
    }
}

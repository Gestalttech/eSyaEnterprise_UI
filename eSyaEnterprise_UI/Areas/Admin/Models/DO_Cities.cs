using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.Admin.Models
{
    public class DO_Cities
    {
        public int Isdcode { get; set; }
        public int StateCode { get; set; }
        public int CityCode { get; set; }
        public string CityDesc { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string StateDesc { get; set; }
    }
}

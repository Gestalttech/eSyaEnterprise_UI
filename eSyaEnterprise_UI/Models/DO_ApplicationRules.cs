using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Models
{
    public class DO_ApplicationRules
    {
        public int ProcessID { get; set; }
        public int RuleID { get; set; }
        public bool RuleStatus { get; set; }
    }
    public class DO_eSyaLoginCulture
    {
        public string CultureCode { get; set; }
        public string CultureDesc { get; set; }
    }
}

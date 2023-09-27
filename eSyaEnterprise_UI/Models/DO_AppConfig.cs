using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Models
{
    public class DO_AppConfig
    {
        public string DateFormat { get; set; }
        public string ShortDateFormat { get; set; }
        public int DecimalDigit { get; set; }
        public string LocalCurrencyCode { get; set; }
        public string ISDCode { get; set; }
    }
}

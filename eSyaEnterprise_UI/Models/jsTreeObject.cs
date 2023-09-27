using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Models
{
    public class jsTreeObject
    {
        public string id { get; set; }
        public string parent { get; set; }
        public string text { get; set; }
        public string icon { get; set; }
        public string GroupIndex { get; set; }
        public stateObject state { get; set; }
        public string Type { get; set; }
    }
    public class stateObject
    {
        public bool opened { get; set; }
        public bool selected { get; set; }
        public bool disabled { get; set; }
        public bool checkbox_disabled { get; set; }
        public bool Checked { get; set; }
    }
}

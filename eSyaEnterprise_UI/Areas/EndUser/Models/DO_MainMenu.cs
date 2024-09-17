using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.EndUser.Models
{
    public class DO_MainMenu
    {
        public int MainMenuId { get; set; }
        public string MainMenu { get; set; }
        public string ImageURL { get; set; }
        public int MenuIndex { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserId { get; set; }
        public string TerminalId { get; set; }

        public List<DO_FormMenu> l_FormMenu = new List<DO_FormMenu>();

        public List<DO_SubMenu> l_SubMenu = new List<DO_SubMenu>();
    }
    
}

﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.EndUser.Models
{
    public class DO_UserGroupRole
    {
        public int BusinessKey { get; set; }
        public int UserGroup { get; set; }
        public int UserType { get; set; }
        public int UserRole { get; set; }
        public int MenuKey { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }

        //public List<DO_UserFormAction> l_formAction { get; set; }
    }
}

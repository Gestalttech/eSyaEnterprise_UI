﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ConfigSKU.Models
{
    public class DO_ItemCategory
    {
        public int ItemGroupId { get; set; }
        public int? ItemCategory { get; set; }
        public string ItemCategoryDesc { get; set; }
        //public decimal BudgetAmount { get; set; }
        //public decimal CommittmentAmount { get; set; }
        public bool? ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedOn { get; set; }
        public string TerminalID { get; set; }
    }
}

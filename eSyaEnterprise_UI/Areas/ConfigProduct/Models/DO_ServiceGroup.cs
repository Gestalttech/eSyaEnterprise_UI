﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ConfigProduct.Models
{
    public class DO_ServiceGroup
    {
        public int ServiceGroupId { get; set; }
        public int ServiceTypeId { get; set; }
        public string? ServiceGroupDesc { get; set; }
        public int ServiceCriteria { get; set; }
        public int PrintSequence { get; set; }
        public bool ActiveStatus { get; set; }
        public string? FormId { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? TerminalID { get; set; }
    }
}

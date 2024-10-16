﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ConfigBusiness.Models
{
    public class DO_BusinessConfiguration
    {
        public List<DO_BusinessEntity> l_BusinessEntity { get; set; }
        public List<DO_BusinessSeg> l_BusinessSegment { get; set; }
        public List<DO_BusinessLoc> l_BusinessLocation { get; set; }
    }
    public class DO_BusinessEntity
    {
        public int BusinessId { get; set; }
        public string BusinessDesc { get; set; }
        public bool IsMultiSegmentApplicable { get; set; }
        public string BusinessUnitType { get; set; }
        public int NoOfUnits { get; set; }
        public int ActiveNoOfUnits { get; set; }
        public bool UsageStatus { get; set; }
        public bool ActiveStatus { get; set; }
        //public string FormId { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public List<DO_EntityPreferredLanguage>? l_Preferredlang { get; set; }
    }
    public class DO_BusinessSeg
    {
        public int BusinessId { get; set; }
        public int SegmentId { get; set; }
        public string SegmentDesc { get; set; }
        public bool ActiveStatus { get; set; }
    }

    public class DO_BusinessLoc
    {
        public int BusinessId { get; set; }
        public int SegmentId { get; set; }
        public int LocationId { get; set; }
        public string LocationDescription { get; set; }
        public bool ActiveStatus { get; set; }
    }
}

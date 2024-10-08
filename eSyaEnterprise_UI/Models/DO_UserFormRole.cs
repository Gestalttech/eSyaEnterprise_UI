using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Models
{
    public class DO_UserFormRole
    {
        public int FormID { get; set; }
        public string FormIntID { get; set; }
        public string FormName { get; set; }
        public bool IsView { get; set; }
        public bool IsInsert { get; set; }
        public bool IsEdit { get; set; }
        public bool IsDelete { get; set; }
        public bool IsPrint { get; set; }
        public bool IsRePrint { get; set; }
        public bool IsApprove { get; set; }
        public bool IsAuthenticate { get; set; }
        public bool IsGiveConcession { get; set; }
        public bool IsGiveDiscount { get; set; }

        public bool IsSurgeon { get; set; }
        public bool IsNutrition { get; set; }
    }
    public class FormControlProperty
    {
        public int ControlKey { get; set; }
        public string? InternalControlId { get; set; }
        public string? ControlType { get; set; }
        public string? Property { get; set; }
        public bool ActiveStatus { get; set; }
    }
}

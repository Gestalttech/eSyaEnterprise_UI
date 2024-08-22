using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.FinAdmin.Models
{
    public class DO_CostCenter
    {
        public int IsInsert { get; set; }
        public int CostCenterCode { get; set; }
        public string CostCenterDesc { get; set; }
        public int CostCenterClass { get; set; }
        public bool UsageStatus { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedOn { get; set; }
        public string TerminalID { get; set; }
    }

    public class DO_CostCenterClass
    {
        public int IsInsert { get; set; }
        public int CostCenterClass { get; set; }
        public string CostClassDesc { get; set; }
        public bool UsageStatus { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedOn { get; set; }
        public string TerminalID { get; set; }
    }
}

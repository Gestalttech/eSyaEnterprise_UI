using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.ManageRates.Models
{
    public class DO_DoctorParameter
    {
        public int DoctorCode { get; set; }
        public int ParameterID { get; set; }
        public decimal ParmPerc { get; set; }
        public bool ParmAction { get; set; }
        public string ParmDesc { get; set; }
        public decimal ParmValue { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

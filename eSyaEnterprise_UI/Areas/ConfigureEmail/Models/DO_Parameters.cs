using System;
using System.Collections.Generic;
using System.Text;

namespace eSyaEnterprise_UI.Areas.ConfigureEmail.Models
{
    public class DO_Parameters
    {
        public int ParameterType { get; set; }
        public string ParameterHeaderDesc { get; set; }
        public int ParameterId { get; set; }
        public string ParameterDesc { get; set; }
        public string ParameterValueType { get; set; }
        public string ParameterValue { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string FormId { get; set; }
        public string TerminalID { get; set; }
    }

    public class DO_eSyaParameter
    {
        public int ParameterID { get; set; }
        public bool ParmAction { get; set; }
        public decimal? ParmValue { get; set; }
        public decimal? ParmPerct { get; set; }
        public string? ParmDesc { get; set; }
        public bool ActiveStatus { get; set; }
    }
}

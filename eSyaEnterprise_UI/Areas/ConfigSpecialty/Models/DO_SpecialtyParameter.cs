﻿namespace eSyaEnterprise_UI.Areas.ConfigSpecialty.Models
{
    
        public class DO_SpecialtyParameter
        {
            public int BusinessKey { get; set; }
            public int SpecialtyID { get; set; }
            public int ParameterID { get; set; }
            public decimal ParmPerc { get; set; }
            public bool ParmAction { get; set; }
            public string? ParmDesc { get; set; }
            public decimal ParmValue { get; set; }
            public bool ActiveStatus { get; set; }
            public string FormId { get; set; }
            public int UserID { get; set; }
            public string TerminalID { get; set; }
        }
    
}

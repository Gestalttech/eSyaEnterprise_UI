﻿namespace eSyaEnterprise_UI.Areas.ConfigStores.Models
{
    public class DO_eSyaParameter
    {
        public int ParameterID { get; set; }
        public string? ParameterValue { get; set; }
        public bool ParmAction { get; set; }
        public decimal ParmValue { get; set; }
        public decimal ParmAmount { get; set; }
        public decimal ParmPerct { get; set; }
        public bool ActiveStatus { get; set; }
    }
}

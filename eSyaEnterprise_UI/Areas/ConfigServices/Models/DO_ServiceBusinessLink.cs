﻿namespace eSyaEnterprise_UI.Areas.ConfigServices.Models
{
    public class DO_ServiceBusinessLink
    {
        public int BusinessKey { get; set; }
        public int ServiceId { get; set; }
        public string? ServiceDesc { get; set; }
        public string? ServiceClassDesc { get; set; }
        public string? LocationDescription { get; set; }
        public decimal ServiceCost { get; set; }
        public bool ActiveStatus { get; set; }
        public List<DO_eSyaParameter> l_ServiceParameter { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedOn { get; set; }
        public string TerminalID { get; set; }
    }
}

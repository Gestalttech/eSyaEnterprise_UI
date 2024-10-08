﻿namespace eSyaEnterprise_UI.Areas.ConfigBusiness.Models
{
    public class DO_PaymentMethodBusinessLink
    {
        public int BusinessKey { get; set; }
        public int Isdcode { get; set; }
        public int PaymentMethod { get; set; }
        public int InstrumentType { get; set; }
        public bool InterfaceReqd { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? PaymentMethodDesc { get; set; }
        public string? InstrumentTypeDesc { get; set; }
    }
}

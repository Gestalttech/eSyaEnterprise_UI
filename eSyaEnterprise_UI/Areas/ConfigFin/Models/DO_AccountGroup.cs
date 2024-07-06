namespace eSyaEnterprise_UI.Areas.ConfigFin.Models
{
    public class DO_AccountGroup
    {
        public string? GroupCode { get; set; } = null!;
        public string GroupDesc { get; set; } = null!;
        public string ParentId { get; set; } = null!;
        public int GroupIndex { get; set; }
        public string NatureOfGroup { get; set; } = null!;
        public string? BookType { get; set; } = null!;
        public bool PrGeneralLedger { get; set; }
        public bool PrControlAccount { get; set; }
        public bool JGeneralLedger { get; set; }
        public bool JControlAccount { get; set; }
        public bool SGeneralLedger { get; set; }
        public bool SControlAccount { get; set; }
        public bool PGeneralLedger { get; set; }
        public bool PControlAccount { get; set; }
        public bool CnGeneralLedger { get; set; }
        public bool CnControlAccount { get; set; }
        public bool DnGeneralLedger { get; set; }
        public bool DnControlAccount { get; set; }
        public bool IsIntegrateFa { get; set; }
        public bool UsageStatus { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

namespace eSyaEnterprise_UI.Areas.ConfigBusiness.Models
{
    public class DO_ProcessMaster
    {
        public int ProcessId { get; set; }
        public string ProcessDesc { get; set; }
        public bool IsSegmentSpecific { get; set; }
        public bool SystemControl { get; set; }
        public string ProcessControl { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
    public class DO_ProcessRule
    {
        public int RuleId { get; set; }
        public int ProcessId { get; set; }
        public string RuleDesc { get; set; }
        public string? Notes { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
    public class DO_ProcessRulebySegment
    {
        public int BusinessKey { get; set; }
        public int RuleId { get; set; }
        public int ProcessId { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

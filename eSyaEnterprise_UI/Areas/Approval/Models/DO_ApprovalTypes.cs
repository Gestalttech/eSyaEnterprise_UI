namespace eSyaEnterprise_UI.Areas.Approval.Models
{
    public class DO_ApprovalTypes
    {
        public int BusinessKey { get; set; }
        public int FormId { get; set; }
        public int ApprovalType { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

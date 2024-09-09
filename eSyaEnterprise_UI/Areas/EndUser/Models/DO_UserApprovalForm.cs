namespace eSyaEnterprise_UI.Areas.EndUser.Models
{
    public class DO_UserApprovalForm
    {
        public int BusinessKey { get; set; }
        public int FormID { get; set; }
        public int UserID { get; set; }
        public int ApprovalLevel { get; set; }
        public bool ActiveStatus { get; set; }
        public string TerminalID { get; set; }
    }
}

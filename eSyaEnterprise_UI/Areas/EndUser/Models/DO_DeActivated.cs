namespace eSyaEnterprise_UI.Areas.EndUser.Models
{
    public class DO_DeActivated
    {
        public int UserID { get; set; }
        public bool IsUserDeactivated { get; set; }
        public string DeactivationReason { get; set; }
        public int ModifiedBy { get; set; }
        public string TerminalID { get; set; }
    }
}

namespace eSyaEnterprise_UI.Areas.EndUser.Models
{
    public class DO_Authorize
    {
        public int UserID { get; set; }
        public bool IsUserAuthenticated { get; set; }
        public int ModifiedBy { get; set; }
        public string TerminalID { get; set; }
    }
}

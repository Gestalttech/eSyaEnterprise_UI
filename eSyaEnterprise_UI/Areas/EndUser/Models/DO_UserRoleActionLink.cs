namespace eSyaEnterprise_UI.Areas.EndUser.Models
{
    public class DO_UserRoleActionLink
    {
        public int UserRole { get; set; }
        public int ActionId { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? ActionDesc { get; set; }
    }
}

namespace eSyaEnterprise_UI.Areas.ConfigBusiness.Models
{
    public class DO_LocationMenuLink
    {
        public int BusinessKey { get; set; }
        public int MenuKey { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; } = null!;
    }
}

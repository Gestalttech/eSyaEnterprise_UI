namespace eSyaEnterprise_UI.Areas.ConfigeSya.Models
{
    public class DO_LocationLicenseInfo
    {
        public int BusinessKey { get; set; }
        public byte[] EBusinessKey { get; set; } = null!;
        public string ESyaLicenseType { get; set; } = null!;
        public int EUserLicenses { get; set; }
        public byte[] EActiveUsers { get; set; } = null!;
        public int ENoOfBeds { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string FormID { get; set; }
        public string TerminalId { get; set; }
    }
}

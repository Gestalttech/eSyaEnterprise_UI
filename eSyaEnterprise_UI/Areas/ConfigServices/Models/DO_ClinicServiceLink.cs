namespace eSyaEnterprise_UI.Areas.ConfigServices.Models
{
    public class DO_ClinicServiceLink
    {
        public int ApplicationCode { get; set; }
        public int CodeType { get; set; }
        public string CodeDesc { get; set; }
        public string FormId { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }

        public bool DefaultStatus { get; set; }
        public bool UsageStatus { get; set; }
        public bool ActiveStatus { get; set; }
    }
}

namespace eSyaEnterprise_UI.Areas.ProductSetup.Models
{
    public class DO_Subledger
    {
        public string SubledgerType { get; set; }
        public string? Sltdesc { get; set; }
        public int SubledgerGroup { get; set; }
        public string? SubledgerDesc { get; set; }
        public string? Coahead { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string FormID { get; set; }
        public string TerminalID { get; set; }
    }
}

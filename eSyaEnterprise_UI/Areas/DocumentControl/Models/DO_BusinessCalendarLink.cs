namespace eSyaEnterprise_UI.Areas.DocumentControl.Models
{
    public class DO_BusinessCalendarLink
    {
        public int BusinessKey { get; set; }
        public string CalenderKey { get; set; }
        public bool YearEndStatus { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public bool Alreadylinked { get; set; }
        public int StartMonth { get; set; }
        public string? CalenderType { get; set; }
    }
}

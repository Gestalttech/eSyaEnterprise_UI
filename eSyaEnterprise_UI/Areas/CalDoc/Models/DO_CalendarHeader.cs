namespace eSyaEnterprise_UI.Areas.CalDoc.Models
{
    public class DO_CalendarHeader
    {
        public string CalenderType { get; set; }
        public int Year { get; set; }
        public int StartMonth { get; set; }
        public string? CalenderKey { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime TillDate { get; set; }
        //public bool YearEndStatus { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

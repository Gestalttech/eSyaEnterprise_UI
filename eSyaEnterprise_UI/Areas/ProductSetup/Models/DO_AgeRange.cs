namespace eSyaEnterprise_UI.Areas.ProductSetup.Models
{
    public class DO_AgeRange
    {
        public int AgeRangeId { get; set; }
        public string RangeDesc { get; set; }
        public int AgeRangeFrom { get; set; }
        public int RangeFromPeriod { get; set; } 
        public int AgeRangeTo { get; set; }
        public int RangeToPeriod { get; set; } 
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? RangeFromPeriodDesc { get; set; }
        public string? RangeToPeriodDesc { get; set; }

    }
}

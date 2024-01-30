namespace eSyaEnterprise_UI.Areas.ConfigProduct.Models
{
    public class DO_AgeRange
    {
        public int AgeRangeId { get; set; }
        public string RangeDesc { get; set; }
        public int AgeRangeFrom { get; set; }
        public string RangeFromPeriod { get; set; }
        public int AgeRangeTo { get; set; }
        public string RangeToPeriod { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

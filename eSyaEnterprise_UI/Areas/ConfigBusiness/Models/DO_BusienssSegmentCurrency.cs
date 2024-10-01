namespace eSyaEnterprise_UI.Areas.ConfigBusiness.Models
{
    public class DO_BusienssSegmentCurrency
    {
        public int BusinessId { get; set; }
        public int SegmentId { get; set; }
        public string CurrencyCode { get; set; }
        public string? CurrencyName { get; set; }
        public bool IsTransacting { get; set; }
        public bool IsReal { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string FormID { get; set; }
        public string TerminalId { get; set; }
    }
}

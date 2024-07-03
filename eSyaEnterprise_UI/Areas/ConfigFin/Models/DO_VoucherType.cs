namespace eSyaEnterprise_UI.Areas.ConfigFin.Models
{
    public class DO_VoucherType
    {
        public string BookType { get; set; }
        public string VoucherType { get; set; }
        public int InstrumentType { get; set; }
        public string VoucherTypeDesc { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? InstrumentTypeDesc { get; set; }
    }
}

namespace eSyaEnterprise_UI.Areas.ProductSetup.Models
{
    public class DO_PaymentMethod
    {
        public int Isdcode { get; set; }
        public string PaymentMethod { get; set; }
        public int InstrumentType { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? PaymentMethodDesc { get; set; }
        public string? InstrumentTypeDesc { get; set; }
    }
}

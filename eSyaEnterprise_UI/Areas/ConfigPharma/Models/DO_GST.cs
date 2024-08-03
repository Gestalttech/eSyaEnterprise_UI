namespace eSyaEnterprise_UI.Areas.ConfigPharma.Models
{
    public class DO_GST
    {
        public decimal Hsncode { get; set; }
        public decimal Gstperc { get; set; }
        public decimal Cessperc { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public DateTime? EffectiveTill { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public int HSNVal { get; set; }
    }
}

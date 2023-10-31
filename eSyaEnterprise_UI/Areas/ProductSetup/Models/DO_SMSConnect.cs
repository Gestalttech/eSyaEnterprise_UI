namespace eSyaEnterprise_UI.Areas.ProductSetup.Models
{
    public class DO_SMSConnect
    {
        public int BusinessKey { get; set; }
        public string ServiceProvider { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public DateTime? EffectiveTill { get; set; }
        public string Api { get; set; }
        public string UserId { get; set; }
        public string Password { get; set; }
        public string SenderId { get; set; }
        public int ISDCode { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int User_ID { get; set; }
        public string TerminalID { get; set; }
        public int isEdit { get; set; }
        public bool status { get; set; }
    }
}

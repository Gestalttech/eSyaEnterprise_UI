namespace eSyaEnterprise_UI.Areas.ProductSetup.Models
{
    public class DO_SMSTEvent
    {
        public int TEventID { get; set; }
        public string TEventDesc { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string FormID { get; set; }

    }
    public class DO_SMSVariable
    {
        public string Smsvariable { get; set; }
        public string Smscomponent { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string FormID { get; set; }
    }
}

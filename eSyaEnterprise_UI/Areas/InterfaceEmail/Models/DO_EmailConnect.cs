namespace eSyaEnterprise_UI.Areas.InterfaceEmail.Models
{
    public class DO_EmailConnect
    {
        public int BusinessKey { get; set; }
        public string OutgoingMailServer { get; set; }
        public int Port { get; set; }
        public int EmailType { get; set; }
        public string SenderEmailId { get; set; }
        public string UserId { get; set; }
        public string Password { get; set; }
        public string? PassKey { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public int ISDCode { get; set; }
        public bool status { get; set; }
        public string? EmailTypeDesc { get; set; }
    }
}

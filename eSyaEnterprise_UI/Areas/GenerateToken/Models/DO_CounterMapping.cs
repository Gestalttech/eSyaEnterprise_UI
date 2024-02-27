namespace eSyaEnterprise_UI.Areas.GenerateToken.Models
{
    public class DO_CounterMapping
    {
        public int BusinessKey { get; set; }
        public string? TokenType { get; set; }
        public string CounterNumber { get; set; }
        public int FloorId { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? TokenDesc { get; set; }
        public string? FloorName { get; set; }
        public string? CounterNumberdesc { get; set; }
        public int DisplaySequence { get; set; }
        public string TokenPrefix { get; set; }
        public string? CounterKey { get; set; }


    }
    public class DO_TokenConfiguration
    {
        public string TokenType { get; set; }
        public string TokenDesc { get; set; }
        public string? ConfirmationUrl { get; set; }
        public string? QrcodeUrl { get; set; }
        public int DisplaySequence { get; set; }
        public string TokenPrefix { get; set; }
        public int TokenNumberLength { get; set; }
        public bool IsEnCounter { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

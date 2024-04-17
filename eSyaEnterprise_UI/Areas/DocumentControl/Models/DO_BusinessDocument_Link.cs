namespace eSyaEnterprise_UI.Areas.DocumentControl.Models
{
    public class DO_BusinessDocument_Link
    {
        public int BusinessKey { get; set; }
        public string CalendarKey { get; set; }
        public int ComboId { get; set; }
        public int FormId { get; set; }
        public int DocumentId { get; set; }
        public string SchemaId { get; set; }
        public bool UsageStatus { get; set; }
        public bool FreezeStatus { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? FormName { get; set; }
        public string? DocumentName { get; set; }
    }
}

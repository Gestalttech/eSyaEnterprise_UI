namespace eSyaEnterprise_UI.Areas.CalDoc.Models
{
    public class DO_DocumentControlMaster
    {
        public int DocumentId { get; set; }
        public string ShortDesc { get; set; } = null!;
        public string DocumentDesc { get; set; } = null!;
        public string DocumentType { get; set; } = null!;
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

namespace eSyaEnterprise_UI.Areas.ConfigBusiness.Models
{
    public class DO_LocationPreferredLanguage
    {
        public int BusinessKey { get; set; }
        public string PreferredLanguage { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string FormID { get; set; }
        public string TerminalId { get; set; }
        public string? CultureDesc { get; set; }
        public string? Pldescription { get; set; }
    }
}

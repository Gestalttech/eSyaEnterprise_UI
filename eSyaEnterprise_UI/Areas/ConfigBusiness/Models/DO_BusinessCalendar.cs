namespace eSyaEnterprise_UI.Areas.ConfigBusiness.Models
{
    public class DO_BusinessCalendar
    {
        public int BusinessKey { get; set; }
        public int DocumentId { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public string CalendarType { get; set; }
        public DateTime? EffectiveTill { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? DocumentDesc { get; set; }
        public string? CalendarTypeDesc { get; set; }
    }
}

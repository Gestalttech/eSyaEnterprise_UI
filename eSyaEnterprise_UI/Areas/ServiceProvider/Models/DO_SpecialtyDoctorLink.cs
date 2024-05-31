namespace eSyaEnterprise_UI.Areas.ServiceProvider.Models
{
    public class DO_SpecialtyDoctorLink
    {
        public int BusinessKey { get; set; }
        public string? LocationDesc { get; set; }
        public int SpecialtyID { get; set; }
        public string? SpecialtyDesc { get; set; }
        public int DoctorID { get; set; }
        public string? DoctorName { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

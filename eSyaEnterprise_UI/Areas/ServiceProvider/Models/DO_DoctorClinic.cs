namespace eSyaEnterprise_UI.Areas.ServiceProvider.Models
{
    public class DO_DoctorClinic
    {
        public int BusinessKey { get; set; }
        public int SpecialtyId { get; set; }
        public string? SpecialtyDesc { get; set; }
        public int DoctorId { get; set; }
        public string? DoctorName { get; set; }
        public int ClinicId { get; set; }
        public string? ClinicDesc { get; set; }
        public int ConsultationId { get; set; }
        public string? ConsultationDesc { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

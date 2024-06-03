namespace eSyaEnterprise_UI.Areas.ConfigSpecialty.Models
{
    public class DO_MapSpecialtyClinicConsultationType
    {
        public int BusinessKey { get; set; }
        public int SpecialtyId { get; set; }
        public int ClinicId { get; set; }
        public int ConsultationId { get; set; }
        public bool ActiveStatus { get; set; }
        public string? ClinicDesc { get; set; }
        public string? ConsultationDesc { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

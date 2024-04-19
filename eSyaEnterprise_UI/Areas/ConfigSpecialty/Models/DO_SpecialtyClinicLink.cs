namespace eSyaEnterprise_UI.Areas.ConfigSpecialty.Models
{
    public class DO_SpecialtyClinicLink
    {
        public int BusinessKey { get; set; }
        public int SpecialtyID { get; set; }
        public string SpecialtyDesc { get; set; }
        public int ClinicID { get; set; }
        public string ClinicDesc { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

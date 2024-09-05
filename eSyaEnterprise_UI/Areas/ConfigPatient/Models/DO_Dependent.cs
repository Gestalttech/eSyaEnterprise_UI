namespace eSyaEnterprise_UI.Areas.ConfigPatient.Models
{
    public class DO_Dependent
    {
        public int BusinessKey { get; set; }
        public int PatientTypeId { get; set; }
        public int PatientCategoryId { get; set; }
        public int Relationship { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? RelationshipDesc { get; set; }
    }
}

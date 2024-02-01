namespace eSyaEnterprise_UI.Areas.ConfigPatient.Models
{
    public class DO_PatientTypeCategorySpecialtyLink
    {
        public int PatientTypeId { get; set; }
        public int PatientCategoryId { get; set; }
        public int SpecialtyId { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string ServiceTypeDesc { get; set; }
    }
}

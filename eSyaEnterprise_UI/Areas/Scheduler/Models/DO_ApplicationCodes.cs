namespace eSyaEnterprise_UI.Areas.Scheduler.Models
{
    public class DO_ApplicationCodes
    {

        public int ApplicationCode { get; set; }
        public int CodeType { get; set; }
        public string CodeDesc { get; set; }
    }
    public class DO_BusinessLocation
    {
        public int BusinessKey { get; set; }
        public string LocationDescription { get; set; }
        public string SegmentDesc { get; set; }
        public bool ActiveStatus { get; set; }
    }
    public class DO_DoctorMaster
    {
        public int DoctorId { get; set; }
        public string DoctorName { get; set; }
        public string DoctorShortName { get; set; }
        public int Gender { get; set; }
        public string DoctorRegnNo { get; set; }
        public string? EMailId { get; set; }
        public int ISDCode { get; set; }
        public string MobileNumber { get; set; }
        public int DoctorClass { get; set; }
        public int DoctorCategory { get; set; }
        public int TraiffFrom { get; set; }
        public string? Password { get; set; }
        public int SeniorityLevel { get; set; }
        public string FormID { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        //for displaying properties
        public string? DoctorClassDesc { get; set; }
        public string? DoctorCategoryDesc { get; set; }
        public string? SeniorityLevelDesc { get; set; }
        //public List<DO_DoctorParameter> l_DoctorParameter { get; set; }
        public string? TraiffFromDesc { get; set; }
        public string? GenderDesc { get; set; }

    }
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

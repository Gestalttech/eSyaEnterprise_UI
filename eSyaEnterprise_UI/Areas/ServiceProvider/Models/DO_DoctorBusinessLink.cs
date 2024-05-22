namespace eSyaEnterprise_UI.Areas.ServiceProvider.Models
{
    public class DO_DoctorBusinessLink
    {
        public int BusinessKey { get; set; }
        public string BusinessLocation { get; set; }
        public int DoctorId { get; set; }
        public int TimeSlotInMins { get; set; }
        public int PatientCountPerHour { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public int IsdCode { get; set; }
    }
    public class DO_ISDCodes
    {
        public int Isdcode { get; set; }
        public string MobileNumberPattern { get; set; }
        public string CountryFlag { get; set; }
        public string CountryName { get; set; }
        public string CountryCode { get; set; }
        public string DomainName { get; set; }
    }
}

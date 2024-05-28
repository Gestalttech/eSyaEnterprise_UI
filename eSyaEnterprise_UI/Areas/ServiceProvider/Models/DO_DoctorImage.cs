namespace eSyaEnterprise_UI.Areas.ServiceProvider.Models
{
    public class DO_DoctorImage
    {
        public int DoctorId { get; set; }
        public string DoctorProfileTitle { get; set; }
        public byte[] DoctorProfileImage { get; set; }
        public string DoctorSignatureTitle { get; set; }
        public byte[] DoctorSignatureImage { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

namespace eSyaEnterprise_UI.Areas.ServiceProvider.Models
{
    public class DO_DoctorProfileAddress
    {
        public int BusinessKey { get; set; }
        public int DoctorId { get; set; }
        public int Isdcode { get; set; }
        public int StateCode { get; set; }
        public int CityCode { get; set; }
        public string Zipcode { get; set; }
        public int ZipserialNumber { get; set; }
        public string? Area { get; set; }
        public string Address { get; set; }
        public string? Pobox { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }

        public string? StateDesc { get; set; }
        public string? CityDesc { get; set; }
        public string? ZipDesc { get; set; }
    }
}

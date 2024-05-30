namespace eSyaEnterprise_UI.Areas.ServiceProvider.Models
{
    public class DO_DoctorStatutoryDetails
    {
        public int DoctorId { get; set; }
        public int Isdcode { get; set; }
        public int StatutoryCode { get; set; }
        public string? StatutoryDescription { get; set; }
        public decimal TaxPerc { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public DateTime? EffectiveTill { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string StatutoryValue { get; set; }
    }
}

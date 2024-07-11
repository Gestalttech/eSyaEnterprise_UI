namespace eSyaEnterprise_UI.Areas.ConfigPatient.Models
{
    public class DO_PatientCategoryDiscount
    {
        public int BusinessKey { get; set; }
        public int PatientCategoryId { get; set; }
        public int DiscountFor { get; set; }
        public int DiscountAt { get; set; }
        public int ServiceClassId { get; set; }
        public decimal ServiceChargePerc { get; set; }
        public string DiscountRule { get; set; } = null!;
        public decimal DiscountPerc { get; set; }
        public bool ActiveStatus { get; set; }
        public int ServiceId { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public List<DO_eSyaParameter> l_discountparams { get; set; }
        public string? PatientCategoryDesc { get; set; }
        public string? ServiceClassDesc { get; set; }
        public bool serviceclass { get; set; }
    }
}

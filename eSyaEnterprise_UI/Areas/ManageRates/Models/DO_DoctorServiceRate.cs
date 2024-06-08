namespace eSyaEnterprise_UI.Areas.ManageRates.Models
{
    public class DO_DoctorServiceRate
    {
        //public int ServiceId { get; set; }
        //public int ServiceTypeId { get; set; }
        //public int ServiceGroupId { get; set; }
        //public int ServiceClassId { get; set; }
        //public string ServiceDesc { get; set; }
        //public string ServiceShortDesc { get; set; }
        //public string Gender { get; set; }
        //public bool IsServiceBillable { get; set; }
        //public decimal ServiceCost { get; set; }
        //public string InternalServiceCode { get; set; }
        //public bool ActiveStatus { get; set; }
        //public string FormId { get; set; }
        //public int UserID { get; set; }
        //public DateTime CreatedOn { get; set; }
        //public string TerminalID { get; set; }

        //public string ServiceTypeDesc { get; set; }
        //public string ServiceGroupDesc { get; set; }
        //public string ServiceClassDesc { get; set; }

        //public bool BusinessLinkStatus { get; set; }

        //public List<DO_eSyaParameter> l_ServiceParameter { get; set; }
        public int BusinessKey { get; set; }
        public int ClinicId { get; set; }
        public int ConsultationId { get; set; }
        public int ServiceId { get; set; }
        public int RateType { get; set; }
        public int DoctorId { get; set; }
        public int SpecialtyId { get; set; }
        public string CurrencyCode { get; set; }
        public DateTime EffectiveDate { get; set; }
        public decimal Tariff { get; set; }
        public bool ActiveStatus { get; set; }
        public DateTime? EffectiveTill { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? ServiceDesc { get; set; }
        public string? DoctorDesc { get; set; }

        
    }
}

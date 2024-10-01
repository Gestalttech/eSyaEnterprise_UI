namespace eSyaEnterprise_UI.Areas.ConfigBusiness.Models
{
    public class DO_BusinessLocation
    {
        public int BusinessId { get; set; }
        public int LocationId { get; set; }
        public int BusinessKey { get; set; }
        public string ShortDesc { get; set; } = null!;
        public string LocationDescription { get; set; } = null!;
        public string BusinessName { get; set; } = null!;
        public int Isdcode { get; set; }
        public int CityCode { get; set; }
        public string CurrencyCode { get; set; } = null!;
        //public bool? TolocalCurrency { get; set; }
        //public bool TocurrConversion { get; set; }
        //public bool TorealCurrency { get; set; }
        public bool Lstatus { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? CurrencyName { get; set; }
        public int SegmentId { get; set; }
        public List<DO_BusienssSegmentCurrency> l_BSCurrency { get; set; }
        public List<DO_eSyaParameter>? l_FormParameter { get; set; }
        public List<DO_LocationPreferredLanguage>? l_Preferredlanguage { get; set; }
        public bool SMSIntegration { get; set; }
        public bool EmailIntegration { get; set; }
        public bool SecurityQuestionIntegration { get; set; }
    }
    public class DO_LocationFinancialInfo
    {
        public int BusinessKey { get; set; }
        public bool IsBookOfAccounts { get; set; }
        public int BusinessSegmentId { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string FormID { get; set; }
        public string TerminalId { get; set; }
    }
    public class DO_LocationTaxInfo
    {
        public int BusinessKey { get; set; }
        public int TaxIdentificationId { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string FormID { get; set; }
        public string TerminalId { get; set; }

    }
    //public class DO_LocationLicenseInfo
    //{
    //    public int BusinessKey { get; set; }
    //    public byte[] EBusinessKey { get; set; } = null!;
    //    public string ESyaLicenseType { get; set; } = null!;
    //    public int EUserLicenses { get; set; }
    //    public byte[] EActiveUsers { get; set; } = null!;
    //    public int ENoOfBeds { get; set; }
    //    public bool ActiveStatus { get; set; }
    //    public int UserID { get; set; }
    //    public string FormID { get; set; }
    //    public string TerminalId { get; set; }



    //}

}

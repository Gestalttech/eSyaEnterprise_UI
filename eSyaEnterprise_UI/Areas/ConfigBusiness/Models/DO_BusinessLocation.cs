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
        public bool? TolocalCurrency { get; set; }
        public bool TocurrConversion { get; set; }
        public bool TorealCurrency { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? CurrencyName { get; set; }
        public int SegmentId { get; set; }
        public List<DO_BusienssSegmentCurrency> l_BSCurrency { get; set; }
        public List<DO_eSyaParameter>? l_FormParameter { get; set; }
        public List<DO_LocationPreferredLanguage>? l_Preferredlanguage { get; set; }
    }
}

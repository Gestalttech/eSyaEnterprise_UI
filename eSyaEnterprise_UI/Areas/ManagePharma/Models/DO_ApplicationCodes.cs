namespace eSyaEnterprise_UI.Areas.ManagePharma.Models
{
    public class DO_ApplicationCodes
    {
        public int ApplicationCode { get; set; }
        public int CodeType { get; set; }
        public string CodeDesc { get; set; }
    }

    public class DO_CountryCodes
    {
        public int Isdcode { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public string CurrencyCode { get; set; }
        public string CurrencyName { get; set; }

    }
}

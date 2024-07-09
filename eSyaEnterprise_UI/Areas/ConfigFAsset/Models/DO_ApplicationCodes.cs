namespace eSyaEnterprise_UI.Areas.ConfigFAsset.Models
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
    }
    public class DO_ISDCodes
    {
        public int Isdcode { get; set; }
        public string CountryName { get; set; }
        public string CountryFlag { get; set; }
        public string CountryCode { get; set; }

    }
}

namespace eSyaEnterprise_UI.Areas.FinAdmin.Models
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
    public class DO_CurrencyMaster
    {
        public string CurrencyCode { get; set; } = null!;
        public string CurrencyName { get; set; } = null!;
    }
}

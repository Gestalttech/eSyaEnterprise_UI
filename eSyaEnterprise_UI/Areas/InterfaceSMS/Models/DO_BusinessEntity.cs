namespace eSyaEnterprise_UI.Areas.InterfaceSMS.Models
{
    public class DO_BusinessEntity
    {
        public int BusinessId { get; set; }
        public string BusinessDesc { get; set; }

    }
    public class DO_BusinessLocation
    {
        public int BusinessKey { get; set; }
        public string LocationDescription { get; set; } = null!;

    }

    public class DO_CountryCodes
    {
        public int Isdcode { get; set; }
        public string CountryName { get; set; } = null!;


    }
}

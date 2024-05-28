namespace eSyaEnterprise_UI.Areas.ServiceProvider.Models
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
        public string SegmentDesc { get; set; }
        public bool ActiveStatus { get; set; }
    }
}

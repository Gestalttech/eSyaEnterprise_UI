namespace eSyaEnterprise_UI.Areas.Approval.Models
{
    public class DO_BusinessLocation
    {
        public int BusinessKey { get; set; }
        public string LocationDescription { get; set; }
    }
    public class DO_Forms
    {
        public int FormID { get; set; }
        public string FormName { get; set; }
        public string FormCode { get; set; }
    }
    public class DO_ApplicationCodes
    {
        public int ApplicationCode { get; set; }
        public int CodeType { get; set; }
        public string CodeDesc { get; set; }
    }
}

namespace eSyaEnterprise_UI.Areas.ConfigBusiness.Models
{
    public class DO_ReturnParameter
    {
        public bool Status { get; set; }
        public string StatusCode { get; set; }
        public string Message { get; set; }
        public bool Warning { get; set; }
        public string WarningMessage { get; set; }
        public string ErrorCode { get; set; }
        public decimal ID { get; set; }
        public string Key { get; set; }
    }
}

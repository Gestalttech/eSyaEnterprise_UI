namespace eSyaEnterprise_UI.Areas.ConfigFAsset.Models
{
    public class DO_ReturnParameter
    {
        public bool Status { get; set; }
        public string StatusCode { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string ErrorCode { get; set; } = null!;
        public decimal ID { get; set; }
        public string Key { get; set; } = null!;
    }
}

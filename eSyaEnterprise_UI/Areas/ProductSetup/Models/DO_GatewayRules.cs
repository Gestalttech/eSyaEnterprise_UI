namespace eSyaEnterprise_UI.Areas.ProductSetup.Models
{
    public class DO_GatewayRules
    {
        public int GwruleId { get; set; }
        public string Gwdesc { get; set; }
        public int RuleValue { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

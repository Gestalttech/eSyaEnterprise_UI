namespace eSyaEnterprise_UI.Areas.GenerateToken.Models
{
    public class DO_CounterAddOn
    {
        public int BusinessKey { get; set; }
        public string CounterKey { get; set; }
        public string AddOn { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? FloorName { get; set; }
    }
    public class DO_Floor
    {
        public int FloorId { get; set; }
        public string FloorName { get; set; }
    }
}

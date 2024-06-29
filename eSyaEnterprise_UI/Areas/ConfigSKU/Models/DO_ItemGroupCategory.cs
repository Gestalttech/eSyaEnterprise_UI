namespace eSyaEnterprise_UI.Areas.ConfigSKU.Models
{
    public class DO_ItemGroupCategory
    {
        public int flag { get; set; }
        public int ItemGroupID { get; set; }
        public int ItemCategory { get; set; }
        public int ItemSubCategory { get; set; }
        public decimal BudgetAmount { get; set; }
        public decimal CommittmentAmount { get; set; }
        public bool Fastatus { get; set; }
        public bool? ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedOn { get; set; }
        public string TerminalID { get; set; }
    }
}

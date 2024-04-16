namespace eSyaEnterprise_UI.Areas.ConfigStores.Models
{
    public class DO_StoreMaster
    {
        public int StoreCode { get; set; }
        public string StoreDesc { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }

        public List<DO_eSyaParameter> l_FormParameter { get; set; }
    }
    public class DO_PortfolioMaster
    {
        public int PortfolioId { get; set; }
        public string PortfolioDesc { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

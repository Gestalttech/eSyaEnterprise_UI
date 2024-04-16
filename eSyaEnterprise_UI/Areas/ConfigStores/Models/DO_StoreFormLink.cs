namespace eSyaEnterprise_UI.Areas.ConfigStores.Models
{
    public class DO_StoreFormLink
    {
        public int FormId { get; set; }
        public int StoreCode { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

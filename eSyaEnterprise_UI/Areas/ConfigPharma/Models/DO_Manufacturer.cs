namespace eSyaEnterprise_UI.Areas.ConfigPharma.Models
{
    public class DO_Manufacturer
    {
        public int ManufacturerId { get; set; }
        public string ManufacturerName { get; set; }
        public string ManfShortName { get; set; } 
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

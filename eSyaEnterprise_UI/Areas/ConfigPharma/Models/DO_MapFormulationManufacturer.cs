namespace eSyaEnterprise_UI.Areas.ConfigPharma.Models
{
    public class DO_MapFormulationManufacturer
    {
        public int CompositionId { get; set; }
        public int FormulationId { get; set; }
        public int ManufacturerId { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public List<DO_MapFormulationManufacturer>? manfctlist { get; set; }
    }
}

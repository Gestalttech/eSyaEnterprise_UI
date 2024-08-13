namespace eSyaEnterprise_UI.Areas.ConfigFin.Models
{
    public class DO_COAParameter
    {
        public int ParameterID { get; set; }
        public string ParameterDesc { get; set; }
        public bool UsageStatus { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedTerminal { get; set; }
    }
}

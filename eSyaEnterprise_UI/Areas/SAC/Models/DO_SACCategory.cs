namespace eSyaEnterprise_UI.Areas.SAC.Models
{
    public class DO_SACCategory
    {
        public int Isdcode { get; set; }
        public string Sacclass { get; set; }
        public string Saccategory { get; set; }
        public string SaccategoryDesc { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public bool _isInsert { get; set; }
    }
}

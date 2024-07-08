namespace eSyaEnterprise_UI.Areas.ConfigFAsset.Models
{
    public class DO_DepreciationMethod
    {
        public int Isdcode { get; set; }
        public int AssetGroup { get; set; }
        public int AssetSubGroup { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public int DepreciationMethod { get; set; }
        public decimal DepreciationPercentage { get; set; }
        public int UsefulYears { get; set; }
        public DateTime? EffectiveTill { get; set; }
        public bool ActiveStatus { get; set; }
        public string? AssetGroupDesc { get; set; }
        public string? AssetSubGroupDesc { get; set; }
        public string? DepreciationMethodDesc { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

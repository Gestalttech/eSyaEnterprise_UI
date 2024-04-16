namespace eSyaEnterprise_UI.Areas.ConfigStores.Models
{
    public class DO_Forms
    {
        public bool IsInsert { get; set; }
        public int FormID { get; set; }
        public string FormCode { get; set; }
        public string FormName { get; set; }
        public string ControllerName { get; set; }
        public string ToolTip { get; set; }
        public bool IsDocumentNumberRequired { get; set; }
        public bool IsStoreLink { get; set; }
        public bool IsMaterial { get; set; }
        public bool IsPharmacy { get; set; }
        public bool IsStationary { get; set; }
        public bool IsCafeteria { get; set; }
        public bool IsFandB { get; set; }
        public bool IsDoctor { get; set; }

        public string InternalFormNumber { get; set; }
        public string NavigateURL { get; set; }
        public string FormDescription { get; set; }

        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }

        //  public List<DO_eSyaParameter> l_FormParameter { get; set; }
        public List<DO_FormAction> l_FormAction { get; set; }
        public List<DO_FormParameter> l_FormParameter { get; set; }
        public int ParameterId { get; set; }
        public List<DO_FormSubParameter> l_FormSubParameter { get; set; }
    }
    public class DO_FormSubParameter
    {
        public int ParameterId { get; set; }
        public int SubParameterId { get; set; }
        public string? SubParameterDesc { get; set; }
        public bool ActiveStatus { get; set; }

    }
}

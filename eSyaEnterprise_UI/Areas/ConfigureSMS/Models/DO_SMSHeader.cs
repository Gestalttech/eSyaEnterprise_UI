using eSyaEnterprise_UI.Areas.ProductSetup.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.ConfigureSMS.Models
{
    public class DO_SMSHeader
    {
        public string Smsid { get; set; }
        public int FormId { get; set; }
        public string Smsdescription { get; set; }
        public bool IsVariable { get; set; }
        public int TEventID { get; set; }
        public string? TEventDesc { get; set; }
        public string? Tevent { get; set; }
        public string Smsstatement { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string FormId1 { get; set; }
        public string TerminalID { get; set; }

        public List<DO_eSyaParameter> l_SMSParameter { get; set; }
    }
    public class DO_SMSTEvent
    {
        public int TEventID { get; set; }
        public string TEventDesc { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string FormID { get; set; }
    }
    public class DO_BusinessLocation
    {
        public int BusinessKey { get; set; }
        public string LocationDescription { get; set; }
    }
    public class DO_BusinessFormSMSLink
    {
        public int BusinessKey { get; set; }
        public string Smsid { get; set; }
        public int FormId { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string FormId1 { get; set; }
        public string TerminalID { get; set; }
    }
    public class DO_Forms
    {
        public bool IsInsert { get; set; }
        public int FormID { get; set; }
        public string? FormCode { get; set; }
        public string FormName { get; set; }
        public string ControllerName { get; set; }
        public string? ToolTip { get; set; }
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
        public List<DO_FormAction>? l_FormAction { get; set; }
        public List<DO_FormParameter>? l_FormParameter { get; set; }
        public int ParameterId { get; set; }
        public List<DO_FormSubParameter>? l_FormSubParameter { get; set; }

    }
}

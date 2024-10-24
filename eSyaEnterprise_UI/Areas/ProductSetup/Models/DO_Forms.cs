﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ProductSetup.Models
{

    public class DO_AreaController
    {
        public int Id { get; set; }
        public string Area { get; set; }
        public string Controller { get; set; }
        public bool ActiveStatus { get; set; }
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
        public List<DO_FormAction>?  l_FormAction { get; set; }
        public List<DO_FormParameter>? l_FormParameter { get; set; }
        public int ParameterId { get; set; }
        public List<DO_FormSubParameter>? l_FormSubParameter { get; set; }

    }

    public class DO_FormParameter
    {
        public int FormId { get; set; }
        public int ParameterId { get; set; }
        public string ParameterValue { get; set; }
        public string? ParameterDesc { get; set; }
        public bool ParmAction { get; set; }
        public bool ActiveStatus { get; set; }
    }

    public class DO_FormAction
    {
        public int ActionId { get; set; }
        public string? ActionDesc { get; set; }
        public int DisplaySequence { get; set; }
        public bool UsageStatus { get; set; }
        public bool ActiveStatus { get; set; }


    }

    public class DO_FormSubParameter
    {
        public int ParameterId { get; set; }
        public int SubParameterId { get; set; }
        public string? SubParameterDesc { get; set; }
        public bool ActiveStatus { get; set; }

    }

    public class DO_FormModule
    {
        public int FormId { get; set; }
        public int ModuleId { get; set; }
        public string TransactionTable { get; set; }
        public string RefferedTable { get; set; }
        public string ReferenceLink { get; set; }
        public string Description { get; set; }
        public int AssignedTo { get; set; }
        public DateTime? AssignedOn { get; set; }
        public string Status { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormName { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public int Isadd { get; set; }
    }

    public class DO_FormModuleConfiguration
    {
        public List<DO_ApplicationCodes> l_Module { get; set; }
        public List<DO_FormModule> l_Form { get; set; }
    }
    public class DO_Actions
    {
        public int ActionId { get; set; }
        public string ActionDesc { get; set; } = null!;
        public int DisplaySequence { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; } = null!;
    }
}


﻿using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.EndUser.Models
{
    public class DO_UserMaster
    {
        public int UserID { get; set; }
        public string LoginID { get; set; } = null!;
        public string LoginDesc { get; set; } = null!;
        public byte[]? Photo { get; set; }
        public string? PhotoUrl { get; set; }
        public string EMailId { get; set; } = null!;
        public bool CreatePasswordInNextSignIn { get; set; }
        public int UnsuccessfulAttempt { get; set; }
        public DateTime? LoginAttemptDate { get; set; }
        public bool BlockSignIn { get; set; }
        public DateTime? LastPasswordUpdatedDate { get; set; }
        public DateTime? LastActivityDate { get; set; }
        public bool IsUserAuthenticated { get; set; }
        public DateTime? UserAuthenticatedDate { get; set; }
        public bool IsUserDeactivated { get; set; }
        public DateTime? UserDeactivatedOn { get; set; }
        public string? DeactivationReason { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int CreatedBy { get; set; }
        public string TerminalID { get; set; }
        //For Image
        public string? userimage { get; set; }

        public List<DO_eSyaParameter> l_userparameter { get; set; }

        public int UserGroup { get; set; }
        public int UserRole { get; set; }
        public string? UserGroupDesc { get; set; }
        public string? UserRoleDesc { get; set; }
        public string? AuthenticStatus { get; set; }


        //public int UserID { get; set; }
        //public string LoginID { get; set; }
        //public string LoginDesc { get; set; }
        //public string Password { get; set; }
        //public int ISDCode { get; set; }
        //public bool AllowMobileLogin { get; set; }
        //public string MobileNumber { get; set; }
        //public string eMailID { get; set; }
        //public byte[] Photo { get; set; }
        //public string? PhotoURL { get; set; }
        //public byte[] DigitalSignature { get; set; }
        //public DateTime LastPasswordChangeDate { get; set; }
        //public DateTime? LastActivityDate { get; set; }
        //public string? OTPNumber { get; set; }
        //public DateTime OTPGeneratedDate { get; set; }
        //public int PreferredLanguage { get; set; }
        //public int Authenticated { get; set; }
        //public string DeactivationReason { get; set; }
        //public bool ActiveStatus { get; set; }
        //public int CreatedBy { get; set; }
        //public string FormId { get; set; }
        //public string TerminalId { get; set; }
        //public bool IsApprover { get; set; }
        //public bool IsDoctor { get; set; }
        //public int? DoctorId { get; set; }
        ////For Image
        //public string? userimage { get; set; }
        //public string? DSimage { get; set; }
    }
    public class DO_eSyaParameter
    {
        public int ParameterID { get; set; }
        public string? ParameterValue { get; set; }
        public bool ParmAction { get; set; }
        public decimal ParmValue { get; set; }
        public decimal ParmPerc { get; set; }
        public string? ParmDesc { get; set; }
        public bool ActiveStatus { get; set; }
    }
    public class DO_PreferredCulture
    {
        public string CultureCode { get; set; }
        public string CultureDescription { get; set; }

    }
    public class DO_UserBusinessLocation
    {
        public int UserID { get; set; }
        public int BusinessKey { get; set; }
        public bool AllowMtfy { get; set; }
        public string PreferredLanguage { get; set; }
        public int Isdcode { get; set; }
        public string MobileNumber { get; set; }
        public int IsdcodeWan { get; set; }
        public string WhatsappNumber { get; set; }
        public int ESyaAuthentication { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int CreatedBy { get; set; }
        public string TerminalID { get; set; }
    }

    public class DO_UserPhoto
    {
        public int UserID { get; set; }
        public byte[]? Photo { get; set; }
        public string? PhotoUrl { get; set; }
        public string? TerminalID { get; set; }
        public int CreatedBy { get; set; }
        public string? userimage { get; set; }
    }

    public class DO_eSignature
    {
        public int UserID { get; set; }
        public byte[] ESignature { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public string TerminalID { get; set; }
        public string? LoginID { get; set; } = null!;
        public string? LoginDesc { get; set; } = null!;
        public string? EMailId { get; set; } = null!;
        public bool IsUserAuthenticated { get; set; }
        public bool IsUserDeactivated { get; set; }
        public string? usersignature { get; set; }
         public int CreatedBy { get; set; }
    }

    public class DO_BlockUser
    {
        public int UserID { get; set; }
        public bool BlockSignIn { get; set; }
        public int ModifiedBy { get; set; }
        public string TerminalID { get; set; }
    }
    public class DO_ChangePassword
    {
        public int userID { get; set; }
        public string oldpassword { get; set; }
        public string newPassword { get; set; }
        public string FormID { get; set; }
        public int CreatedBy { get; set; }
        public string TerminalID { get; set; }
    }
}

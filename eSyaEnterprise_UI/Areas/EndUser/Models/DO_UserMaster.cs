using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.EndUser.Models
{
    public class DO_UserMaster
    {
        public int UserID { get; set; }
        public string LoginID { get; set; }
        public string LoginDesc { get; set; }
        public string Password { get; set; }
        public int ISDCode { get; set; }
        public bool AllowMobileLogin { get; set; }
        public string MobileNumber { get; set; }
        public string eMailID { get; set; }
        public byte[] Photo { get; set; }
        public string? PhotoURL { get; set; }
        public byte[] DigitalSignature { get; set; }
        public DateTime LastPasswordChangeDate { get; set; }
        public DateTime? LastActivityDate { get; set; }
        public string? OTPNumber { get; set; }
        public DateTime OTPGeneratedDate { get; set; }
        public int PreferredLanguage { get; set; }
        public int Authenticated { get; set; }
        public string DeactivationReason { get; set; }
        public bool ActiveStatus { get; set; }
        public int CreatedBy { get; set; }
        public string FormId { get; set; }
        public string TerminalId { get; set; }
        public bool IsApprover { get; set; }
        public bool IsDoctor { get; set; }
        public int? DoctorId { get; set; }
        //For Image
        public string? userimage { get; set; }
        public string? DSimage { get; set; }
    }
}

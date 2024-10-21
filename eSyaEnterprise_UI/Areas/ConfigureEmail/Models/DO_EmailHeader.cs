using System;
using System.Collections.Generic;
using System.Text;

namespace eSyaEnterprise_UI.Areas.ConfigureEmail.Models
{
    public class DO_EmailHeader
    {
        public string EmailTempid { get; set; }
        public int EmailType { get; set; }
        public int FormId { get; set; }
        public string EmailTempDesc { get; set; }
        public string EmailSubject { get; set; }
        public string EmailBody { get; set; }
        public bool IsVariable { get; set; }
        public int TeventId { get; set; }
        public bool IsAttachmentReqd { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }

        public List<DO_eSyaParameter> l_EmailParameter { get; set; }
    }

    public class DO_EmailRecipient
    {
        public int BusinessKey { get; set; }
        public string EmailTempid { get; set; }
        public string Emailid { get; set; }
        public string RecipientName { get; set; }
        public string Remarks { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string FormId1 { get; set; }
        public string TerminalID { get; set; }
    }
    
    public class DO_BusinessFormEmailLink
    {
        public int BusinessKey { get; set; }
        public int FormId { get; set; }
        public string EmailTempId { get; set; } = null!;
        public bool ActiveStatus { get; set; }
        public int UserID { get; set; }
        public string FormId1 { get; set; }
        public string TerminalID { get; set; }
    }
}

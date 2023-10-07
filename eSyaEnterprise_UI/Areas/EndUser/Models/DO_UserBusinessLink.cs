using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.EndUser.Models
{
    public class DO_UserBusinessLink
    {
        public int UserID { get; set; }
        public int BusinessKey { get; set; }
        public string? LocationDescription { get; set; }
        public int UserGroup { get; set; }
        public string? UserGroupDesc { get; set; }
        public int UserType { get; set; }
        public string? UserTypeDesc { get; set; }
        public int IUStatus { get; set; }
        public bool AllowMTFY { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int CreatedBy { get; set; }
        public string TerminalId { get; set; }
    }
}

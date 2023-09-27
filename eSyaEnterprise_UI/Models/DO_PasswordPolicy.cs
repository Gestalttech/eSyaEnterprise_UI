using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Models
{
    public class DO_PasswordPolicy
    {
        public int RequiredLength { get; set; }
        public int RequireLowercase { get; set; }
        public int RequireUppercase { get; set; }
        public int RequireNumeric { get; set; }
        public int RequireSpecialChar { get; set; }
        public int PasswordValidity { get; set; }
        public int PasswordRepeatationPolicy { get; set; }
        public int UnsuccessfulLoginAttempt { get; set; }
        public int UnLockLoginInHours { get; set; }
    }
}

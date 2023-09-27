using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace eSyaEnterprise_UI.Models
{
    public class LoginViewModel : IdentityUser
    {
        //public string LoginID { get; set; }

        public string OTP { get; set; }

        [DataType(DataType.Password)]
        [Required(ErrorMessage = "UserID")]
        public string Password { get; set; }

        [Display(Name = "Remember Me")]
        public bool RememberMe { get; set; }

        public string MobileNumber { get; set; }
        //public string ReturnUrl { get; set; }

        public List<SelectListItem> l_BusinessKey { set; get; }
        public List<SelectListItem> l_FinancialYear { get; set; }

        public int BusinessKey { set; get; }
        public int FinancialYear { set; get; }

        public string BusinessLocation { set; get; }
    }

    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
    }

    public class ApplicationRole : IdentityRole
    {
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public string IPAddress { get; set; }
    }
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }
    }

    public class MobileViewModel
    {
        public string MobileNumber { get; set; }
    }
}

using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Controllers
{
    [AllowAnonymous]
    public class LoginController : Controller
    {
        private SignInManager<ApplicationUser> signInManager;

        public LoginController(SignInManager<ApplicationUser> signinMgr)
        {
            // userManager = userMgr;
            signInManager = signinMgr;
        }
        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var isValid = (model.UserName == "admin" && model.Password == "Admin@123");
                if (!isValid)
                {
                    // ModelState.AddModelError("", "username or password is invalid");
                    return View(model);
                }
                var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme, ClaimTypes.Name, ClaimTypes.Role);
                identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, model.UserName));
                identity.AddClaim(new Claim(ClaimTypes.Name, model.UserName));
                var principal = new ClaimsPrincipal(identity);
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties { IsPersistent = model.RememberMe });

                //model.ReturnUrl = "Login/LoginConfirmation";

                return new RedirectToActionResult("LoginConfirmation", "Login", "");
                //return View(model);
            }
            else
            {
                //ModelState.AddModelError("", "username or password is blank");
                return View(model);
            }
        }

        public IActionResult AccessDenied()
        {
            return View();
        }
        public IActionResult GoogleLogin()
        {
            return GoogleLogin(Url);
        }

        [AllowAnonymous]
        public IActionResult GoogleLogin(IUrlHelper url)
        {
            string redirectUrl = url.Action("GoogleResponse", "Account");
            var properties = signInManager.ConfigureExternalAuthenticationProperties("Google", redirectUrl);
            return new ChallengeResult("Google", properties);
        }

        [AllowAnonymous]
        public async Task<IActionResult> GoogleResponse()
        {
            ExternalLoginInfo info = await signInManager.GetExternalLoginInfoAsync();

            return RedirectToAction(nameof(Login));
        }

        public IActionResult LoginConfirmation()
        {
            return View();
        }

        public IActionResult RedirectFA()
        {
            AppSessionVariables.SetSessionUserID(HttpContext, 10);
            RedirectToActionResult redirectResult = new RedirectToActionResult("Index", "Home", "");
            return redirectResult;
        }
        public IActionResult MobileLogin()
        {
            return View();
        }
        public IActionResult MobileLoginOTP()
        {
            return View();
        }
        public IActionResult GmailLogin()
        {
            return View();
        }
        public IActionResult GetUserID()
        {
            return View();
        }
        public IActionResult GetPassword()
        {
            return View();
        }
        public IActionResult FacebookLogin()
        {
            return View();
        }
        public IActionResult CreatePassword()
        {
            return View();
        }

        [HttpPost]
        public IActionResult SetLanguage(string culture, string returnUrl)
        {
            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
            new CookieOptions { Expires = DateTimeOffset.UtcNow.AddDays(1) }
            );

            return LocalRedirect(returnUrl);
        }

        private async Task SignInUser(string username, bool isPersistent)
        {
            // Initialization.  
            var claims = new List<Claim>();

            try
            {
                // Setting  
                claims.Add(new Claim(ClaimTypes.Name, username));
                var claimIdenties = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var claimPrincipal = new ClaimsPrincipal(claimIdenties);
                var authenticationManager = Request.HttpContext;

                // Sign In.  
                await authenticationManager.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimPrincipal, new AuthenticationProperties() { IsPersistent = isPersistent });
            }
            catch (Exception)
            {
                // Info  
                throw;
            }
        }

        public async Task<IActionResult> OnPostLogOff()
        {
            try
            {
                // Setting.  
                var authenticationManager = Request.HttpContext;

                // Sign Out.  
                await authenticationManager.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            }
            catch (Exception)
            {
                // Info  
                throw;
            }

            // Info.  
            return this.RedirectToPage("/Login");
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            HttpContext.SignOutAsync();
            return View();
        }

        public IActionResult CommonIndex()
        {
            return View();
        }
    }
}

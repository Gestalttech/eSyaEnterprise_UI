using DocumentFormat.OpenXml.Spreadsheet;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Extension;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using eSyaEssentials_UI;
using Humanizer.Configuration;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Data.SqlClient.DataClassification;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Controllers
{
    [AllowAnonymous]
    public class AccountController : Controller
    {
        private SignInManager<ApplicationUser> signInManager;
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        private readonly IApplicationRulesServices _applicationRulesServices;
        private readonly ILogger<AccountController> _logger;
        private readonly DO_AppConfig appConfig;
        private readonly IPasswordPolicy _passwordPolicy;
        private readonly DO_PasswordPolicy _passwordStrength;
        private readonly IConfiguration _configuration;
        public AccountController(SignInManager<ApplicationUser> signinMgr,
             IeSyaGatewayServices eSyaGatewayServices,
             IApplicationRulesServices applicationRulesServices,
             IOptions<DO_AppConfig> option,
             ILogger<AccountController> logger,
             IPasswordPolicy passwordPolicy,
              IOptions<DO_PasswordPolicy> passwordStrength,
              IConfiguration configuration)
        {
            signInManager = signinMgr;
            _eSyaGatewayServices = eSyaGatewayServices;
            _applicationRulesServices = applicationRulesServices;
            appConfig = option.Value;
            _logger = logger;
            _passwordPolicy = passwordPolicy;
            _passwordStrength = passwordStrength.Value;
            _configuration= configuration;
        }
        public async Task<IActionResult> Index()
        {
            try
            {
               int GwRuleId = 5;
                HttpContext.Session.Set("AppConfig", appConfig);

                SetLoginApplicationRuleInViewBag();
                var cultureResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<List<DO_eSyaLoginCulture>>("ApplicationRules/GetActiveCultures");
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<List<DO_AppCodes>>("Common/GetApplicationCodesByCodeType?codeType="+ ApplicationCodeTypeValues.SecurityQuestions);
                var QuestionResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<int>("UserAccount/GetNumberofQuestion?GwRuleId=" + GwRuleId);

                if (serviceResponse.Status && cultureResponse.Status && QuestionResponse.Status)
                {
                    ViewBag.QuestionList = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.ApplicationCode.ToString(),
                        Text = b.CodeDesc,
                    }).ToList();

                    var cultures = cultureResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.CultureCode.ToString(),
                        Text = b.CultureDesc,
                    }).ToList();

                    //ViewData["cultureResponse"] = new SelectList(cultures, "Value", "Text");
                    ViewBag.CultureResponse = cultures;
                    ViewBag.NoofQuestions = QuestionResponse.Data;

                    return View();
                }
                else
                {
                   
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetApplicationCodesByCodeType");
                    return View();
                }
               
               
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:Index");
                throw;
            }

        }
        public async void SetLoginApplicationRuleInViewBag()
        {
            ViewBag.IsMobileLogin = false;
            ViewBag.IsGetUser = false;
            ViewBag.IsGetPassword = false;
            ViewBag.IsHideMobileLogin = false;

            var pr = await _applicationRulesServices.GetApplicationRuleListByProcesssID(1);
            if (pr != null)
            {
                ViewBag.IsMobileLogin = pr.Where(w => w.RuleID == 1 && w.RuleStatus).Count() > 0;
                ViewBag.IsGetUser = pr.Where(w => w.RuleID == 2 && w.RuleStatus).Count() > 0;
                ViewBag.IsGetPassword = pr.Where(w => w.RuleID == 3 && w.RuleStatus).Count() > 0;
                ViewBag.IsHideMobileLogin = pr.Where(w => w.RuleID == 4 && w.RuleStatus).Count() > 0;
                ViewBag.IsAPIConnected = true;
            }
            else
            {
                ViewBag.IsAPIConnected = false;
            }
        }

        [HttpPost]
        public async Task<IActionResult> Index(LoginViewModel model)
        {

            try
            {
                //GetBusinessApplicationRuleByBusinessKey(int businesskey, int processID, int ruleID)

                var smspr = await _applicationRulesServices.GetBusinessApplicationRuleByBusinessKey(model.BusinessKey, 7, 1);
                var emailpr = await _applicationRulesServices.GetBusinessApplicationRuleByBusinessKey(model.BusinessKey, 7, 2);
                var squestionpr = await _applicationRulesServices.GetBusinessApplicationRuleByBusinessKey(model.BusinessKey, 7, 3);
                var passwordpr = await _applicationRulesServices.GetBusinessApplicationRuleByBusinessKey(model.BusinessKey, 7, 4);

                var obj = new DO_UserLogIn()
                {
                    LoginID = model.UserName,
                    Password = model.Password,
                    ePassword = string.Empty,
                    UnsuccessfulLoginAttempt = _passwordStrength.UnsuccessfulLoginAttempt,
                    UnLockLoginInHours = _passwordStrength.UnLockLoginInHours,
                    PasswordValidity = _passwordStrength.PasswordValidity,
                };
                
                    //var obj = new { LoginID = model.UserName, model.Password, _passwordStrength.UnsuccessfulLoginAttempt, _passwordStrength.UnLockLoginInHours };
                    var serviceResponse = await _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_UserAccount>("UserAccount/ValidateUserPassword", obj);
                    if (serviceResponse.Status)
                    {
                        if (!serviceResponse.Data.IsSucceeded)
                        {
                            //ModelState.AddModelError("", serviceResponse.Data.Message);
                           // ViewBag.InvaidUser = serviceResponse.Data.Message;
                            SetLoginApplicationRuleInViewBag();
                            return Json(new { success = false, errorMessage = serviceResponse.Data.Message });
                        //return View("Index");
                    }
                        if (serviceResponse.Data.ForcePasswordChangeNextSignIn)
                        {
                            ViewBag.UserID = serviceResponse.Data.UserID;
                            return View("CreatePassword", _passwordStrength);
                        }
                        if (_passwordStrength.PasswordValidity > 0 && serviceResponse.Data.LastPasswordChangedDay > _passwordStrength.PasswordValidity)
                        {
                            ViewBag.UserID = serviceResponse.Data.UserID;
                            TempData["UserID"] = serviceResponse.Data.UserID;
                            return View("CreatePassword", _passwordStrength);
                        }

                        var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme, ClaimTypes.Name, ClaimTypes.Role);
                        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, model.UserName));
                        identity.AddClaim(new Claim(ClaimTypes.Name, model.UserName));
                        var principal = new ClaimsPrincipal(identity);
                        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties { IsPersistent = model.RememberMe });
                        AppSessionVariables.SetSessionUserID(HttpContext, serviceResponse.Data.UserID);
                        AppSessionVariables.SetSessionDoctorID(HttpContext, serviceResponse.Data.DoctorID ?? 0);
                        AppSessionVariables.SetSessionUserType(HttpContext, serviceResponse.Data.UserType);

                    //

                    var l_b = serviceResponse.Data.l_BusinessKey
                                                   .Select(b => new SelectListItem
                                                   {
                                                       Value = b.Key.ToString(),
                                                       Text = b.Value,
                                                       Selected = serviceResponse.Data.l_BusinessKey.Count() == 1

                                                   }).ToList();

                    var l_f = serviceResponse.Data.l_FinancialYear
                                                   .Select(b => new SelectListItem
                                                   {
                                                       Value = b.ToString(),
                                                       Text = b.ToString(),
                                                       Selected = b == serviceResponse.Data.l_FinancialYear.FirstOrDefault()
                                                   }).ToList();

                    TempData.Set("l_BusinessKey", l_b);
                    TempData.Set("l_FinancialYear", l_f);

                    AppSessionVariables.SetSessionUserID(HttpContext, serviceResponse.Data.UserID);
                    AppSessionVariables.SetSessionUserBusinessKeyLink(HttpContext, serviceResponse.Data.l_BusinessKey);

                    int userId= AppSessionVariables.GetSessionUserID(HttpContext);
                    int businesskey= AppSessionVariables.GetSessionBusinessKey(HttpContext);

                    var roleResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<int>("UserAccount/GetUserRolebyUserID?userID="+ userId + "&businbessKey="+ businesskey);
                    if (roleResponse.Status)
                    {
                        AppSessionVariables.SetSessionUserRole(HttpContext, roleResponse.Data);
                    }

                   
                    //


                    LocationConfirmation(model);

                   
                    if (smspr)
                    {
                        return Json(new { success = true,ActivatedRule="Sms", redirectUrl = "/Home/Index" });
                    }else if (emailpr)
                    {
                        return Json(new { success = true, ActivatedRule = "Email", redirectUrl = "/Home/Index" });
                    }else if(squestionpr)
                    {
                        return Json(new { success = true, ActivatedRule = "Questions", redirectUrl = "/Home/Index" });
                    }
                    else
                    {
                        return Json(new { success = true, ActivatedRule = "", redirectUrl = "/Home/Index" });
                    }

                   // return RedirectToAction("Index", "Home");
                }
                else
                    {
                        ModelState.AddModelError("", "Internal error");
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:Login:params:" + JsonConvert.SerializeObject(model));
                        SetLoginApplicationRuleInViewBag();
                        return Json(new { success = false, errorMessage = "Internal Error" });
                }
        }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:Login:params:" + JsonConvert.SerializeObject(model));
                throw;
            }
        }

        public async Task<JsonResult> SendLoginOTP(string mobileNumber)
        {
            try
            {
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("UserAccount/ValidateUserMobileLogin?mobileNumber=" + mobileNumber);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data.IsSucceeded)
                    {
                        DO_SmsParameter sms = new DO_SmsParameter
                        {
                            MobileNumber = mobileNumber,
                            TEventID = SMSTriggerEventValues.MobileLoginOTP,
                            FormID = AppSessionVariables.GetSessionFormID(HttpContext),
                            OTP = serviceResponse.Data.OTP,
                            UserID = serviceResponse.Data.UserID
                        };
                        var sr_SMS = _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_SmsParameter>("SmsSender/SendSmsForForm", sms).Result;
                        if (sr_SMS.Status)
                        {
                            return Json(new { Status = true, serviceResponse.Data.StatusCode });
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:SendOTP:For MobileNumber {0}", mobileNumber);
                            return Json(new { Status = false, StatusCode = "500" });
                        }
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:SendOTP:For MobileNumber {0}", mobileNumber);
                        return Json(new { Status = false, serviceResponse.Data.StatusCode });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:SendOTP:For MobileNumber {0}", mobileNumber);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:SendOTP:For MobileNumber {0}", mobileNumber);
                throw;
            }
        }

        public async Task<JsonResult> ValidateOTP(string mobileNumber, string OTP)
        {
            try
            {
                var obj = new { mobileNumber, otp = OTP };
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_UserAccount>("UserAccount/ValidateUserOTP", obj);
                if (serviceResponse.Status)
                {
                    if (!serviceResponse.Data.IsSucceeded)
                    {
                        return Json(new { Status = false, serviceResponse.Data.Message });
                    }
                    else
                    {
                        return Json(new { Status = true, serviceResponse.Data.UserID });
                    }
                }
                else
                {
                    return Json(new { Status = false, Message = "Internal Error" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ValidateOTP:For MobileNumber {0} with OTP entered {1}", mobileNumber, OTP);
                throw;
            }
        }

        //[HttpPost]
        public async Task<IActionResult> MobileLogin(LoginViewModel model)
        {
            try
            {
                if (!string.IsNullOrEmpty(model.PhoneNumber) && !string.IsNullOrEmpty(model.OTP))
                {
                    var obj = new { mobileNumber = model.PhoneNumber, otp = model.OTP };
                    var serviceResponse = _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_UserAccount>("UserAccount/ValidateUserOTP", obj).Result;
                    if (serviceResponse.Status)
                    {
                        if (!serviceResponse.Data.IsSucceeded)
                        {
                            ModelState.AddModelError("", serviceResponse.Data.Message);
                            SetLoginApplicationRuleInViewBag();
                            return View("Index");
                        }
                        model.UserName = serviceResponse.Data.LoginID;

                        var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme, ClaimTypes.Name, ClaimTypes.Role);
                        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, model.UserName));
                        identity.AddClaim(new Claim(ClaimTypes.Name, model.UserName));
                        var principal = new ClaimsPrincipal(identity);
                        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties { IsPersistent = model.RememberMe });

                        var l_b = serviceResponse.Data.l_BusinessKey
                                                     .Select(b => new SelectListItem
                                                     {
                                                         Value = b.Key.ToString(),
                                                         Text = b.Value,
                                                         Selected = serviceResponse.Data.l_BusinessKey.Count() == 1

                                                     }).ToList();

                        var l_f = serviceResponse.Data.l_FinancialYear
                                                       .Select(b => new SelectListItem
                                                       {
                                                           Value = b.ToString(),
                                                           Text = b.ToString(),
                                                           Selected = b == serviceResponse.Data.l_FinancialYear.FirstOrDefault()
                                                       }).ToList();

                        TempData.Set("l_BusinessKey", l_b);
                        TempData.Set("l_FinancialYear", l_f);

                        AppSessionVariables.SetSessionUserID(HttpContext, serviceResponse.Data.UserID);
                        AppSessionVariables.SetSessionUserBusinessKeyLink(HttpContext, serviceResponse.Data.l_BusinessKey);


                        return new RedirectToActionResult("BusinessLocation", "Account", new { });
                    }
                    else
                    {
                        ModelState.AddModelError("", "Internal error");
                        SetLoginApplicationRuleInViewBag();
                        return View("Index");
                    }
                }
                else
                {
                    ModelState.AddModelError("", "Internal error");
                    SetLoginApplicationRuleInViewBag();
                    return View("Index");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:MobileLogin:params:" + JsonConvert.SerializeObject(model));
                throw;
            }
        }
        public IActionResult BusinessLocation()
        {
            LoginViewModel model = new LoginViewModel();
            model.l_BusinessKey = JsonConvert.DeserializeObject<List<SelectListItem>>(TempData["l_BusinessKey"].ToString());
            model.l_FinancialYear = JsonConvert.DeserializeObject<List<SelectListItem>>(TempData["l_FinancialYear"].ToString());

            if (model.l_BusinessKey.Where(w => w.Selected).Count() > 0)
                model.BusinessKey = Convert.ToInt32(model.l_BusinessKey.Where(w => w.Selected).FirstOrDefault().Value);

            if (model.l_FinancialYear.Where(w => w.Selected).Count() > 0)
                model.FinancialYear = Convert.ToInt32(model.l_FinancialYear.Where(w => w.Selected).FirstOrDefault().Value);

            ViewBag.BK = model.l_BusinessKey;
            ViewBag.FY = model.l_FinancialYear;

            TempData.Keep();

            return View(model);
        }


        public IActionResult UnauthorizedAccess()
        {
            return View();
        }
        public IActionResult CreatePassword()
        {
            if (TempData["UserID"] != null)
            {
                ViewBag.UserID = TempData["UserID"];
                return View(_passwordStrength);
            }
            return View("GetPassword");
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
            catch (Exception ex)
            {
                throw;
            }
            return this.RedirectToPage("/Login");
        }

        public async Task<IActionResult> Logout()
        {
            HttpContext.Session.Clear();
            await HttpContext.SignOutAsync();

            HttpContext.Session.Set("AppConfig", appConfig);
            SetLoginApplicationRuleInViewBag();
            //clearing Culture cookie
            Response.Cookies.Delete(CookieRequestCultureProvider.DefaultCookieName);
            return View();
        }
        public async Task<JsonResult> SendUserID(string mobileNumber)
        {
            try
            {
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("UserAccount/ValidateUserMobile?mobileNumber=" + mobileNumber);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data.IsSucceeded)
                    {
                        DO_SmsParameter sms = new DO_SmsParameter();
                        sms.TEventID = SMSTriggerEventValues.ForgetUserIDOTP;
                        sms.FormID = AppSessionVariables.GetSessionFormID(HttpContext);
                        sms.OTP = serviceResponse.Data.OTP;
                        sms.UserID = serviceResponse.Data.UserID;
                        var sr_SMS = _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_SmsParameter>("SmsSender/SendSmsForForm", sms).Result;
                        if (sr_SMS.Status)
                        {
                            return Json(new { Status = true, serviceResponse.Data.StatusCode });
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:SendOTP:For MobileNumber {0}", mobileNumber);
                            return Json(new { Status = false, StatusCode = "500" });
                        }
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:SendOTP:For MobileNumber {0}", mobileNumber);
                        return Json(new { Status = false, serviceResponse.Data.StatusCode });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:SendOTP:For MobileNumber {0}", mobileNumber);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:SendOTP:For MobileNumber {0}", mobileNumber);
                throw;
            }
        }

        public IActionResult GetPassword()
        {
            return View();
        }
        public IActionResult GetUserID()
        {
            return View();
        }
        public IActionResult SessionTimeout()
        {
            return View();
        }
        [HttpPost]
        public IActionResult SetLanguage(string culture, string returnUrl)
        {
            // Set the culture in a cookie so it persists across requests
            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
            new CookieOptions { Expires = DateTimeOffset.UtcNow.AddDays(1) }
            );

            //System.Threading.Thread.CurrentThread.CurrentUICulture = new CultureInfo(culture);
            // Set the current thread culture (affects only the current request)
            Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(culture);
            Thread.CurrentThread.CurrentUICulture = Thread.CurrentThread.CurrentCulture;

            ViewBag.selectedculture = culture;
            return LocalRedirect(returnUrl);
        }
        //not used
        [HttpPost]
        public IActionResult SetBusinessLocation(int businessKey, string returnUrl)
        {
            var bk = HttpContext.Request.Form["Businesskey"];
            var l_bk = AppSessionVariables.GetSessionUserBusinessKeyLink(HttpContext);
            var bk_Name = l_bk.Where(w => w.Key == businessKey).FirstOrDefault().Value;
            AppSessionVariables.SetSessionBusinessLocationName(HttpContext, bk_Name);


            AppSessionVariables.SetSessionBusinessKey(HttpContext, businessKey);
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
            catch (Exception ex)
            {
                // Info  
                throw;
            }
        }
        public async Task<JsonResult> SendCreatePasswordOTP(string mobileNumber)
        {
            try
            {
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("UserAccount/ValidateUserMobile?mobileNumber=" + mobileNumber);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data.IsSucceeded)
                    {
                        DO_SmsParameter sms = new DO_SmsParameter();
                        sms.TEventID = SMSTriggerEventValues.ForgetPasswordOTP;
                        sms.FormID = AppSessionVariables.GetSessionFormID(HttpContext);
                        sms.OTP = serviceResponse.Data.OTP;
                        sms.UserID = serviceResponse.Data.UserID;
                        var sr_SMS = _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_SmsParameter>("SmsSender/SendSmsForForm", sms).Result;
                        if (sr_SMS.Status)
                        {
                            return Json(new { Status = true, serviceResponse.Data.StatusCode });
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:SendOTP:For MobileNumber {0}", mobileNumber);
                            return Json(new { Status = false, StatusCode = "500" });
                        }
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:SendOTP:For MobileNumber {0}", mobileNumber);
                        return Json(new { Status = false, serviceResponse.Data.StatusCode });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:SendOTP:For MobileNumber {0}", mobileNumber);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:SendOTP:For MobileNumber {0}", mobileNumber);
                throw ex;
            }
        }

        public async Task<JsonResult> ValidateOTPForCreatePassword(string mobileNumber, string OTP)
        {
            try
            {
                var obj = new { mobileNumber, otp = OTP };
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_UserAccount>("UserAccount/ValidateUserOTP", obj);
                if (serviceResponse.Status)
                {
                    if (!serviceResponse.Data.IsSucceeded)
                    {
                        return Json(new { Status = false, serviceResponse.Data.Message });
                    }
                    else
                    {
                        //
                        TempData["UserID"] = serviceResponse.Data.UserID;
                        //RedirectToAction("CreatePassword", "Account");
                        return Json(new { Status = true, serviceResponse.Data.UserID });
                    }
                }
                else
                {
                    return Json(new { Status = false, Message = "Internal Error" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ValidateOTP:For MobileNumber {0} with OTP entered {1}", mobileNumber, OTP);
                throw ex;
            }
        }

        public async Task<JsonResult> CreateUserPassword(int userID, string newPassword, string confirmPassword)
        {
            if (string.IsNullOrEmpty(newPassword) || string.IsNullOrEmpty(confirmPassword))
            {
                return Json(new { Status = false, Message = "New Password & Confirm Password cannot be blank." });
            }
            if (newPassword != confirmPassword)
            {
                return Json(new { Status = false, Message = "New Password & Confirm Password are not same." });
            }
            var passswordpolicy = _passwordPolicy.IsValidPasswordPolicy(newPassword);
            if (!passswordpolicy.Status)
            {
                return Json(new { Status = false, passswordpolicy.Message });
            }
            try
            {
                var obj = new { UserID = userID, Password = newPassword, _passwordStrength.PasswordRepeatationPolicy };
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserAccount/CreateUserPassword", obj);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    return Json(new { Status = false, Message = "Internal Error" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:CreateUserPassword:For UserID {0} ", userID.ToString());
                throw ex;
            }
        }

        public IActionResult ConnectionError()
        {
            return View();
        }

        #region Getting  and setting the User Location List
        [HttpGet]
        public async Task<JsonResult> GetUserLocationsbyUserID(string loginId)
        {
            try
            {
                var parameter = "?loginID=" + loginId;

                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserFinBusinessLocation>("UserAccount/GetUserLocationsbyUserID" + parameter);
                if (serviceResponse.Status)
                {
                    if(serviceResponse.Data.lstUserLocation!=null && serviceResponse.Data.lstFinancialYear!=null)
                    {
                        SetFinBusinessLocation(serviceResponse.Data);
                    }
                   
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserLocationsbyUserID:For UserID {0} with loginID entered {1}", loginId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUserLocationsbyUserID:For UserID {0} with BusinessKey entered {1}", loginId);
                throw ex;
            }
        }

        public void SetFinBusinessLocation(DO_UserFinBusinessLocation model)
        {
            #region location setting
            DO_UserAccount obj = new DO_UserAccount();

            // Populate us.l_BusinessKey
            obj.l_BusinessKey = model.lstUserLocation
                .Select(x => new KeyValuePair<int, string>(x.BusinessKey, x.BusinessLocation))
                .ToDictionary(x => x.Key, x => x.Value);

            // Generate the SelectListItem list
            var l_b = obj.l_BusinessKey
                .Select(b => new SelectListItem
                {
                    Value = b.Key.ToString(),
                    Text = b.Value,
                    Selected = obj.l_BusinessKey.Count == 1
                }).ToList();

            var l_f = model.lstFinancialYear
                                           .Select(b => new SelectListItem
                                           {
                                               Value = b.ToString(),
                                               Text = b.ToString(),
                                               Selected = b == model.lstFinancialYear.FirstOrDefault()
                                           }).ToList();

            TempData.Set("l_BusinessKey", l_b);
            TempData.Set("l_FinancialYear", l_f);

            AppSessionVariables.SetSessionUserID(HttpContext, obj.UserID);
            AppSessionVariables.SetSessionUserBusinessKeyLink(HttpContext, obj.l_BusinessKey);

            if (l_b.Count == 1)
            {

                AppSessionVariables.SetSessionBusinessKey(HttpContext, Convert.ToInt32(value: l_b.FirstOrDefault().Value));
                AppSessionVariables.SetSessionFinancialYear(HttpContext, Convert.ToInt32(l_f.FirstOrDefault().Value));
                AppSessionVariables.SetSessionBusinessLocationName(HttpContext, l_b.FirstOrDefault().Text);

              
            }
            #endregion
        }

        public void LocationConfirmation(LoginViewModel model)
        {
            
            if (Convert.ToInt32(model.BusinessKey) > 0 && Convert.ToInt32(model.FinancialYear) > 0)
            {
                AppSessionVariables.SetSessionBusinessKey(HttpContext, Convert.ToInt32(model.BusinessKey));
                AppSessionVariables.SetSessionFinancialYear(HttpContext, Convert.ToInt32(model.FinancialYear));

                var l_b = JsonConvert.DeserializeObject<List<SelectListItem>>(TempData["l_BusinessKey"].ToString());
                AppSessionVariables.SetSessionBusinessLocationName(HttpContext, l_b.Where(w => w.Value == model.BusinessKey.ToString()).FirstOrDefault().Text);

            }
            else
            {
                model.l_BusinessKey = JsonConvert.DeserializeObject<List<SelectListItem>>(TempData["l_BusinessKey"].ToString());
                model.l_FinancialYear = JsonConvert.DeserializeObject<List<SelectListItem>>(TempData["l_FinancialYear"].ToString());

                if (model.l_BusinessKey.Where(w => w.Selected).Count() > 0)
                    model.BusinessKey = Convert.ToInt32(model.l_BusinessKey.Where(w => w.Selected).FirstOrDefault().Value);

                if (model.l_FinancialYear.Where(w => w.Selected).Count() > 0)
                    model.FinancialYear = Convert.ToInt32(model.l_FinancialYear.Where(w => w.Selected).FirstOrDefault().Value);

                ModelState.AddModelError("", "please check user input");
                TempData.Keep();
            }
        }

        #endregion

        #region Change password

        [HttpGet]
        public async Task<JsonResult> ValidateCreateUserOTP(int userId, string otp)
        {
            try
            {
                var parameter = "?userId=" + userId+ "&otp="+ otp;
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("UserAccount/ValidateCreateUserOTP" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:ValidateCreateUserOTP:For UserID {0} with OTP entered {1}", otp);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ValidateCreateUserOTP:For UserID {0} with OTP entered {1}", otp);
                throw ex;
            }
        }

        [HttpGet]
        public async Task<JsonResult> ChkIsCreatePasswordInNextSignIn(string loginId)
        {
            try
            {
                //SMS Rule is true

                var smspr = await _applicationRulesServices.GetApplicationRuleStatusByID(1, 1);
                if (smspr)
                {
                    var parameter = "?loginId=" + loginId;

                    var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_ReturnParameter>("UserAccount/ChkIsCreatePasswordInNextSignIn" + parameter);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            serviceResponse.Data.ErrorCode = "Please enter the OTP that has been sent to your mobile number:<span class='bold'>" + serviceResponse.Data.ErrorCode + "</span>";
                            serviceResponse.Data.Message = string.Empty;
                        }
                        return Json(serviceResponse.Data);

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:ChkIsCreatePasswordInNextSignIn:For UserID {0} with loginID entered {1}", loginId);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                var Emailpr = await _applicationRulesServices.GetApplicationRuleStatusByID(1, 2);
                if (Emailpr)
                {
                    var parameter = "?loginId=" + loginId;

                    var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_ReturnParameter>("UserAccount/ChkIsCreatePasswordInNextSignIn" + parameter);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            serviceResponse.Data.Message = "Please enter the OTP that has been sent to your email ID:<span class='bold'>" + serviceResponse.Data.Message + "</span>";
                            serviceResponse.Data.ErrorCode = string.Empty;
                        }
                        return Json(serviceResponse.Data);

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:ChkIsCreatePasswordInNextSignIn:For UserID {0} with loginID entered {1}", loginId);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                return Json(new DO_ReturnParameter() { Status = false, Message = "No Rule has been set for Send OTP for first login" });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ChkIsCreatePasswordInNextSignIn:For UserID {0} with BusinessKey entered {1}", loginId);
                throw ex;
            }
        }

        [HttpPost]
        public async Task<JsonResult> CreateUserPasswordINNextSignIn(int userId, string password,string confirmPassword)
        {
            try
            {
                //Ternary conditions
                //int businesskey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
                //businesskey = (businesskey == 0) ? 11 : businesskey;

                //int businesskey = AppSessionVariables.GetSessionBusinessKey(HttpContext);

                //// Multiple conditions using ternary operator
                //businesskey = (businesskey == 0) ? 11
                //            : (businesskey == 1) ? 22
                //            : (businesskey == 2) ? 33
                //            : businesskey;  // Default case if none of the above match

                if (password != confirmPassword)
                {
                    return Json(new DO_ReturnParameter { Status = false, Message = "Password and Confirm Password should be same" });
                }

                //
                var passwordpr = await _applicationRulesServices.GetApplicationRuleStatusByID(4, 1);
                int GwRuleId = 4;
                var ruleResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<int>("ForgotUserPassword/GetGatewayRuleValuebyRuleID?GwRuleId=" + GwRuleId);

                if (passwordpr && ruleResponse.Status && ruleResponse.Data > 0)
                {

                    var passswordpolicy = _passwordPolicy.IsValidPasswordPolicy(password);
                    if (!passswordpolicy.Status)
                    {
                        return Json(new { Status = false, passswordpolicy.Message });
                    }

                }

                var parameter = "?userId=" + userId + "&password=" + password ;
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_ReturnParameter>("UserAccount/CreateUserPasswordINNextSignIn" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:CreateUserPasswordINNextSignIn:params:" + JsonConvert.SerializeObject(password));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:CreateUserPasswordINNextSignIn:params:" + JsonConvert.SerializeObject(password));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion

        #region User Security Question
        [HttpGet]
        public async Task<JsonResult> ChkIsUserQuestionsExists(string loginId)
        {
            try
            {
                var parameter = "?loginID=" + loginId;

                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_ReturnParameter>("UserAccount/ChkIsUserQuestionsExists" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:ChkIsUserQuestionsExists:For UserID {0} with loginID entered {1}", loginId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ChkIsUserQuestionsExists:For UserID {0} with BusinessKey entered {1}", loginId);
                throw ex;
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetNumberofQuestionsbyRule(int ProcessId,int RuleId)
        {
            try
            {
                var parameter = "?ProcessId=" + ProcessId + "&RuleId="+ RuleId;

                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<int>("UserAccount/GetNumberofQuestionsbyRule" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetNumberofQuestionsbyRule");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetNumberofQuestionsbyRule");
                throw ex;
            }
        }
        [HttpPost]
        public async Task<JsonResult> InsertUserSecurityQuestion(List<DO_UserSecurityQuestions> obj)
        {
            try
            {
                foreach(var q in obj)
                {
                    if (q.SecurityQuestionId == 0 || q.SecurityAnswer == null)
                    {
                        return Json(new { Status = false, Message="Please Select All Questions" });
                    }
                }
                obj.All(c =>
                {
                    
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    c.EffectiveFrom = System.DateTime.Now;
                    return true;
                });
               
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserAccount/InsertUserSecurityQuestion",obj);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertUserSecurityQuestion", obj);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertUserSecurityQuestion", obj);
                throw ex;
            }
        }
        #endregion

        #region Forgot User ID
        [HttpGet]
        public async Task<JsonResult> GetOTPbyMobileNumber(string mobileNo)
        {
            try
            {
                //SMS Rule is true
               
                var smspr = await _applicationRulesServices.GetApplicationRuleStatusByID(1, 1);
                if (smspr)
                {
                    var smsparameter = "?mobileNo=" + mobileNo;
                    var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("ForgotUserPassword/GetOTPbyMobileNumber" + smsparameter);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            serviceResponse.Data.LoginDesc = "Please enter the OTP that has been sent to your mobile number:<span class='bold'>" + serviceResponse.Data.MobileNumber + "</span>";
                        }
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetOTPbyMobileNumber:For UserID {0} with mobileNo entered {1}", mobileNo);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                   
                }


                //EMail Rule is true
               
                var Emailpr = await _applicationRulesServices.GetApplicationRuleStatusByID(1, 2);
                if (Emailpr)
                {
                    var emailparameter = "?mobileNo=" + mobileNo;
                    var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("ForgotUserPassword/GetOTPbyMobileNumber" + emailparameter);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            serviceResponse.Data.LoginDesc = "Please enter the OTP that has been sent to your email ID: <span class='bold'>" + serviceResponse.Data.Password + "</span>";

                        }
                        return Json(serviceResponse.Data);

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetOTPbyMobileNumber:For UserID {0} with mobileNo entered {1}", mobileNo);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }

                //Question Rule is true
             
                var Questionpr = await _applicationRulesServices.GetApplicationRuleStatusByID(1, 3);
                if (Questionpr)
                {
                    var parameter = "?mobileNo=" + mobileNo;
                    var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserSecurityQuestions>("ForgotUserPassword/GetRandomSecurityQuestion" + parameter);
                    if (serviceResponse.Status)
                    {
                        return Json(serviceResponse.Data);

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetRandomSecurityQuestion:For UserID {0} with mobileNo entered {1}", mobileNo);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                return Json(new DO_ReturnParameter() {Status=false,Message="No Rule has been set for Forgot User ID" });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetOTPbyMobileNumber:For UserID {0} with mobileNo entered {1}", mobileNo);
                throw ex;
            }
        }

        [HttpGet]
        public async Task<JsonResult> ValidateUserbyOTP(string mobileNo, string otp, int expirytime)
        {
            try
            {
                var parameter = "?mobileNo=" + mobileNo + "&otp=" + otp + "&expirytime=" + expirytime;
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("ForgotUserPassword/ValidateUserbyOTP" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:ValidateUserbyOTP:For UserID {0} with OTP entered {1}", otp);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ValidateUserbyOTP:For UserID {0} with OTP entered {1}", otp);
                throw ex;
            }
        }

        [HttpPost]
        public async Task<JsonResult> ValidateUserSecurityQuestion(DO_UserSecurityQuestions obj)
        {
            try
            {
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.EffectiveFrom = System.DateTime.Now;
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_UserAccount>("ForgotUserPassword/ValidateUserSecurityQuestion", obj);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:ValidateUserSecurityQuestion");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ValidateUserSecurityQuestion");
                throw ex;
            }
        }

        [HttpGet]
        public async Task<JsonResult> GetLabelNameForgotUserIDbyRule()
        {
            try
            {
                //SMS Rule is true

                var smspr = await _applicationRulesServices.GetApplicationRuleStatusByID(1, 1);
                string otpmsg = "Send OTP by SMS";
                if (smspr)
                {
                  
                    string uiCulture = Thread.CurrentThread.CurrentUICulture.ToString();
                    if (uiCulture != null)
                    {
                        if(uiCulture== "hi-IN")
                        {
                            otpmsg = "एसएमएस द्वारा OTP भेजें";
                        }else if(uiCulture == "ar-EG")
                        {
                            otpmsg = "إرسال OTP عبر الرسائل القصيرة";
                        }
                        
                    }

                    return Json(new DO_ReturnParameter { Status = true,Message= otpmsg }) ;
                 
                }

                //EMail Rule is true

                var Emailpr = await _applicationRulesServices.GetApplicationRuleStatusByID(1, 2);
                string emailmsg = "Send OTP by Email";
                if (Emailpr)
                {
                    string uiCulture = Thread.CurrentThread.CurrentUICulture.ToString();
                    if (uiCulture != null)
                    {
                        if (uiCulture == "hi-IN")
                        {
                            emailmsg = "ईमेल द्वारा OTP भेजें";
                        }
                        else if (uiCulture == "ar-EG")
                        {
                            emailmsg = "إرسال OTP عبر البريد الإلكتروني";
                        }

                    }
                    return Json(new DO_ReturnParameter { Status = true, Message = emailmsg });

                }

                //Question Rule is true

                var Questionpr = await _applicationRulesServices.GetApplicationRuleStatusByID(1, 3);
                string quesmsg = "Answer Security Question";
                if (Questionpr)
                {
                    string uiCulture = Thread.CurrentThread.CurrentUICulture.ToString();
                    if (uiCulture != null)
                    {
                        if (uiCulture == "hi-IN")
                        {
                            quesmsg = "सुरक्षा प्रश्न का उत्तर दें";
                        }
                        else if (uiCulture == "ar-EG")
                        {
                            quesmsg = "الإجابة على سؤال الأمان";
                        }
                        return Json(new DO_ReturnParameter { Status = true, Message = quesmsg });
                    }
                }
                return Json(new DO_ReturnParameter() { Status = false, Message = otpmsg });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetLabelNameForgotUserIDbyRule:For UserID {0} with mobileNo entered {1}");
                throw ex;
            }
        }
        #endregion

        #region Forgot Password 
        [HttpGet]
        public async Task<JsonResult> GetForgotPasswordOTPbyMobileNumber(string mobileNo)
        {
            try
            {
                //SMS Rule is true

                var smspr = await _applicationRulesServices.GetApplicationRuleStatusByID(2, 1);
                if (smspr)
                {
                    var smsparameter = "?mobileNo=" + mobileNo;
                    var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("ForgotUserPassword/GetOTPbyMobileNumber" + smsparameter);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            serviceResponse.Data.LoginDesc = "Please enter the OTP that has been sent to your mobile number: <span class='bold'>" + serviceResponse.Data.MobileNumber + "</span>";

                        }
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetOTPbyMobileNumber:For UserID {0} with mobileNo entered {1}", mobileNo);
                        return Json(new { Status = false, StatusCode = "500" });
                    }

                }

                //EMail Rule is true

                var Emailpr = await _applicationRulesServices.GetApplicationRuleStatusByID(2, 2);
                if (Emailpr)
                {
                    var emailparameter = "?mobileNo=" + mobileNo;
                    var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("ForgotUserPassword/GetOTPbyMobileNumber" + emailparameter);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            serviceResponse.Data.LoginDesc = "Please enter the OTP that has been sent to your email ID:<span class='bold'>" + serviceResponse.Data.Password + "</span>";
                        }
                        return Json(serviceResponse.Data);
                    }
                   
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetOTPbyMobileNumber:For UserID {0} with mobileNo entered {1}", mobileNo);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }

                //Question Rule is true

                var Questionpr = await _applicationRulesServices.GetApplicationRuleStatusByID(2, 3);
                if (Questionpr)
                {
                    var parameter = "?mobileNo=" + mobileNo;
                    var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserSecurityQuestions>("ForgotUserPassword/GetRandomSecurityQuestion" + parameter);
                    if (serviceResponse.Status)
                    {
                        return Json(serviceResponse.Data);

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetRandomSecurityQuestion:For UserID {0} with mobileNo entered {1}", mobileNo);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                return Json(new DO_ReturnParameter() { Status = false, Message = "No Rule has been for Forgot User ID" });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetOTPbyMobileNumber:For UserID {0} with mobileNo entered {1}", mobileNo);
                throw ex;
            }
        }

        [HttpGet]
        public async Task<JsonResult> ValidateForgotPasswordOTP(string mobileNo, string otp, int expirytime)
        {
            try
            {
                var parameter = "?mobileNo=" + mobileNo + "&otp=" + otp + "&expirytime=" + expirytime;
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("ForgotUserPassword/ValidateForgotPasswordOTP" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:ValidateForgotPasswordOTP:For UserID {0} with OTP entered {1}", otp);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ValidateForgotPasswordOTP:For UserID {0} with OTP entered {1}", otp);
                throw ex;
            }
        }

        [HttpPost]
        public async Task<JsonResult> ValidateForgotPasswordSecurityQuestion(DO_UserSecurityQuestions obj)
        {
            try
            {

                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.EffectiveFrom = System.DateTime.Now;
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_UserAccount>("ForgotUserPassword/ValidateForgotPasswordSecurityQuestion", obj);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:ValidateForgotPasswordSecurityQuestion");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ValidateForgotPasswordSecurityQuestion");
                throw ex;
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetLabelNameForgotPasswordbyRule()
        {
            try
            {
                //SMS Rule is true

                var smspr = await _applicationRulesServices.GetApplicationRuleStatusByID(2, 1);
                string otpmsg = "Send OTP by SMS";
                if (smspr)
                {

                    string uiCulture = Thread.CurrentThread.CurrentUICulture.ToString();
                    if (uiCulture != null)
                    {
                        if (uiCulture == "hi-IN")
                        {
                            otpmsg = "एसएमएस द्वारा OTP भेजें";
                        }
                        else if (uiCulture == "ar-EG")
                        {
                            otpmsg = "إرسال OTP عبر الرسائل القصيرة";
                        }

                    }

                    return Json(new DO_ReturnParameter { Status = true, Message = otpmsg });

                }

                //EMail Rule is true

                var Emailpr = await _applicationRulesServices.GetApplicationRuleStatusByID(2, 2);
                string emailmsg = "Send OTP by Email";
                if (Emailpr)
                {
                    string uiCulture = Thread.CurrentThread.CurrentUICulture.ToString();
                    if (uiCulture != null)
                    {
                        if (uiCulture == "hi-IN")
                        {
                            emailmsg = "ईमेल द्वारा OTP भेजें";
                        }
                        else if (uiCulture == "ar-EG")
                        {
                            emailmsg = "إرسال OTP عبر البريد الإلكتروني";
                        }

                    }
                    return Json(new DO_ReturnParameter { Status = true, Message = emailmsg });

                }

                //Question Rule is true

                var Questionpr = await _applicationRulesServices.GetApplicationRuleStatusByID(2, 3);
                string quesmsg = "Answer Security Question";
                if (Questionpr)
                {
                    string uiCulture = Thread.CurrentThread.CurrentUICulture.ToString();
                    if (uiCulture != null)
                    {
                        if (uiCulture == "hi-IN")
                        {
                            quesmsg = "सुरक्षा प्रश्न का उत्तर दें";
                        }
                        else if (uiCulture == "ar-EG")
                        {
                            quesmsg = "الإجابة على سؤال الأمان";
                        }
                        return Json(new DO_ReturnParameter { Status = true, Message = quesmsg });
                    }
                }
                return Json(new DO_ReturnParameter() { Status = false, Message = otpmsg });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetLabelNameForgotPasswordbyRule:For UserID {0} with mobileNo entered {1}");
                throw ex;
            }
        }

        [HttpGet]
        public async Task<JsonResult> CheckValidateUserID(string loginID)
        {
            try
            {
                var parameter = "?loginID=" + loginID;
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("ForgotUserPassword/CheckValidateUserID" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:CheckValidateUserID:For loginID {0} ", loginID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:CheckValidateUserID:For UserID {0} ", loginID);
                throw ex;
            }
        }

        [HttpPost]
        public async Task<JsonResult> ChangePasswordfromForgotPassword(int userId, string password, string confirmPassword)
        {
            try
            {


                if (password != confirmPassword)
                {
                    return Json(new DO_ReturnParameter { Status = false, Message = "Password and Confirm Password should be same" });
                }

                //
                var passwordpr = await _applicationRulesServices.GetApplicationRuleStatusByID(4, 1);
                int GwRuleId = 4;
                var ruleResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<int>("ForgotUserPassword/GetGatewayRuleValuebyRuleID?GwRuleId=" + GwRuleId);

                if (passwordpr && ruleResponse.Status && ruleResponse.Data > 0)
                {

                    var passswordpolicy = _passwordPolicy.IsValidPasswordPolicy(password);
                    if (!passswordpolicy.Status)
                    {
                        return Json(new { Status = false, passswordpolicy.Message });
                    }

                }

                var parameter = "?userId=" + userId + "&password=" + password;
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ForgotUserPassword/ChangePasswordfromForgotPassword" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:ChangePasswordfromForgotPassword:params:" + JsonConvert.SerializeObject(password));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ChangePasswordfromForgotPassword:params:" + JsonConvert.SerializeObject(password));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion

        #region Change Password Expiration Password
        [HttpGet]
        public async Task<JsonResult> GetPasswordPolicybyRule()
        {
            try
            {
                //SMS Rule is true

                var passwordpr = await _applicationRulesServices.GetApplicationRuleStatusByID(4, 1);
                int GwRuleId = 4;
                var ruleResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<int>("ForgotUserPassword/GetGatewayRuleValuebyRuleID?GwRuleId=" + GwRuleId);

                if (passwordpr && ruleResponse.Status && ruleResponse.Data>0)
                {

                    var message = "The Password must meet the following Password Policy.";
                    var msg = _configuration.GetValue<string>("PasswordPolicy:ErrorMessage");
                    message += msg;
                    return Json(new DO_ReturnParameter() { Status = true, StatusCode = "1",Message= message });
 
                }
                else
                {

                    return Json(new DO_ReturnParameter() { Status = true, StatusCode = "0", });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPasswordPolicybyRule");
                throw ex;
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetPasswordExpirationDaysbyRule(string loginId)
        {
            try
            {
              

                var smspr = await _applicationRulesServices.GetApplicationRuleStatusByID(4, 3);
                if (smspr)
                {

                    var parameter = "?loginId=" + loginId;

                    var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ForgotUserPassword/GetPasswordExpirationDays" + parameter);
                    if (serviceResponse.Status)
                    {
                        return Json(serviceResponse.Data);

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetPasswordExpirationDaysbyRule:For UserID {0} with loginID entered {1}", loginId);
                        return Json(new { Status = false, StatusCode = "500" });
                    }

                }
                else
                {

                    return Json(new DO_ReturnParameter() { Status = true, StatusCode = "0", });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPasswordExpirationDaysbyRule:For loginId {0} with loginId entered {1}");
                throw ex;
            }
        }
        [HttpPost]
        public async Task<JsonResult> ChangeUserExpirationPassword(DO_ChangeExpirationPassword obj)
        {
            try
            {
                var passwordpr = await _applicationRulesServices.GetApplicationRuleStatusByID(4, 1);
                int GwRuleId = 4;
                var ruleResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<int>("ForgotUserPassword/GetGatewayRuleValuebyRuleID?GwRuleId=" + GwRuleId);

                if (passwordpr && ruleResponse.Status && ruleResponse.Data > 0)
                {

                    var passswordpolicy = _passwordPolicy.IsValidPasswordPolicy(obj.newPassword);
                    if (!passswordpolicy.Status)
                    {
                        return Json(new { Status = false, passswordpolicy.Message });
                    }

                }

               
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedBy= AppSessionVariables.GetSessionUserID(HttpContext);
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ForgotUserPassword/ChangeUserExpirationPassword", obj);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:ChangeUserExpirationPassword", obj);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ChangeUserExpirationPassword", obj);
                throw ex;
            }
        }

        #endregion

        #region Dual Authentication
        [HttpGet]
        public async Task<JsonResult> GetLabelNameForDualAuthenticationbyBusinesskey(int businesskey)
        {
            try
            {
                //SMS Rule is true

                var smspr = await _applicationRulesServices.GetBusinessApplicationRuleByBusinessKey(businesskey, 7, 1);
                string otpmsg = "Send OTP by SMS";
                if (smspr)
                {

                    string uiCulture = Thread.CurrentThread.CurrentUICulture.ToString();
                    if (uiCulture != null)
                    {
                        if (uiCulture == "hi-IN")
                        {
                            otpmsg = "एसएमएस द्वारा OTP भेजें";
                        }
                        else if (uiCulture == "ar-EG")
                        {
                            otpmsg = "إرسال OTP عبر الرسائل القصيرة";
                        }

                    }

                    return Json(new DO_ReturnParameter { Status = true, Message = otpmsg });

                }

                //EMail Rule is true

                var Emailpr = await _applicationRulesServices.GetBusinessApplicationRuleByBusinessKey(businesskey, 7, 2);
                string emailmsg = "Send OTP by Email";
                if (Emailpr)
                {
                    string uiCulture = Thread.CurrentThread.CurrentUICulture.ToString();
                    if (uiCulture != null)
                    {
                        if (uiCulture == "hi-IN")
                        {
                            emailmsg = "ईमेल द्वारा OTP भेजें";
                        }
                        else if (uiCulture == "ar-EG")
                        {
                            emailmsg = "إرسال OTP عبر البريد الإلكتروني";
                        }

                    }
                    return Json(new DO_ReturnParameter { Status = true, Message = emailmsg });

                }

                //Question Rule is true

                var Questionpr = await _applicationRulesServices.GetBusinessApplicationRuleByBusinessKey(businesskey, 7, 3);
                string quesmsg = "Answer Security Question";
                if (Questionpr)
                {
                    string uiCulture = Thread.CurrentThread.CurrentUICulture.ToString();
                    if (uiCulture != null)
                    {
                        if (uiCulture == "hi-IN")
                        {
                            quesmsg = "सुरक्षा प्रश्न का उत्तर दें";
                        }
                        else if (uiCulture == "ar-EG")
                        {
                            quesmsg = "الإجابة على سؤال الأمان";
                        }
                        return Json(new DO_ReturnParameter { Status = true, Message = quesmsg });
                    }
                }
                return Json(new DO_ReturnParameter() { Status = false, Message = otpmsg });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetLabelNameForgotUserIDbyRule:For UserID {0} with mobileNo entered {1}");
                throw ex;
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetOTPbyMobileNumberDualAuthentication(string mobileNo,int businesskey)
        {
            try
            {
                //SMS Rule is true

                var smspr = await _applicationRulesServices.GetBusinessApplicationRuleByBusinessKey(businesskey, 7, 1);
                if (smspr)
                {
                    var smsparameter = "?mobileNo=" + mobileNo;
                    var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("ForgotUserPassword/GetOTPbyMobileNumber" + smsparameter);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            serviceResponse.Data.LoginDesc = "Please enter the OTP that has been sent to your mobile number:<span class='bold'>" + serviceResponse.Data.MobileNumber + "</span>";
                        }
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetOTPbyMobileNumber:For UserID {0} with mobileNo entered {1}", mobileNo);
                        return Json(new { Status = false, StatusCode = "500" });
                    }

                }


                //EMail Rule is true

                var Emailpr = await _applicationRulesServices.GetBusinessApplicationRuleByBusinessKey(businesskey, 7, 2);
                if (Emailpr)
                {
                    var emailparameter = "?mobileNo=" + mobileNo;
                    var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("ForgotUserPassword/GetOTPbyMobileNumber" + emailparameter);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            serviceResponse.Data.LoginDesc = "Please enter the OTP that has been sent to your email ID: <span class='bold'>" + serviceResponse.Data.Password + "</span>";

                        }
                        return Json(serviceResponse.Data);

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetOTPbyMobileNumber:For UserID {0} with mobileNo entered {1}", mobileNo);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }

                //Question Rule is true

                var Questionpr = await _applicationRulesServices.GetBusinessApplicationRuleByBusinessKey(businesskey, 7, 3);
                if (Questionpr)
                {
                    var parameter = "?mobileNo=" + mobileNo;
                    var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserSecurityQuestions>("ForgotUserPassword/GetRandomSecurityQuestion" + parameter);
                    if (serviceResponse.Status)
                    {
                        return Json(serviceResponse.Data);

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetRandomSecurityQuestion:For UserID {0} with mobileNo entered {1}", mobileNo);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                return Json(new DO_ReturnParameter() { Status = false, Message = "No Rule has been set for Forgot User ID" });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetOTPbyMobileNumber:For UserID {0} with mobileNo entered {1}", mobileNo);
                throw ex;
            }
        }

        //[HttpPost]
        //public async Task<JsonResult> ValidateUserSecurityQuestion(DO_UserSecurityQuestions obj)
        //{
        //    try
        //    {
        //        obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
        //        obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
        //        obj.EffectiveFrom = System.DateTime.Now;
        //        var serviceResponse = await _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_UserAccount>("ForgotUserPassword/ValidateUserSecurityQuestion", obj);
        //        if (serviceResponse.Status)
        //        {
        //            return Json(serviceResponse.Data);

        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:ValidateUserSecurityQuestion");
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:ValidateUserSecurityQuestion");
        //        throw ex;
        //    }
        //}
        //[HttpGet]
        //public async Task<JsonResult> ValidateUserbyOTP(string mobileNo, string otp, int expirytime)
        //{
        //    try
        //    {
        //        var parameter = "?mobileNo=" + mobileNo + "&otp=" + otp + "&expirytime=" + expirytime;
        //        var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("ForgotUserPassword/ValidateUserbyOTP" + parameter);
        //        if (serviceResponse.Status)
        //        {
        //            return Json(serviceResponse.Data);

        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:ValidateUserbyOTP:For UserID {0} with OTP entered {1}", otp);
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:ValidateUserbyOTP:For UserID {0} with OTP entered {1}", otp);
        //        throw ex;
        //    }
        //}
        #endregion
    }
}

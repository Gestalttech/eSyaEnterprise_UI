using DocumentFormat.OpenXml.Spreadsheet;
using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.Localize.Data;
using eSyaEnterprise_UI.Areas.Localize.Models;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Extension;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.Localize.Controllers
{
    [AllowAnonymous]
    public class UserCreationController : Controller
    {
        private readonly DO_AppConfig appConfig;
        private readonly IeSyaLocalizeAPIServices _eSyalocalizeAPIServices;
        private readonly ILogger<UserCreationController> _logger;
        public UserCreationController(IeSyaLocalizeAPIServices eSyalocalizeAPIServices, ILogger<UserCreationController> logger)
        {
            _eSyalocalizeAPIServices = eSyalocalizeAPIServices;
            _logger = logger;
        }
        #region User Creation
        [Area("Localize")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ELE_06_00()
        {
            return View();
        }
        /// <summary>
        /// Get Users for Grid
        /// </summary>
        [Area("Localize")]
        [HttpPost]
        public async Task<JsonResult> GetAllUsers()
        {
            try
            {

                var serviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.GetAsync<List<DO_UserCreation>>("UserCreation/GetAllUsers");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAllUsers");
                    return Json(new { Status = false, StatusCode = "500" });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAllUsers");

                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Insert or Update User Creation
        /// </summary>
        [Area("Localize")]
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateUserCreation(DO_UserCreation obj)
        {

            try
            {
                obj.User_ID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/InsertOrUpdateUserCreation", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateUserCreation:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }


        /// <summary>
        /// Activate or De Activate User
        /// </summary>
        [Area("Localize")]
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveUser(bool status, int UserId)
        {

            try
            {

                var parameter = "?status=" + status + "&UserId=" + UserId;
                var serviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("UserCreation/ActiveOrDeActiveUser" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveUser:For UserId {0} ", UserId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion


        #region Login
        [Area("Localize")]
        public IActionResult Login()
        {
            HttpContext.Session.Set("AppConfig", appConfig);

            return View();
        }

        [Area("Localize")]
        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {

            try
            {
                bool isValid = false;
                var serviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.GetAsync<List<DO_UserCreation>>("UserCreation/GetAllUsers");
                if (serviceResponse.Status)
                {
                    isValid = serviceResponse.Data.Any(x => x.LoginId.ToLower() == model.UserName.ToLower() && x.Password == model.Password);
                    if (isValid)
                    {
                        AppSessionVariables.SetSessionUserID(HttpContext, 0);
                        AppSessionVariables.SetSessionBusinessKey(HttpContext, 0);
                        AppSessionVariables.SetSessionFinancialYear(HttpContext, 0);

                        AppSessionVariables.SetSessionBusinessLocationName(HttpContext, "Gestalt");

                        var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme, ClaimTypes.Name, ClaimTypes.Role);
                        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, model.UserName));
                        identity.AddClaim(new Claim(ClaimTypes.Name, model.UserName));
                        var principal = new ClaimsPrincipal(identity);
                        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties { IsPersistent = model.RememberMe });

                        AppSessionVariables.SetSessionIsEsyaUser(HttpContext, true);
                        var url = Url.Action("Index", "Home", new { area = "" });
                        return Redirect(url);

                        //It will also work
                        //return Redirect("~/Home/Index");
                    }
                    else
                    {
                        //ModelState.AddModelError("", "Invalid UserId or Password");
                        ViewBag.InvaidUser = "Invalid UserId or Password";
                        return View(model);
                    }
                }
                else
                {
                    //ModelState.AddModelError("", "Internal error");
                    ViewBag.InvaidUser = "Invalid UserId or Password";
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:Login:params:" + JsonConvert.SerializeObject(model));
                    return View("Login");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:Login:params:" + JsonConvert.SerializeObject(model));
                throw ex;
            }
        }
        #endregion
    }
}

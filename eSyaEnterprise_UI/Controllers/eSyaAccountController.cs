﻿using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Extension;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Controllers
{
    [AllowAnonymous]
    public class eSyaAccountController : Controller
    {
        private SignInManager<ApplicationUser> signInManager;
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        private readonly IApplicationRulesServices _applicationRulesServices;
        private readonly ILogger<AccountController> _logger;
        private readonly DO_AppConfig appConfig;
        public eSyaAccountController(SignInManager<ApplicationUser> signinMgr,
         IeSyaGatewayServices eSyaGatewayServices,
         IApplicationRulesServices applicationRulesServices,
         IOptions<DO_AppConfig> option,
         ILogger<AccountController> logger)
        {
            signInManager = signinMgr;
            _eSyaGatewayServices = eSyaGatewayServices;
            _applicationRulesServices = applicationRulesServices;
            appConfig = option.Value;
            _logger = logger;
        }
        public IActionResult Login()
        {
            HttpContext.Session.Set("AppConfig", appConfig);

            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {

            try
            {
                var isValid = (model.UserName.ToLower() == "gestalt" && model.Password == "Gestalt@2008");
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
                    //return new RedirectToActionResult("V_2_00", "FormsMenu", new { area = "eSyaConfig" });
                    return new RedirectToActionResult("EPS_04_00", "FormNames", new { area = "ProductSetup" });
                }
                var objmodel = new DO_UserLogIn()
                {
                    LoginID = model.UserName,
                    Password = model.Password,
                    ePassword = string.Empty
                };
                //if (ModelState.IsValid)
                if (objmodel.LoginID != "gestalt")
                {
                    //var obj = new { LoginID = objmodel.LoginID, objmodel.Password };
                    var serviceResponse = await _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_UserAccount>("eSyaUser/ValidateUserPassword", objmodel);
                    if (serviceResponse.Status)
                    {
                        if (!serviceResponse.Data.IsSucceeded)
                        {
                            //ModelState.AddModelError("", serviceResponse.Data.Message);
                            ViewBag.InvaidUser = serviceResponse.Data.Message;
                            return View("Login");
                        }
                        var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme, ClaimTypes.Name, ClaimTypes.Role);
                        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, model.UserName));
                        identity.AddClaim(new Claim(ClaimTypes.Name, model.UserName));
                        var principal = new ClaimsPrincipal(identity);
                        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties { IsPersistent = model.RememberMe });

                        AppSessionVariables.SetSessionUserID(HttpContext, serviceResponse.Data.UserID);
                        AppSessionVariables.SetSessionUserType(HttpContext, serviceResponse.Data.UserType);
                        AppSessionVariables.SetSessionIsEsyaUser(HttpContext, true);

                        AppSessionVariables.SetSessionBusinessLocationName(HttpContext, "Gestalt");

                        return RedirectToAction("Index", "Home");
                    }
                    else
                    {
                        ModelState.AddModelError("", "Internal error");
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:Login:params:" + JsonConvert.SerializeObject(model));
                        return View("Login");
                    }
                }
                else
                {
                    return View("Login");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:Login:params:" + JsonConvert.SerializeObject(model));
                throw;
            }
        }
        public async Task<IActionResult> CreateLogin()
        {
            var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<List<DO_AppCodes>>("Common/GetApplicationCodesByCodeType?codeType=" + CodeTypeValues_ac.UserGroup);
            if (serviceResponse.Status)
            {
                ViewBag.l_UserGroup = serviceResponse.Data;
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:CreateLogin");
            }
            return View();
        }
        [HttpGet]
        public async Task<JsonResult> GeteSyaUserList()
        {
            try
            {
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<List<DO_eSyaUser>>("eSyaUser/GeteSyaUser");
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GeteSyaUserList");
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GeteSyaUserList");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GeteSyaUserList");
                throw;
            }
        }

        [HttpGet]
        public async Task<JsonResult> GetUserTypeListByGroup(int userGroup)
        {
            try
            {
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<List<DO_AppCodes>>("eSyaUser/GetUserTypeByGroup?userGroup=" + userGroup);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserTypeListByGroup");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUserTypeListByGroup");
                throw;
            }
        }

        [HttpPost]
        public JsonResult InsertIntoeSyaUser(DO_eSyaUser obj)
        {
            try
            {
                obj.CreatedBy = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.FormId = "0";
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("eSyaUser/InsertIntoeSyaUser", obj).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertIntoeSyaUser:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertIntoeSyaUser:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpPost]
        public JsonResult UpdateeSyaUser(DO_eSyaUser obj)
        {
            try
            {
                obj.CreatedBy = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("eSyaUser/UpdateeSyaUser", obj).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateeSyaUser:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateeSyaUser:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpGet]
        public async Task<JsonResult> GeteSyaUserByUserID(int userID)
        {
            try
            {
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_eSyaUser>("eSyaUser/GeteSyaUserByUserID?userID=" + userID);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GeteSyaUserByUserID");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GeteSyaUserByUserID");
                throw;
            }
        }

    }
}

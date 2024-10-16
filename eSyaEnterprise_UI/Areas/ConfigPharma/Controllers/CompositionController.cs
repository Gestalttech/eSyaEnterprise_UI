﻿using Microsoft.AspNetCore.Mvc;
using eSyaEnterprise_UI.Areas.ConfigPharma.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using eSyaEnterprise_UI.Areas.ConfigPharma.Models;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using System.Reflection.Emit;


namespace eSyaEnterprise_UI.Areas.ConfigPharma.Controllers
{
    [SessionTimeout]
    public class CompositionController : Controller
    {
        private readonly IeSyaConfigPharmaAPIServices _eSyapharmaAPIServices;
        private readonly ILogger<ManufacturerController> _logger;

        public CompositionController(IeSyaConfigPharmaAPIServices pharmacyAPIServices, ILogger<ManufacturerController> logger)
        {
            _eSyapharmaAPIServices = pharmacyAPIServices;
            _logger = logger;
        }
        #region Drug Composition 
        [Area("ConfigPharma")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPH_05_00()
        {
            try
            {

                List<int> l_codeType = new List<int>();
                l_codeType.Add(ApplicationCodeTypeValues.PharmacyGroup);


                var response = _eSyapharmaAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("CommonData/GetApplicationCodesByCodeTypeList", l_codeType).Result;
                var respDrugClass =await _eSyapharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugClass>>("DrugComposition/GetActiveDrugClass");
                var responseTherapueticClass =await _eSyapharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugTherapeutic>>("DrugComposition/GetActiveDrugTherapeutics");

                if (response.Status && respDrugClass.Status && responseTherapueticClass.Status)
                {
                    ViewBag.DrugClassList = respDrugClass.Data.Select(a => new SelectListItem
                    {
                        Text = a.DrugClassDesc,
                        Value = a.DrugClass.ToString()
                    });

                    ViewBag.TherapueticClassList = responseTherapueticClass.Data.Select(a => new SelectListItem
                    {
                        Text = a.DrugTherapeuticDesc,
                        Value = a.DrugTherapeutic.ToString()
                    });

                    List<DO_ApplicationCodes> PharmacyGroup = response.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.PharmacyGroup).ToList();
                    ViewBag.PharmacyGroupList = PharmacyGroup.Select(a => new SelectListItem
                    {
                        Text = a.CodeDesc,
                        Value = a.ApplicationCode.ToString()
                    });
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetApplicationCodesByCodeType:For RateType {0}", ApplicationCodeTypeValues.ConfigPatientRateType);
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApplicationCodesByCodeType:For RateType {0}", ApplicationCodeTypeValues.ConfigPatientRateType);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Getting Composition List By Prefix
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetCompositionByPrefix(string prefix)
        {
            try
            {
                var parameter = "?prefix=" + prefix;
                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<List<DO_Composition>>("DrugComposition/GetCompositionByPrefix" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetCompositionByPrefix :For prefix {0} ", prefix);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Composition
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateComposition(DO_Composition obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (obj.CompositionId == 0)
                {
                    var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DrugComposition/InsertComposition", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateComposition:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DrugComposition/UpdateComposition", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateComposition:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateComposition:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Getting Composition List For tree
        /// </summary>
        [HttpGet]
        public async Task<ActionResult> GetCompositionForTree(string prefix)
        {
            try
            {
                List<jsTreeObject> treeView = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "C";
                jsObj.parent = "#";
                jsObj.text = "Compositions";
                jsObj.icon = "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);

                var parameter = "?prefix=" + prefix;
                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<List<DO_Composition>>("DrugComposition/GetCompositionByPrefix" + parameter);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var g_list = serviceResponse.Data;
                        foreach (var g in g_list)
                        {
                            jsObj = new jsTreeObject();
                            jsObj.id = g.CompositionId.ToString();
                            jsObj.text = g.DrugCompDesc;
                            jsObj.icon = "/images/jsTree/openfolder.png";
                            jsObj.parent = "C";
                            treeView.Add(jsObj);
                        }
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCompositionForTree :For prefix {0} ", prefix);
                }

                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetCompositionForTree :For prefix {0} ", prefix);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }


        /// <summary>
        /// Getting Composition By ID
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetCompositionInfo(int composId)
        {
            try
            {
                var parameter = "?composId=" + composId;
                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<DO_Composition>("DrugComposition/GetCompositionInfo" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetCompositionByID :For composId {0} ", composId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        [Area("ConfigPharma")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult _DrugComposition()
        {
            return View();
        }
        
        #endregion

    }
}

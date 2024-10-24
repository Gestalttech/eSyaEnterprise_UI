﻿using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigBusiness.Data;
using eSyaEnterprise_UI.Areas.ConfigBusiness.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigBusiness.Controllers
{
    [SessionTimeout]
    public class ApplicationRulesController : Controller
    {
        private readonly IeSyaConfigBusinessAPIServices _eSyaConfigBusinessAPIServices;
        private readonly ILogger<ApplicationRulesController> _logger;


        public ApplicationRulesController(IeSyaConfigBusinessAPIServices eSyaConfigBusinessAPIServices, ILogger<ApplicationRulesController> logger)
        {
            _eSyaConfigBusinessAPIServices = eSyaConfigBusinessAPIServices;
            _logger = logger;
        }
        #region Map Business - Application Rules
        [Area("ConfigBusiness")]
        [ServiceFilter(typeof(ViewBagActionFilter))]

        public async Task<IActionResult> ECB_04_00()
        {
            try
            {
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("ConfigMasterData/GetBusinessKey");
                if (serviceResponse.Status)
                {
                    ViewBag.Businesskey = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.BusinessKey.ToString(),
                        Text = b.LocationDescription,
                    }).ToList();

                    return View();
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessKey");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessKey");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        public async Task<JsonResult> GetProcessMaster()
        {
            try
            {
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_ProcessMaster>>("Rules/GetProcessMaster");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetProcessMaster");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetProcessMaster");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetProcessRulebySegmentwise()
        {
            try
            {
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_ProcessRule>>("Rules/GetProcessRulebySegmentwise");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetProcessRule by Segment");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetProcessRule");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetProcessRulebyBusinessKey(int BusinessKey)
        {
            try
            {
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_ProcessRule>>("Rules/GetProcessRulebyBusinessKey?BusinessKey=" + BusinessKey);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetProcessRulebyBusinessKey by Segment");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetProcessRulebyBusinessKey");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Update Application Rule by segment
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertorUpdateProcessRulebySegment(DO_ProcessRulebySegment obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Rules/InsertorUpdateProcessRulebySegment", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateApplicationRule:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion

        #region Map Application Rules - Business
        [Area("ConfigBusiness")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECB_05_00()
        {
            return View();

        }

        public async Task<ActionResult> GetProcessRulesMapwithLocation()
        {
            try
            {
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_ProcessMaster>>("Rules/GetProcessforLocationLink");
                var process_list = new List<DO_ProcessMaster>();
                if (serviceResponse.Status)
                {
                    process_list = serviceResponse.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetProcessforLocationLink");
                }

                var ruleserviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_ProcessRule>>("Rules/GetProcessRuleforLocationLink");
                var rule_list = new List<DO_ProcessRule>();
                if (ruleserviceResponse.Status)
                {
                    rule_list = ruleserviceResponse.Data;
                }
                else
                {
                    _logger.LogError(new Exception(ruleserviceResponse.Message), "UD:GetProcessRuleforLocationLink");
                }

                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                List<jsTreeObject> treeView = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "SG";
                jsObj.parent = "#";
                jsObj.text = "Process Rules";
                jsObj.icon = baseURL + "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);
                if (process_list != null)
                {
                    foreach (var st in process_list)
                    {
                        jsObj = new jsTreeObject();
                        jsObj.id = st.ProcessId.ToString();
                        jsObj.text = st.ProcessDesc;
                        jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                        jsObj.parent = "SG";
                        jsObj.state = new stateObject { opened = false, selected = false };
                        treeView.Add(jsObj);
                        if (rule_list != null)
                        {
                            foreach (var sg in rule_list)
                            {
                                if (st.ProcessId == sg.ProcessId)
                                {
                                    jsObj = new jsTreeObject();
                                    //jsObj.id = "G" + st.ProcessId.ToString()+ sg.RuleId.ToString();
                                    jsObj.id = "G" + st.ProcessId.ToString() + "-" + sg.RuleId.ToString();
                                    jsObj.text = sg.RuleDesc;
                                    jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                    jsObj.parent = st.ProcessId.ToString();
                                    treeView.Add(jsObj);

                                }
                            }
                        }
                    }
                }

                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetProcessRulesMapwithLocation");
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }




        }
        [HttpGet]
        public async Task<ActionResult> GetProcessRulesMappedwithLocationByID(int processID, int ruleID)
        {
            try
            {
                var parameter = "?processID=" + processID + "&ruleID=" + ruleID;
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("Rules/GetProcessRulesMappedwithLocationByID" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetProcessRulesMappedwithLocationByID:For processID {0}", processID);
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetProcessRulesMappedwithLocationByID:For processID {0}", processID);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetProcessRulesMappedwithLocationByID:For processID {0}", processID);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }

        /// <summary>
        /// Insert Into Process Rules Map with Location 
        /// </summary>

        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateProcessRulesMapwithLocation(List<DO_ProcessRulebySegment> obj)
        {
            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();
                    return true;
                });

                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Rules/InsertOrUpdateProcessRulesMapwithLocation", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateProcessRulesMapwithLocation:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateProcessRulesMapwithLocation:params:" + JsonConvert.SerializeObject(obj));
                throw;
            }
        }
        /// <summary>
        ///Get Business Location Parameters by Business Key for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetLocationParameters(int BusinessKey)
        {
            try
            {

                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_eSyaParameter>>("License/GetLocationParametersbyBusinessKey?BusinessKey=" + BusinessKey);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetLocationParametersbyBusinessKey:For BusinessKey {0}", BusinessKey);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetLocationParametersbyBusinessKey:For BusinessKey {0}", BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetLocationParametersbyBusinessKey:For BusinessKey {0} BusinessKey", BusinessKey);
                throw;
            }
        }
        #endregion
    }
}

using DocumentFormat.OpenXml.Spreadsheet;
using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigProduct.Models;
using eSyaEnterprise_UI.Areas.ProductSetup.Data;
using eSyaEnterprise_UI.Areas.ProductSetup.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ProductSetup.Controllers
{
    [SessionTimeout]
    public class RulesController : Controller
    {
        private readonly IeSyaProductSetupAPIServices _eSyaProductSetupAPIServices;
        private readonly ILogger<RulesController> _logger;

        public RulesController(IeSyaProductSetupAPIServices eSyaProductSetupAPIServices, ILogger<RulesController> logger)
        {
            _eSyaProductSetupAPIServices = eSyaProductSetupAPIServices;
            _logger = logger;
        }
        #region Application Rules

        [ServiceFilter(typeof(ViewBagActionFilter))]
        [Area("ProductSetup")]
        public IActionResult EPS_07_00()
        {
            try
            {
                return View();
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        public async Task<JsonResult> GetProcessMaster()
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_ProcessMaster>>("Rules/GetProcessMaster");
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

        public async Task<JsonResult> GetProcessRule()
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_ProcessRule>>("Rules/GetProcessRule");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetProcessRule");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetProcessRule");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Process Rule
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertProcessMaster(DO_ProcessMaster obj)
        {

            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Rules/InsertIntoProcessMaster", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertProcessMaster:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        /// <summary>
        /// Update Process Rule
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateProcessMaster(DO_ProcessMaster obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Rules/UpdateProcessMaster", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateProcessMaster:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Process Rule
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertApplicationRule(DO_ProcessRule obj)
        {

            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Rules/InsertIntoProcessRule", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertApplicationRule:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        /// <summary>
        /// Update Process Rule
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateApplicationRule(DO_ProcessRule obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Rules/UpdateProcessRule", obj);
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

        #region Application Rule-Segment Based
        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]

        public async Task<IActionResult> EPS_20_00()
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("ConfigMasterData/GetBusinessKey");
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
        [HttpPost]
        public async Task<JsonResult> GetProcessRulebySegmentwise()
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_ProcessRule>>("Rules/GetProcessRulebySegmentwise");
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
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_ProcessRule>>("Rules/GetProcessRulebyBusinessKey?BusinessKey=" + BusinessKey);
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
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Rules/InsertorUpdateProcessRulebySegment", obj);
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


        #region Application Rules Map to Business Location
        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPS_24_00()
        {
             return View();
           
        }

        public async Task<ActionResult> GetProcessRulesMapwithLocation()
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_ProcessMaster>>("Rules/GetProcessforLocationLink");
                var process_list = new List<DO_ProcessMaster>();
                if (serviceResponse.Status)
                {
                    process_list = serviceResponse.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetProcessforLocationLink");
                }

                var ruleserviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_ProcessRule>>("Rules/GetProcessRuleforLocationLink");
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
                                    jsObj.parent =st.ProcessId.ToString();
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
        public async Task<ActionResult> GetProcessRulesMappedwithLocationByID(int processID,int ruleID)
        {
            try
            {
                var parameter = "?processID=" + processID+ "&ruleID="+ ruleID;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("Rules/GetProcessRulesMappedwithLocationByID" + parameter);
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

                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Rules/InsertOrUpdateProcessRulesMapwithLocation", obj);
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
        #endregion
    }
}

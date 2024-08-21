using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.Approval.Data;
using eSyaEnterprise_UI.Areas.Approval.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.Approval.Controllers
{
    [SessionTimeout]
    public class ProcessController : Controller
    {
        private readonly IeSyaApprovalProcessAPIServices _eSyaApprovalProcessAPIServices;
        private readonly ILogger<ProcessController> _logger;

        public ProcessController(IeSyaApprovalProcessAPIServices eSyaApprovalProcessAPIServices, ILogger<ProcessController> logger)
        {
            _eSyaApprovalProcessAPIServices = eSyaApprovalProcessAPIServices;
            _logger = logger;
        }
         #region Approval Level Based
        [Area("Approval")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EAP_01_00()
        {
            try
            {
                List<int> l_ac = new List<int>();
                l_ac.Add(ApplicationCodeTypeValues.ApprovalType);
                l_ac.Add(ApplicationCodeTypeValues.ApprovalLevel);
                var response = await _eSyaApprovalProcessAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("CommonData/GetApplicationCodesByCodeTypeList", l_ac);
                var serviceResponse = await _eSyaApprovalProcessAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");
                if (serviceResponse.Status && response.Status)
                {
                    if (response.Data != null && serviceResponse.Data!=null)
                    {
                        List<DO_ApplicationCodes> approval = response.Data;
                
                        ViewBag.ApprovalType = approval.Where(w => w.CodeType == ApplicationCodeTypeValues.ApprovalType).Select(b => new SelectListItem
                        {
                            Value = b.ApplicationCode.ToString(),
                            Text = b.CodeDesc,
                        }).ToList();

                        ViewBag.BusinessKeyList = serviceResponse.Data.Select(b => new SelectListItem
                        {
                            Value = b.BusinessKey.ToString(),
                            Text = b.LocationDescription,
                        }).ToList();

                        return View();
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessKey");
                        return View();
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessKey");
                    return View();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessKey");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        ///Get Form List for Approval
        /// </summary>
        [Area("Approval")]
        [HttpPost]
        public async Task<JsonResult> GetFormsForApproval()
        {

            try
            {
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                List<jsTreeObject> treeView = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "FM",
                    parent = "#",
                    text = "eSya Forms",
                    icon = baseURL + "/images/jsTree/foldergroupicon.png",
                    state = new stateObject { opened = true, selected = false }
                };
                treeView.Add(jsObj);

                var serviceResponse = await _eSyaApprovalProcessAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("Process/GetFormsForApproval");

                if (serviceResponse.Status)
                {
                    foreach (var fm in serviceResponse.Data)
                    {
                        jsObj = new jsTreeObject
                        {
                            id = fm.FormID.ToString(),
                            text = fm.FormCode.ToString() + '.' + fm.FormName,
                            icon = baseURL + "/images/jsTree/openfolder.png",
                            parent = "FM"
                        };
                        treeView.Add(jsObj);
                    }
                    return Json(treeView);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetFormsForApproval");
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetFormsForApproval");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        [Area("Approval")]
        [HttpPost]
        public async Task<JsonResult> GetApprovalLevelsbyCodeType(int businesskey, int formId, int approvaltype)
        {
            try
            {
                var parameter = "?codetype=" + ApplicationCodeTypeValues.ApprovalLevel+
                    "&businesskey="+ businesskey+ "&formId="+ formId+ "&approvaltype="+ approvaltype;
                var serviceResponse = await _eSyaApprovalProcessAPIServices.HttpClientServices.GetAsync<List<DO_ApprovalLevels>>("Process/GetApprovalLevelsbyCodeType" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetApprovalLevelsbyCodeType");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApprovalLevelsbyCodeType");
                throw;
            }
        }

        //<summary>
        //Insert or Update Approval Types
        // </summary>
        [Area("Approval")]
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateApprovalLevel(DO_ApprovalTypes obj)
        {

            try
            {

                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                if (obj.lst_ApprovalLevels.Count>0 )
                {
                    obj.lst_ApprovalLevels.All(c =>
                    {
                        c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                        c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                        return true;
                    });
                }
               
                var serviceResponse = await _eSyaApprovalProcessAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Process/InsertOrUpdateApprovalLevel", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateApprovalLevel:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateApprovalLevel:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });

            }

        }
        #endregion

        #region Approval Value Based
        [Area("Approval")]
        [HttpPost]
        public async Task<JsonResult> GetApprovalValuesbyFormID(int businesskey, int formId, int approvaltype)
        {
            try
            {
                var parameter = "?businesskey=" + businesskey + "&formId=" + formId;
                var serviceResponse = await _eSyaApprovalProcessAPIServices.HttpClientServices.GetAsync<List<DO_ApprovalValues>>("Process/GetApprovalValuesbyFormID" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetApprovalValuesbyFormID");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApprovalValuesbyFormID");
                throw;
            }
        }

        //<summary>
        //Insert or Update Approval Types
        // </summary>
        [Area("Approval")]
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateApprovalValueBased(DO_ApprovalTypes obj)
        {

            try
            {

                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                if (obj.lst_ApprovalLevels.Count > 0)
                {
                    obj.lst_ApprovalLevels.All(c =>
                    {
                        c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                        c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                        return true;
                    });
                }
                if(obj.lst_ApprovalValues.Count > 0)
                {
                    obj.lst_ApprovalValues.All(c =>
                    {
                        c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                        c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                        return true;
                    });
                }

                var serviceResponse = await _eSyaApprovalProcessAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Process/InsertOrUpdateApprovalValueBased", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateApprovalValueBased:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateApprovalValueBased:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });

            }

        }
        #endregion
    }
}

using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.SAC.Data;
using eSyaEnterprise_UI.Areas.SAC.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.SAC.Controllers
{
    [SessionTimeout]
    public class SACClassController : Controller
    {

        private readonly IeSyaSACAPIServices _eSyaSACAPIServices;
        private readonly ILogger<SACClassController> _logger;
        public SACClassController(IeSyaSACAPIServices eSyaSACAPIServices, ILogger<SACClassController> logger)
        {
            _eSyaSACAPIServices = eSyaSACAPIServices;
            _logger = logger;
        }

        #region SACClass
        [Area("SAC")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECS_05_00()
        {
            return View();
        }
        [Produces("application/json")]
        [HttpGet]
        public async Task<ActionResult> GetServiceClass()
        {
            try
            {
                List<jsTreeObject> treeView = new List<jsTreeObject>();
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "ST";
                jsObj.parent = "#";
                jsObj.text = "Service Types";
                jsObj.icon = baseURL + "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);

                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_SACClass>>("ServiceManagement/GetServiceTypes");
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var st_list = serviceResponse.Data;
                        foreach (var it in st_list)
                        {
                            jsObj = new jsTreeObject();
                            jsObj.id = it.Sacclass.ToString();
                            jsObj.text = it.SacclassDesc;
                            jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                            jsObj.parent = "ST";
                            treeView.Add(jsObj);
                        }
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceTypes");
                }

                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceTypes");
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }
        public async Task<ActionResult> GetServiceClassByID(int ServiceClassID)
        {
            try
            {
                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<DO_SACClass>("ServiceManagement/GetServiceClassByID?ServiceTypeID=" + ServiceClassID);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceClassByID:For ServiceClassID {0}", ServiceClassID);
                        return Json(new { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceTypeByID:For ServiceTypeID {0}", ServiceClassID);
                    return Json(new { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceTypeByID:For ServiceTypeID {0}", ServiceClassID);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> AddOrUpdateServiceClass(DO_SACClass obj)
        {
            try
            {
                //obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.FormID = "ECS_05_00";
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ServiceManagement/AddOrUpdateServiceClass", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddOrUpdateServiceClass:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateServiceClass:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateServiceClass:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> UpdateServiceClassIndex(int ServiceClassId, bool isMoveUp, bool isMoveDown)
        {
            try
            {
                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ServiceManagement/UpdateServiceTypeIndex?serviceClassId=" + ServiceClassId + "&isMoveUp=" + isMoveUp + "&isMoveDown=" + isMoveDown);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:UpdateServiceTypeIndex:For serviceClassId {0},isMoveUp {1},isMoveDown {2} ", ServiceClassId, isMoveUp, isMoveDown);
                        return Json(new { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateServiceTypeIndex:For serviceClassId {0},isMoveUp {1},isMoveDown {2} ", ServiceClassId, isMoveUp, isMoveDown);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateServiceTypeIndex:For serviceClassId {0},isMoveUp {1},isMoveDown {2} ", ServiceClassId, isMoveUp, isMoveDown);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> DeleteServiceClass(int serviceClassId)
        {
            try
            {
                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ServiceManagement/DeleteServiceType?serviceClassId=" + serviceClassId);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:DeleteServiceType:For serviceClassId {0} ", serviceClassId);
                        return Json(new { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteServiceType:For serviceClassId {0}", serviceClassId);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteServiceType:For serviceClassId {0} ", serviceClassId);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }


        #endregion

    }
}

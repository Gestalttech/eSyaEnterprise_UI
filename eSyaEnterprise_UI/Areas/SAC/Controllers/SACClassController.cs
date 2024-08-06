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
        public async Task<ActionResult> GetSACClasses(int ISDCode)
        {
            try
            {
                var param = "&ISDCode=" + ISDCode;
                List<jsTreeObject> treeView = new List<jsTreeObject>();
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "ST";
                jsObj.parent = "#";
                jsObj.text = "SAC Class";
                jsObj.icon = baseURL + "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);

                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_SACClass>>("SACClass/GetSACClasses" + param);
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
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSACClasses");
                }

                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSACClasses");
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }
        [HttpGet]
        public async Task<ActionResult> GetSACClassByClassID(int ISDCode, string SACClassID)
        {
            try
            {
                var parameter = "?ISDCode=" + ISDCode + "&SACClassID=" + SACClassID;
                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<DO_SACClass>("SACClass/GetSACClassByClassID" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSACClassByClassID:For SACClassID {0}", SACClassID);
                        return Json(new { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSACClassByClassID:For SACClassID {0}", SACClassID);
                    return Json(new { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSACClassByClassID:For SACClassID {0}", SACClassID);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        [HttpPost]
        public async Task<ActionResult> InsertOrUpdateSACClass(bool _isInsert,DO_SACClass obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                if (_isInsert)
                {
                    var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SACClass/InsertIntoSACClass", obj);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            return Json(serviceResponse.Data);
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:InsertIntoSACClass:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                        }

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertIntoSACClass:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SACClass/UpdateSACClass", obj);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            return Json(serviceResponse.Data);
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:UpdateSACClass:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                        }

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateSACClass:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateSACClass:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> DeleteSACClass(int ISDCode, string SACClassID)
        {
            try
            {
                var parameter = "?ISDCode=" + ISDCode + "&SACClassID=" + SACClassID;

                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("SACClass/DeleteSACClass" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:DeleteSACClass:For SACClassID {0} ", SACClassID);
                        return Json(new { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteSACClass:For SACClassID {0}", SACClassID);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteSACClass:For SACClassID {0} ", SACClassID);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }


        #endregion

    }
}

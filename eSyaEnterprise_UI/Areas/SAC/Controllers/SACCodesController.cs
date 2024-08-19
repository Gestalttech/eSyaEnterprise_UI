using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.SAC.Data;
using eSyaEnterprise_UI.Areas.SAC.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.SAC.Controllers
{
    [SessionTimeout]
    public class SACCodesController : Controller
    {
        private readonly IeSyaSACAPIServices _eSyaSACAPIServices;
        private readonly ILogger<SACCodesController> _logger;
        public SACCodesController(IeSyaSACAPIServices eSyaSACAPIServices, ILogger<SACCodesController> logger)
        {
            _eSyaSACAPIServices = eSyaSACAPIServices;
            _logger = logger;
        }
        #region SAC Codes

        /// <summary>
        /// SAC Codes
        /// </summary>
        /// <returns></returns>

        [Area("SAC")]
        //[ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECS_07_00()
        {
            ViewBag.UserFormRole = new DO_UserFormRole
            {
                IsInsert = true,
                IsEdit = true,
                IsDelete = true,
                IsView = true
            };
            return View();
        }

        public async Task<ActionResult> GetSACCodes(int ISDCode)
        {
            try
            {
                var parameter = "?ISDCode=" + ISDCode;
                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_SACClass>>("SACClass/GetSACClasses"+ parameter);
                var st_list = new List<DO_SACClass>();
                if (serviceResponse.Status)
                {
                    st_list = serviceResponse.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSACClasses:GetSACClasses");
                }
                var serviceResponse1 = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_SACCategory>>("SACCategory/GetSACCategories"+ parameter);
                var sg_list = new List<DO_SACCategory>();
                if (serviceResponse1.Status)
                {
                    sg_list = serviceResponse1.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse1.Message), "UD:GetSACCategories:GetSACCategories");
                }
                var sc_list = new List<DO_SACCodes>();
                var serviceResponse2 = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_SACCodes>>("SACCodes/GetSACCodes"+ parameter);
                if (serviceResponse2.Status)
                {
                    sc_list = serviceResponse2.Data;
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse2.Message), "UD:GetSACCodes:GetSACCodes");
                }
                List<jsTreeObject> treeView = new List<jsTreeObject>();
                jsTreeObject jsObj = new jsTreeObject();

                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                jsObj.id = "SC";
                jsObj.parent = "#";
                jsObj.text = "SAC Codes";
                jsObj.icon = "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);
                if (st_list != null)
                {
                    foreach (var st in st_list)
                    {
                        jsObj = new jsTreeObject();
                        jsObj.id = "T" + st.Sacclass.ToString();
                        jsObj.text =st.Sacclass+"-"+ st.SacclassDesc;
                        jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                        jsObj.parent = "SC";
                        jsObj.state = new stateObject { opened = false, selected = false };
                        treeView.Add(jsObj);
                        if (sg_list != null)
                        {
                            foreach (var sg in sg_list)
                            {
                                if (st.Sacclass == sg.Sacclass)
                                {
                                    jsObj = new jsTreeObject();
                                    jsObj.id = sg.Saccategory.ToString();
                                    jsObj.text =sg.Saccategory+"-"+ sg.SaccategoryDesc;
                                    jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                                    jsObj.parent = "T" + st.Sacclass.ToString();
                                    jsObj.state = new stateObject { opened = false, selected = false };
                                    treeView.Add(jsObj);


                                    if (sc_list != null)
                                    {
                                        foreach (var sc in sc_list)
                                        {
                                            if (sg.Saccategory == sc.Saccategory)
                                            {
                                                if (sc.Saccode == sc.ParentId)
                                                {
                                                    jsObj = new jsTreeObject();
                                                    jsObj.id = "C" + sc.Saccode.ToString();
                                                    jsObj.text =sc.Saccode +"-"+ sc.Sacdescription;
                                                    jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                                    jsObj.parent = sg.Saccategory.ToString();
                                                    treeView.Add(jsObj);
                                                }
                                                else
                                                {
                                                    jsObj = new jsTreeObject();
                                                    jsObj.id = "C" + sc.Saccode.ToString();
                                                    jsObj.text =sc.Saccode+"-"+ sc.Sacdescription;
                                                    jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                                    jsObj.parent = "C" + sc.ParentId.ToString();
                                                    treeView.Add(jsObj);
                                                }

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceClasses");
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }



        }

        [HttpGet]
        public async Task<ActionResult> GetSACCodeByCode(int ISDCode,  string SACCodeID)
        {
            try
            {
                var parameter = "?ISDCode=" + ISDCode + "&SACCodeID=" + SACCodeID;
                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<DO_SACCodes>("SACCodes/GetSACCodeByCode" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSACCodeByCode:For SACCodeID {0}", SACCodeID);
                        return Json(new { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSACCodeByCode:For SACCodeID {0}", SACCodeID);
                    return Json(new { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSACCodeByCode:For SACCodeID {0}", SACCodeID);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        [HttpPost]
        public async Task<ActionResult> InsertOrUpdateSACCode( DO_SACCodes obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                if (obj._isInsert)
                {
                    var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SACCodes/InsertIntoSACCode", obj);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            return Json(serviceResponse.Data);
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:InsertIntoSACCode:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                        }

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertIntoSACCategory:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SACCodes/UpdateSACSACCode", obj);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            return Json(serviceResponse.Data);
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:UpdateSACSACCode:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                        }

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateSACCode:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateSACCategory:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> DeleteSACCode(int ISDCode,  string SACCodeID)
        {
            try
            {
                var parameter = "?ISDCode=" + ISDCode + "&SACCodeID=" + SACCodeID;


                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("SACCodes/DeleteSACCode" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:DeleteSACCode:For SACCode {0} ", SACCodeID);
                        return Json(new { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteSACCode:For SACCode {0}", SACCodeID);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteSACCode:For SACCode {0} ", SACCodeID);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion
    }
}

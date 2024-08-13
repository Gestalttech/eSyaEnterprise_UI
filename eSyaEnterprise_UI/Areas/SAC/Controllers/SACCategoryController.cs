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
    public class SACCategoryController : Controller
    {
        private readonly IeSyaSACAPIServices _eSyaSACAPIServices;
        private readonly ILogger<SACCategoryController> _logger;
        public SACCategoryController(IeSyaSACAPIServices eSyaSACAPIServices, ILogger<SACCategoryController> logger)
        {
            _eSyaSACAPIServices = eSyaSACAPIServices;
            _logger = logger;
        }
        #region SAC Category

        /// <summary>
        /// SAC Category
        /// </summary>
        /// <returns></returns>

        [Area("SAC")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECS_06_00()
        {
            return View();
        }
        [Produces("application/json")]
        [HttpGet]
        public async Task<ActionResult> GetSACCategories(int ISDCode)
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
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSACCategories:ISDCode");
                }

                var serviceResponse1 = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_SACCategory>>("SACCategory/GetSACCategories"+ parameter);
                var sg_list = new List<DO_SACCategory>();
                if (serviceResponse1.Status)
                {
                    sg_list = serviceResponse1.Data;
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse1.Message), "UD:GetSACCategories:ISDCode");
                }

                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                List<jsTreeObject> treeView = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "SG";
                jsObj.parent = "#";
                jsObj.text = "SAC Category";
                jsObj.icon = baseURL + "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);
                if (st_list != null)
                {
                    foreach (var st in st_list)
                    {
                        jsObj = new jsTreeObject();
                        jsObj.id = st.Sacclass.ToString();
                        jsObj.text = st.SacclassDesc;
                        jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                        jsObj.parent = "SG";
                        jsObj.state = new stateObject { opened = false, selected = false };
                        treeView.Add(jsObj);
                        if (sg_list != null)
                        {
                            foreach (var sg in sg_list)
                            {
                                if (st.Sacclass == sg.Sacclass)
                                {
                                    jsObj = new jsTreeObject();
                                    jsObj.id = "G" + sg.Saccategory.ToString();
                                    jsObj.text = sg.SaccategoryDesc;
                                    jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                    jsObj.parent = st.Sacclass.ToString();
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
                _logger.LogError(ex, "UD:GetSACCategories");
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }




        }
       
        [HttpGet]
        public async Task<ActionResult> GetSACCategoryByCategoryID(int ISDCode, string SACClassID, string SACCategoryID)
        {
            try
            {
                var parameter = "?ISDCode=" + ISDCode + "&SACClassID=" + SACClassID + "&SACCategoryID=" + SACCategoryID;
                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<DO_SACCategory>("SACCategory/GetSACCategoryByCategoryID" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSACCategoryByCategoryID:For SACCategoryID {0}", SACCategoryID);
                        return Json(new { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSACCategoryByCategoryID:For SACCategoryID {0}", SACCategoryID);
                    return Json(new { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSACCategoryByCategoryID:For SACCategoryID {0}", SACCategoryID);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        [HttpPost]
        public async Task<ActionResult> InsertOrUpdateSACCategory(DO_SACCategory obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                if (obj._isInsert)
                {
                    var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SACCategory/InsertIntoSACCategory", obj);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            return Json(serviceResponse.Data);
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:InsertIntoSACCategory:params:" + JsonConvert.SerializeObject(obj));
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
                    var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SACCategory/UpdateSACCategory", obj);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            return Json(serviceResponse.Data);
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:UpdateSACCategory:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                        }

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateSACCategory:params:" + JsonConvert.SerializeObject(obj));
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
        public async Task<ActionResult> DeleteSACCategory(int ISDCode, string SACClassID, string SACCategoryID)
        {
            try
            {
                var parameter = "?ISDCode=" + ISDCode + "&SACClassID=" + SACClassID + "&SACCategoryID=" + SACCategoryID;

                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("SACCategory/DeleteSACCategory" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:DeleteSACCategory:For SACCategoryID {0} ", SACCategoryID);
                        return Json(new { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteSACCategory:For SACCategoryID {0}", SACCategoryID);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteSACClass:For SACCategoryID {0} ", SACCategoryID);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion
    }
}

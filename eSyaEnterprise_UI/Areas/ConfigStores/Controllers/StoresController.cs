﻿using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigStores.Data;
using eSyaEnterprise_UI.Areas.ConfigStores.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigStores.Controllers
{
    [SessionTimeout]
    public class StoresController : Controller
    {
        private readonly IeSyaConfigStoreAPIServices _eSyaConfigStoreAPIServices;
        private readonly ILogger<StoresController> _logger;

        public StoresController(IeSyaConfigStoreAPIServices eSyaConfigStoreAPIServices, ILogger<StoresController> logger)
        {
            _eSyaConfigStoreAPIServices = eSyaConfigStoreAPIServices;
            _logger = logger;
        }

        #region Store Master
        //Store Master 
        [Area("ConfigStores")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECS_01_00()
        {

            return View();
        }
        /// <summary>
        /// Get Store Codes List for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetStoreCodes()
        {
            try
            {
                var serviceResponse = await _eSyaConfigStoreAPIServices.HttpClientServices.GetAsync<List<DO_StoreMaster>>("StoreMaster/GetStoreCodes");
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStoreCodes");
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStoreCodes");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetStoreCodes");
                throw;
            }
        }

        /// <summary>
        /// Get Store parameter
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetStoreParameterList(int StoreCode,int StoreType)
        {
            try
            {
                var serviceResponse = await _eSyaConfigStoreAPIServices.HttpClientServices.GetAsync<DO_StoreMaster>("StoreMaster/GetStoreParameterList?StoreCode=" + StoreCode + "&StoreType="+ StoreType);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStoreParameterList:For StoreCode {0}", StoreCode);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStoreParameterList:For StoreCode {0}", StoreCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetStoreParameterList:For StoreCode {0}", StoreCode);
                throw;
            }
        }

        /// <summary>
        /// Insert or Update Store Codes
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateStoreCodes(DO_StoreMaster storecodes)
        {
            try
            {

                if (string.IsNullOrEmpty(storecodes.StoreDesc))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Enter Store Description" });
                }
                else
                {
                    storecodes.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    storecodes.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    storecodes.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                    var serviceResponse = await _eSyaConfigStoreAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("StoreMaster/InsertOrUpdateStoreCodes", storecodes);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateStoreCodes:params:" + JsonConvert.SerializeObject(storecodes));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateStoreCodes:params:" + JsonConvert.SerializeObject(storecodes));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        /// <summary>
        /// Delete Store Codes
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> DeleteStoreCode(int StoreCode)
        {
            try
            {
                if (StoreCode == 0)
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Store" });
                }
                else
                {
                    var parameter = "?StoreCode=" + StoreCode;
                    var serviceResponse = await _eSyaConfigStoreAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("StoreMaster/DeleteStoreCode" + parameter);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteStoreCode:For StoreCode {0}", StoreCode);
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteStoreCode:For StoreCode {0}", StoreCode);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        /// <summary>
        /// Activate or De Activate Store Code
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveStoreCode(bool status, int storecode,int StoreType)
        {

            try
            {

                var parameter = "?status=" + status + "&storecode=" + storecode + "&StoreType=" + StoreType;
                var serviceResponse = await _eSyaConfigStoreAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("StoreMaster/ActiveOrDeActiveStoreCode" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveStoreCode:For storecode {0} ", storecode);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion Store Master

        #region Store_Form_Link

        [Area("ConfigStores")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECS_02_00()
        {

            return View();
        }

        public JsonResult GetFormForStorelinking()
        {
            try
            {
                List<jsTreeObject> treeView = new List<jsTreeObject>();

                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "FM",
                    parent = "#",
                    text = "eSya Forms",
                    icon = baseURL + "/images/jsTree/foldergroupicon.png",
                    state = new stateObject { opened = true, selected = false }
                };
                treeView.Add(jsObj);

                var serviceResponse1 = _eSyaConfigStoreAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("StoreMaster/GetFormForStorelinking").Result;
                if (serviceResponse1.Status)
                {
                    foreach (var fm in serviceResponse1.Data)
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
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse1.Message), "UD:GetFormList");
                }

                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetFormList");
                throw ex;
            }
        }


        public JsonResult GetFormForStorelinkin1g()
        {
            try
            {
                var serviceResponse = _eSyaConfigStoreAPIServices.HttpClientServices.GetAsync<List<DO_StoreFormLink>>("StoreMaster/GetFormForStorelinking").Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetFormForStorelinking");
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetFormForStorelinking");
                throw ex;
            }
        }

        public JsonResult GetStoreFormLinked(int formId)
        {
            try
            {
                var serviceResponse = _eSyaConfigStoreAPIServices.HttpClientServices.GetAsync<List<DO_StoreMaster>>("StoreMaster/GetStoreFormLinked?formId=" + formId).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStoreFormLinked:params:formId:" + formId.ToString());
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetStoreFormLinked:params:formId:" + formId.ToString());
                throw ex;
            }
        }

        [HttpPost]
        public JsonResult InsertIntoFormStoreLink(List<DO_StoreFormLink> l_obj)
        {
            try
            {
                if (l_obj.Count == 0)
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "No Record" });
                }
                else
                {
                    l_obj.All(c =>
                    {
                        c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                        c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                        return true;
                    });

                    var serviceResponse = _eSyaConfigStoreAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("StoreMaster/InsertIntoFormStoreLink", l_obj).Result;
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(serviceResponse.Message, "UD:InsertIntoFormStoreLink:Params:" + JsonConvert.SerializeObject(l_obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertIntoFormStoreLink:Params:" + JsonConvert.SerializeObject(l_obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion  Store_Form_Link

        #region Portfolio Master
        [Area("ConfigStores")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECS_03_00()
        {

            return View();
        }
        /// <summary>
        ///Get Portfolios for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetAllPortfolios()
        {

            try
            {
                var serviceResponse = await _eSyaConfigStoreAPIServices.HttpClientServices.GetAsync<List<DO_PortfolioMaster>>("StoreMaster/GetAllPortfolios");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAllPortfolios");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAllPortfolios");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert or Update Actions
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateIntoPortfolio(bool isInsert, DO_PortfolioMaster obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (isInsert)
                {
                    var serviceResponse = await _eSyaConfigStoreAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("StoreMaster/InsertIntoPortfolio", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
                else
                {
                    var serviceResponse = await _eSyaConfigStoreAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("StoreMaster/UpdatePortfolio", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateIntoPortfolio:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Portfolio
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActivePortfolio(bool status, int PortfolioId)
        {

            try
            {

                var parameter = "?status=" + status + "&PortfolioId=" + PortfolioId;
                var serviceResponse = await _eSyaConfigStoreAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("StoreMaster/ActiveOrDeActivePortfolio" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActivePortfolio:For ID {0} ", PortfolioId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion

    }
}

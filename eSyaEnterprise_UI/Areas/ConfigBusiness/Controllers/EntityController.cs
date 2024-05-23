using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigBusiness.Data;
using eSyaEnterprise_UI.Areas.ConfigBusiness.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigBusiness.Controllers
{
    [SessionTimeout]
    public class EntityController : Controller
    {
        private readonly IeSyaConfigBusinessAPIServices _eSyaConfigBusinessAPIServices;
        private readonly ILogger<EntityController> _logger;


        public EntityController(IeSyaConfigBusinessAPIServices eSyaConfigBusinessAPIServices, ILogger<EntityController> logger)
        {
            _eSyaConfigBusinessAPIServices = eSyaConfigBusinessAPIServices;
            _logger = logger;
        
        }

        #region Business Entity
        /// <summary>
        /// Business Entity
        /// </summary>
        /// <returns></returns>
        [Area("ConfigBusiness")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECB_01_00()
        {
            return View();
        }

        /// <summary>
        ///Get Business Entities for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetBusinessEntities()
        {
            try
            {
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_BusinessEntity>>("License/GetBusinessEntities");
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessEntities");
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessEntities");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessEntities");
                throw;
            }

        }

        /// <summary>
        ///Get Business Entities for Tree View
        /// </summary>
        //[Produces("application/json")]
        [HttpGet]
        public async Task<JsonResult> GetBusinessEntitiesforTreeView()
        {
            try
            {
                List<jsTreeObject> jsTree = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "MM",
                    parent = "#",
                    text = "Business Entity",
                    state = new stateObject { opened = true, selected = false }
                };
                jsTree.Add(jsObj);

                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_BusinessEntity>>("License/GetBusinessEntities");
                if (serviceResponse.Status)
                {
                    var BusinessEntities = serviceResponse.Data;
                    if (BusinessEntities != null)
                    {
                        foreach (var f in BusinessEntities.OrderBy(o => o.BusinessId))
                        {
                            jsObj = new jsTreeObject
                            {
                                id = "FM" + f.BusinessId.ToString() + "_" + f.BusinessId.ToString(),
                                text = f.BusinessDesc,
                                //GroupIndex = f.BusinessId.ToString() + "_" + f.ActiveStatus.ToString() + "_" + f.IsMultiSegmentApplicable.ToString(),
                                GroupIndex = f.BusinessId.ToString() + "_" + f.ActiveStatus.ToString(),
                                parent = "MM",
                                state = new stateObject { opened = true, selected = false }
                            };
                            jsTree.Add(jsObj);
                        }
                    }
                    return Json(jsTree);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessEntitiesforTreeView");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessEntitiesforTreeView");
                throw;
                //return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Business Entity Info
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetBusinessEntityInfo(int BusinessId)
        {
            try
            {
                var parameter = "?BusinessId=" + BusinessId;
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<DO_BusinessEntity>("License/GetBusinessEntityInfo" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessEntityInfo:For BusinessId {0}", BusinessId);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessEntityInfo:For BusinessId {0}", BusinessId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessEntityInfo:For BusinessId {0}", BusinessId);
                throw;
            }
        }

        /// <summary>
        /// Insert or Update Business Entity
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateBusinessEntity(DO_BusinessEntity businessentity)
        {
            try
            {
                if (businessentity.BusinessUnitType == 'S'.ToString())
                {
                    businessentity.NoOfUnits = 1;
                }
                if (businessentity.BusinessUnitType == 'S'.ToString())
                {
                    businessentity.IsMultiSegmentApplicable = false;
                }
                if (businessentity.BusinessUnitType == 'M'.ToString())
                {
                    businessentity.IsMultiSegmentApplicable = true;
                }
                if (string.IsNullOrEmpty(businessentity.BusinessDesc))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Enter Entity Description" });
                }
                else
                {
                    if (businessentity.l_Preferredlang != null)
                    {
                        businessentity.l_Preferredlang.All(c =>
                        {
                            c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                            c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                            c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                            return true;
                        });

                        //int defaultlang = businessentity.l_Preferredlang.Where(x => x.DefaultLanguage).Count();

                        //if (defaultlang > 1)
                        //{
                        //    return Json(new DO_ReturnParameter() { Status = false, Message = "Defalt Language should not be more than one Language" });
                        //}

                    }
                    businessentity.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    businessentity.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    businessentity.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    if (businessentity.BusinessId == 0)
                    {
                        var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("License/InsertBusinessEntity", businessentity);
                        if (serviceResponse.Status)
                            return Json(serviceResponse.Data);
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateBusinessEntity:params:" + JsonConvert.SerializeObject(businessentity));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                        }
                    }
                    else
                    {
                        var serviceResponse = _eSyaConfigBusinessAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("License/UpdateBusinessEntity", businessentity).Result;
                        if (serviceResponse.Status)
                            return Json(serviceResponse.Data);
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateBusinessEntity:params:" + JsonConvert.SerializeObject(businessentity));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateBusinessEntity:params:" + JsonConvert.SerializeObject(businessentity));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        /// <summary>
        ///DELETE Business Entity
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> DeleteBusinessEntity(int BusinessEntityId)
        {
            try
            {
                var parameter = "?BusinessEntityId=" + BusinessEntityId;
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("License/DeleteBusinessEntity" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteBusinessEntity:For BusinessEntityId {0}}", BusinessEntityId);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteBusinessEntity:For BusinessEntityId {0}", BusinessEntityId);
                return Json(new { Status = false, Message = ex.ToString() });
                //return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        ///Get Business Entity Preferred Language
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetPreferredLanguagebyBusinessKey(int BusinessId)
        {
            try
            {
                var parameter = "?BusinessId=" + BusinessId;
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_EntityPreferredLanguage>>("License/GetPreferredLanguagebyBusinessKey" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetPreferredLanguagebyBusinessKey:For BusinessId {0}", BusinessId);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetPreferredLanguagebyBusinessKey:For BusinessId {0}", BusinessId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPreferredLanguagebyBusinessKey:For BusinessId {0}", BusinessId);
                throw;
            }
        }
        #endregion Business Entity 
    }
}

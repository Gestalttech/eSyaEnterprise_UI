using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.Stores.Data;
using eSyaEnterprise_UI.Areas.Stores.Models;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Extension;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.Stores.Controllers
{
    [SessionTimeout]
    public class StoresController : Controller
    {
        private readonly IeSyaStoreAPIServices _eSyaStoreAPIServices;
        private readonly ILogger<StoresController> _logger;

        public StoresController(IeSyaStoreAPIServices eSyaStoreAPIServices, ILogger<StoresController> logger)
        {
            _eSyaStoreAPIServices = eSyaStoreAPIServices;
            _logger = logger;
        }
        #region Map Business to Stores & its Portfolio
        [Area("Stores")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ECS_04_00()
        {
            var serviceResponse = await _eSyaStoreAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("Common/GetBusinessKey");
            if (serviceResponse.Status)
            {
                if (serviceResponse.Data != null)
                {
                    ViewBag.BusinessKey = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.BusinessKey.ToString(),
                        Text = b.LocationDescription,
                    }).ToList();
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:V_1511_00:GetBusinessKey");
            }
            return View();

        }

        /// <summary>
        /// Get Store List for js tree
        /// </summary>
        [Produces("application/json")]
        [HttpGet]
        public async Task<JsonResult> GetStoreList(int BusinessKey)
        {
            try
            {
                List<jsTreeObject> jsTree = new List<jsTreeObject>();

                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "MM",
                    parent = "#",
                    text = "Stores",
                    state = new stateObject { opened = true, selected = false }
                };
                jsTree.Add(jsObj);
                var parameter = "?BusinessKey=" + BusinessKey;
                var serviceResponse = await _eSyaStoreAPIServices.HttpClientServices.GetAsync<List<DO_StoreMaster>>("StoreMaster/GetStoreList" + parameter);
                var storeList = serviceResponse.Data;

                if (storeList != null)
                {
                    //Add Form
                    foreach (var f in storeList.OrderBy(o => o.StoreCode))
                    {
                        if (f.ActiveStatus)
                        {
                            jsObj = new jsTreeObject
                            {
                                id = "ST" + "T" + "_" + f.StoreCode.ToString(),
                                text = f.StoreDesc,
                                GroupIndex = f.StoreCode.ToString(),
                                parent = "MM",
                                icon = baseURL + "/images/jsTree/checkedstate.jpg",
                                state = new stateObject { opened = true, selected = false }
                            };
                            jsTree.Add(jsObj);
                        }
                        else
                        {
                            jsObj = new jsTreeObject
                            {
                                id = "ST" + "F" + "_" + f.StoreCode.ToString(),
                                text = f.StoreDesc,
                                GroupIndex = f.StoreCode.ToString(),
                                parent = "MM",
                                state = new stateObject { opened = true, selected = false }
                            };
                            jsTree.Add(jsObj);
                        }
                    }
                }
                return Json(jsTree);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetStoreList");
                throw;
            }
        }


        /// <summary>
        ///Get Accounting Type
        /// </summary>
        [HttpPost]
        public JsonResult GetAllAccountingType()
        {
            try
            {
                var _actypes = GetAllStoreClass();
                return Json(_actypes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAllAccountingType");
                throw;
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetStoreBusinessLinkInfo(int BusinessKey, int StoreCode)
        {
            try
            {
                //var _actypes = GetAllStoreClass();

                var parameter = "?BusinessKey=" + BusinessKey + "&StoreCode=" + StoreCode;
                var serviceResponse = await _eSyaStoreAPIServices.HttpClientServices.GetAsync<DO_StoreBusinessLink>("StoreMaster/GetStoreBusinessLinkInfo" + parameter);

                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStoreBusinessLinkInfo:For BusinessKey {0} with StoreCode entered {1}", BusinessKey, StoreCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetStoreBusinessLinkInfo:For BusinessKey {0} with StoreCode entered {1} ", BusinessKey, StoreCode);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetPortfolioStoreBusinessLinkInfo(int BusinessKey, int StoreCode)
        {
            try
            {
                var parameter = "?BusinessKey=" + BusinessKey + "&StoreCode=" + StoreCode;
                var serviceResponse = await _eSyaStoreAPIServices.HttpClientServices.GetAsync<List<DO_StoreBusinessLink>>("StoreMaster/GetPortfolioStoreBusinessLinkInfo" + parameter);

                List<DO_StoreBusinessLink> Storelinkdata = serviceResponse.Data;

                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStoreBusinessLinkInfo:For BusinessKey {0} with StoreCode entered {1}", BusinessKey, StoreCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetStoreBusinessLinkInfo:For BusinessKey {0} with StoreCode entered {1} ", BusinessKey, StoreCode);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        //<summary>
        //Insert or Update Store Business Link
        // </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateStoreBusinessLink(DO_StoreBusinessLink obj)
        {

            try
            {

                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaStoreAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("StoreMaster/InsertOrUpdateStoreBusinessLink", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateStoreBusinessLink:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertUpdateStoreBusinessLink:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });

            }

        }

        private static List<DO_AccountingType> GetAllStoreClass()
        {
            List<DO_AccountingType> objlist = new List<DO_AccountingType>();
            objlist.Add(new DO_AccountingType()
            {
                StoreClass = "A",
                StoreClassDescription = "Is Accounting",
                ActiveStatus = false
            });
            objlist.Add(new DO_AccountingType()
            {
                StoreClass = "C",
                StoreClassDescription = "IS Custodian",
                ActiveStatus = false
            });
            objlist.Add(new DO_AccountingType()
            {
                StoreClass = "M",
                StoreClassDescription = "IS Consumption",
                ActiveStatus = false
            });
            objlist.Add(new DO_AccountingType()
            {
                StoreClass = "S",
                StoreClassDescription = "IS Point of Sales",
                ActiveStatus = false
            });
            return objlist;
        }
        #endregion Store Business Link
    }
}

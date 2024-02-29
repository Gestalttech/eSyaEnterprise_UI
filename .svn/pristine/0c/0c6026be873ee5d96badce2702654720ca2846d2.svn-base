using eSyaEnterprise_UI.Areas.ConfigPharma.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using eSyaEnterprise_UI.Areas.ConfigPharma.Models;

namespace eSyaEnterprise_UI.Areas.ConfigPharma.Controllers
{
    public class VendorController : Controller
    {
        private readonly IeSyaConfigPharmaAPIServices _eSyapharmaAPIServices;
        private readonly ILogger<ManufacturerController> _logger;

        public VendorController(IeSyaConfigPharmaAPIServices pharmacyAPIServices, ILogger<ManufacturerController> logger)
        {
            _eSyapharmaAPIServices = pharmacyAPIServices;
            _logger = logger;
        }

        [Area("ConfigPharma")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPH_04_00()
        {
            return View();
        }
        /// <summary>
        ///Getting Mapped Vendors List with Manufacturer in Grid
        /// </summary>
        /// 

        [Area("ConfigPharma")]
        [HttpPost]
        public async Task<JsonResult> GetMappedVendorListbyManufacturer(int manufId)
        {

            try
            {
                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<List<DO_ManufacturerVendorLink>>("Vendor/GetMappedVendorListbyManufacturer?manufId=" + manufId);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetMappedVendorListbyManufacturer");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetMappedVendorListbyManufacturer");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        /// <summary>
        ///Get Getting Active Manufacturer List for Tree View
        /// </summary>
        [Area("ConfigPharma")]
        [HttpPost]
        public async Task<JsonResult> GetActiveManufacturerList()
        {

            try
            {
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                List<jsTreeObject> treeView = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "FM",
                    parent = "#",
                    text = "Manufacturer",
                    icon = baseURL + "/images/jsTree/foldergroupicon.png",
                    state = new stateObject { opened = true, selected = false }
                };
                treeView.Add(jsObj);

                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<List<DO_ManufacturerVendorLink>>("Vendor/GetActiveManufacturerList");

                if (serviceResponse.Status)
                {
                    foreach (var fm in serviceResponse.Data)
                    {
                        jsObj = new jsTreeObject
                        {
                            id = fm.ManufacturerId.ToString(),
                            text =fm.ManufacturerName,
                            icon = baseURL + "/images/jsTree/openfolder.png",
                            parent = "FM"
                        };
                        treeView.Add(jsObj);
                    }
                    return Json(treeView);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveManufacturerList");
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveManufacturerList");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert Or Update Manufacturer-Vendors Links .
        /// </summary>
        [Area("ConfigPharma")]
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateManufacturer(DO_ManufacturerVendorLink obj)
        {

            try
            {
              
                    obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                foreach (var vlink in obj.vendorlist)
                {
                    vlink.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    vlink.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    vlink.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                }

                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Vendor/InsertOrUpdateManufacturer", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateManufacturer:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
    }
}

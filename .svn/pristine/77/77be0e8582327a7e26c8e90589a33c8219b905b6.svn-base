using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.Admin.Data;
using eSyaEnterprise_UI.Areas.Admin.Models;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Extension;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

namespace eSyaEnterprise_UI.Areas.Admin.Controllers
{
    public class HolidayMasterController : Controller
    {
        private readonly IeSyaAdminAPIServices _eSyaAdminAPIServices;
        private readonly ILogger<HolidayMasterController> _logger;

        public HolidayMasterController(IeSyaAdminAPIServices eSyaAdminAPIServices, ILogger<HolidayMasterController> logger)
        {
            _eSyaAdminAPIServices = eSyaAdminAPIServices;
            _logger = logger;
        }
        [Area("Admin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EAD_03_00()
        {
            try
            {
                return View();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ECA_22_00");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }


        }

        [HttpPost]
        public async Task<JsonResult> GetHolidayMasterByBusinessKey(int businesskey)
        {

            try
            {
                var parameter = "?businesskey=" + businesskey;
                var serviceresponce = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<List<DO_HolidayMaster>>("HolidayMaster/GetHolidayByBusinessKey" + parameter);

                if (serviceresponce.Status)
                {
                    return Json(serviceresponce.Data);
                }
                else
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceresponce.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDocumentControlNormalModebyBusinessKey:For businesskey {0} ", businesskey);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }


        }

        [HttpPost]
        public async Task<JsonResult> InsertAndUpdateHolidayMaster(bool isInsert, DO_HolidayMaster obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (isInsert)
                {
                    var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("HolidayMaster/InsertIntoHolidayMaster", obj);

                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

                }
                else
                {
                    var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("HolidayMaster/UpdateHolidayMaster", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertAndUpdateHolidayMaster:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveHolidayMaster(DO_HolidayMaster objgen)
        {
            try
            {
                objgen.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                objgen.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                objgen.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("HolidayMaster/ActiveOrDeActiveHolidayMaster", objgen);

                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD: ActiveOrDeActiveHolidayMaster:", objgen);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }


        }



    }
}

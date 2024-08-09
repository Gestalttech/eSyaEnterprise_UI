using eSyaEnterprise_UI.Areas.Egypt.Data;
using eSyaEnterprise_UI.Areas.Egypt.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.Egypt.Controllers
{
    
    public class DisplaySystemController : Controller
    {
        private readonly IEgyptTokenSystemAPIServices _EgyptAdminAPIServices;
        private readonly ILogger<DisplaySystemController> _logger;

        public DisplaySystemController(IEgyptTokenSystemAPIServices EgyptAdminAPIServices, ILogger<DisplaySystemController> logger)
        {
            _EgyptAdminAPIServices = EgyptAdminAPIServices;
            _logger = logger;
        }
        [Area("Egypt")]
        public async Task<IActionResult> Reception(string? DisplayArea)
        {
            if (DisplayArea == null || DisplayArea=="0")
            {
                return Json("Please Enter Display Area");
            }
           var param  = "?loungnumber=" + DisplayArea; 

            var serviceResponse = await _EgyptAdminAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("Reception/GetDeskNumbers" + param);
            if (serviceResponse.Status)
            {
                ViewBag.DisplayArea = DisplayArea;
                ViewBag.RoomList = serviceResponse.Data;

                return View();
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetFloors");
                return View();
            }
            
        }
        [HttpGet]
        public async Task<JsonResult> GetDeskNumbers(int loungnumber)
        {
            try
            {
                var param = "?loungnumber=" + loungnumber;
                var serviceResponse = await _EgyptAdminAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("Reception/GetDeskNumbers" + param);
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetTokenForReceptionDisplay(int DisplayArea,string arrayofRoomList)
        {
            try
            {
                var param = "?businessKey=" + 11 + "&DisplayArea=" + DisplayArea + "&DisplayArea="  +"&arrayofRoomList=" + arrayofRoomList;
                var serviceResponse = await _EgyptAdminAPIServices.HttpClientServices.GetAsync<List<DO_Reception>>("DisplaySystem/GetTokensforReceptionDisplay" + param);
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
      
    }
}

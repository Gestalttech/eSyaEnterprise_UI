using eSyaEnterprise_UI.Areas.Egypt.Data;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
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
        public IActionResult Reception()
        {
            return View();
        }


        //public JsonResult GetTokenForReceptionDisplay(int businessKey, string tokenArea)
        //{
        //    try
        //    {
        //        //var client = _EgyptAdminAPIServices.InitializeClient(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        //        //var parameter = "?businessKey=" + businessKey.ToString();
        //        //parameter += "&tokenArea=" + tokenArea;
        //        //HttpResponseMessage response = client.GetAsync("DisplaySystem/GetTokenForReceptionDisplay" + parameter).Result;
        //        //string respData = response.Content.ReadAsStringAsync().Result;

        //        //var st = JsonConvert.DeserializeObject<List<DO_Reception>>(respData);
        //        //return Json(st);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}
    }
}

using eSyaEnterprise_UI.ActionFilter;


using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.Egypt.Controllers
{
    [SessionTimeout]
    public class ReceptionController : Controller
    {
        //private readonly IEgyptTokenSystemAPIServices _EgyptAdminAPIServices;
        //private readonly ILogger<ReceptionController> _logger;

        //public ReceptionController(IEgyptTokenSystemAPIServices EgyptAdminAPIServices, ILogger<ReceptionController> logger)
        //{
        //    _EgyptAdminAPIServices = EgyptAdminAPIServices;
        //    _logger = logger;
        //}
        [Area("Egypt")]
        //[ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult TKM_99_00()
        {
            List<string> l_RoomList = new List<string>();
            l_RoomList.Add("1");
            l_RoomList.Add("2");
            l_RoomList.Add("3");
            l_RoomList.Add("4");
            ViewBag.RoomList = l_RoomList;

            //var client = _eSyaWebAPI.InitializeClient(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
            //HttpResponseMessage response = await client.GetAsync("ClinicMasterData/GetCustomer");
            //string respData = await response.Content.ReadAsStringAsync();
            //ViewBag.CustomerList = JsonConvert.DeserializeObject<List<DO_Customer>>(respData);
            return View();
        }

        //public JsonResult GetTokenDetailForReceptionDesk(int specialtyId, int doctorId, string patientType)
        //{
        //    try
        //    {

        //        var client = _eSyaWebAPI.InitializeClient(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        //        var parameter = "?businessKey=" + new AppSessionVariables().GetSessionBusinessKey(HttpContext).ToString();
        //        parameter += "&specialtyId=" + specialtyId.ToString();
        //        parameter += "&doctorId=" + doctorId.ToString();
        //        parameter += "&patientType=" + patientType;
        //        HttpResponseMessage response = client.GetAsync("ReceptionK/GetTokenDetailForReceptionDesk" + parameter).Result;
        //        string respData = response.Content.ReadAsStringAsync().Result;

        //        var st = JsonConvert.DeserializeObject<List<DO_Reception>>(respData);
        //        return Json(st);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }

        //}

        //public JsonResult UpdateReceptionTokenStatusToNurseAssessment(DO_Reception obj)
        //{
        //    try
        //    {
        //        obj.BusinessKey = new AppSessionVariables().GetSessionBusinessKey(HttpContext);
        //        obj.FormID = new AppSessionVariables().GetSessionFormID(HttpContext);
        //        obj.UserID = new AppSessionVariables().GetSessionUserID(HttpContext);
        //        obj.TerminalID = new BaseController().GetIPAddress(HttpContext);

        //        var client = _eSyaWebAPI.InitializeClient(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        //        HttpResponseMessage response = client.PostAsJsonAsync<DO_Reception>("ReceptionK/UpdateReceptionTokenStatusToNurseAssessment", obj).Result;
        //        string respData = response.Content.ReadAsStringAsync().Result;

        //        if (response.IsSuccessStatusCode)
        //            return Json(new { Status = true });
        //        else
        //            return Json(new { Status = false, Message = response.ReasonPhrase });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}
        //public JsonResult UpdateReceptionTokenStatusToCancel(DO_Reception obj)
        //{
        //    try
        //    {
        //        obj.BusinessKey = new AppSessionVariables().GetSessionBusinessKey(HttpContext);
        //        obj.FormID = new AppSessionVariables().GetSessionFormID(HttpContext);
        //        obj.UserID = new AppSessionVariables().GetSessionUserID(HttpContext);
        //        obj.TerminalID = new BaseController().GetIPAddress(HttpContext);

        //        var client = _eSyaWebAPI.InitializeClient(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        //        HttpResponseMessage response = client.PostAsJsonAsync<DO_Reception>("ReceptionK/UpdateReceptionTokenStatusToCancel", obj).Result;
        //        string respData = response.Content.ReadAsStringAsync().Result;

        //        if (response.IsSuccessStatusCode)
        //            return Json(new { Status = true });
        //        else
        //            return Json(new { Status = false, Message = response.ReasonPhrase });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}

        //public JsonResult UpdateReceptionTokenToHold(DO_Reception obj)
        //{
        //    try
        //    {
        //        obj.BusinessKey = new AppSessionVariables().GetSessionBusinessKey(HttpContext);
        //        obj.FormID = new AppSessionVariables().GetSessionFormID(HttpContext);
        //        obj.UserID = new AppSessionVariables().GetSessionUserID(HttpContext);
        //        obj.TerminalID = new BaseController().GetIPAddress(HttpContext);

        //        var client = _eSyaWebAPI.InitializeClient(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        //        HttpResponseMessage response = client.PostAsJsonAsync<DO_Reception>("ReceptionK/UpdateReceptionTokenToHold", obj).Result;
        //        string respData = response.Content.ReadAsStringAsync().Result;

        //        if (response.IsSuccessStatusCode)
        //            return Json(new { Status = true });
        //        else
        //            return Json(new { Status = false, Message = response.ReasonPhrase });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}

        //public JsonResult UpdateReceptionTokenToRelease(DO_Reception obj)
        //{
        //    try
        //    {
        //        obj.BusinessKey = new AppSessionVariables().GetSessionBusinessKey(HttpContext);
        //        obj.FormID = new AppSessionVariables().GetSessionFormID(HttpContext);
        //        obj.UserID = new AppSessionVariables().GetSessionUserID(HttpContext);
        //        obj.TerminalID = new BaseController().GetIPAddress(HttpContext);

        //        var client = _eSyaWebAPI.InitializeClient(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        //        HttpResponseMessage response = client.PostAsJsonAsync<DO_Reception>("ReceptionK/UpdateReceptionTokenToRelease", obj).Result;
        //        string respData = response.Content.ReadAsStringAsync().Result;

        //        if (response.IsSuccessStatusCode)
        //            return Json(new { Status = true });
        //        else
        //            return Json(new { Status = false, Message = response.ReasonPhrase });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}

        //public JsonResult UpdateReceptionCallingToken(DO_Reception obj)
        //{
        //    try
        //    {
        //        obj.BusinessKey = new AppSessionVariables().GetSessionBusinessKey(HttpContext);
        //        obj.FormID = new AppSessionVariables().GetSessionFormID(HttpContext);
        //        obj.UserID = new AppSessionVariables().GetSessionUserID(HttpContext);
        //        obj.TerminalID = new BaseController().GetIPAddress(HttpContext);

        //        var client = _eSyaWebAPI.InitializeClient(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        //        HttpResponseMessage response = client.PostAsJsonAsync<DO_Reception>("ReceptionK/UpdateReceptionCallingToken", obj).Result;
        //        string respData = response.Content.ReadAsStringAsync().Result;
        //        var rp_app = JsonConvert.DeserializeObject<ReturnParameter>(respData);

        //        if (rp_app.success)
        //            return Json(new { Status = true, QTokenKey = rp_app.Key });
        //        else
        //            return Json(new { Status = false, Message = rp_app.Message });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}

        //public JsonResult UpdateReceptionToCallingNextToken(DO_Reception obj)
        //{
        //    try
        //    {
        //        obj.BusinessKey = new AppSessionVariables().GetSessionBusinessKey(HttpContext);
        //        obj.FormID = new AppSessionVariables().GetSessionFormID(HttpContext);
        //        obj.UserID = new AppSessionVariables().GetSessionUserID(HttpContext);
        //        obj.TerminalID = new BaseController().GetIPAddress(HttpContext);

        //        var client = _eSyaWebAPI.InitializeClient(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        //        HttpResponseMessage response = client.PostAsJsonAsync<DO_Reception>("ReceptionK/UpdateReceptionToCallingNextToken", obj).Result;
        //        string respData = response.Content.ReadAsStringAsync().Result;
        //        var rp_app = JsonConvert.DeserializeObject<ReturnParameter>(respData);

        //        if (rp_app.success)
        //            return Json(new { Status = true, QTokenKey = rp_app.Key });
        //        else
        //            return Json(new { Status = false, Message = rp_app.Message });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}

        //public JsonResult GetTokenDetailForReceptionDisplay(int businessKey)
        //{
        //    try
        //    {
        //        var client = _eSyaWebAPI.InitializeClient(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        //        var parameter = "?businessKey=" + businessKey.ToString();
        //        HttpResponseMessage response = client.GetAsync("ReceptionK/GetTokenDetailForReceptionDisplay" + parameter).Result;
        //        string respData = response.Content.ReadAsStringAsync().Result;

        //        var st = JsonConvert.DeserializeObject<List<DO_Reception>>(respData);
        //        return Json(st);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}

        //public JsonResult GetCallingTokenForReceptionDisplay(int businessKey)
        //{
        //    try
        //    {
        //        var client = _eSyaWebAPI.InitializeClient(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        //        var parameter = "?businessKey=" + businessKey.ToString();
        //        HttpResponseMessage response = client.GetAsync("ReceptionK/GetCallingTokenForReceptionDisplay" + parameter).Result;
        //        string respData = response.Content.ReadAsStringAsync().Result;

        //        var st = JsonConvert.DeserializeObject<List<DO_Reception>>(respData);
        //        return Json(st);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}

        //public JsonResult GetTokenForReceptionDisplay(int businessKey, string arrayofRoomList)
        //{
        //    try
        //    {
        //        var client = _eSyaWebAPI.InitializeClient(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        //        var parameter = "?businessKey=" + businessKey.ToString();
        //        parameter += "&arrayofRoomList=" + arrayofRoomList;
        //        HttpResponseMessage response = client.GetAsync("ReceptionK/GetTokenForReceptionDisplay" + parameter).Result;
        //        string respData = response.Content.ReadAsStringAsync().Result;

        //        var st = JsonConvert.DeserializeObject<List<DO_Reception>>(respData);
        //        return Json(st);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}

        //public JsonResult GetLongWaitingPatients()
        //{
        //    try
        //    {

        //        var client = _eSyaWebAPI.InitializeClient(HttpContext.RequestServices.GetRequiredService<IConfiguration>());
        //        var parameter = "?businessKey=" + new AppSessionVariables().GetSessionBusinessKey(HttpContext).ToString();
        //        HttpResponseMessage response = client.GetAsync("ReceptionK/GetLongWaitingPatients" + parameter).Result;
        //        string respData = response.Content.ReadAsStringAsync().Result;

        //        var st = JsonConvert.DeserializeObject<List<DO_Reception>>(respData);
        //        return Json(st);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }

        //}
            [Area("Egypt")]
            [ServiceFilter(typeof(ViewBagActionFilter))]
            public IActionResult TKM_99_01()
            {
                return View();
            }
        }
}

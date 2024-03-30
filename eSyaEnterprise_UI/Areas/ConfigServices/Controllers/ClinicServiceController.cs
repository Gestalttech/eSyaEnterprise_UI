using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ConfigServices.Data;
using eSyaEnterprise_UI.Areas.ConfigServices.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigServices.Controllers
{
    [SessionTimeout]
    public class ClinicServiceController : Controller
    {
        private readonly IeSyaConfigServicesAPIServices _eSyaConfigServicesAPIServices;
        private readonly ILogger<ClinicServiceController> _logger;
        public ClinicServiceController(IeSyaConfigServicesAPIServices eSyaConfigServicesAPIServices, ILogger<ClinicServiceController> logger)
        {
            _eSyaConfigServicesAPIServices = eSyaConfigServicesAPIServices;
            _logger = logger;
        }

        #region ClinicServiceLink

        /// <summary>
        /// Clinic Service Link
        /// </summary>
        /// <returns></returns>

        [Area("ConfigServices")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EMS_04_00()
        {
            var businessserviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");
            var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_ServiceCode>>("ClinicServices/GetActiveServices");

            if (businessserviceResponse.Status && serviceResponse.Status)
            {
                if (businessserviceResponse.Data != null)
                {
                    ViewBag.BusinessKey = businessserviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.BusinessKey.ToString(),
                        Text = b.LocationDescription,
                    }).ToList();
                }
                if (serviceResponse.Data != null)
                {
                    ViewBag.Services = serviceResponse.Data.Select(s => new SelectListItem
                    {
                        Value = s.ServiceId.ToString(),
                        Text = s.ServiceDesc,
                    }).ToList();
                }
            }
            
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:EMS_04_00:GetActiveServices");
            }

            return View();

        }
        [HttpGet]
        public async Task<ActionResult> GetClinicServiceLinkbyBusinesskey(int businessKey)
        {
            try
            {
                var parameter = "?businessKey=" + businessKey;
                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_MapClinicServiceLink>>("ClinicServices/GetClinicServiceLinkbyBusinesskey" + parameter);
                if (serviceResponse.Status)
                {
                    var ClinicServiceLink_list = serviceResponse.Data;
                    return Json(ClinicServiceLink_list);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetClinicServiceLinkbyBusinesskey:For BusinessKey {0} ", businessKey);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetClinicServiceLinkbyBusinesskey:For BusinessKey {0} ", businessKey);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }
        [HttpPost]
        public async Task<ActionResult> GetClinicbyBusinesskey(int businessKey)
        {
            try
            {
                var parameter = "?businessKey=" + businessKey;
                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("ClinicServices/GetClinicbyBusinesskey"+ parameter);
                var ct_list = new List<DO_ApplicationCodes>();
                if (serviceResponse.Status)
                {
                    ct_list = serviceResponse.Data;
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetClinicbyBusinesskey: businessKey{0}", businessKey);
                }




                return Json(ct_list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:businessKey: businessKey{0}", businessKey);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }




        }
        [HttpPost]
        public async Task<ActionResult> GetConsultationbyClinicIdandBusinesskey(int clinicId, int businessKey)
        {
            try
            {
                var parameter = "?clinicId=" + clinicId + "&businessKey=" + businessKey;

                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("ClinicServices/GetConsultationbyClinicIdandBusinesskey" + parameter);
                var ct_list = new List<DO_ApplicationCodes>();
                if (serviceResponse.Status)
                {
                    ct_list = serviceResponse.Data;
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetConsultationbyClinicIdandBusinesskey: clinicId{0}", clinicId);
                }




                return Json(ct_list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetConsultationbyClinicIdandBusinesskey: clinicId{0}", clinicId);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }




        }
        public async Task<ActionResult> AddClinicServiceLink(DO_MapClinicServiceLink obj)
        {
            try
            {
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ClinicServices/AddClinicServiceLink", obj);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddClinicServiceLink:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddClinicServiceLink:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion
    }
}

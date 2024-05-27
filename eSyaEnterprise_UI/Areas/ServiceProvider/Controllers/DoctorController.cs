using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;
using eSyaEnterprise_UI.Areas.ServiceProvider.Data;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ServiceProvider.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using eSyaEnterprise_UI.Utility;
using eSyaEssentials_UI;
using Newtonsoft.Json;
namespace eSyaEnterprise_UI.Areas.ServiceProvider.Controllers
{
    [SessionTimeout]
    public class DoctorController : Controller
    {
        private readonly ILogger<DoctorController> _logger;
        private readonly IeSyaServiceProviderAPIServices _eSyaServiceProviderAPIServices;
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _appEnvironment;
        public DoctorController(IeSyaServiceProviderAPIServices eSyaServiceProviderAPIServices, ILogger<DoctorController> logger, IWebHostEnvironment hostingEnvironment, IeSyaGatewayServices eSyaGatewayServices, IConfiguration configuration)
        {
            _logger = logger;
            _appEnvironment = hostingEnvironment;
            _eSyaGatewayServices = eSyaGatewayServices;
            _configuration = configuration;
            _eSyaServiceProviderAPIServices = eSyaServiceProviderAPIServices;
        }

        #region Manage Doctor
        [Area("ServiceProvider")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ESP_01_00()
        {
            try
            {
                int Isdcode = _configuration.GetValue<int>("cnf:ISDCode");
                ViewBag.Isdcode = Isdcode;
                List<int> l_codeType = new List<int>();
                l_codeType.Add(ApplicationCodeTypeValues.Gender);
                l_codeType.Add(ApplicationCodeTypeValues.TraiffFrom);
                l_codeType.Add(ApplicationCodeTypeValues.DoctorClass);
                l_codeType.Add(ApplicationCodeTypeValues.DoctorCategory);
                l_codeType.Add(ApplicationCodeTypeValues.SeniorityLevel);
                var serviceresponse = await _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("CommonData/GetApplicationCodesByCodeTypeList", l_codeType);

                if (serviceresponse.Status)
                {


                    List<DO_ApplicationCodes> Gender = serviceresponse.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.Gender).ToList();
                    List<DO_ApplicationCodes> TraiffFrom = serviceresponse.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.TraiffFrom).ToList();
                    List<DO_ApplicationCodes> DoctorClass = serviceresponse.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.DoctorClass).ToList();
                    List<DO_ApplicationCodes> DoctorCategory = serviceresponse.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.DoctorCategory).ToList();
                    List<DO_ApplicationCodes> SeniorityLevel = serviceresponse.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.SeniorityLevel).ToList();

                    ViewBag.GenderList = Gender.Select(a => new SelectListItem
                    {
                        Text = a.CodeDesc,
                        Value = a.ApplicationCode.ToString()
                    });

                    ViewBag.TraiffFromList = TraiffFrom.Select(a => new SelectListItem
                    {
                        Text = a.CodeDesc,
                        Value = a.ApplicationCode.ToString()
                    });
                    ViewBag.DoctorClassList = DoctorClass.Select(a => new SelectListItem
                    {
                        Text = a.CodeDesc,
                        Value = a.ApplicationCode.ToString()
                    });

                    ViewBag.DoctorCategoryList = DoctorCategory.Select(a => new SelectListItem
                    {
                        Text = a.CodeDesc,
                        Value = a.ApplicationCode.ToString()
                    });
                    ViewBag.SeniorityLevelList = SeniorityLevel.Select(a => new SelectListItem
                    {
                        Text = a.CodeDesc,
                        Value = a.ApplicationCode.ToString()
                    });
                }
                else
                {
                    _logger.LogError(new Exception(serviceresponse.Message), "UD:GetApplicationCodesByCodeType:For DoctorClass {0}", ApplicationCodeTypeValues.DoctorClass);
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApplicationCodesByCodeType:For DoctorClass {0}", ApplicationCodeTypeValues.DoctorClass);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #region Doctor Profile
        [Area("ServiceProvider")]
        public IActionResult _DoctorProfile()
        {
            return View();
        }
        /// <summary>
        /// Get Doctor Master List by Prefix
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetDoctorMasterListForPrefix(string doctorNamePrefix)
        {
            try
            {
                if (doctorNamePrefix == null)
                {
                    doctorNamePrefix = "All";
                }
               
                var response =await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_DoctorMaster>>("DoctorMaster/GetDoctorMasterListForPrefix?doctorNamePrefix=" + doctorNamePrefix);
                if (response.Status)
                {
                    return Json(response.Data);
                }
                else
                {
                    return Json(new DO_ReturnParameter()
                    {
                        Status = false,
                        StatusCode = response.StatusCode.ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Get Doctor Master by Doctor ID
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDoctorMaster(int doctorId)
        {
            try
            {
                var response =await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<DO_DoctorMaster>("DoctorMaster/GetDoctorMaster?doctorId=" + doctorId);
                if (response.Status)
                {
                    return Json(response.Data);
                   
                }
                else
                {
                    return Json(new DO_ReturnParameter()
                    {
                        Status = false,
                        StatusCode = response.StatusCode.ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Get Doctor Parameter List by Doctor ID
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDoctorParameterList(int doctorId)
        {
            try
            {
                var response =await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_DoctorParameter>>("DoctorMaster/GetDoctorParameterList?doctorId=" + doctorId);
                return Json(response.Data);

            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Doctor Master
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertDoctorMaster(DO_DoctorMaster obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (obj.l_DoctorParameter.Count > 0)
                {
                    obj.l_DoctorParameter.All(c =>
                    {
                        c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                        c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                        c.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                        return true;
                    });
                }
               
                var serviceresponse =await _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorMaster/InsertIntoDoctorMaster", obj);
                if (serviceresponse.Status)
                    return Json(serviceresponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceresponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertDoctorMaster:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Update Doctor Master
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateDoctorMaster(DO_DoctorMaster obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (obj.l_DoctorParameter.Count > 0)
                {
                    obj.l_DoctorParameter.All(c =>
                    {
                        c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                        c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                        c.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                        return true;
                    });
                }
                var serviceresponse = await _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorMaster/UpdateDoctorMaster", obj);
                if (serviceresponse.Status)
                    return Json(serviceresponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceresponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateDoctorMaster:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Activate or De Activate Doctor
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveDoctor(bool status, int doctorId)
        {

            try
            {

                var parameter = "?status=" + status + "&doctorId=" + doctorId;
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("DoctorMaster/ActiveOrDeActiveDoctor" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveDoctor:For doctorId {0} ", doctorId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion

        #region About Doctor
        [Area("ServiceProvider")]
        public IActionResult _AboutDoctor()
        {
            return View();
        }
        /// <summary>
        /// Get About Doctor details by doctorID
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetAboutDoctorbydoctorId(int doctorId)
        {
            try
            {
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<Do_AboutDoctor>("DoctorMaster/GetAboutDoctorbydoctorId?doctorId=" + doctorId);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAboutDoctorbydoctorId");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAboutDoctorbydoctorId");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Or Update About Doctor Details
        /// </summary>
        //[AutoValidateAntiforgeryToken()]
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateIntoAboutDoctor(Do_AboutDoctor obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorMaster/InsertOrUpdateIntoAboutDoctor", obj);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateIntoAboutDoctor:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateIntoAboutDoctor:params:" + JsonConvert.SerializeObject(obj));
                throw ex;
            }
        }
        #endregion


        #region PhotoAndSignature
        [Area("ServiceProvider")]
        public IActionResult _PhotoAndSignature()
        {
            return View();
        }
        #endregion


        #region Address

        [Area("ServiceProvider")]
        public IActionResult _Address()
        {
            return View();
        }
        #endregion

        #region Statutory Details
        [Area("ServiceProvider")]
        public IActionResult _StatutoryDetails()
        {
            return View();
        }

        #endregion

        #region Business Link
        [Area("ServiceProvider")]
        public IActionResult _BusinessLink()
        {
            return View();
        }
        #endregion


        #region Specialty Link
        [Area("ServiceProvider")]
        public IActionResult _SpecialtyLink()
        {
            return View();

        }
        #endregion

        #region ClinicLink
        [Area("ServiceProvider")]
        public IActionResult _ClinicLink()
        {
            return View();

        }
        #endregion


        #region ConsultationRates
        [Area("ServiceProvider")]
        public IActionResult _ConsultationRates()
        {
            return View();

        }
        #endregion

        #endregion
    }
}

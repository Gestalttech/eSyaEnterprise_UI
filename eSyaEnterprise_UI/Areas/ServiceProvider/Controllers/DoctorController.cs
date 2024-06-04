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
using System.Text;
using System.Text.RegularExpressions;
using eSyaEnterprise_UI.Models;
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
        /// <summary>
        /// Get Doctor Image & Signature 
        /// </summary>
        [HttpPost]
        public JsonResult GetDoctorProfileImagebyDoctorId(int doctorId)
        {
            try
            {
                var response = _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<DO_DoctorImage>("DoctorMaster/GetDoctorProfileImagebyDoctorId?doctorId=" + doctorId).Result;
                if (response.Status)
                {
                   
                    if (response.Data != null)
                    {
                        var resdata = response.Data;

                        string doctorimageURI = string.Empty;
                        string doctorsignURI = string.Empty;
                        if (resdata.DoctorProfileImage != null)
                            doctorimageURI = ConvertByteArraytoImageURI(resdata.DoctorProfileImage);
                        resdata.DoctorProfileTitle = doctorimageURI;

                        if (resdata.DoctorSignatureImage != null)
                            doctorsignURI = ConvertByteArraytoImageURI(resdata.DoctorSignatureImage);
                        resdata.DoctorSignatureTitle = doctorsignURI;
                        return Json(resdata);
                    }
                    else
                    {
                        return Json(response.Data);
                    }
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
        /// Insert Doctor Master
        /// </summary>
        [HttpPost]
        public JsonResult InsertIntoDoctorProfileImage(DO_DoctorImage obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                if (obj.DoctorProfileTitle != null && obj.DoctorSignatureTitle != null)
                {

                    string doctorImagebase64 = obj.DoctorProfileTitle;// load base 64 code to this variable from js 
                    string doctorSignbase64 = obj.DoctorSignatureTitle;// load base 64 code to this variable from js 

                    Byte[] doctorImagebitmapData = new Byte[doctorImagebase64.Length];
                    Byte[] doctorSignbitmapData = new Byte[doctorSignbase64.Length];
                    doctorImagebitmapData = Convert.FromBase64String(FixBase64ForImage(doctorImagebase64));
                    doctorSignbitmapData = Convert.FromBase64String(FixBase64ForImage(doctorSignbase64));
                    if (doctorImagebitmapData.Length > 2 * 1024 * 1024)
                    {
                        return Json(new DO_ReturnParameter() { Status = false, Message = "Doctor Photo file size should be smaller than 2 MB" });
                    }
                    if (doctorSignbitmapData.Length > 2 * 1024 * 1024)
                    {
                        return Json(new DO_ReturnParameter() { Status = false, Message = "Doctor Signature file size should be smaller than 2 MB" });
                    }
                    obj.DoctorProfileImage = doctorImagebitmapData;
                    obj.DoctorSignatureImage = doctorSignbitmapData;
                }
                else
                {
                    byte[] emptyByte = { };
                    obj.DoctorProfileImage = emptyByte;
                    obj.DoctorSignatureImage = emptyByte;
                }
                var serviceresponse = _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorMaster/InsertIntoDoctorProfileImage", obj).Result;
                if (serviceresponse.Status)
                {
                    return Json(serviceresponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceresponse.Message), "UD:InsertIntoDoctorProfileImage:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceresponse.Message });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertIntoDoctorProfileImage:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        public static string FixBase64ForImage(string image)
        {

            var regex = new Regex(@"data:(?<mime>[\w/\-\.]+);(?<encoding>\w+),(?<data>.*)", RegexOptions.Compiled);
            var match = regex.Match(image);
            var mime = match.Groups["mime"].Value;
            var encoding = match.Groups["encoding"].Value;
            var data = match.Groups["data"].Value;
            return data;
        }
        public static string ConvertByteArraytoImageURI(Byte[] image)
        {

            StringBuilder ImageURI = new StringBuilder();
            ImageURI.Append("data:");
            string image_data = Convert.ToBase64String(image);
            string mime = "image/jpeg";
            string encoding = "base64";
            ImageURI.Append(mime);
            ImageURI.Append(";");
            ImageURI.Append(encoding);
            ImageURI.Append(",");
            ImageURI.Append(image_data);
            return Convert.ToString(ImageURI);
        }
        #endregion

        #region Business Link
        [Area("ServiceProvider")]
        public IActionResult _BusinessLink()
        {
            return View();
        }
        /// <summary>
        /// Get Business Location List
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDoctorBusinessLinkList(int doctorId)
        {
            try
            {
                var serviceresponse =await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_DoctorBusinessLink>>("DoctorMaster/GetDoctorBusinessLinkList?doctorId=" + doctorId);
                if (serviceresponse.Status)
                {
                    return Json(serviceresponse.Data);
                }
                else
                {
                    return Json(new DO_ReturnParameter()
                    {
                        Status = false,
                        StatusCode = serviceresponse.StatusCode.ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Doctor Business Link
        /// </summary>
        [HttpPost]
        public JsonResult InsertIntoDoctorBusinessLink(List<DO_DoctorBusinessLink> obj)
        {
            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    return true;
                });

                var serviceresponse = _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorMaster/InsertOrUpdateDoctorBusinessLink", obj).Result;
                return Json(serviceresponse.Data);

            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion

        #region Address

        [Area("ServiceProvider")]
        public IActionResult _Address()
        {
            return View();
        }
        /// <summary>
        /// Get Doctor Linked Business Location DDL
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDoctorLinkWithBusinessLocation(int doctorId)
        {
            try
            {
                var response =await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_DoctorBusinessLink>>("DoctorMaster/GetDoctorLinkWithBusinessLocation?doctorId=" + doctorId);
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
        /// Get ISD Code by Business key.
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetISDCodesbyBusinessKey(int businessKey)
        {
            try
            {
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_CountryISDCodes>>("DoctorMaster/GetISDCodesbyBusinessKey?businessKey=" + businessKey);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data.Count > 0)
                    {
                        foreach (var i in serviceResponse.Data)
                        {

                            //i.CountryName = "<div  style=\"float: left;\"><img src='" + this.Request.PathBase + '/' + i.CountryFlag + "'/></div>" + '(' + '+' + i.Isdcode + ')' + i.CountryName;
                            i.CountryFlag = this.Request.PathBase + "/" +i.CountryFlag;
                            i.CountryName = i.CountryName;
                            i.Isdcode = i.Isdcode;

                        }
                        var res = serviceResponse.Data.GroupBy(x => x.Isdcode).Select(y => y.First()).Distinct();
                        return Json(res);

                    }
                    else
                    {
                        return Json(serviceResponse.Data);
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetISDCodesbyBusinessKey:For businessKey ", businessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetISDCodesbyBusinessKey:For isdCode ", businessKey);
                throw ex;
            }
        }
        /// <summary>
        /// Get States by ISD Code.
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetStatesbyIsdCode(int Isdcode)
        {
            try
            {
                var parameter = "?Isdcode=" + Isdcode;
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_DoctorProfileAddress>>("DoctorMaster/GetStatesbyIsdCode" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStatesbyIsdCode:For isdCode ", Isdcode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetStatesbyIsdCode:For isdCode ", Isdcode);
                throw ex;
            }
        }

        /// <summary>
        /// Get City List by isdCode and stateCode.
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetCitiesbyStateCode(int Isdcode, int statecode)
        {
            try
            {
                var parameter = "?Isdcode=" + Isdcode + "&statecode=" + statecode;
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_DoctorProfileAddress>>("DoctorMaster/GetCitiesbyStateCode" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCitiesbyStateCode:For isdCode {0} with stateCode entered {1}", Isdcode, statecode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetCitiesbyStateCode:For isdCode {0} with stateCode entered {1}", Isdcode, statecode);
                throw ex;
            }
        }


        [HttpGet]
        public async Task<JsonResult> GetZipDescriptionbyCityCode(int Isdcode, int statecode, int citycode)
        {
            try
            {
                var parameter = "?Isdcode=" + Isdcode + "&statecode=" + statecode + "&citycode=" + citycode;
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_DoctorProfileAddress>>("DoctorMaster/GetZipDescriptionbyCityCode" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetZipDescriptionbyCityCode:For isdCode {0} with stateCode entered {1}", Isdcode, statecode, citycode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetZipDescriptionbyCityCode:For isdCode {0} with stateCode entered {1}", Isdcode, statecode, citycode);
                throw ex;
            }
        }


        /// <summary>
        /// Get Area  details and Zip Code by Serial Number
        /// UI Reffered - Doctor Profile Master
        [HttpGet]
        public async Task<JsonResult> GetZipCodeAndArea(int Isdcode, string zipcode)
        {
            try
            {
                var parameter = "?Isdcode=" + Isdcode + "&zipcode=" + zipcode;
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_DoctorProfileAddress>>("DoctorMaster/GetZipCodeAndArea" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetZipCodeAndArea:For isdCode {0} with stateCode entered {1}", Isdcode, zipcode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetZipCodeAndArea:For isdCode {0} with stateCode entered {1}", Isdcode, zipcode);
                throw ex;
            }
        }
        /// <summary>
        /// Get Doctor Area details for select by default dropdown values based on  pincode Text box
        /// UI Reffered - Doctor Profile Master
        [HttpGet]
        public async Task<JsonResult> FillCoumbosbyZipCode(int Isdcode, string zipcode)
        {
            try
            {
                var parameter = "?Isdcode=" + Isdcode + "&zipcode=" + zipcode;
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<DO_DoctorProfileAddress>("DoctorMaster/FillCoumbosbyZipCode" + parameter);
                if (serviceResponse.Status)
                {

                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:FillCoumbosbyZipCode:For isdCode {0} with stateCode cityCode pincode entered {1} ", Isdcode, zipcode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAreaDetailsbyPincode:For isdCode {0} with  pincode entered {1} }", Isdcode, zipcode);
                throw ex;
            }
        }

        /// <summary>
        /// Get Business Address by businessKey.
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetDoctorAddressDoctorId(int doctorId)
        {
            try
            {
                //var parameter = "?Isdcode=" + Isdcode + "&doctorId=" + doctorId + "&businesskey=" + AppSessionVariables.GetSessionBusinessKey(HttpContext);

                var parameter = "?doctorId=" + doctorId;

                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<DO_DoctorProfileAddress>("DoctorMaster/GetDoctorAddressDoctorId" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDoctorAddressDoctorId:For doctorId ");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDoctorAddressDoctorId:For doctorId ");
                throw ex;
            }
        }

        /// <summary>
        /// Insert or Update Business Address
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateIntoDoctorProfileAddress(DO_DoctorProfileAddress obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorMaster/InsertOrUpdateIntoDoctorProfileAddress", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateIntoDoctorProfileAddress:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion

        #region Statutory Details
        [Area("ServiceProvider")]
        public IActionResult _StatutoryDetails()
        {
            return View();
        }
        /// <summary>
        ///Get Doctor Statutory details by IsdCode
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDoctorStatutoryDetails(int doctorId, int isdCode)
        {
            try
            {
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_DoctorStatutoryDetails>>("DoctorMaster/GetDoctorStatutoryDetails?doctorId=" + doctorId + "&isdCode=" + isdCode);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDoctorStatutoryDetails:For doctorId {0} and ISDCode {1}", doctorId, isdCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDoctorStatutoryDetails:For BusinessKey {0} and ISDCode {1}", doctorId, isdCode);
                throw ex;
            }
        }

        /// <summary>
        /// Insert Into Doctor Statutory details
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateDoctorStatutoryDetails(List<DO_DoctorStatutoryDetails> obj)
        {
            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();
                    return true;
                });

                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorMaster/InsertOrUpdateDoctorStatutoryDetails", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateDoctorStatutoryDetails:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateDoctorStatutoryDetails:params:" + JsonConvert.SerializeObject(obj));
                throw ex;
            }
        }

        /// <summary>
        /// Get ISD Code by Doctor Id.
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetISDCodesbyDoctorId(int doctorId)
        {
            try
            {
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_CountryISDCodes>>("DoctorMaster/GetISDCodesbyDoctorId?doctorId=" + doctorId);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data.Count > 0)
                    {
                        foreach (var i in serviceResponse.Data)
                        {
                            //i.CountryName = "<div  style=\"float: left;\"><img src='" + this.Request.PathBase + '/' + i.CountryFlag + "'/></div>" + '(' + '+' + i.Isdcode + ')' + i.CountryName;

                            //i.DomainName = this.Request.PathBase;
                            i.CountryFlag = this.Request.PathBase + "/" + i.CountryFlag;
                            i.CountryName = i.CountryName;
                            i.Isdcode = i.Isdcode;
                        }
                        return Json(serviceResponse.Data);

                    }
                    else
                    {
                        return Json(serviceResponse.Data);
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetISDCodesbyDoctorId:For DoctorId ", doctorId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetISDCodesbyDoctorId:For DoctorId ", doctorId);
                throw ex;
            }
        }

      

        #endregion

        #region Specialty Link
        [Area("ServiceProvider")]
        public IActionResult _SpecialtyLink()
        {
            return View();

        }
        /// <summary>
        /// Get Specialty List From Specialty Business Link
        /// </summary>
       
        [HttpPost]
        public async Task<JsonResult> GetSpecialtyListForBusinessKey(int businessKey)
        {
            try
            {
                var response =await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyDoctorLink>>("DoctorMaster/GetSpecialtyListForBusinessKey?businessKey=" + businessKey);
                return Json(response.Data);

            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Get Business Location List
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetSpecialtyListByDoctorId(int doctorId)
        {
            try
            {
                var response =await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyDoctorLink>>("DoctorMaster/GetSpecialtyListByDoctorId?doctorId=" + doctorId);
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
        /// Insert Specialty Link
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertDoctorSpecialtyLink(DO_SpecialtyDoctorLink obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var Insertresponse =await _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorMaster/InsertDoctorSpecialtyLink", obj);
                return Json(Insertresponse.Data);

            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Specialty Link
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateDoctorSpecialtyLink(DO_SpecialtyDoctorLink obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var Insertresponse =await _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorMaster/UpdateDoctorSpecialtyLink", obj);
                return Json(Insertresponse.Data);

            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        #endregion

        #region ClinicLink
        [Area("ServiceProvider")]
        public IActionResult _ClinicLink()
        {
            return View();

        }
        /// <summary>
        /// Get Specialty List
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetSpecialtyListByBKeyDoctorId(int businessKey, int doctorId)
        {
            try
            {
                var response =await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyDoctorLink>>("DoctorMaster/GetSpecialtyListByBKeyDoctorId?businessKey=" + businessKey + "&doctorId=" + doctorId);
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

        [Produces("application/json")]
        [HttpGet]
        public async Task<JsonResult> GetClinicConsultantTreeList(int businessKey, int specialtyId, int doctorId)
        {
            try
            {
                List<jsTreeObject> ClinicConsultantTree = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "CL0",
                    parent = "#",
                    text = "Clinics",
                    //icon = "/images/jsTree/foldergroupicon.png",
                    state = new stateObject { opened = true, selected = false, checkbox_disabled = true, disabled = true }
                };
                ClinicConsultantTree.Add(jsObj);

                var clinicResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_DoctorClinic>>("DoctorMaster/GetDoctorClinicLinkList?businessKey=" + businessKey + "&specialtyId=" + specialtyId + "&doctorId=" + doctorId);
                if (clinicResponse.Status)
                {
                    if (clinicResponse.Data != null)
                    {
                        List<DO_OPClinic> clinic_list = clinicResponse.Data.Select(x => new DO_OPClinic { ConsultationId = x.ConsultationId, ConsultationDesc = x.ConsultationDesc }).GroupBy(y => y.ConsultationId, (key, grp) => grp.FirstOrDefault()).ToList();
                        foreach (DO_OPClinic cl in clinic_list)
                        {
                            jsObj = new jsTreeObject
                            {
                                id = cl.ConsultationId.ToString(),
                                text = cl.ConsultationDesc.ToString(),
                                //icon = "/images/jsTree/openfolder.png",
                                parent = "CL0",
                                state = new stateObject { opened = true, selected = false, checkbox_disabled = true, disabled = true },
                            };
                            ClinicConsultantTree.Add(jsObj);
                        }

                        var conusltant_list = clinicResponse.Data;
                        foreach (var co in conusltant_list.Where(w => conusltant_list.Any(f => f.ConsultationId == w.ConsultationId)))
                        {
                            jsObj = new jsTreeObject
                            {
                                text = co.ClinicDesc,
                                parent = co.ConsultationId.ToString()

                            };
                            if (co.BusinessKey > 0)
                            {
                                jsObj.id = co.ConsultationId.ToString() + "_" + "Y" + "_" + co.ClinicId;
                                //jsObj.icon = "/images/jsTree/checkedstate.jpg";
                                if (co.ActiveStatus)
                                    jsObj.state = new stateObject { opened = true, selected = true, Checked = true };
                                else
                                    jsObj.state = new stateObject { opened = true, selected = false, Checked = false };
                            }
                            else
                            {
                                jsObj.id = co.ConsultationId.ToString() + "_" + "N" + "_" + co.ClinicId;
                                //jsObj.icon = "/images/jsTree/fileIcon.png";
                                jsObj.state = new stateObject { opened = true, selected = false, Checked = false };
                            }

                            ClinicConsultantTree.Add(jsObj);
                        }
                    }

                    return Json(ClinicConsultantTree);
                }
                else
                {
                    _logger.LogError(new Exception(clinicResponse.Message), "UD:GetClinicConsultantTreeList:For BusinessId {0} , SpecialtyId {1} and DoctorId entered {2}", businessKey, specialtyId, doctorId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetClinicConsultantTreeList:For BusinessId {0} , SpecialtyId {1} and DoctorId entered {2}", businessKey, specialtyId, doctorId);
                throw ex;
            }
        }

        /// <summary>
        /// Insert / Update Doctor Clinic
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertUpdateDoctorClinicLink(List<DO_DoctorClinic> do_cl)
        {
            try
            {
                do_cl.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    return true;
                });

                var Insertresponse = await _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorMaster/InsertUpdateDoctorClinicLink", do_cl);
                if (Insertresponse.Status)
                    return Json(Insertresponse.Data);
                else
                {
                    _logger.LogError(new Exception(Insertresponse.Message), "UD:InsertUpdateDoctorClinicLink:params:" + JsonConvert.SerializeObject(do_cl));
                    return Json(new DO_ReturnParameter() { Status = false, Message = Insertresponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertUpdateDoctorClinicLink:params:" + JsonConvert.SerializeObject(do_cl));
                throw ex;
            }
        }
        #endregion


        //#region ConsultationRates
        //[Area("ServiceProvider")]
        //public IActionResult _ConsultationRates()
        //{
        //    return View();

        //}
        //#endregion

        #endregion
    }
}

using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.EndUser.Data;
using eSyaEnterprise_UI.Areas.EndUser.Models;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using eSyaEnterprise_UI.Models;
using System.Text.RegularExpressions;
using System.Text;

namespace eSyaEnterprise_UI.Areas.EndUser.Controllers
{
    [SessionTimeout]
    public class eSignatureController : Controller
    {
        private readonly IeSyaEndUserAPIServices _eSyaEndUserAPIServices;
        private readonly ILogger<eSignatureController> _logger;
        public eSignatureController(IeSyaEndUserAPIServices eSyaEndUserAPIServices, ILogger<eSignatureController> logger)
        {
            _eSyaEndUserAPIServices = eSyaEndUserAPIServices;

            _logger = logger;
        }
        #region eSignature
        [Area("EndUser")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EEU_08_00()
        {
            return View();
        }

        /// <summary>
        ///Get User Master Details
        /// </summary>

        [HttpGet]
        public async Task<JsonResult> GetActiveUsersforSignature()
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_eSignature>>("eSignature/GetActiveUsersforSignature");

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;

                        //string userimageURI = string.Empty;
                        foreach (var u in data)
                        {
                            string userimageURI = string.Empty;

                            if (u.ESignature.Length != 0)
                                userimageURI = ConvertByteArraytoImageURI(u.ESignature);
                            u.usersignature = userimageURI;
                        }

                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveUsersforSignature");
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveUsersforSignature");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveUsersforSignature");
                throw ex;
            }
        }

        /// <summary>
        /// Upload Photo to User Master
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateUsereSignature(DO_eSignature obj, string file)
        {
            try
            {


                obj.CreatedBy = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID= AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (file != null)
                {

                    string userbase64 = file;// load base 64 code to this variable from js 
                    Byte[] userbitmapData = new Byte[userbase64.Length];
                    userbitmapData = Convert.FromBase64String(FixBase64ForImage(userbase64));
                    if (userbitmapData.Length > 2 * 1024 * 1024)
                    {
                        return Json(new DO_ReturnParameter() { Status = false, Message = "User Photo file size should be smaller than 2 MB" });
                    }

                    obj.ESignature = userbitmapData;
                }
                else
                {
                    byte[] emptyByte = { };
                    obj.ESignature = emptyByte;
                }



                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("eSignature/InsertOrUpdateUsereSignature", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateUsereSignature:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }





            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateUsereSignature:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        /// <summary>
        ///Get Photo by UserID
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetUsereSignaturebyUserID(int UserID)
        {
            try
            {
                var parameter = "?UserID=" + UserID;
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<DO_eSignature>("eSignature/GetUsereSignaturebyUserID" + parameter);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;

                        string userimageURI = string.Empty;
                        if (data.ESignature.Length != 0)
                            userimageURI = ConvertByteArraytoImageURI(data.ESignature);
                        data.usersignature = userimageURI;
                        return Json(data);
                    }
                    else
                    {
                        return Json(serviceResponse.Data);
                    }
                    
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUsereSignaturebyUserID:For UserID {0}", UserID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUsereSignaturebyUserID:For UserID {0}", UserID);
                throw ex;
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
    }
}

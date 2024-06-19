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
    public class PhotoController : Controller
    {
        private readonly IeSyaEndUserAPIServices _eSyaEndUserAPIServices;
        private readonly ILogger<PhotoController> _logger;
        public PhotoController(IeSyaEndUserAPIServices eSyaEndUserAPIServices, ILogger<PhotoController> logger)
        {
            _eSyaEndUserAPIServices = eSyaEndUserAPIServices;

            _logger = logger;
        }
        #region  UploadUser photo
        [Area("EndUser")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EEU_07_00()
        {
            return View();
        }

        /// <summary>
        ///Get User Master Details
        /// </summary>
      
        [HttpGet]
        public async Task<JsonResult> GetActiveUsersforPhoto()
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserMaster>>("UserCreation/GetActiveUsersforPhoto");

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;

                        //string userimageURI = string.Empty;
                        foreach (var u in data)
                        {
                            string userimageURI = string.Empty;

                            if (u.Photo.Length != 0)
                                userimageURI = ConvertByteArraytoImageURI(u.Photo);
                            u.userimage = userimageURI;
                        }
                        
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveUsersforPhoto");
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveUsersforPhoto");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveUsersforPhoto");
                throw ex;
            }
        }

        /// <summary>
        /// Upload Photo to User Master
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UploadUserPhoto(DO_UserPhoto obj, string file)
        {
            try
            {


                obj.CreatedBy = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                if (file != null)
                {

                    string userbase64 = file;// load base 64 code to this variable from js 
                    Byte[] userbitmapData = new Byte[userbase64.Length];
                    userbitmapData = Convert.FromBase64String(FixBase64ForImage(userbase64));
                    if (userbitmapData.Length > 2 * 1024 * 1024)
                    {
                        return Json(new DO_ReturnParameter() { Status = false, Message = "User Photo file size should be smaller than 2 MB" });
                    }

                    obj.Photo = userbitmapData;
                }
                else
                {
                    byte[] emptyByte = { };
                    obj.Photo = emptyByte;
                }


                
                    var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/UploadUserPhoto", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:UploadUserPhoto:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                
                



            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UploadUserPhoto:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        /// <summary>
        ///Get Photo by UserID
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetUserPhotobyUserID(int UserID)
        {
            try
            {
                var parameter = "?UserID=" + UserID;
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<DO_UserPhoto>("UserCreation/GetUserPhotobyUserID" + parameter);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;

                        string userimageURI = string.Empty;
                        if (data.Photo.Length != 0)
                            userimageURI = ConvertByteArraytoImageURI(data.Photo);
                        data.userimage = userimageURI;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserPhotobyUserID:For UserID {0}", UserID);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserPhotobyUserID:For UserID {0}", UserID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUserPhotobyUserID:For UserID {0}", UserID);
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

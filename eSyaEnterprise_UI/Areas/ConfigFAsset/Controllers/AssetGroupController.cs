using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigFAsset.Data;
using eSyaEnterprise_UI.Areas.ConfigFAsset.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigFAsset.Controllers
{
   
    [SessionTimeout]
    public class AssetGroupController : Controller
    {
        private readonly IeSyFixedAssetAPIServices _eSyFixedAssetAPIServices;
        private readonly ILogger<AssetGroupController> _logger;

        public AssetGroupController(IeSyFixedAssetAPIServices eSyFixedAssetAPIServices, ILogger<AssetGroupController> logger)
        {
            _eSyFixedAssetAPIServices = eSyFixedAssetAPIServices;
            _logger = logger;
        }

        #region Define Asset Groups
        [Area("ConfigFAsset")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EFC_01_00()
        {
            return View();
        }
        [HttpGet]
        public async Task<JsonResult> GetFixedAssetGroup()
        {
            try
            {
                var serviceResponse = await _eSyFixedAssetAPIServices.HttpClientServices.GetAsync<List<DO_ConfigFixedAssetGroup>>("AssetGroup/GetFixedAssetGroup");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetFixedAssetGroup");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetFixedAssetGroup");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetFixedAssetSubGroup()
        {
            try
            {
                var serviceResponse = await _eSyFixedAssetAPIServices.HttpClientServices.GetAsync<List<DO_ConfigFixedAssetGroup>>("AssetGroup/GetFixedAssetSubGroup");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetFixedAssetSubGroup");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetFixedAssetSubGroup");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        [HttpPost]
        public async Task<JsonResult> InsertIntoFixedAssetGroup(DO_ConfigFixedAssetGroup obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();
                var serviceResponse = await _eSyFixedAssetAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("AssetGroup/InsertIntoFixedAssetGroup", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertIntoFixedAssetGroup:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
    }
}

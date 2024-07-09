using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ConfigFAsset.Data;
using eSyaEnterprise_UI.Areas.ConfigFAsset.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigFAsset.Controllers
{
    [SessionTimeout]
    public class DepreciationController : Controller
    {
        private readonly IeSyFixedAssetAPIServices _eSyFixedAssetAPIServices;
        private readonly ILogger<DepreciationController> _logger;

        public DepreciationController(IeSyFixedAssetAPIServices eSyFixedAssetAPIServices, ILogger<DepreciationController> logger)
        {
            _eSyFixedAssetAPIServices = eSyFixedAssetAPIServices;
            _logger = logger;
        }
        [Area("ConfigFAsset")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EFC_03_00()
        {

            //int businesskey=AppSessionVariables.GetSessionBusinessKey(HttpContext); 

            int businesskey = 11;

            var DepreciationResponse = await _eSyFixedAssetAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("CommonData/GetApplicationCodesByCodeType?codeType="+ ApplicationCodeTypeValues.DepreciationMethod);
            var IsdcodeResponse = await _eSyFixedAssetAPIServices.HttpClientServices.GetAsync<List<DO_ISDCodes>>("AssetDepreciation/GetISDCodesbyBusinesskey?businesskey=" + businesskey);
            var AssetResponse = await _eSyFixedAssetAPIServices.HttpClientServices.GetAsync<List<DO_ConfigFixedAssetGroup>>("AssetDepreciation/GetActiveFixedAssetGroup");

            if (DepreciationResponse.Status && IsdcodeResponse.Status && AssetResponse.Status)
            {
                ViewBag.DeprMethodsList = DepreciationResponse.Data.Select(b => new SelectListItem
                {
                    Value = b.ApplicationCode.ToString(),
                    Text = b.CodeDesc,
                }).ToList();
                ViewBag.AssetGroupList = AssetResponse.Data.Select(b => new SelectListItem
                {
                    Value = b.AssetGroup.ToString(),
                    Text = b.AssetGroupDesc,
                }).ToList();

                ViewBag.DomainName = this.Request.PathBase;
                ViewBag.ISDCodes = IsdcodeResponse.Data;
                 

                return View();
            }
            else
            {
                _logger.LogError(new Exception(DepreciationResponse.Message), "UD:GetApplicationCodesByCodeType");
                 return View();
            }
            

           
        }

        [HttpPost]
        public async Task<JsonResult> GetActiveFixedAssetSubGroupbyGroupId(int groupId)
        {

            try
            {
                var parameter = "?groupId=" + groupId;
                var serviceResponse = await _eSyFixedAssetAPIServices.HttpClientServices.GetAsync<List<DO_ConfigFixedAssetGroup>>("AssetDepreciation/GetActiveFixedAssetSubGroupbyGroupId" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveFixedAssetSubGroupbyGroupId:For groupId {0}", groupId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveFixedAssetSubGroupbyGroupId:For groupId {0} ", groupId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        [HttpPost]
        public async Task<JsonResult> GetDepreciationMethodbyISDCode(int ISDCode)
        {

            try
            {
                var parameter = "?ISDCode=" + ISDCode;
                var serviceResponse = await _eSyFixedAssetAPIServices.HttpClientServices.GetAsync<List<DO_DepreciationMethod>>("AssetDepreciation/GetDepreciationMethodbyISDCode" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDepreciationMethodbyISDCode:For ISDCode {0}", ISDCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDepreciationMethodbyISDCode:For ISDCode {0} ", ISDCode);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateDepreciationMethod(DO_DepreciationMethod obj)
        {

            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

               
                    var serviceResponse = await _eSyFixedAssetAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("AssetDepreciation/InsertOrUpdateDepreciationMethod", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                

                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateDepreciationMethod:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveDepreciationMethod(bool status, DO_DepreciationMethod obj)
        {

            try
            {
                obj.status = status;
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);


                var serviceResponse = await _eSyFixedAssetAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("AssetDepreciation/ActiveOrDeActiveDepreciationMethod", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });



            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveDepreciationMethod:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
    }
}

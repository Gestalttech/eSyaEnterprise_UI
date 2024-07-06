using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigFin.Data;
using eSyaEnterprise_UI.Areas.ConfigFin.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigFin.Controllers
{
    [SessionTimeout]
    public class AccountGroupController : Controller
    {
        private readonly IeSyaFinanceAPIServices _eSyaFinanceAPIServices;
        private readonly ILogger<AccountGroupController> _logger;
        public AccountGroupController(IeSyaFinanceAPIServices eSyaFinanceAPIServices, ILogger<AccountGroupController> logger)
        {
            _eSyaFinanceAPIServices = eSyaFinanceAPIServices;
            _logger = logger;
        }
        [Area("ConfigFin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EAC_03_00()
        {

            var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.GetAsync<List<DO_BookType>>("AccountGroup/GetActiveBookTypes");
            if (serviceResponse.Status)
            {
                ViewBag.BookTypeList = serviceResponse.Data.Select(b => new SelectListItem
                {
                    Value = b.BookType.ToString(),
                    Text = b.BookTypeDesc,
                }).ToList();

                return View();
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveBookTypes");
                return Json(new { Status = false, StatusCode = "500" });
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetAccountGroupsforTreeview()
        {
            try
            {
                List<jsTreeObject> treeView = new List<jsTreeObject>();
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "s";
                jsObj.parent = "#";
                jsObj.text = "Account Group";
                jsObj.icon = baseURL + "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);

                var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.GetAsync<List<DO_AccountGroup>>("AccountGroup/GetAccountGroupsforTreeview");
                if (serviceResponse.Status)
                {
                    
                    foreach (DO_AccountGroup obj in serviceResponse.Data)
                    {
                        jsObj = new jsTreeObject();
                        jsObj.id = obj.GroupCode;
                        jsObj.text = obj.GroupDesc;
                        jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                        if (obj.ParentId == "A" || obj.ParentId == "E" || obj.ParentId == "L" || obj.ParentId == "I")
                        {
                            jsObj.parent = "s";
                        }
                        else
                        {
                            jsObj.parent = obj.ParentId;
                        }

                        jsObj.GroupIndex = obj.GroupIndex.ToString();
                        treeView.Add(jsObj);
                    }



                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAccountGroupsforTreeview");
                }

                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAccountGroupsforTreeview");
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }
        [HttpPost]
        public async Task<ActionResult> InsertIntoAccountGroup(DO_AccountGroup obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);


                var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("AccountGroup/InsertIntoAccountGroup", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:InsertIntoAccountGroup:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertIntoAccountGroup:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertIntoAccountGroup:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
    }
}

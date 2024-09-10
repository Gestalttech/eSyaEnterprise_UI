using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Areas.ViewAdmin.Data;
using eSyaEnterprise_UI.Areas.ViewAdmin.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using eSyaEnterprise_UI.ApplicationCodeTypes;

namespace eSyaEnterprise_UI.Areas.ViewAdmin.Controllers
{
    [SessionTimeout]
    public class ApproverController : Controller
    {
        private readonly IeSyaViewAdminAPIServices _eSyaViewAdminAPIServices;
        private readonly ILogger<ApproverController> _logger;
        public ApproverController(IeSyaViewAdminAPIServices eSyaEndUserAPIServices, ILogger<ApproverController> logger)
        {
            _eSyaViewAdminAPIServices = eSyaEndUserAPIServices;
            _logger = logger;
        }

        [Area("ViewAdmin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EAP_02_00()
        {
            var serviceResponse = await _eSyaViewAdminAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");
            if (serviceResponse.Status)
            {
                ViewBag.BusinessKeyList = serviceResponse.Data.Select(b => new SelectListItem
                {
                    Value = b.BusinessKey.ToString(),
                    Text = b.LocationDescription,
                }).ToList();
                return View();
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessKey");
                return View();
            }
        }

        /// <summary>
        ///Get Form List for Approval
        /// </summary>
        [Area("ViewAdmin")]
        [HttpPost]
        public async Task<JsonResult> GetApprovedFormsbyBusinesskey(int Businesskey)
        {

            try
            {
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                List<jsTreeObject> treeView = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "FM",
                    parent = "#",
                    text = "Approver Forms",
                    icon = baseURL + "/images/jsTree/foldergroupicon.png",
                    state = new stateObject { opened = true, selected = false }
                };
                treeView.Add(jsObj);

                var serviceResponse = await _eSyaViewAdminAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("Approver/GetApprovedFormsbyBusinesskey?Businesskey="+ Businesskey);

                if (serviceResponse.Status)
                {
                    foreach (var fm in serviceResponse.Data)
                    {
                        jsObj = new jsTreeObject
                        {
                            id = fm.FormID.ToString(),
                            text = fm.FormCode.ToString() + '.' + fm.FormName,
                            icon = baseURL + "/images/jsTree/openfolder.png",
                            parent = "FM"
                        };
                        treeView.Add(jsObj);
                    }
                    return Json(treeView);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetApprovedFormsbyBusinesskey");
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApprovedFormsbyBusinesskey");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        [Area("ViewAdmin")]
        [HttpPost]
        public async Task<JsonResult> GetApproverUsresbyBusinesskey(int Businesskey, int FormID)
        {
            try
            {
                var parameter = "?Businesskey=" + Businesskey +
                    "&FormID=" + FormID ;
                var serviceResponse = await _eSyaViewAdminAPIServices.HttpClientServices.GetAsync<List<DO_Approver>>("Approver/GetApproverUsresbyBusinesskey" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetApproverUsresbyBusinesskey");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApproverUsresbyBusinesskey");
                throw;
            }
        }
    }
}

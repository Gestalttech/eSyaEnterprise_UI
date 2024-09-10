using eSyaEnterprise_UI.ActionFilter;

using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using eSyaEnterprise_UI.Areas.ViewAdmin.Data;

using Microsoft.AspNetCore.Mvc;
using eSyaEnterprise_UI.Areas.Approval.Models;

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
            var serviceresponse = await _eSyaViewAdminAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");
            if (serviceresponse.Status)
            {
                if (serviceresponse.Data != null)
                {
                    ViewBag.Businesskeys = serviceresponse.Data;
                    return View();
                }
                else
                {
                    _logger.LogError(new Exception(serviceresponse.Message), "UD:GetBusinessKey");
                    return View();
                }
            }
            else
            {
                    _logger.LogError(new Exception(serviceresponse.Message), "UD:GetBusinessKey");
                    return View();
            }
        }

        /// <summary>
        ///Get Form List for Approval
        /// </summary>
        [Area("Approval")]
        [HttpPost]
        public async Task<JsonResult> GetFormsForApproval()
        {

            try
            {
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                List<jsTreeObject> treeView = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "FM",
                    parent = "#",
                    text = "eSya Forms",
                    icon = baseURL + "/images/jsTree/foldergroupicon.png",
                    state = new stateObject { opened = true, selected = false }
                };
                treeView.Add(jsObj);

                var serviceResponse = await _eSyaViewAdminAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("Process/GetFormsForApproval");

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
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetFormsForApproval");
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetFormsForApproval");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
    }
}

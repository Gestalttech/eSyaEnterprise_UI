using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ManageInventory.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using eSyaEnterprise_UI.Areas.ManageInventory.Models;
using eSyaEnterprise_UI.Models;
using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.ManageInventory.Controllers
{
    [SessionTimeout]
    public class ItemController : Controller
    {
        private readonly IeSyaInventoryAPIServices _eSyaInventoryAPIServices;
        private readonly ILogger<ItemController> _logger;

        public ItemController(IeSyaInventoryAPIServices eSyainventoryAPIServices, ILogger<ItemController> logger)
        {
            _eSyaInventoryAPIServices = eSyainventoryAPIServices;
            _logger = logger;
        }

        #region Service Item Link
        [Area("ManageInventory")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EMI_03_00()
        {
            var responseBk = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("Common/GetBusinessKey");
            var responseSC = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_Services>>("Common/GetServiceClass");
            if (responseBk.Status && responseSC.Status)
            {
                if (responseBk.Data != null)
                {
                    ViewBag.BusinessKeyList = responseBk.Data.Select(a => new SelectListItem
                    {
                        Text = a.LocationDescription,
                        Value = a.BusinessKey.ToString()
                    });
                }

                if (responseSC.Data != null)
                {
                    ViewBag.ServiceClassList = responseSC.Data.Select(a => new SelectListItem
                    {
                        Text = a.ServiceClassDesc,
                        Value = a.ServiceClassId.ToString()
                    });
                }
            }

            ViewBag.formName = "Service Item Link";
            return View();
        }

        /// <summary>
        ///Get Services for Tree View
        /// </summary>
        [HttpPost]
        public IActionResult GetServiceItemLinkTree(int BusinessKey, int ServiceClassId)
        {
            try
            {
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                List<jsTreeObject> treeView = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "FM",
                    parent = "#",
                    text = "Services",
                    icon = baseURL + "/images/jsTree/foldergroupicon.png",
                    state = new stateObject { opened = true, selected = false }
                };
                treeView.Add(jsObj);

                if (BusinessKey == 0 && ServiceClassId == 0)
                    return Json(treeView);

                var parameter = "?BusinessKey=" + BusinessKey + "&ServiceClassId=" + ServiceClassId;
                var serviceResponse = _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_Services>>("Common/GetServices" + parameter).Result;

                if (serviceResponse.Status)
                {
                    foreach (var fm in serviceResponse.Data)
                    {
                        jsObj = new jsTreeObject
                        {
                            id = fm.ServiceId.ToString(),
                            text = fm.ServiceDesc.ToString(),
                            icon = baseURL + "/images/jsTree/openfolder.png",
                            parent = "FM"
                        };
                        treeView.Add(jsObj);
                    }
                    return Json(treeView);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceItemLinkTree:For BusinessKey {0} With ServiceClass {1}", BusinessKey, ServiceClassId);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceItemLinkTree:For BusinessKey {0} With ServiceClass {1}", BusinessKey, ServiceClassId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        #endregion
    }
}

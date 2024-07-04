using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigFin.Data;
using eSyaEnterprise_UI.Areas.ConfigFin.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics.Metrics;

namespace eSyaEnterprise_UI.Areas.ConfigFin.Controllers
{
    [SessionTimeout]
    public class VoucherTypeController : Controller
    {
        private readonly IeSyaFinanceAPIServices _eSyaFinanceAPIServices;
        private readonly ILogger<VoucherTypeController> _logger;
        public VoucherTypeController(IeSyaFinanceAPIServices eSyaFinanceAPIServices, ILogger<VoucherTypeController> logger)
        {
            _eSyaFinanceAPIServices = eSyaFinanceAPIServices;
            _logger = logger;
        }
        [Area("ConfigFin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EAC_02_00()
        {
            //ViewBag.UserFormRole = new DO_UserFormRole
            //{
            //    IsInsert = true,
            //    IsEdit = true,
            //    IsDelete = true,
            //    IsView = true
            //};
            return View();
        }
        [Produces("application/json")]
        [HttpGet]
        public async Task<ActionResult> GetActiveBookTypes()
        {
            try
            {
                List<jsTreeObject> treeView = new List<jsTreeObject>();
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "VT";
                jsObj.parent = "#";
                jsObj.text = "Book Types";
                jsObj.icon = baseURL + "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);

                var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.GetAsync<List<DO_BookType>>("VoucherType/GetActiveBookTypes");
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var st_list = serviceResponse.Data;
                        foreach (var it in st_list)
                        {
                            jsObj = new jsTreeObject();
                            jsObj.id = it.BookType.ToString();
                            jsObj.text = it.BookTypeDesc;
                            jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                            jsObj.parent = "VT";
                            treeView.Add(jsObj);
                        }
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBookTypes");
                }

                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBookTypes");
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }
        [HttpGet]
        public async Task<ActionResult> GetVoucherTypesbyBookType(string booktype)
        {
            try
            {
                var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.GetAsync<List<DO_VoucherType>>("VoucherType/GetVoucherTypesbyBookType?booktype=" + booktype);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetVoucherTypesbyBookType:For booktype {0}", booktype);
                        return Json(new { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetVoucherTypesbyBookType:For booktype {0}", booktype);
                    return Json(new { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetVoucherTypesbyBookType:For booktype {0}", booktype);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        [HttpGet]
        public async Task<ActionResult> ChkBookTypePaymentMethodLinkRequried(string booktype)
        {
            try
            {
                var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.GetAsync<bool>("VoucherType/ChkBookTypePaymentMethodLinkRequried?booktype=" + booktype);
                var data = serviceResponse.Data;
                return Json(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ChkBookTypePaymentMethodLinkRequried:For booktype {0}", booktype);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        [HttpGet]
        public async Task<ActionResult> GetBookTypePaymentMethods(string booktype, string? vouchertype)
        {
            try
            {
               
                var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.GetAsync<List<DO_VoucherType>>("VoucherType/GetBookTypePaymentMethods?booktype=" + booktype+ "&vouchertype="+ vouchertype);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBookTypePaymentMethods:For booktype {0}", booktype);
                        return Json(new { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBookTypePaymentMethods:For booktype {0}", booktype);
                    return Json(new { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBookTypePaymentMethods:For booktype {0}", booktype);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        public async Task<ActionResult> InsertOrUpdateVoucherType(DO_VoucherType obj)
        {
            try
            {
                List<KeyValuePair<int, bool>> lstInstruments = new List<KeyValuePair<int, bool>>();
                if (obj.lstVoucherType != null)
                {


                    foreach (var instrument in obj.lstVoucherType)
                    {
                        lstInstruments.Add(new KeyValuePair<int, bool>(instrument.InstrumentType, instrument.ActiveStatus));
                    }
                }
                obj.lstInstruments = lstInstruments;
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                
                    var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("VoucherType/InsertOrUpdateVoucherType", obj);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            return Json(serviceResponse.Data);
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:InsertOrUpdateVoucherType:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                        }

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateVoucherType:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateVoucherType:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
    }
}

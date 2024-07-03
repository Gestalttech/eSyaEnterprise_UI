using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigFin.Data;
using eSyaEnterprise_UI.Areas.ConfigFin.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigFin.Controllers
{
    [SessionTimeout]
    public class BookTypeController : Controller
    {
        private readonly IeSyaFinanceAPIServices _eSyaFinanceAPIServices;
        private readonly ILogger<BookTypeController> _logger;
        public BookTypeController(IeSyaFinanceAPIServices eSyaFinanceAPIServices, ILogger<BookTypeController> logger)
        {
            _eSyaFinanceAPIServices = eSyaFinanceAPIServices;
            _logger = logger;
        }
        [Area("ConfigFin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EAC_01_00()
        {
            return View();
        }

        [Produces("application/json")]
        [HttpGet]
        public async Task<ActionResult> GetBookTypes()
        {
            try
            {
                List<jsTreeObject> treeView = new List<jsTreeObject>();
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "BT";
                jsObj.parent = "#";
                jsObj.text = "Book Types";
                jsObj.icon = baseURL + "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);

                var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.GetAsync<List<DO_BookType>>("BookType/GetBookTypes");
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
                            jsObj.parent = "BT";
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
        public async Task<ActionResult> GetBooksbyType(string booktype)
        {
            try
            {
                var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.GetAsync<DO_BookType>("BookType/GetBooksbyType?booktype=" + booktype);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBooksbyType:For booktype {0}", booktype);
                        return Json(new { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBooksbyType:For booktype {0}", booktype);
                    return Json(new { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBooksbyType:For booktype {0}", booktype);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> InsertOrUpdateIntoBookType(DO_BookType obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                if (obj.IsInser)
                {
                    var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("BookType/InsertIntoBookType", obj);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            return Json(serviceResponse.Data);
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:InsertIntoBookType:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                        }

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertIntoBookType:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("BookType/UpdateBookType", obj);
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            return Json(serviceResponse.Data);
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:UpdateBookType:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                        }

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateServiceType:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateBookType:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
    }
}

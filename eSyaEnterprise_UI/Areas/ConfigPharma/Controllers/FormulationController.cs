using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ConfigPharma.Data;
using eSyaEnterprise_UI.Areas.ConfigPharma.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigPharma.Controllers
{
    [SessionTimeout]
    public class FormulationController : Controller
    {
        private readonly IeSyaConfigPharmaAPIServices _eSyapharmaAPIServices;
        private readonly ILogger<FormulationController> _logger;

        public FormulationController(IeSyaConfigPharmaAPIServices pharmacyAPIServices, ILogger<FormulationController> logger)
        {
            _eSyapharmaAPIServices = pharmacyAPIServices;
            _logger = logger;
        }
        [Area("ConfigPharma")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPH_06_00()
        {
            try
            {

                List<int> l_codeType = new List<int>();
                l_codeType.Add(ApplicationCodeTypeValues.DrugForms);
                l_codeType.Add(ApplicationCodeTypeValues.MethodOfAdministration);


                var response = _eSyapharmaAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("CommonData/GetApplicationCodesByCodeTypeList", l_codeType).Result;

                if (response.Status )
                {
                   

                    List<DO_ApplicationCodes> DrugForms = response.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.DrugForms).ToList();
                    List<DO_ApplicationCodes> Methdofadmn = response.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.MethodOfAdministration).ToList();


                    ViewBag.DrugFormsList = DrugForms.Select(a => new SelectListItem
                    {
                        Text = a.CodeDesc,
                        Value = a.ApplicationCode.ToString()
                    });

                    ViewBag.MethodOfAdministrationList = Methdofadmn.Select(a => new SelectListItem
                    {
                        Text = a.CodeDesc,
                        Value = a.ApplicationCode.ToString()
                    });
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetApplicationCodesByCodeType:For RateType {0}", ApplicationCodeTypeValues.ConfigPatientRateType);
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApplicationCodesByCodeType:For RateType {0}", ApplicationCodeTypeValues.ConfigPatientRateType);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

      

        /// <summary>
        /// Getting Composition List For tree
        /// </summary>
        [HttpGet]
        public async Task<ActionResult> GetActiveCompositionforTreeview(string prefix)
        {
            try
            {
                List<jsTreeObject> treeView = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "C";
                jsObj.parent = "#";
                jsObj.text = "Compositions";
                jsObj.icon = "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);

                var parameter = "?prefix=" + prefix;
                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<List<DO_Composition>>("DrugFormulation/GetActiveCompositionforTreeview" + parameter);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var g_list = serviceResponse.Data;
                        foreach (var g in g_list)
                        {
                            jsObj = new jsTreeObject();
                            jsObj.id = g.CompositionId.ToString();
                            jsObj.text = g.DrugCompDesc;
                            jsObj.icon = "/images/jsTree/openfolder.png";
                            jsObj.parent = "C";
                            treeView.Add(jsObj);
                        }
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveCompositionforTreeview :For prefix {0} ", prefix);
                }

                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveCompositionforTreeview :For prefix {0} ", prefix);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }
        /// <summary>
        /// Getting Composition By ID
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetDrugFormulationInfobyCompositionID(int composId)
        {
            try
            {
                var parameter = "?composId=" + composId;
                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugFormulation>>("DrugFormulation/GetDrugFormulationInfobyCompositionID" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDrugFormulationInfobyCompositionID :For composId {0} ", composId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Getting Composition By ID
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetDrugFormulationParamsbyFormulationID(int composId, int formulationId)
        {
            try
            {
                var parameter = "?composId=" + composId + "&formulationId="+ formulationId;
                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<DO_DrugFormulation>("DrugFormulation/GetDrugFormulationParamsbyFormulationID" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDrugFormulationInfobyCompositionID :For composId {0} ", composId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Insert Formulation
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateDrugFormulation(DO_DrugFormulation obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (obj.FormulationId == 0)
                {
                    var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DrugFormulation/InsertIntoDrugFormulation", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateDrugFormulation:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DrugFormulation/UpdateDrugFormulation", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateDrugFormulation:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateDrugFormulation:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

    }
}

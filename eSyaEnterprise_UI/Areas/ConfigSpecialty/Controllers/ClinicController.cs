using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using eSyaEnterprise_UI.Utility;
using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigSpecialty.Data;
using eSyaEnterprise_UI.Areas.ConfigSpecialty.Models;
using eSyaEnterprise_UI.Models;

namespace eSyaEnterprise_UI.Areas.ConfigSpecialty.Controllers
{
    [SessionTimeout]
    public class ClinicController : Controller
    {
        private readonly IeSyaConfigSpecialtyAPIServices _eSyaConfigSpecialtyAPIServices;
        private readonly ILogger<ClinicController> _logger;

        public ClinicController(IeSyaConfigSpecialtyAPIServices eSyaConfigSpecialtyAPIServices, ILogger<ClinicController> logger)
        {
            _eSyaConfigSpecialtyAPIServices = eSyaConfigSpecialtyAPIServices;
            _logger = logger;
        }

        #region Map Specialty clinic
        [Area("ConfigSpecialty")]
        //[ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECP_07_00()
        {
            ViewBag.UserFormRole = new DO_UserFormRole
            {
                IsInsert = true,
                IsEdit = true,
                IsDelete = true,
                IsView = true
            };
            var responseBk = _eSyaConfigSpecialtyAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey").Result;
            if (responseBk.Status)
            {
                if (responseBk.Data != null)
                {
                    ViewBag.BusinessKeyList = responseBk.Data.Select(a => new SelectListItem
                    {
                        Text = a.LocationDescription,
                        Value = a.BusinessKey.ToString()
                    });
                }
            }
            return View();
        }

        /// <summary>
        /// Get Specialty List From Specialty Business Link
        /// </summary>

        [HttpPost]
        public async Task<JsonResult> GetMappedSpecialtyListbyBusinessKey(int businessKey)
        {
            try
            {
                var response = await _eSyaConfigSpecialtyAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyBusinessLink>>("Clinic/GetMappedSpecialtyListbyBusinessKey?businessKey=" + businessKey);
                return Json(response.Data);

            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [Produces("application/json")]
        [HttpGet]
        public async Task<JsonResult> GetMapedSpecialtyClinicConsultationTypeBySpecialtyID(int businessKey, int specialtyId)
        {
            try
            {
                List<jsTreeObject> ClinicConsultantTree = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "CL0",
                    parent = "#",
                    text = "Clinics",
                    //icon = "/images/jsTree/foldergroupicon.png",
                    state = new stateObject { opened = true, selected = false, checkbox_disabled = true, disabled = true }
                };
                ClinicConsultantTree.Add(jsObj);

                var clinicResponse = await _eSyaConfigSpecialtyAPIServices.HttpClientServices.GetAsync<List<DO_MapSpecialtyClinicConsultationType>>("Clinic/GetDoctorClinicLinkList?businessKey=" + businessKey + "&specialtyId=" + specialtyId + "&doctorId=" + doctorId);
                if (clinicResponse.Status)
                {
                    if (clinicResponse.Data != null)
                    {
                        List<DO_MapSpecialtyClinicConsultationType> clinic_list = clinicResponse.Data.Select(x => new DO_MapSpecialtyClinicConsultationType { ConsultationId = x.ConsultationId, ConsultationDesc = x.ConsultationDesc }).GroupBy(y => y.ConsultationId, (key, grp) => grp.FirstOrDefault()).ToList();
                        foreach (DO_MapSpecialtyClinicConsultationType cl in clinic_list)
                        {
                            jsObj = new jsTreeObject
                            {
                                id = cl.ConsultationId.ToString(),
                                text = cl.ConsultationDesc.ToString(),
                                //icon = "/images/jsTree/openfolder.png",
                                parent = "CL0",
                                state = new stateObject { opened = true, selected = false, checkbox_disabled = true, disabled = true },
                            };
                            ClinicConsultantTree.Add(jsObj);
                        }

                        var conusltant_list = clinicResponse.Data;
                        foreach (var co in conusltant_list.Where(w => conusltant_list.Any(f => f.ConsultationId == w.ConsultationId)))
                        {
                            jsObj = new jsTreeObject
                            {
                                text = co.ClinicDesc,
                                parent = co.ConsultationId.ToString()

                            };
                            if (co.BusinessKey > 0)
                            {
                                jsObj.id = co.ConsultationId.ToString() + "_" + "Y" + "_" + co.ClinicId;
                                //jsObj.icon = "/images/jsTree/checkedstate.jpg";
                                if (co.ActiveStatus)
                                    jsObj.state = new stateObject { opened = true, selected = true, Checked = true };
                                else
                                    jsObj.state = new stateObject { opened = true, selected = false, Checked = false };
                            }
                            else
                            {
                                jsObj.id = co.ConsultationId.ToString() + "_" + "N" + "_" + co.ClinicId;
                                //jsObj.icon = "/images/jsTree/fileIcon.png";
                                jsObj.state = new stateObject { opened = true, selected = false, Checked = false };
                            }

                            ClinicConsultantTree.Add(jsObj);
                        }
                    }

                    return Json(ClinicConsultantTree);
                }
                else
                {
                    _logger.LogError(new Exception(clinicResponse.Message), "UD:GetMapedSpecialtyClinicConsultationTypeBySpecialtyID:For BusinessId {0} , SpecialtyId {1} and Specialty ID entered {2}", businessKey, specialtyId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetMapedSpecialtyClinicConsultationTypeBySpecialtyID:For BusinessId {0} , SpecialtyId {1}", businessKey, specialtyId);
                throw ex;
            }
        }

        /// <summary>
        /// Insert / Update Doctor Clinic
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertUpdateSpecialtyClinicConsultationTypeLink(List<DO_MapSpecialtyClinicConsultationType> do_cl)
        {
            try
            {
                do_cl.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    return true;
                });

                var Insertresponse = await _eSyaConfigSpecialtyAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Clinic/InsertUpdateSpecialtyClinicConsultationTypeLink", do_cl);
                if (Insertresponse.Status)
                    return Json(Insertresponse.Data);
                else
                {
                    _logger.LogError(new Exception(Insertresponse.Message), "UD:InsertUpdateSpecialtyClinicConsultationTypeLink:params:" + JsonConvert.SerializeObject(do_cl));
                    return Json(new DO_ReturnParameter() { Status = false, Message = Insertresponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertUpdateSpecialtyClinicConsultationTypeLink:params:" + JsonConvert.SerializeObject(do_cl));
                throw ex;
            }
        }
        #endregion
    }
}

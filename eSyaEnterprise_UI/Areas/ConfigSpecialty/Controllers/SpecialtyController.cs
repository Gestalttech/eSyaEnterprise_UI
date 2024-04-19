using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigSpecialty.Models;
using eSyaEnterprise_UI.Areas.ConfigSpecialty.Data;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigSpecialty.Controllers
{
    [SessionTimeout]
    public class SpecialtyController : Controller
    {
        private readonly IeSyaConfigSpecialtyAPIServices _eSyaConfigSpecialtyAPIServices;
        private readonly ILogger<SpecialtyController> _logger;

        public SpecialtyController(IeSyaConfigSpecialtyAPIServices eSyaConfigSpecialtyAPIServices, ILogger<SpecialtyController> logger)
        {
            _eSyaConfigSpecialtyAPIServices = eSyaConfigSpecialtyAPIServices;
            _logger = logger;
        }

        #region Specialities

        [Area("ConfigSpecialty")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECP_04_00()
        {
            return View();
        }

        /// <summary>
        /// Insert Specialty Codes
        /// </summary>
        [Area("ConfigSpecialty")]
        [HttpPost]
        public JsonResult InsertSpecialtyCodes(DO_SpecialtyCodes obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                obj.lstAgerangeSpecilatyLink.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    return true;
                });

                var Insertresponse = _eSyaConfigSpecialtyAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SpecialtyCodes/InsertSpecialtyCodes", obj).Result;
                if (Insertresponse.Status)
                {
                    return Json(Insertresponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(Insertresponse.Message), "UD:InsertSpecialtyCodes:Params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = Insertresponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertSpecialtyCodes:Params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Update Specialty Codes
        /// </summary>
        [Area("ConfigSpecialty")]
        [HttpPost]
        public JsonResult UpdateSpecialtyCodes(DO_SpecialtyCodes obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.lstAgerangeSpecilatyLink.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    return true;
                });
                var response = _eSyaConfigSpecialtyAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SpecialtyCodes/UpdateSpecialtyCodes", obj).Result;
                if (response.Status)
                {
                    return Json(response.Data);
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:UpdateSpecialtyCodes:Params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = response.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateSpecialtyCodes:Params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Delete Specialty Codes
        /// </summary>
        [Area("ConfigSpecialty")]
        [HttpPost]
        public JsonResult DeleteSpecialtyCodes(DO_SpecialtyCodes obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var response = _eSyaConfigSpecialtyAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SpecialtyCodes/DeleteSpecialtyCodes", obj).Result;
                if (response.Status)
                    return Json(response.Data);
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:DeleteSpecialtyCodes:Params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = response.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteSpecialtyCodes:Params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Specialty Codes for Tree View
        /// </summary>
        [Area("ConfigSpecialty")]
        [Produces("application/json")]
        public IActionResult GetSpecialtyTree()
        {

            try
            {
                var response = _eSyaConfigSpecialtyAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyCodes>>("SpecialtyCodes/GetSpecialtyCodesList").Result;
                List<DO_SpecialtyCodes> data = response.Data;

                List<jsTreeObject> SpecialtyTree = new List<jsTreeObject>();
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                jsTreeObject obj;
                obj = new jsTreeObject();

                obj.id = "H0";
                obj.parent = "#";
                obj.text = "Specialty Codes";
                obj.state = new stateObject { opened = true, selected = false };

                SpecialtyTree.Add(obj);

                //List<DO_SpecialtyCodes> aGroup = data.Select(x => new DO_AssetGroup { AssetGroup = x.AssetGroup, AssetGroupID = x.AssetGroupID }).GroupBy(y => y.AssetGroupID, (key, grp) => grp.FirstOrDefault()).ToList();

                foreach (DO_SpecialtyCodes lst in data)
                {
                    obj = new jsTreeObject();

                    obj.id = lst.SpecialtyID.ToString();
                    obj.parent = "H0";
                    obj.text = lst.SpecialtyDesc;
                    if (lst.ActiveStatus)
                        obj.icon = baseURL + "/images/jsTree/checkedstate.jpg";
                    obj.state = new stateObject { opened = false, selected = false };

                    SpecialtyTree.Add(obj);
                }

                return Json(SpecialtyTree);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSpecialtyTree");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Get Specialty Codes Detail
        /// </summary>
        [Area("ConfigSpecialty")]
        [HttpPost]
        public JsonResult GetSpecialtyCode(int specialtyId)
        {
            try
            {
                var response = _eSyaConfigSpecialtyAPIServices.HttpClientServices.GetAsync<DO_SpecialtyCodes>("SpecialtyCodes/GetSpecialtyCodes?specialtyId=" + specialtyId).Result;
                if (response.Status)
                {
                    return Json(response.Data);
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetSpecialtyCode");
                    return Json(new DO_ReturnParameter()
                    {
                        Status = false,
                        StatusCode = response.StatusCode.ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSpecialtyCode");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Get Age Range Matrix Link by SpecialtyId for Grid
        /// </summary>
        [Area("ConfigSpecialty")]
        [HttpPost]
        public JsonResult GetAgeRangeMatrixLinkbySpecialtyId(int specialtyId)
        {
            try
            {
                var response = _eSyaConfigSpecialtyAPIServices.HttpClientServices.GetAsync<List<DO_AgeRangeMatrixSpecialtyLink>>("SpecialtyCodes/GetAgeRangeMatrixLinkbySpecialtyId?specialtyId=" + specialtyId).Result;
                if (response.Status)
                {
                    return Json(response.Data);
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetAgeRangeMatrixLinkbySpecialtyId");
                    return Json(new DO_ReturnParameter()
                    {
                        Status = false,
                        StatusCode = response.StatusCode.ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAgeRangeMatrixLinkbySpecialtyId");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
    }
}

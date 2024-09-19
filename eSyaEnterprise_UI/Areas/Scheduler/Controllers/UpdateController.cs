using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.Scheduler.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using eSyaEnterprise_UI.Areas.Scheduler.Models;
using eSyaEnterprise_UI.Models;
using ClosedXML.Excel;
using eSyaEnterprise_UI.Extension;
using eSyaEnterprise_UI.Utility;
using Newtonsoft.Json;
using System.Data;
namespace eSyaEnterprise_UI.Areas.Scheduler.Controllers
{
    [SessionTimeout]
    public class UpdateController : Controller
    {
        private readonly IeSyaServiceSchedulerAPIServices _eSyaSchedulerAPIServices;
        private readonly ILogger<UpdateController> _logger;
        private readonly IWebHostEnvironment _appEnvironment;
        public UpdateController(IeSyaServiceSchedulerAPIServices eSyaSchedulerAPIServices, ILogger<UpdateController> logger, IWebHostEnvironment hostingEnvironment)
        {
            _eSyaSchedulerAPIServices = eSyaSchedulerAPIServices;
            _logger = logger;
            _appEnvironment = hostingEnvironment;

        }

        #region Schedule Update
        [Area("Scheduler")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ESP_05_00()
        {
            try
            {
                var serviceresponse = await _eSyaSchedulerAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");
                if (serviceresponse.Status)
                {
                    ViewBag.BusinessKeys = serviceresponse.Data.Select(a => new SelectListItem
                    {
                        Text = a.LocationDescription,
                        Value = a.BusinessKey.ToString()
                    });
                    return View();
                }
                else
                {
                    _logger.LogError(new Exception(serviceresponse.Message), "UD:GetBusinessKey: {0}");
                }
                return View();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessKey:{0}");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetScheduledDoctorsbyBusinessKey(int Businesskey)
        {
            try
            {
                var parameter = "?Businesskey=" + Businesskey;
                var serviceResponse = await _eSyaSchedulerAPIServices.HttpClientServices.GetAsync<List<DO_DoctorMaster>>("Scheduler/GetDoctorsbyBusinessKey" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetScheduledDoctorsbyBusinessKey:For Businesskey {0} ", Businesskey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetScheduledDoctorsbyBusinessKey:For Businesskey {0} ", Businesskey);
                throw ex;
            }
        }

        [HttpGet]
        public async Task<JsonResult> GetScheduledSpecialtiesbyDoctorID(int Businesskey, int DoctorID)
        {
            try
            {
                var parameter = "?Businesskey=" + Businesskey + "&DoctorID=" + DoctorID;
                var serviceResponse = await _eSyaSchedulerAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyDoctorLink>>("Scheduler/GetSpecialtiesbyDoctorID" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetScheduledSpecialtiesbyDoctorID:For DoctorID {0} ", DoctorID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetScheduledSpecialtiesbyDoctorID:For DoctorID {0} ", DoctorID);
                throw ex;
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetScheduledClinicsbySpecialtyID(int Businesskey, int DoctorID, int SpecialtyID)
        {
            try
            {
                var parameter = "?Businesskey=" + Businesskey + "&DoctorID=" + DoctorID + "&SpecialtyID=" + SpecialtyID;
                var serviceResponse = await _eSyaSchedulerAPIServices.HttpClientServices.GetAsync<List<DO_DoctorClinic>>("Scheduler/GetClinicsbySpecialtyID" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetScheduledClinicsbySpecialtyID:For SpecialtyID {0} ", SpecialtyID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetScheduledClinicsbySpecialtyID:For SpecialtyID {0} ", SpecialtyID);
                throw ex;
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetScheduledConsultationsbyClinicID(int Businesskey, int DoctorID, int SpecialtyID, int ClinicID)
        {
            try
            {
                var parameter = "?Businesskey=" + Businesskey + "&DoctorID=" + DoctorID + "&SpecialtyID=" + SpecialtyID + "&ClinicID=" + ClinicID;
                var serviceResponse = await _eSyaSchedulerAPIServices.HttpClientServices.GetAsync<List<DO_DoctorClinic>>("Scheduler/GetConsultationsbyClinicID" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetScheduledConsultationsbyClinicID:For ClinicID {0} ", ClinicID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetScheduledConsultationsbyClinicID:For ClinicID {0} ", ClinicID);
                throw ex;
            }
        }

        /// <summary>
        /// Get Doctor day Schedule by Search Criteria
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDoctordaySchedulebySearchCriteria(int Businesskey, int DoctorID, int SpecialtyID, int ClinicID, int ConsultationID, DateTime ScheduleFromDate, DateTime ScheduleToDate)
        {
            try
            {
                var serviceResponse = await _eSyaSchedulerAPIServices.HttpClientServices.GetAsync<List<DO_DoctorDaySchedule>>("DoctorDaySchedule/GetDoctordaySchedulebySearchCriteria?Businesskey=" + Businesskey + "&DoctorID=" + DoctorID + "&SpecialtyID=" + SpecialtyID + "&ClinicID=" + ClinicID + "&ConsultationID=" + ConsultationID + "&ScheduleFromDate=" + ScheduleFromDate + "&ScheduleToDate=" + ScheduleToDate);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data.ToList());
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDoctordaySchedulebySearchCriteria");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDoctordaySchedulebySearchCriteria");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        /// <summary>
        /// Insert Doctor day Schedule
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateDoctordaySchedule(bool isInsert, DO_DoctorDaySchedule obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                if (isInsert)
                {
                    var serviceResponse = await _eSyaSchedulerAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorDaySchedule/InsertIntoDoctordaySchedule", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertIntoDoctordaySchedule:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

                else
                {
                    var serviceResponse = await _eSyaSchedulerAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorDaySchedule/UpdateDoctordaySchedule", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateDoctordaySchedule:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateDoctordaySchedule:params:" + JsonConvert.SerializeObject(obj));
                throw ex;
            }
        }

        /// <summary>
        /// Activate or De Activate Doctor day Schedule
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveDoctordaySchedule(DO_DoctorDaySchedule objdel)
        {

            try
            {
                objdel.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                objdel.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                objdel.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                objdel.XlsheetReference = "#";
                var serviceResponse = await _eSyaSchedulerAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorDaySchedule/ActiveOrDeActiveDoctordaySchedule", objdel);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveDoctordaySchedule:params:" + JsonConvert.SerializeObject(objdel));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        [HttpGet]
        public async Task<IActionResult> Export(int Businesskey, int DoctorID, int SpecialtyID, int ClinicID, int ConsultationID, DateTime ScheduleFromDate, DateTime ScheduleToDate)
        {
            string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            string fileName = "DoctordaySchedule.xlsx";

            string name = "DoctordaySchedule";
            DataTable dt = new DataTable(name);
            dt.Columns.AddRange(new DataColumn[9]
            {
                new DataColumn("Specialty"),
                new DataColumn("Clinic"),
                new DataColumn("Consultation"),
                new DataColumn("Doctor Name"),
                new DataColumn("Schedule Date"),
                new DataColumn("Schedule From Time"),
                new DataColumn("Schedule To Time"),
                new DataColumn("Number of Patients"),
                new DataColumn("Status")
            });


            var serviceResponse = await _eSyaSchedulerAPIServices.HttpClientServices.GetAsync<List<DO_DoctorDaySchedule>>("DoctorDaySchedule/GetDoctordaySchedulebySearchCriteria?Businesskey=" + Businesskey + "&DoctorID=" + DoctorID + "&SpecialtyID=" + SpecialtyID + "&ClinicID=" + ClinicID + "&ConsultationID=" + ConsultationID + "&ScheduleFromDate=" + ScheduleFromDate + "&ScheduleToDate=" + ScheduleToDate);

            if (serviceResponse.Data != null)
            {
                foreach (var lang in serviceResponse.Data)
                {
                    dt.Rows.Add(lang.SpecialtyDesc, lang.ClinicDesc, lang.ConsultationDesc, lang.DoctorName, lang.ScheduleDate, lang.ScheduleFromTime, lang.ScheduleToTime, lang.NoOfPatients, lang.status);
                }

                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(dt);
                    using (MemoryStream stream = new MemoryStream())
                    {
                        wb.SaveAs(stream);
                        var content = stream.ToArray();
                        return File(content, contentType, fileName);
                    }
                }
            }
            else
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = "No date Exists" });
            }
        }

        [HttpPost]
        public async Task<JsonResult> Insert_ImpotedDoctorScheduleList(IFormFile postedFile, int BusinessKey)
        {
            try
            {
                List<DO_DoctorDaySchedule> obj = new List<DO_DoctorDaySchedule>();
                DO_DoctorDaySchedule ds;
                var supportedTypes = new[] { ".xls", ".xlsx", "xls", "xlsx" };
                var fileextension = Path.GetExtension(postedFile.FileName);
                if (!supportedTypes.Contains(fileextension))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "File Extension Is In Valid - Only Upload EXCEL File" });
                }
                string filename = Path.GetFileName(postedFile.FileName);
                var uploads = Path.Combine(_appEnvironment.WebRootPath, "Uploads\\ExcelUploads");
                var filepath = Path.Combine(Directory.GetCurrentDirectory(), uploads, filename);
                //Removing already Exits Excel file
                if (System.IO.File.Exists(filepath))
                {
                    System.IO.File.Delete(filepath);
                }
                //Creating New Excel file
                using (FileStream fs = System.IO.File.Create(filepath))
                {
                    postedFile.CopyTo(fs);
                }
                int rowno = 1;
                XLWorkbook workbook = XLWorkbook.OpenFromTemplate(filepath);
                var sheets = workbook.Worksheets.First();
                var rows = sheets.Rows().ToList();
                foreach (var row in rows)
                {
                    if (rowno != 1)
                    {
                        var checkEmpty = row.Cell(1).Value.ToString();
                        if (string.IsNullOrWhiteSpace(checkEmpty) || string.IsNullOrEmpty(checkEmpty))
                        {
                            break;
                        }
                        if (string.IsNullOrWhiteSpace(row.Cell(1).Value.ToString()) || string.IsNullOrEmpty(row.Cell(1).Value.ToString()))
                        {
                            return Json(new DO_ReturnParameter() { Status = false, Message = "Specialty should not be Empty" });
                        }
                        if (string.IsNullOrWhiteSpace(row.Cell(2).Value.ToString()) || string.IsNullOrEmpty(row.Cell(2).Value.ToString()))
                        {
                            return Json(new DO_ReturnParameter() { Status = false, Message = "Clinic should not be Empty" });
                        }
                        if (string.IsNullOrWhiteSpace(row.Cell(3).Value.ToString()) || string.IsNullOrEmpty(row.Cell(3).Value.ToString()))
                        {
                            return Json(new DO_ReturnParameter() { Status = false, Message = "Consultation should not be Empty" });
                        }
                        if (string.IsNullOrWhiteSpace(row.Cell(4).Value.ToString()) || string.IsNullOrEmpty(row.Cell(4).Value.ToString()))
                        {
                            return Json(new DO_ReturnParameter() { Status = false, Message = "Doctor should not be Empty" });
                        }
                        if (string.IsNullOrWhiteSpace(row.Cell(5).Value.ToString()) || string.IsNullOrEmpty(row.Cell(5).Value.ToString()))
                        {
                            return Json(new DO_ReturnParameter() { Status = false, Message = "Schedule date should not be Empty" });
                        }
                        if (string.IsNullOrWhiteSpace(row.Cell(6).Value.ToString()) || string.IsNullOrEmpty(row.Cell(6).Value.ToString()))
                        {
                            return Json(new DO_ReturnParameter() { Status = false, Message = "Schedule from Time should not be Empty" });
                        }
                        if (string.IsNullOrWhiteSpace(row.Cell(7).Value.ToString()) || string.IsNullOrEmpty(row.Cell(7).Value.ToString()))
                        {
                            return Json(new DO_ReturnParameter() { Status = false, Message = "Schedule To Time should not be Empty" });
                        }
                        if (string.IsNullOrWhiteSpace(row.Cell(8).Value.ToString()) || string.IsNullOrEmpty(row.Cell(8).Value.ToString()))
                        {
                            return Json(new DO_ReturnParameter() { Status = false, Message = "Number of Patients should not be Empty" });
                        }
                        if (string.IsNullOrWhiteSpace(row.Cell(9).Value.ToString()) || string.IsNullOrEmpty(row.Cell(9).Value.ToString()))
                        {
                            return Json(new DO_ReturnParameter() { Status = false, Message = "Status should not be Empty" });
                        }

                        ds = new DO_DoctorDaySchedule();
                        ds.SpecialtyDesc = row.Cell(1).Value.ToString().Trim();
                        ds.ClinicDesc = row.Cell(2).Value.ToString().Trim();
                        ds.ConsultationDesc = row.Cell(3).Value.ToString().Trim();
                        ds.DoctorName = row.Cell(4).Value.ToString().Trim();
                        ds.ScheduleDate = Convert.ToDateTime(row.Cell(5).Value.ToString().Trim());
                        var fime = row.Cell(6).Value.ToString().Trim();
                        var Ttime = row.Cell(7).Value.ToString().Trim();
                        DateTime Fromtime = DateTime.Parse(fime);
                        DateTime Totime = DateTime.Parse(Ttime);
                        var ftime = Fromtime.ToString("HH:mm");
                        var ttime = Totime.ToString("HH:mm");
                        //ds.ScheduleFromTime = TimeSpan.Parse(ftime);
                        //ds.ScheduleToTime = TimeSpan.Parse(ttime);
                        ds.ScheduleFromTime = TimeSpan.Parse(ftime, System.Globalization.CultureInfo.CurrentCulture);
                        ds.ScheduleToTime = TimeSpan.Parse(ttime, System.Globalization.CultureInfo.CurrentCulture);
                        ds.NoOfPatients = Convert.ToInt32(row.Cell(8).Value.ToString().Trim());
                        ds.ActiveStatus = Convert.ToBoolean(row.Cell(9).Value.ToString().Trim());
                        ds.XlsheetReference = filepath;
                        obj.Add(ds);
                    }
                    else
                    {
                        rowno = 2;
                    }
                }
                if (obj.Count > 0)
                {
                    obj.All(x =>
                    {
                        x.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                        x.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                        x.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                        x.BusinessKey = BusinessKey;
                        return true;
                    });

                    var serviceResponse = await _eSyaSchedulerAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorDaySchedule/ImportedDoctorScheduleList", obj);
                    if (serviceResponse.Status)
                    {
                        System.IO.File.Delete(filepath);
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Excel does not contain valid data" });

                }

                //ViewBag.Data = lst;
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message + " or valid Time and Date format should be: MM/DD/YYYY and Time format sholud not be greater than 24 hrs" });

            }
        }
        #endregion
    }
}

using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.SAC.Data;
using eSyaEnterprise_UI.Areas.SAC.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.SAC.Controllers
{
    [SessionTimeout]
    public class SACCodesController : Controller
    {
        private readonly IeSyaSACAPIServices _eSyaSACAPIServices;
        private readonly ILogger<SACCodesController> _logger;
        public SACCodesController(IeSyaSACAPIServices eSyaSACAPIServices, ILogger<SACCodesController> logger)
        {
            _eSyaSACAPIServices = eSyaSACAPIServices;
            _logger = logger;
        }
        #region SAC Codes

        /// <summary>
        /// SAC Codes
        /// </summary>
        /// <returns></returns>

        [Area("SAC")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECS_07_00()
        {
            return View();
        }

        //public async Task<ActionResult> GetSACCodes(int ISDCode)
        //{
        //    try
        //    {
        //        var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_SACClass>>("SACClass/GetSACClasses");
        //        var st_list = new List<DO_SACClass>();
        //        if (serviceResponse.Status)
        //        {
        //            st_list = serviceResponse.Data.FindAll(w => w.ActiveStatus == true);
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSACClasses:GetSACClasses");
        //        }
        //        var serviceResponse1 = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_SACCategory>>("SACCategory/GetSACCategories");
        //        var sg_list = new List<DO_SACCategory>();
        //        if (serviceResponse1.Status)
        //        {
        //            sg_list = serviceResponse1.Data.FindAll(w => w.ActiveStatus == true);
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse1.Message), "UD:GetSACCategories:GetSACCategories");
        //        }
        //        var sc_list = new List<DO_SACCodes>();
        //        var serviceResponse2 = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_SACCodes>>("SACCodes/GetSACCodes");
        //        if (serviceResponse2.Status)
        //        {
        //            sc_list = serviceResponse2.Data;
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse2.Message), "UD:GetSACCodes:GetSACCodes");
        //        }
        //        List<jsTreeObject> treeView = new List<jsTreeObject>();
        //        jsTreeObject jsObj = new jsTreeObject();

        //        string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

        //        jsObj.id = "SC";
        //        jsObj.parent = "#";
        //        jsObj.text = "Service Classes";
        //        jsObj.icon = "/images/jsTree/foldergroupicon.png";
        //        jsObj.state = new stateObject { opened = true, selected = false };
        //        treeView.Add(jsObj);
        //        if (st_list != null)
        //        {
        //            foreach (var st in st_list)
        //            {
        //                jsObj = new jsTreeObject();
        //                jsObj.id = "T" + st.Sacclass.ToString();
        //                jsObj.text = st.SacclassDesc;
        //                jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
        //                jsObj.parent = "SC";
        //                jsObj.state = new stateObject { opened = false, selected = false };
        //                treeView.Add(jsObj);
        //                if (sg_list != null)
        //                {
        //                    foreach (var sg in sg_list)
        //                    {
        //                        if (st.Sacclass == sg.Sacclass)
        //                        {
        //                            jsObj = new jsTreeObject();
        //                            jsObj.id = sg.Saccategory.ToString();
        //                            jsObj.text = sg.SaccategoryDesc;
        //                            jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
        //                            jsObj.parent = "T" + st.Sacclass.ToString();
        //                            jsObj.state = new stateObject { opened = false, selected = false };
        //                            treeView.Add(jsObj);


        //                            if (sc_list != null)
        //                            {
        //                                foreach (var sc in sc_list)
        //                                {
        //                                    if (sg.Saccategory == sc.Saccategory)
        //                                    {
        //                                        if (sc.ServiceClassId == sc.ParentId)
        //                                        {
        //                                            jsObj = new jsTreeObject();
        //                                            jsObj.id = "C" + sc.ServiceClassId.ToString();
        //                                            jsObj.text = sc.ServiceClassDesc;
        //                                            jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
        //                                            jsObj.parent = sg.ServiceGroupId.ToString();
        //                                            treeView.Add(jsObj);
        //                                        }
        //                                        else
        //                                        {
        //                                            jsObj = new jsTreeObject();
        //                                            jsObj.id = "C" + sc.ServiceClassId.ToString();
        //                                            jsObj.text = sc.ServiceClassDesc;
        //                                            jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
        //                                            jsObj.parent = "C" + sc.ParentId.ToString();
        //                                            treeView.Add(jsObj);
        //                                        }

        //                                    }
        //                                }
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //        }

        //        return Json(treeView);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetServiceClasses");
        //        return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
        //    }



        //}

        #endregion
    }
}

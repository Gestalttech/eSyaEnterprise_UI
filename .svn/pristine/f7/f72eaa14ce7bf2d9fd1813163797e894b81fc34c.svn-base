using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Extension;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;


namespace eSyaEnterprise_UI.Areas.Appointment.Controllers
{
    //[SessionTimeout]
    public class ClinicController : Controller
    {
        [Area("Appointment")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EAP_01_00()
        {
            return View();
        }

        [Area("Appointment")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult _Confirmation()
        {
            return View();
        }
    }
}

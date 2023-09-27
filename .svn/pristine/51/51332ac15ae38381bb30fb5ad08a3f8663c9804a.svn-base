using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Controllers
{
    public class SharedViewController : Controller
    {
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        public SharedViewController(IeSyaGatewayServices eSyaGatewayServices)
        {
            _eSyaGatewayServices = eSyaGatewayServices;

        }
        public IActionResult _ISDMobileNumber()
        {
            ViewBag.ID = "cboISDCode";
            var serviceResponse = _eSyaGatewayServices.HttpClientServices.GetAsync<List<DO_ISDCodes>>("Common/GetISDCodes").Result;
            ViewBag.ISDCodes = serviceResponse.Data;

            return PartialView("_ISDMobileNumber");
        }

    }
}

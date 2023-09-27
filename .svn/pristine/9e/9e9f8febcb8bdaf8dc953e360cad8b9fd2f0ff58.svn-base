using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.ViewComponents
{
    public class IsdCountryInputViewComponent : ViewComponent
    {
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        public IsdCountryInputViewComponent(IeSyaGatewayServices eSyaGatewayServices)
        {
            _eSyaGatewayServices = eSyaGatewayServices;

        }
        public async Task<IViewComponentResult> InvokeAsync(string id)
        {
            ViewBag.cboID = "cbo" + id;
            ViewBag.DomainName = this.Request.PathBase;
            var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<List<DO_ISDCodes>>("Common/GetISDCodes");
            ViewBag.ISDCodes = serviceResponse.Data;

            return View("_IsdCountryInput");
        }
    }
}
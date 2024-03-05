using eSyaEnterprise_UI.Areas.ProductSetup.Data;
using eSyaEnterprise_UI.Areas.ProductSetup.Models;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.ViewComponents
{
    public class eSyaParameterTypeViewComponent : ViewComponent
    {
        private readonly IeSyaProductSetupAPIServices _eSyaProductSetupAPIServices;
        public eSyaParameterTypeViewComponent(IeSyaProductSetupAPIServices eSyaProductSetupAPIServices)
        {
            _eSyaProductSetupAPIServices = eSyaProductSetupAPIServices;

        }
        public async Task<IViewComponentResult> InvokeAsync(string parameterType, string id)
        {
            ViewBag.tblID = "tbl" + id;
            var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_Parameters>>("Parameters/GetParametersInformationByParameterType?parameterType=" + parameterType);
            var params_list = serviceResponse.Data;

            return View("_eSyaParameterType", params_list);
        }
    }
}

using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.ViewComponents
{
    public class eSyaBusinessLocationViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var l_bk = AppSessionVariables.GetSessionUserBusinessKeyLink(HttpContext);
            ViewBag.SelectedBusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
            return View("_eSyaBusinessLocation", l_bk);
        }
    }
}

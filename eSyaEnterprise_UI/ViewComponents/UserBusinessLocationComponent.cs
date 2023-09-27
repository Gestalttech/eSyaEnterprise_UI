using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.ViewComponents
{
    public class UserBusinessLocationViewComponent : ViewComponent
    {
        private readonly IUserAccountServices _userAccountServices;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserBusinessLocationViewComponent(IUserAccountServices userAccountServices, IHttpContextAccessor httpContextAccessor)
        {
            _userAccountServices = userAccountServices;
            _httpContextAccessor = httpContextAccessor;

        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            //var l_bk = AppSessionVariables.GetSessionUserBusinessKeyLink(HttpContext);
            Dictionary<int, string> l_bk = new Dictionary<int, string>();
            if (AppSessionVariables.GetSessionIsEsyaUser(_httpContextAccessor.HttpContext))
            {
                var userAccount = await _userAccountServices.GeteSyaUserBusinessLocation();
                l_bk = userAccount.l_BusinessKey;
            }
            else
            {
                if (AppSessionVariables.GetSessionUserID(_httpContextAccessor.HttpContext) == 0)
                {
                    var userAccount = await _userAccountServices.GeteSyaUserBusinessLocation();
                    l_bk = userAccount.l_BusinessKey;
                }
                else
                {
                    var userAccount = await _userAccountServices.GetUserBusinessLocation(AppSessionVariables.GetSessionUserID(_httpContextAccessor.HttpContext));
                    l_bk = userAccount.l_BusinessKey;
                }
            }

            ViewBag.BusinessLocation = l_bk.Select(a => new SelectListItem
            {
                Text = a.Value,
                Value = a.Key.ToString(),
                Selected = a.Key == AppSessionVariables.GetSessionBusinessKey(HttpContext)
            });

            ViewBag.SelectedBusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);


            return View("_UserBusinessLocation", l_bk);
        }
    }
}
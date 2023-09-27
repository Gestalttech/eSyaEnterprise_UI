using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Controllers

{
    public class MenuViewComponent : ViewComponent
    {
        private readonly IUserAccountServices _userAccountServices;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MenuViewComponent(IUserAccountServices userAccountServices, IHttpContextAccessor httpContextAccessor)
        {
            _userAccountServices = userAccountServices;
            _httpContextAccessor = httpContextAccessor;

        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            if (AppSessionVariables.GetSessionUserID(httpContext: _httpContextAccessor.HttpContext) == 0)
            {
                var serviceResponse = await _userAccountServices.GeteSyaMenulist();
                var fn_list = serviceResponse;

                return View("_UserMenu", fn_list);
            }
            else if (AppSessionVariables.GetSessionIsEsyaUser(_httpContextAccessor.HttpContext))
            {
                var serviceResponse = await _userAccountServices.GeteSyaUserMenulist(
                  AppSessionVariables.GetSessionUserID(_httpContextAccessor.HttpContext));
                var fn_list = serviceResponse;

                return View("_UserMenu", fn_list);
            }
            else
            {
                var serviceResponse = await _userAccountServices.GetUserMenulist(
                    AppSessionVariables.GetSessionBusinessKey(_httpContextAccessor.HttpContext),
                    AppSessionVariables.GetSessionUserID(_httpContextAccessor.HttpContext));
                var fn_list = serviceResponse;

                return View("_UserMenu", fn_list);
            }
        }
    }
}

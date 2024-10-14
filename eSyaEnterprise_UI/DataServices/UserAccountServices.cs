using eSyaEnterprise_UI.GestaltUserDataServices;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static eSyaEnterprise_UI.Models.DO_UserMenu;

namespace eSyaEnterprise_UI.DataServices
{
    public class UserAccountServices : IUserAccountServices
    {
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        private readonly IeSyaGestaltUserSetUpGatewayServices _esyaGestaltSetUpGateway;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserAccountServices(IeSyaGatewayServices eSyaGatewayServices, IeSyaGestaltUserSetUpGatewayServices esyaGestaltSetUpGateway, IHttpContextAccessor httpContextAccessor)
        {
            _eSyaGatewayServices = eSyaGatewayServices;
            _esyaGestaltSetUpGateway = esyaGestaltSetUpGateway;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<DO_MainMenu>> GeteSyaMenulist()
        {
            try
            {
                // if login with Gestalt User It has to get all menu items
                //var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<List<DO_MainMenu>>("UserAccount/GeteSyaMenulist");
                var serviceResponse = await _esyaGestaltSetUpGateway.HttpClientServices.GetAsync<List<DO_MainMenu>>("eSyaUserAccount/GeteSyaMenulist");
                return serviceResponse.Data;
            }

            catch (Exception ex)
            {
                return new List<DO_MainMenu>();
            }
        }

        public async Task<List<DO_MainMenu>> GeteSyaUserMenulist(int userID)
        {
            try
            {
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<List<DO_MainMenu>>("eSyaUser/GeteSyaUserMenulist?userID="+ userID);
                return serviceResponse.Data;
            }
            catch (Exception ex)
            {
                return new List<DO_MainMenu>();
            }
        }


        public async Task<DO_UserFormRole> GetFormAction(ControllerActionDescriptor controllerAction)
        {
            try
            {
                var area = controllerAction.RouteValues["area"];
                var controllerName = controllerAction.ControllerName;
                var actionName = controllerAction.ActionName;
                var navigationURL = area + "/" + controllerName + "/" + actionName;

                var param = "?navigationURL=" + navigationURL;
                // if login with Gestalt User It has to get all Actions
                //var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserFormRole>("UserAccount/GetFormAction" + param);
                var serviceResponse = await _esyaGestaltSetUpGateway.HttpClientServices.GetAsync<DO_UserFormRole>("eSyaUserAccount/GetFormAction" + param);

                return serviceResponse.Data;
            }
            catch (Exception ex)
            {
                return new DO_UserFormRole();
            }
        }

        public async Task<DO_UserAccount> GeteSyaUserBusinessLocation()
        {
            try
            {
                //var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("eSyaUser/GetBusinessLocation");
                var serviceResponse = await _esyaGestaltSetUpGateway.HttpClientServices.GetAsync<DO_UserAccount>("eSyaUserAccount/GetBusinessLocation");
                return serviceResponse.Data;
            }
            catch (Exception ex)
            {
                return new DO_UserAccount();
            }
        }

        public async Task<List<DO_MainMenu>> GetUserMenulist(int businessKey, int userID)
        {
            try
            {
                var param = "?businessKey=" + businessKey;
                param += "&userID=" + userID;
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<List<DO_MainMenu>>("UserAccount/GetUserMenulist"+ param);
                return serviceResponse.Data;
            }
            catch (Exception ex)
            {
                return new List<DO_MainMenu>();
            }
        }

        public async Task<DO_UserFormRole> GetFormActionByUser(int businessKey, int userID, ControllerActionDescriptor controllerAction)
        {
            try
            {
                var area = controllerAction.RouteValues["area"];
                var controllerName = controllerAction.ControllerName;
                var actionName = controllerAction.ActionName;
                var navigationURL = area + "/" + controllerName + "/" + actionName;

                var param = "?businessKey=" + businessKey;
                param += "&userID=" + userID;
                param += "&navigationURL=" + navigationURL;
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserFormRole>("UserAccount/GetFormActionByUser" + param);
                return serviceResponse.Data;
            }
            catch (Exception ex)
            {
                return new DO_UserFormRole();
            }
        }

        public async Task<DO_UserAccount> GetUserBusinessLocation(int userID)
        {
            try
            {
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("UserAccount/GetUserBusinessLocation?userID=" + userID);
                return serviceResponse.Data;
            }
            catch (Exception ex)
            {
                return new DO_UserAccount();
            }
        }

        public async Task<DO_UserAccount> GetUserNameById(int userId)
        {
            try
            {
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_UserAccount>("UserAccount/GetUserNameById?userId=" + userId);
                return serviceResponse.Data;
            }
            catch (Exception ex)
            {
                return new DO_UserAccount();
            }
        }
        public async Task<List<FormControlProperty>> GetFormControlPropertybyUserRole()
        {
            try
            {
                string FormId = string.Empty;
                int userRole = 0;
                var httpContext = _httpContextAccessor.HttpContext;
                if (httpContext != null)
                {
                    FormId = AppSessionVariables.GetSessionFormInternalID(httpContext).ToString();
                    userRole=AppSessionVariables.GetSessionUserRole(httpContext);

                }
                var param = "?userRole=" + userRole;
                param += "&forminternalID=" + FormId;
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<List<FormControlProperty>>("LocalizationResource/GetFormControlPropertybyUserRole" + param);
                return serviceResponse.Data;
            }
            catch (Exception ex)
            {
                return new List<FormControlProperty>();
            }
        }

    }
}

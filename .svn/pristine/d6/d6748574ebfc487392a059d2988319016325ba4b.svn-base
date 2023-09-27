using eSyaEnterprise_UI.Models;
using Microsoft.AspNetCore.Mvc.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static eSyaEnterprise_UI.Models.DO_UserMenu;

namespace eSyaEnterprise_UI.DataServices
{
    public interface IUserAccountServices
    {
        Task<List<DO_MainMenu>> GeteSyaMenulist();
        Task<List<DO_MainMenu>> GeteSyaUserMenulist(int userID);
        Task<DO_UserFormRole> GetFormAction(ControllerActionDescriptor controllerAction);
        Task<DO_UserAccount> GeteSyaUserBusinessLocation();

        Task<List<DO_MainMenu>> GetUserMenulist(int businessKey, int userID);
        Task<DO_UserFormRole> GetFormActionByUser(int businessKey, int userID, ControllerActionDescriptor controllerAction);
        Task<DO_UserAccount> GetUserBusinessLocation(int userID);

        Task<DO_UserAccount> GetUserNameById(int userId);
    }
}

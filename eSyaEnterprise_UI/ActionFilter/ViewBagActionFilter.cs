using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Utility;

namespace eSyaEnterprise_UI.ActionFilter
{
    public class ViewBagActionFilter : ActionFilterAttribute
    {
        private readonly IUserAccountServices _userAccountServices;
        public ViewBagActionFilter(IUserAccountServices userAccountServices)
        {
            _userAccountServices = userAccountServices;
        }

        public override void OnResultExecuting(ResultExecutingContext context)
        {
            //            if (context.HttpContext.Request.UrlReferrer == null ||
            //context.HttpContext.Request.Url.Host != context.HttpContext.Request.UrlReferrer.Host)
            //            {
            //                context.Result = new RedirectToRouteResult(new
            //                                          RouteValueDictionary(new { controller = "Dashboard", action = "Index", area = "" }));
            //            }
            if (context.Controller is Controller)
            {
                var controller = context.Controller as Controller;

                DO_UserFormRole userRole = new DO_UserFormRole();

                if (AppSessionVariables.GetCurrentSessionUserID(context.HttpContext) == null)
                {
                    context.Result = new RedirectResult("~/Account/Logout");
                    return;
                }

                if (AppSessionVariables.GetSessionBusinessKey(context.HttpContext) == 0
                    && AppSessionVariables.GetSessionUserID(context.HttpContext) == 0)
                {
                    userRole = _userAccountServices.GetFormAction(
                        controller.ControllerContext.ActionDescriptor).Result;
                }
                else
                {
                    userRole = _userAccountServices.GetFormActionByUser(
                        AppSessionVariables.GetSessionBusinessKey(context.HttpContext),
                        AppSessionVariables.GetSessionUserID(context.HttpContext),
                        controller.ControllerContext.ActionDescriptor).Result;
                }

                if (userRole != null)
                {
                    controller.ViewBag.UserFormRole = userRole;
                    controller.ViewBag.formName = userRole.FormName;
                    AppSessionVariables.SetSessionFormID(context.HttpContext, userRole.FormID);
                    AppSessionVariables.SetSessionFormInternalID(context.HttpContext, userRole.FormIntID ?? "0");

                }
                else
                {
                    controller.ViewBag.UserFormRole = new DO_UserFormRole() { IsInsert = true, IsEdit = true, IsDelete = true, IsView = true };
                    controller.ViewBag.formName = "";
                    AppSessionVariables.SetSessionFormID(context.HttpContext, 0);
                    AppSessionVariables.SetSessionFormInternalID(context.HttpContext, "0");
                }
            }

            base.OnResultExecuting(context);
        }
    }
}

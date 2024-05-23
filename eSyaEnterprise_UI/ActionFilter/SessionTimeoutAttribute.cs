using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using eSyaEnterprise_UI.Utility;

namespace eSyaEnterprise_UI.ActionFilter
{
    public class SessionTimeoutAttribute : ActionFilterAttribute
    {
        //public override void OnActionExecuting(ActionExecutingContext filterContext)
        //{
        //    var canAcess = false;
        //    // check the refer
        //    var referer = filterContext.HttpContext.Request.Headers["Referer"].ToString();
        //    if (!string.IsNullOrEmpty(referer))
        //    {
        //        var rUri = new System.UriBuilder(referer).Uri;
        //        var req = filterContext.HttpContext.Request;
        //        if (req.Host.Host == rUri.Host && req.Host.Port == rUri.Port && req.Scheme == rUri.Scheme)
        //        {
        //            canAcess = true;
        //        }
        //    }

        //    // ... check other requirements

        //    if (!canAcess)
        //    {
        //        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Account", action = "Index", area = "" }));
        //    }
        //}

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (AppSessionVariables.GetCurrentSessionUserID(context.HttpContext) == null)
            {
                context.Result = new RedirectResult("~/Account/Logout");
                return;
            }
            //if (AppSessionVariables.GetCurrentSessionUserID(context.HttpContext) == 0)
            //{
            //    context.Result = new RedirectResult("~/Account/Logout");
            //    return;
            //}
            base.OnActionExecuting(context);
        }
    }
}

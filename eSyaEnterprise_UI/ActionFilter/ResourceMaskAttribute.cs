using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace eSyaEnterprise_UI.ActionFilter
{
    public class ResourceMaskAttribute:ActionFilterAttribute
    {
        private readonly IUserAccountServices _userAccountServices;
        public ResourceMaskAttribute(IUserAccountServices userAccountServices)
        {
            _userAccountServices = userAccountServices;
        }
        public override void OnResultExecuting(ResultExecutingContext context)
        {
            if (context.Controller is Controller)
            {
                var controller = context.Controller as Controller;

                List<FormControlProperty> resoucemask = new List<FormControlProperty>();

             
                resoucemask = _userAccountServices.GetFormControlPropertybyUserRole().Result;

                if (resoucemask != null)
                {
                    controller.ViewBag.ResourceMask = resoucemask;

                }

            }

            base.OnResultExecuting(context);



        }
    }
}

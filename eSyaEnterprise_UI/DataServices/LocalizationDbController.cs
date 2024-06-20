using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eSyaEnterprise_UI.GestaltUserDataServices;
using eSyaEnterprise_UI.Models;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.DataServices
{
    public class LocalizationDbController : Controller
    {
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        private readonly IeSyaGestaltUserSetUpGatewayServices _esyaGestaltSetUpGateway;
        public LocalizationDbController(IeSyaGatewayServices eSyaGatewayServices, IeSyaGestaltUserSetUpGatewayServices esyaGestaltSetUpGateway)
        {
            _eSyaGatewayServices = eSyaGatewayServices;
            _esyaGestaltSetUpGateway = esyaGestaltSetUpGateway;
        }

        public List<DO_LocalizationResource> GetLocalizationResourceString(string culture, string resourceName)
        {
            try
            {
                var param = "?culture=" + culture;
                param += "resourceName=" + resourceName;
                var serviceResponse = _eSyaGatewayServices.HttpClientServices.GetAsync<List<DO_LocalizationResource>>("LocalizationResource/GetLocalizationResourceString" + param).Result;
                //var serviceResponse = _esyaGestaltSetUpGateway.HttpClientServices.GetAsync<List<DO_LocalizationResource>>("eSyaUserAccount/GetLocalizationResourceString" + param).Result;
                return serviceResponse.Data;
            }
            catch (Exception ex)
            {
                return new List<DO_LocalizationResource>();
            }

        }

    }
}
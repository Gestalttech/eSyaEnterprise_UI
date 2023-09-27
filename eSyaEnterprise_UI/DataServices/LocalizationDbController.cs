using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eSyaEnterprise_UI.Models;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.DataServices
{
    public class LocalizationDbController : Controller
    {
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        public LocalizationDbController(IeSyaGatewayServices eSyaGatewayServices)
        {
            _eSyaGatewayServices = eSyaGatewayServices;
        }

        public List<DO_LocalizationResource> GetLocalizationResourceString(string culture, string resourceName)
        {
            try
            {
                var param = "?culture=" + culture;
                param += "resourceName=" + resourceName;
                var serviceResponse = _eSyaGatewayServices.HttpClientServices.GetAsync<List<DO_LocalizationResource>>("LocalizationResource/GetLocalizationResourceString"+ param).Result;
                return serviceResponse.Data;
            }
            catch (Exception ex)
            {
                return new List<DO_LocalizationResource>();
            }

        }

    }
}
using eSyaEssentials_UI;
using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
namespace eSyaEnterprise_UI.Areas.ConfigFacilities.Data
{
    public class eSyaFacilityAPIServices : IeSyaFacilityAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaFacilityAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {
            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.Vendor.Data
{
    public class eSyaVendorAPIServices : IeSyaVendorAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaVendorAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

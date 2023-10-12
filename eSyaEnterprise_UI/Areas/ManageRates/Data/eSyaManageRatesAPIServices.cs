using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ManageRates.Data
{
    public class eSyaManageRatesAPIServices : IeSyaManageRatesAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaManageRatesAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {
            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

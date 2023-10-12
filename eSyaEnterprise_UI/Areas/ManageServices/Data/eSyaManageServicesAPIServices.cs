using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.ManageServices.Data
{
    public class eSyaManageServicesAPIServices : IeSyaManageServicesAPIServices
    {

        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaManageServicesAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {
            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

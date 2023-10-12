using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.Stores.Data
{
    public class eSyaStoreAPIServices : IeSyaStoreAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaStoreAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

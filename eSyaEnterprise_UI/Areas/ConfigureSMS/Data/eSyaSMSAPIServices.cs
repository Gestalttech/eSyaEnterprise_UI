using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.ConfigureSMS.Data
{
    public class eSyaSMSAPIServices : IeSyaSMSAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaSMSAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.ConfigureEmail.Data
{
    public class eSyaEmailAPIServices : IeSyaEmailAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaEmailAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

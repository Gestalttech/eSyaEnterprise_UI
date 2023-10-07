using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.EndUser.Data
{
    public class eSyaEndUserAPIServices : IeSyaEndUserAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaEndUserAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

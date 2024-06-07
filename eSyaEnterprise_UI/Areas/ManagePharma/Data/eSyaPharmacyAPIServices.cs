using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ManagePharma.Data
{
    public class eSyaPharmaAPIServices: IeSyaPharmaAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaPharmaAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

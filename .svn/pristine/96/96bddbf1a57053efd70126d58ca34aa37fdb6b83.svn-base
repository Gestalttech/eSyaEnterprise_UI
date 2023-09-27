using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.DataServices
{
    public class eSyaGatewayServices: IeSyaGatewayServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaGatewayServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }

    }
}

using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.Admin.Data
{
    public class eSyaAdminAPIServices : IeSyaAdminAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaAdminAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

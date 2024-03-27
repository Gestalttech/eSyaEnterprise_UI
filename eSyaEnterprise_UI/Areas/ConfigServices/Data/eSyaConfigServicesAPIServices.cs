using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.ConfigServices.Data
{
    public class eSyaConfigServicesAPIServices: IeSyaConfigServicesAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaConfigServicesAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

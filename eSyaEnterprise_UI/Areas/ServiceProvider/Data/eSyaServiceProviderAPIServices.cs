using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.ServiceProvider.Data
{
    public class eSyaServiceProviderAPIServices: IeSyaServiceProviderAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaServiceProviderAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

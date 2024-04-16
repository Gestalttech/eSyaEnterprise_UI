using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.ConfigStores.Data
{
    public class eSyaConfigStoreAPIServices: IeSyaConfigStoreAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaConfigStoreAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

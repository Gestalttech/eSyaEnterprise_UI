using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.ConfigeSya.Data
{
    public class eSyaConfigeSyaAPIServices: IeSyaConfigeSyaAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaConfigeSyaAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {
            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

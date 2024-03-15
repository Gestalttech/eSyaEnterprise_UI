using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.ConfigBusiness.Data
{
    public class eSyaConfigBusinessAPIServices: IeSyaConfigBusinessAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaConfigBusinessAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {
            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

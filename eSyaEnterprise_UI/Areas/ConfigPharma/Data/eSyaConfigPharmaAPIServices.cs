using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.ConfigPharma.Data
{
    public class eSyaConfigPharmaAPIServices: IeSyaConfigPharmaAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaConfigPharmaAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

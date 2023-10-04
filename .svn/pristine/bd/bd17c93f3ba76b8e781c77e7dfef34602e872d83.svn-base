using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.Localize.Data
{

    public class eSyaLocalizeAPIServices : IeSyaLocalizeAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaLocalizeAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }

    }
}

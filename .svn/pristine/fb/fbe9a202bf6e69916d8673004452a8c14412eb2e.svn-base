using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.ProductSetup.Data
{
    public class eSyaProductSetupAPIServices : IeSyaProductSetupAPIServices
    {

        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaProductSetupAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }


    }
}

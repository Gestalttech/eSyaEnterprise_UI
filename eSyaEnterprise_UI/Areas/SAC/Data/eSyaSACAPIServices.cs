using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.SAC.Data
{
    public class eSyaSACAPIServices : IeSyaSACAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaSACAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

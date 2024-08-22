using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.FinAdmin.Data
{
    public class eSyaFinAdminAPIServices : IeSyaFinAdminAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaFinAdminAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

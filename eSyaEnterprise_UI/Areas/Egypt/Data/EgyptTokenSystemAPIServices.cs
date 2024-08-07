using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.Egypt.Data
{
    public class EgyptTokenSystemAPIServices : IEgyptTokenSystemAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public EgyptTokenSystemAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

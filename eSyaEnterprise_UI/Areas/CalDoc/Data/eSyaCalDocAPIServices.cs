using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.CalDoc.Data
{
    public class eSyaCalDocAPIServices: IeSyaCalDocAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaCalDocAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {
            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

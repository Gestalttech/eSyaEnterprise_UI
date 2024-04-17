using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.InterfaceEmail.Data
{
    public class eSyaInterfaceEmailAPIServices: IeSyaInterfaceEmailAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaInterfaceEmailAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

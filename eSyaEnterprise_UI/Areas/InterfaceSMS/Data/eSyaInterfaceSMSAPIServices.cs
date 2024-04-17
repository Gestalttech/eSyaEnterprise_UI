using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.InterfaceSMS.Data
{
    public class eSyaInterfaceSMSAPIServices : IeSyaInterfaceSMSAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaInterfaceSMSAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

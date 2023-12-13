using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.GestaltUserDataServices
{
    public class eSyaGestaltUserSetUpGatewayServices: IeSyaGestaltUserSetUpGatewayServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaGestaltUserSetUpGatewayServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.Customer.Data
{
    public class eSyaCustomerAPIServices: IeSyaCustomerAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaCustomerAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.ConfigInventory.Data
{
    public class eSyaConfigInventoryAPIServices: IeSyaConfigInventoryAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaConfigInventoryAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

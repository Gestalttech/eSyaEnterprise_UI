using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.ViewAdmin.Data
{
    public class eSyaViewAdminAPIServices: IeSyaViewAdminAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaViewAdminAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

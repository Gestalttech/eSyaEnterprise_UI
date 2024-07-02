using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.ConfigFin.Data
{
    public class eSyaFinanceAPIServices: IeSyaFinanceAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaFinanceAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

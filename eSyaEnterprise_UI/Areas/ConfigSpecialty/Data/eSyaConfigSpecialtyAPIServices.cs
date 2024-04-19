using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.ConfigSpecialty.Data
{
    public class eSyaConfigSpecialtyAPIServices: IeSyaConfigSpecialtyAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaConfigSpecialtyAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

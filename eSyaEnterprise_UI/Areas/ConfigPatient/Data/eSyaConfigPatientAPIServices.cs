using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.ConfigPatient.Data
{
   
    public class eSyaConfigPatientAPIServices: IeSyaConfigPatientAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaConfigPatientAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {
            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

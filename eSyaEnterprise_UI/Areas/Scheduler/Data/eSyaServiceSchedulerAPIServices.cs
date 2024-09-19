using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.Scheduler.Data
{
    public class eSyaServiceSchedulerAPIServices: IeSyaServiceSchedulerAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaServiceSchedulerAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

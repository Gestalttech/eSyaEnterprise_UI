using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.Approval.Data
{
    public class eSyaApprovalProcessAPIServices: IeSyaApprovalProcessAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaApprovalProcessAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {
            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

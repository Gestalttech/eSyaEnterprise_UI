using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.DocumentControl.Data
{
    public class eSyaDocumentControlAPIServices: IeSyaDocumentControlAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaDocumentControlAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

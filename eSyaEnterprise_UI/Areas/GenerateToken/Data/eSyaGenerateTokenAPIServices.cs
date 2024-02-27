using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.GenerateToken.Data
{
    public class eSyaGenerateTokenAPIServices: IeSyaGenerateTokenAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyaGenerateTokenAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

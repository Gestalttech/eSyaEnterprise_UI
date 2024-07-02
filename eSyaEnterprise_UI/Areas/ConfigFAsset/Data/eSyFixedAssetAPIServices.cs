using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.ConfigFAsset.Data
{
    public class eSyFixedAssetAPIServices: IeSyFixedAssetAPIServices
    {
        public IHttpClientServices HttpClientServices { get; set; }
        public eSyFixedAssetAPIServices(HttpClient httpClient, IHttpClientServices clientServices)
        {

            clientServices.Client = httpClient;
            HttpClientServices = clientServices;
        }
    }
}

using eSyaEssentials_UI;

namespace eSyaEnterprise_UI.Areas.ServiceProvider.Data
{
    public interface IeSyaServiceProviderAPIServices
    {
        IHttpClientServices HttpClientServices { get; set; }
    }
}

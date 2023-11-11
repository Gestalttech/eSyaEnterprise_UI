using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.Vendor.Data
{
    public interface IeSyaVendorAPIServices
    {
        IHttpClientServices HttpClientServices { get; set; }
    }
}

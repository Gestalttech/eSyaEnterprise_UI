using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ConfigServices.Data
{
    public interface IeSyaConfigServicesAPIServices
    {
        IHttpClientServices HttpClientServices { get; set; }
    }
}

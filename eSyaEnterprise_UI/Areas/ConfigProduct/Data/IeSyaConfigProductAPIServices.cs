using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ConfigProduct.Data
{
    public interface IeSyaConfigProductAPIServices
    {
        IHttpClientServices HttpClientServices { get; set; }
    }
}

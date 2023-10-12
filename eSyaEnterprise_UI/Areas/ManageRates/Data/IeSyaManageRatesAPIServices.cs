using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ManageRates.Data
{
    public interface IeSyaManageRatesAPIServices
    {
        IHttpClientServices HttpClientServices { get; set; }
    }
}

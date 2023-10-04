using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ConfigureSMS.Data
{
    public interface IeSyaSMSAPIServices
    {
        IHttpClientServices HttpClientServices { get; set; }
    }
}

using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ConfigureEmail.Data
{
    public interface IeSyaEmailAPIServices
    {
        IHttpClientServices HttpClientServices { get; set; }
    }
}

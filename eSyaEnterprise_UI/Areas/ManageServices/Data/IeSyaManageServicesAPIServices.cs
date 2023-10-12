using eSyaEssentials_UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace eSyaEnterprise_UI.Areas.ManageServices.Data
{
    public interface IeSyaManageServicesAPIServices
    {
        IHttpClientServices HttpClientServices { get; set; }
    }
}

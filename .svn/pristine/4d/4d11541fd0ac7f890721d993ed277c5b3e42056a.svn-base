using eSyaEnterprise_UI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.DataServices
{
    public class SmsServices : ISmsServices
    {
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        public SmsServices(IeSyaGatewayServices eSyaGatewayServices)
        {
            _eSyaGatewayServices = eSyaGatewayServices;
        }

        public void SendSmsForForm(DO_SmsParameter smsparams)
        {
            _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_SmsParameter>("SmsSender/SendSmsForForm", smsparams);
        }

    }
}

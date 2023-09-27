using eSyaEnterprise_UI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.DataServices
{
    public interface ISmsServices
    {
        void SendSmsForForm(DO_SmsParameter smsparams);
    }
}

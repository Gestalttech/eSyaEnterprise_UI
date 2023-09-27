using eSyaEnterprise_UI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.DataServices
{
    public class ApplicationRulesServices : IApplicationRulesServices
    {
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        public ApplicationRulesServices(IeSyaGatewayServices eSyaGatewayServices)
        {
            _eSyaGatewayServices = eSyaGatewayServices;
        }

        public async Task<bool> GetApplicationRuleStatusByID(int processID, int ruleID)
        {
            try
            {
                var param = "processID=" + processID + "&ruleID" + ruleID;
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<bool>("ApplicationRules/GetApplicationRuleStatusByID?"+ param);
                return serviceResponse.Data;
            }
            catch 
            {
                return false;
            }
        }

        public async Task<List<DO_ApplicationRules>> GetApplicationRuleListByProcesssID(int processID)
        {
            try
            {
                var param = "processID=" + processID;
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<List<DO_ApplicationRules>>("ApplicationRules/GetApplicationRuleListByProcesssID?"+ param);
                return serviceResponse.Data;
            }
            catch
            {
                return new List<DO_ApplicationRules>();
            }
        }
    }
}

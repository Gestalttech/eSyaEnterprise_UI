using eSyaEnterprise_UI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.DataServices
{
    public interface IApplicationRulesServices
    {
        Task<bool> GetApplicationRuleStatusByID(int processID, int ruleID);
        //need to delete
        Task<List<DO_ApplicationRules>> GetApplicationRuleListByProcesssID(int processID);

        Task<bool> GetBusinessApplicationRuleByBusinessKey(int businesskey, int processID, int ruleID);

        Task<bool> GetMobileLoginApplicationRuleStatusByID(int processID);
    }
}

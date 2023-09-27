using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Extension
{
    public static class ExceptionVariable
    {
        public static string GetMessage(Exception ex)
        {
            string msg = ex.InnerException == null ? ex.ToString() : ex.InnerException.Message;
            if (msg.LastIndexOf(',') == msg.Length - 1)
                msg = msg.Remove(msg.LastIndexOf(','));
            return msg;
        }

       public enum EventMethod
        {
            View,
            Get,
            Post,
        }
    }
}

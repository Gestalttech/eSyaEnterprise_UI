using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Utility
{
    public class AppSessionVariables
    {
        public static void SetSessionIsEsyaUser(HttpContext httpContext, bool isESyaUser)
        {
            httpContext.Session.SetString("IsESyaUser", isESyaUser.ToString());
        }

        public static bool GetSessionIsEsyaUser(HttpContext httpContext)
        {
            var key = httpContext.Session.GetString("IsESyaUser");
            return Convert.ToBoolean(key ?? "false");
        }

        public static void SetSessionUserID(HttpContext httpContext, int userID)
        {
            httpContext.Session.SetInt32("UserID", userID);
        }

        public static int GetSessionUserID(HttpContext httpContext)
        {
            var key = httpContext.Session.GetInt32("UserID");
            return (short)(key == null ? 0 : key);
        }

        public static int? GetCurrentSessionUserID(HttpContext httpContext)
        {
            var key = httpContext.Session.GetInt32("UserID");
            return key;
        }

        public static void SetSessionBusinessKey(HttpContext httpContext, int businessKey)
        {
            httpContext.Session.SetInt32("BusinessKey", businessKey);
        }

        public static string GetSessionBusinessLocationName(HttpContext httpContext)
        {
            var key = httpContext.Session.GetString("BusinessLocationName");
            return key;
        }


        public static void SetSessionBusinessLocationName(HttpContext httpContext, string businessLocationName)
        {
            httpContext.Session.SetString("BusinessLocationName", businessLocationName);
        }

        public static int GetSessionBusinessKey(HttpContext httpContext)
        {
            var key = httpContext.Session.GetInt32("BusinessKey");
            return (int)(key == null ? 587 : key);
        }

        public static void SetSessionUserBusinessKeyLink(HttpContext httpContext, Dictionary<int, string> l_businessKey)
        {
            httpContext.Session.SetString("UserBusinessKeyLink", JsonConvert.SerializeObject(l_businessKey));
        }
        public static Dictionary<int, string> GetSessionUserBusinessKeyLink(HttpContext httpContext)
        {
             var UserBusinessKeyLink = httpContext.Session.GetString("UserBusinessKeyLink");
            if (UserBusinessKeyLink != null)
                return JsonConvert.DeserializeObject<Dictionary<int, string>>(UserBusinessKeyLink);
            else
                return new Dictionary<int, string>();
        }

        public static void SetSessionFinancialYear(HttpContext httpContext, int financialYear)
        {
            httpContext.Session.SetInt32("FinancialYear", financialYear);
        }

        public static short GetSessionFinancialYear(HttpContext httpContext)
        {
            var key = httpContext.Session.GetInt32("FinancialYear");
            return (short)(key == null ? 0 : key);
        }

        public static void SetSessionUserType(HttpContext httpContext, int userType)
        {
            httpContext.Session.SetInt32("UserType", userType);
        }

        public static int GetSessionUserType(HttpContext httpContext)
        {
            var key = httpContext.Session.GetInt32("UserType");
            return (short)(key == null ? 0 : key);
        }


        public static void SetSessionFormID(HttpContext httpContext, int formID)
        {
            httpContext.Session.SetInt32("FormID", formID);
        }
        public static int GetSessionFormID(HttpContext httpContext)
        {
            var key = httpContext.Session.GetInt32("FormID");
            return (int)(key == null ? 0 : key);
        }

        public static void SetSessionFormInternalID(HttpContext httpContext, string formID)
        {
            httpContext.Session.SetString("FormInternalID", formID);
        }

        public static string GetSessionFormInternalID(HttpContext httpContext)
        {
            var key = httpContext.Session.GetString("FormInternalID");
            return key ?? "0";
        }

        public static void SetSessionDoctorID(HttpContext httpContext, int doctorID)
        {
            httpContext.Session.SetInt32("DoctorID", doctorID);
        }
        public static int? GetSessionDoctorID(HttpContext httpContext)
        {
            var key = httpContext.Session.GetInt32("DoctorID");
            return key;
        }


        public static string GetIPAddress(HttpContext httpContext)
        {
            var _accessor = httpContext.RequestServices.GetRequiredService<IHttpContextAccessor>();
            var ip = _accessor.HttpContext?.Connection?.RemoteIpAddress?.ToString();

            IPHostEntry heserver = Dns.GetHostEntry(Dns.GetHostName());
            ip = heserver.AddressList[1].ToString();

            return ip;
        }
    }

    public class SessionManager
    {

        private readonly ISession _session;
        private const String UserId_KEY = "UserID";
        public SessionManager(IHttpContextAccessor httpContextAccessor)
        {
            _session = httpContextAccessor.HttpContext.Session;
        }

        public int UserID
        {
            get => _session.GetInt32(UserId_KEY) ?? 0;
            set => _session.SetInt32(UserId_KEY, value);
        }
    }

}

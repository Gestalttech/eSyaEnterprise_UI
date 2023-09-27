using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Extension
{
    public static class SessionExtensions
    {
        //public static double? GetDouble(this ISession session, string key)
        //{
        //    var data = session.Get(key);
        //    if (data == null)
        //    {
        //        return null;
        //    }
        //    return BitConverter.ToDouble(data, 0);
        //}

        //public static void SetDouble(this ISession session, string key, double value)
        //{
        //    session.Set(key, BitConverter.GetBytes(value));
        //}

        //public static T GetComplexData<T>(this ISession session, string key)
        //{
        //    var data = session.GetString(key);
        //    if (data == null)
        //    {
        //        return default(T);
        //    }
        //    return JsonConvert.DeserializeObject<T>(data);
        //}

        //public static void SetComplexData(this ISession session, string key, object value)
        //{
        //    session.SetString(key, JsonConvert.SerializeObject(value));

        //    // HttpContext.Session.SetComplexData("Object", obj);
        //}

        //public static void SetObjectAsJson(this ISession session, string key, object value)
        //{
        //    session.SetString(key, JsonConvert.SerializeObject(value));

        //    //SessionHelper.SetObjectAsJson(HttpContext.Session, "Object", obj);
        //}

        //public static T GetObjectFromJson<T>(this ISession session, string key)
        //{
        //    var value = session.GetString(key);
        //    return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
        //    //Object obj = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "Object");
        //}

        public static void Set<T>(this ISession session, string key, T value)
        {
            session.SetString(key, JsonConvert.SerializeObject(value));
        }

        public static T Get<T>(this ISession session, string key)
        {
            var value = session.GetString(key);

            return value == null ? default(T) :
                JsonConvert.DeserializeObject<T>(value);
        }
    }
}

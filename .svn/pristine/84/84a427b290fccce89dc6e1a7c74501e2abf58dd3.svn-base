using Newtonsoft.Json;
using System;
using System.IO;

namespace eSyaEnterprise_UI.Extension
{
    public static class JsonStream
    {
        public static T Read<T>(string filePath)
        {
            try
            {
                return JsonConvert.DeserializeObject<T>(File.ReadAllText(filePath));
            }
            catch
            {
                return default(T);
            }
        }
        public static void Write<T>(T model, string filePath)
        {
            File.WriteAllText(filePath, JsonConvert.SerializeObject(model));
        }
    }

    public class MenuItem
    {
        public string MenuName { get; set; }
        public string Version { get; set; }
    }


}

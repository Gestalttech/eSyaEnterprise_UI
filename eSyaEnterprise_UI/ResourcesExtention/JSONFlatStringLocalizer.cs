using eSyaEnterprise_UI.DataServices;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Ref
{

    /// <summary>
    ///  Startup.cs
    ///  Add following line 
    ///  services.AddSingleton<IStringLocalizerFactory, JsonStringLocalizerFactory>();
    ///  services.AddSingleton<IStringLocalizer, JsonStringLocalizer>();
    /// </summary>
    public class JsonStringLocalizerFactory : IStringLocalizerFactory
    {
        public IStringLocalizer Create(Type resourceSource)
        {
            return new JSONFlatStringLocalizer();
        }

        public IStringLocalizer Create(string baseName, string location)
        {
            return new JSONFlatStringLocalizer(baseName);
        }
    }

    public class JSONFlatStringLocalizer : IStringLocalizer
    {
        List<JsonLocalization> localization = new List<JsonLocalization>();
        private string _baseName = "";

        public JSONFlatStringLocalizer()
        {
            //JsonSerializer serializer = new JsonSerializer();
            //localization = JsonConvert.DeserializeObject<List<JsonLocalization>>(File.ReadAllText(@"localization.json"));
        }

        public JSONFlatStringLocalizer(string baseName)
        {
            _baseName = baseName;

            //var rootPath = _baseName.Split(new char[] { '.' }, StringSplitOptions.None).Skip(1).Take(2);
            //var resourcesPath = string.Join(@"\", rootPath);
            //var culture = CultureInfo.CurrentUICulture;
            //var resourceName = @"Resources\localization";
            //var resourceFile = $"{resourceName}.json";
            ////var resourceFile = $"{resourceName}.{culture.Name}.json";
            //var localizationFilePath = Path.Combine(resourcesPath, resourceFile);
            ////localizationFilePath = @"localization.json";
            ////read all json file
            //JsonSerializer serializer = new JsonSerializer();
            //localization = JsonConvert.DeserializeObject<List<JsonLocalization>>(File.ReadAllText(localizationFilePath));

        }


        public LocalizedString this[string name]
        {
            get
            {
                var value = GetString(name);
                return new LocalizedString(name, value ?? name, resourceNotFound: value == null);
            }
        }

        public LocalizedString this[string name, params object[] arguments]
        {
            get
            {
                var format = GetString(name);
                var value = string.Format(format ?? name, arguments);
                return new LocalizedString(name, value, resourceNotFound: format == null);
            }
        }

        public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures)
        {
            return localization.Where(l => l.LocalizedValue.Keys.Any(lv => lv == CultureInfo.CurrentUICulture.Name)).Select(l => new LocalizedString(l.Key, l.LocalizedValue[CultureInfo.CurrentUICulture.Name], true));
        }

        public IStringLocalizer WithCulture(CultureInfo culture)
        {
            return new JSONFlatStringLocalizer(_baseName);
        }

        private string GetString(string name)
        {
            var query = localization.Where(l => l.LocalizedValue.Keys.Any(lv => lv == CultureInfo.CurrentUICulture.Name));
            var value = query.FirstOrDefault(l => l.Key == name);
            if (value != null)
                return value.LocalizedValue[CultureInfo.CurrentUICulture.Name];
            else
                return name;
        }
    }

    class JsonLocalization
    {
        public string Key { get; set; }
        public Dictionary<string, string> LocalizedValue = new Dictionary<string, string>();

    }
}

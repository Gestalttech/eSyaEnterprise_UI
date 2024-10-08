using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.GestaltUserDataServices;
using eSyaEnterprise_UI.Models;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.ResourcesExtention
{

    /// <summary>
    ///  Startup.cs
    ///  Add following line 
    ///  services.AddSingleton<IStringLocalizerFactory, JsonStringLocalizerFactory>();
    ///  services.AddSingleton<IStringLocalizer, JsonDbContextStringLocalizer>();
    /// </summary>
    public class JsonStringLocalizerFactory : IStringLocalizerFactory
    {
        private IWebHostEnvironment  _environment;
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        private readonly IeSyaGestaltUserSetUpGatewayServices _esyaGestaltSetUpGateway;
        public JsonStringLocalizerFactory(IeSyaGatewayServices eSyaGatewayServices, IeSyaGestaltUserSetUpGatewayServices esyaGestaltSetUpGateway, IWebHostEnvironment environment)
        {
            _eSyaGatewayServices = eSyaGatewayServices;
            _esyaGestaltSetUpGateway = esyaGestaltSetUpGateway;
            _environment = environment;
        }
        public IStringLocalizer Create(Type resourceSource)
        {
            return new JsonDbContextStringLocalizer(_eSyaGatewayServices, _esyaGestaltSetUpGateway, _environment);
        }

        public IStringLocalizer Create(string baseName, string location)
        {
            return new JsonDbContextStringLocalizer(_eSyaGatewayServices, _esyaGestaltSetUpGateway, baseName, _environment);
        }
    }

    public class JsonDbContextStringLocalizer : IStringLocalizer
    {
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        private readonly JsonSerializer _serializer = new JsonSerializer();
        private IWebHostEnvironment _environment;
        private readonly IeSyaGestaltUserSetUpGatewayServices _esyaGestaltSetUpGateway;
        List<DO_LocalizationResource> localization = new List<DO_LocalizationResource>();
        private string _baseName = "";

        public JsonDbContextStringLocalizer(IeSyaGatewayServices eSyaGatewayServices, IeSyaGestaltUserSetUpGatewayServices esyaGestaltSetUpGateway, IWebHostEnvironment environment)
        {
            _eSyaGatewayServices = eSyaGatewayServices;
            _esyaGestaltSetUpGateway = esyaGestaltSetUpGateway;
            _environment = environment;
        }

        public JsonDbContextStringLocalizer(IeSyaGatewayServices eSyaGatewayServices, IeSyaGestaltUserSetUpGatewayServices esyaGestaltSetUpGateway, string baseName, IWebHostEnvironment environment)
        {
            _environment = environment;
            _eSyaGatewayServices = eSyaGatewayServices;
            _esyaGestaltSetUpGateway = esyaGestaltSetUpGateway;
            _baseName = baseName;
            var resourceName = _baseName.Split(new char[] { '.' }, StringSplitOptions.None).Reverse().Skip(1).FirstOrDefault() ?? "";

            try
            {
                var param = "?culture=" + CultureInfo.CurrentUICulture.Name;
                param += "&resourceName=" + resourceName;
                var serviceResponse = _eSyaGatewayServices.HttpClientServices.GetAsync<List<DO_LocalizationResource>>("LocalizationResource/GetLocalizationResourceString" + param).Result;
                //var serviceResponse = _esyaGestaltSetUpGateway.HttpClientServices.GetAsync<List<DO_LocalizationResource>>("eSyaUserAccount/GetLocalizationResourceString" + param).Result;

                localization = serviceResponse.Data;



            }
            catch
            {

            }
        }


        public LocalizedString this[string name]
        {
            get
            {
                var value = string.Empty;
                if (name.StartsWith("UI"))
                {
                    value= GetJsonStringData(name);
                }
                else
                {
                    value = GetString(name);
                }
               
                return new LocalizedString(name, value ?? name, resourceNotFound: value == null);
            }
        }

        public LocalizedString this[string name, params object[] arguments]
        {
            get
            {
                var format = string.Empty;
                if (name.StartsWith("UI"))
                {
                    format = GetJsonStringData(name);
                }
                else
                {
                    format = GetString(name);
                }
                //var format = GetString(name);
                var value = string.Format(format ?? name, arguments);
                return new LocalizedString(name, value, resourceNotFound: format == null);
            }
        }

        public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures)
        {
            //return localization.Where(l => l.Culture == CultureInfo.CurrentUICulture.Name).Select(l => new LocalizedString(l.Key, l.Value, true));
            return localization.Select(l => new LocalizedString(l.Key, l.Value, true));
        }

        public IStringLocalizer WithCulture(CultureInfo culture)
        {
            return new JsonDbContextStringLocalizer(_eSyaGatewayServices, _esyaGestaltSetUpGateway,  _baseName,_environment);
        }

        private string GetString(string name)
        {
            
            if (localization != null)
            {
                var lv = localization.Where(l => //l.Culture == CultureInfo.CurrentUICulture.Name &&
                         l.Key == name).FirstOrDefault();
                if (lv != null)
                    return lv.Value;
                else
                    return name;
            }
            else
                return name;
        }
    //
        private string GetJsonStringData(string key)
        {

            //var filepath = $"UIResources/{Thread.CurrentThread.CurrentCulture.Name}.json";

            var filepath = $"UIResources/{CultureInfo.CurrentUICulture.Name}.json";

            if (string.IsNullOrWhiteSpace(_environment.WebRootPath))
            {
                _environment.ContentRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            }
            string fullFilePath = Path.Combine(this._environment.WebRootPath, filepath);

            if (File.Exists(fullFilePath))
            {
                var result = GetValueFromJson(key, fullFilePath);
                return result;
            }
            return string.Empty;
        }

        private string GetValueFromJson(string propertyName, string filePath)
        {
            if (string.IsNullOrEmpty(propertyName) || string.IsNullOrEmpty(filePath))
            {
                return string.Empty;

            }
            using (FileStream stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                StreamReader streamreader = new StreamReader(stream);
                JsonTextReader reader = new JsonTextReader(streamreader);
                while (reader.Read())
                {
                    if (reader.TokenType == JsonToken.PropertyName && reader.Value as string == propertyName)
                    {
                        reader.Read();
                        return _serializer.Deserialize<string>(reader);
                    }
                }
                return string.Empty;
            }

        }
        //
    }
}

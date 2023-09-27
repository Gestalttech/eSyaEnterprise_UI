using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Models;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
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
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        public JsonStringLocalizerFactory(IeSyaGatewayServices eSyaGatewayServices)
        {
            _eSyaGatewayServices = eSyaGatewayServices;
        }
        public IStringLocalizer Create(Type resourceSource)
        {
            return new JsonDbContextStringLocalizer(_eSyaGatewayServices);
        }

        public IStringLocalizer Create(string baseName, string location)
        {
            return new JsonDbContextStringLocalizer(_eSyaGatewayServices, baseName);
        }
    }

    public class JsonDbContextStringLocalizer : IStringLocalizer
    {
        private readonly IeSyaGatewayServices _eSyaGatewayServices;

        List<DO_LocalizationResource> localization = new List<DO_LocalizationResource>();
        private string _baseName = "";

        public JsonDbContextStringLocalizer(IeSyaGatewayServices eSyaGatewayServices)
        {
            _eSyaGatewayServices = eSyaGatewayServices;
        }

        public JsonDbContextStringLocalizer(IeSyaGatewayServices eSyaGatewayServices, string baseName)
        {
            _eSyaGatewayServices = eSyaGatewayServices;
            _baseName = baseName;
            var resourceName = _baseName.Split(new char[] { '.' }, StringSplitOptions.None).Reverse().Skip(1).FirstOrDefault() ?? "";

            try
            {
                var param = "?culture=" + CultureInfo.CurrentUICulture.Name;
                param += "&resourceName=" + resourceName;
                var serviceResponse = _eSyaGatewayServices.HttpClientServices.GetAsync<List<DO_LocalizationResource>>("LocalizationResource/GetLocalizationResourceString" + param).Result;
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
            //return localization.Where(l => l.Culture == CultureInfo.CurrentUICulture.Name).Select(l => new LocalizedString(l.Key, l.Value, true));
            return localization.Select(l => new LocalizedString(l.Key, l.Value, true));
        }

        public IStringLocalizer WithCulture(CultureInfo culture)
        {
            return new JsonDbContextStringLocalizer(_eSyaGatewayServices, _baseName);
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
    }
}

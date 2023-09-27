using Microsoft.Extensions.Localization;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Utility
{
    public class DataAnnotationResource : IStringLocalizer
    {
      
            public LocalizedString this[string name]
            {
                get
                {
                    return new LocalizedString(name, name + "test localizer");
                }
            }

            public LocalizedString this[string name, params object[] arguments]
            {
                get
                {
                    return new LocalizedString(name, name + "test localizer");
                }
            }

            public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures)
            {
                return new List<LocalizedString>();
            }

            public IStringLocalizer WithCulture(CultureInfo culture)
            {
                return this;
            }

    }
}

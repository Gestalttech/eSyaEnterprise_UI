using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Extension
{
    public static class DateTimeExtensions
    {
        public static string ToJsonDateFormat(this DateTime dt)
        {
            return dt.ToString("yyyy/MM/dd hh:mm:ss");
        }

        public static string ToJsonDateFormat(this DateTime? dt)
        {
            return dt.HasValue ? dt.Value.ToJsonDateFormat() : string.Empty;
        }
    }
}

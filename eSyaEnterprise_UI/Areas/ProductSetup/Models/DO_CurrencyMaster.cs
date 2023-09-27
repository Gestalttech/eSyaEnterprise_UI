using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ProductSetup.Models
{
    public class DO_CurrencyMaster
    {
        public string CurrencyCode { get; set; }
        public string CurrencyName { get; set; }
        public string Symbol { get; set; }
        public decimal DecimalPlaces { get; set; }
        public bool ShowInMillions { get; set; }
        public bool SymbolSuffixToAmount { get; set; }
        public string DecimalPortionWord { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
    public class DO_ExchangeRate
    {
        public int BusinessKey { get; set; }
        public string CurrencyCode { get; set; }
        public DateTime DateOfExchangeRate { get; set; }
        public decimal? StandardRate { get; set; }
        public decimal? SellingRate { get; set; }
        public DateTime? SellingLastVoucherDate { get; set; }
        public decimal? BuyingRate { get; set; }
        public DateTime? BuyingLastVoucherDate { get; set; }
        public bool ActiveStatus { get; set; }
        public string CurrencyName { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

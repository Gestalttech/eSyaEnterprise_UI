using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eSya.Finance.DO
{
    public class DO_CurrencyExchangeRate
    {
        public string CurrencyCode { get; set; }
        public string CurrencyDesc { get; set; }
        public DateTime DateOfExchangeRate { get; set; }
        public decimal StandardRate { get; set; }
        public decimal SellingRate { get; set; }
        public DateTime? SellingLastVoucherDate { get; set; }
        public decimal BuyingRate { get; set; }
        public DateTime? BuyingLastVoucherDate { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedON { get; set; }
        public string TerminalID { get; set; }
    }
}

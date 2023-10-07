using eSyaEnterprise_UI.Areas.ProductSetup.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.Admin.Models
{
    public class DO_BusinessLocation
    {
        public int BusinessId { get; set; }
        public int BusinessKey { get; set; }
        public int LocationId { get; set; }
        public string LocationDescription { get; set; }
        public string BusinessName { get; set; }
        public byte[] EBusinessKey { get; set; }
        public int Isdcode { get; set; }
        public int CityCode { get; set; }
        public string CurrencyCode { get; set; }
        public int TaxIdentification { get; set; }
        public string ESyaLicenseType { get; set; }
        public int EUserLicenses { get; set; }
        public byte[] EActiveUsers { get; set; }
        public int ENoOfBeds { get; set; }
        public bool? TolocalCurrency { get; set; }
        public bool TocurrConversion { get; set; }
        public bool TorealCurrency { get; set; }
        public bool IsBookOfAccounts { get; set; }
        public int BusinessSegmentId { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        //for display properties
        public string CurrencyName { get; set; }
        public List<DO_BusienssSegmentCurrency> l_BSCurrency { get; set; }

        public int SegmentId { get; set; }
    }
}

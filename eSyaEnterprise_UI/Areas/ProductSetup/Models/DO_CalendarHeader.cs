using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ProductSetup.Models
{
    public class DO_CalendarHeader
    {
        public int BusinessKey { get; set; }
        public string CalenderType { get; set; }
        public decimal Year { get; set; }
        public string? CalenderKey { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime TillDate { get; set; }
        public bool YearEndStatus { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public bool Alreadylinked { get; set; }


    }
    public class DO_CalendarDetails
    {
        public int BusinessKey { get; set; }
        public string CalenderKey { get; set; }
        public int MonthId { get; set; }
        public int ParameterId { get; set; }
        public decimal ParmPerc { get; set; }
        public bool ParmAction { get; set; }
        public string? ParmDesc { get; set; }
        public decimal ParmValue { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string MonthDescription { get; set; }

    }
    public class DO_CalendarBusinessLink
    {
        public int BusinessKey { get; set; }
        public string CalenderKey { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime TillDate { get; set; }
        public bool YearEndStatus { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
    public class DO_CalendarPatientIdGeneration
    {
        public int BusinessKey { get; set; }
        public string CalenderKey { get; set; }
        public int MonthId { get; set; }
        public string PatientIdgen { get; set; }
        public int PatientIdserial { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? MonthDescription { get; set; }
        public int EditMonthId { get; set; }
        public DateTime Fromdate { get; set; }
        public DateTime Tilldate { get; set; }
        public decimal Year { get; set; }
    }
}

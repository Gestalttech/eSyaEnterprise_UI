﻿namespace eSyaEnterprise_UI.Areas.ConfigSpecialty.Models
{
    public class DO_SpecialtyCodes
    {
        public int SpecialtyID { get; set; }
        public string SpecialtyDesc { get; set; }
        public string Gender { get; set; }
        public string SpecialtyType { get; set; }
        public string SpecialtyGroup { get; set; }
        public string? MedicalIcon { get; set; }
        public string? FocusArea { get; set; }
        //public int AgeRangeFrom { get; set; }
        //public string RangePeriodFrom { get; set; }
        //public int AgeRangeTo { get; set; }
        //public string? RangePeriodTo { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public List<DO_AgeRangeMatrixSpecialtyLink>? lstAgerangeSpecilatyLink { get; set; }
    }
    public class DO_AgeRangeMatrixSpecialtyLink
    {
        public int SpecialtyId { get; set; }
        public int AgeRangeId { get; set; }
        public string? RangeDesc { get; set; }
        public int AgeRangeFrom { get; set; }
        public int RangeFromPeriod { get; set; }
        public int AgeRangeTo { get; set; }
        public int RangeToPeriod { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public string? RangeFromPeriodDesc { get; set; }
        public string? RangeToPeriodDesc { get; set; }
    }
}

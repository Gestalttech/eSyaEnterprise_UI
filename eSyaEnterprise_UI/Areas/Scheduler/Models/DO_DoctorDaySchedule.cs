﻿namespace eSyaEnterprise_UI.Areas.Scheduler.Models
{
    public class DO_DoctorDaySchedule
    {
        public int BusinessKey { get; set; }
        public int ConsultationId { get; set; }
        public int ClinicId { get; set; }
        public int SpecialtyId { get; set; }
        public int DoctorId { get; set; }
        public DateTime ScheduleDate { get; set; }
        public int SerialNo { get; set; }
        public TimeSpan ScheduleFromTime { get; set; }
        public TimeSpan ScheduleToTime { get; set; }
        public int NoOfPatients { get; set; }
        public string XlsheetReference { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        //for displaying Heading
        public string? ConsultationDesc { get; set; }
        public string? ClinicDesc { get; set; }
        public string? SpecialtyDesc { get; set; }
        public string? DoctorName { get; set; }
        public bool status { get; set; }
    }
}

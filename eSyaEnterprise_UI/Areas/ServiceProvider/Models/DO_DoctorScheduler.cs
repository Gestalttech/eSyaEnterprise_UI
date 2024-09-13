namespace eSyaEnterprise_UI.Areas.ServiceProvider.Models
{
    public class DO_DoctorScheduler
    {
        public int BusinessKey { get; set; }
        public int ConsultationID { get; set; }
        public string? ConsultationType { get; set; }
        public int ClinicID { get; set; }
        public string? ClinicDesc { get; set; }
        public int SpecialtyID { get; set; }
        public string? SpecialtyDesc { get; set; }
        public int DoctorId { get; set; }
        public string? DoctorName { get; set; }
        public string? DayOfWeek { get; set; }
        public int SerialNo { get; set; }
        public TimeSpan ScheduleFromTime { get; set; }
        public TimeSpan ScheduleToTime { get; set; }
        public int PatientCountPerHour { get; set; }
        public int TimeSlotInMins { get; set; }
        public bool Week1 { get; set; }
        public bool Week2 { get; set; }
        public bool Week3 { get; set; }
        public bool Week4 { get; set; }
        public bool Week5 { get; set; }
        public string? RoomNo { get; set; }
        public DateTime ScheduleChangeDate { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public bool _status { get; set; }
    }
}

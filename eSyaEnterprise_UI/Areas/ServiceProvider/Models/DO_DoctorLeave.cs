namespace eSyaEnterprise_UI.Areas.ServiceProvider.Models
{
    public class DO_DoctorLeave
    {
        public int BusinessKey { get; set; }
        public int DoctorId { get; set; }
        public DateTime OnLeaveFrom { get; set; }
        public DateTime OnLeaveTill { get; set; }
        public int NoOfDays { get; set; }
        public string? Comments { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public bool _status { get; set; }

    }
}

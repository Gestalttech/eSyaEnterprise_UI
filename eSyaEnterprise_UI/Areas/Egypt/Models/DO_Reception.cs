namespace eSyaEnterprise_UI.Areas.Egypt.Models
{
    public class DO_Reception
    {
        public int BusinessKey { get; set; }
        public string QueueTokenKey { get; set; }
        public DateTime TokenDate { get; set; }
        //public TimeSpan AppointmentFromTime { get; set; }
        public int SequeueNumber { get; set; }
        //public string RoomNumber { get; set; }
        //public string PatientType { get; set; }
        //public string PatientName { get; set; }
        //public int SpecialtyID { get; set; }
        //public string SpecialtyDesc { get; set; }
        //public int DoctorID { get; set; }
        //public string DoctorName { get; set; }
        //public string DoctorName_ar { get; set; }
        public bool TokenCalling { get; set; }
        public string? CallingRoomNumber { get; set; }
        //public DateTime? TokenCallingTime { get; set; }
        public bool TokenHold { get; set; }
        //public int TokenHoldOccurence { get; set; }
        //public DateTime TokenHoldingTime { get; set; }
        //public string TokenStatus { get; set; }

        //public string DoctorNameAr { get; set; }
        //public string SpecialtyDescAr { get; set; }

        //patient data
        //public int UHID { get; set; }
        //public string PatientId { get; set; }
        //public string FirstName { get; set; }
        //public string LastName { get; set; }
        //public string Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        //public decimal MobileNumber { get; set; }
        //public string EmailId { get; set; }
        //public int? CustomerId { get; set; }
        //public string CustomerName { get; set; }
        //public string VisitType { get; set; }
        //

        public DateTime Createdon { get; set; }

        //public bool ActiveStatus { get; set; }
        //public int FormID { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
    public class DO_ReturnParameter
    {
        public bool Status { get; set; }
        public string StatusCode { get; set; }
        public string Message { get; set; }
        public string ErrorCode { get; set; }
        public decimal ID { get; set; }
        public string Key { get; set; }
    }
    public class DO_ApplicationCodes
    {
        public int ApplicationCode { get; set; }
        public int CodeType { get; set; }
        public string CodeDesc { get; set; }
    }

    public class DO_BusinessLocation
    {
        public int BusinessKey { get; set; }
        public string LocationDescription { get; set; }
    }
}


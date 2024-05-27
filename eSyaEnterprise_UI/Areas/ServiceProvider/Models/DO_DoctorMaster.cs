namespace eSyaEnterprise_UI.Areas.ServiceProvider.Models
{
   
        public class DO_DoctorMaster
        {
            public int BusinessKey { get; set; }
            public int DoctorId { get; set; }
            public string DoctorName { get; set; }
            public string DoctorShortName { get; set; }
            public int Gender { get; set; }
            public string DoctorRegnNo { get; set; }
            public string? EMailId { get; set; }
            public int ISDCode { get; set; }
            public string MobileNumber { get; set; }
            public int DoctorClass { get; set; }
            public int DoctorCategory { get; set; }
            public int TraiffFrom { get; set; }
            public string? Password { get; set; }
            public int SeniorityLevel { get; set; }
            public string FormID { get; set; }
            public bool ActiveStatus { get; set; }
            public int UserID { get; set; }
            public string TerminalID { get; set; }
            //for displaying properties
            public string? DoctorClassDesc { get; set; }
            public string? DoctorCategoryDesc { get; set; }
            public string? SeniorityLevelDesc { get; set; }
            public List<DO_DoctorParameter> l_DoctorParameter { get; set; }
            public string? TraiffFromDesc { get; set; }
            public string? GenderDesc { get; set; }

    }
        public class DO_DoctorParameter
        {
            public int DoctorCode { get; set; }
            public int ParameterID { get; set; }
            public decimal ParmPerc { get; set; }
            public bool ParmAction { get; set; }
            public string? ParmDesc { get; set; }
            public decimal ParmValue { get; set; }
            public bool ActiveStatus { get; set; }
            public string FormId { get; set; }
            public int UserID { get; set; }
            public string TerminalID { get; set; }
        }

        //public class DO_DoctorImage
        //{
        //    public int DoctorId { get; set; }
        //    //public string ImageTitle { get; set; }
        //    //public byte[] ImageData { get; set; }
        //    public string DoctorProfileTitle { get; set; }
        //    public byte[] DoctorProfileImage { get; set; }
        //    public string DoctorSignatureTitle { get; set; }
        //    public byte[] DoctorSignatureImage { get; set; }
        //    public bool ActiveStatus { get; set; }
        //    public int UserID { get; set; }
        //    public string TerminalID { get; set; }

        //}
    
}

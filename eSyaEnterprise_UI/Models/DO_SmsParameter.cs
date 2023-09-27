using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Models
{
    public class DO_SmsParameter
    {
        public string MessageType { get; set; }
        public string NavigationURL { get; set; }
        public int FormID { get; set; }
        public int TEventID { get; set; }
        public int UserID { get; set; }
        public int UHID { get; set; }
        public int DoctorID { get; set; }
        public int CustomerID { get; set; }
        public int VendorID { get; set; }
        public int EmployeeID { get; set; }
        public string Name { get; set; }
        public string MobileNumber { get; set; }
        public Dictionary<string, string> SmsVariables { get; set; }

        public string OTP { get; set; }
        public bool IsUserPasswordInclude { get; set; }
    }
}

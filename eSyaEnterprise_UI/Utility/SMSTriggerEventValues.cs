using DocumentFormat.OpenXml.EMMA;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static ClosedXML.Excel.XLPredefinedFormat;

namespace eSyaEnterprise_UI.Utility
{
    public class SMSTriggerEventValues
    {
        //public const int ForgetUserIDOTP = 1;
        //public const int ForgetPasswordOTP = 2;
        //public const int MobileLoginOTP = 3;
        //public const int OnSaveClicked = 4;
        //public const int OnGuestCheckOut = 6;

        public const int OnSaveClick = 1;
        public const int FirstTimeLoginOTP = 2;
        public const int ForgetUserIDOTP = 3;
        public const int ForgetPasswordOTP = 4;
        public const int MobileLoginOTP = 5;
        public const int TokenQRCodeOTP = 6;
        public const int QRCodeTokenNumber = 7;
        public const int PreSelfRegistrationOTP = 8;
        public const int TokenKIOSKOTP = 9;
        public const int KIOSKTokenNumbertoPatient = 10;
        public const int DualAuthenticationOTP = 11;
    }
}

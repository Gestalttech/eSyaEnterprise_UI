using System.Diagnostics.Metrics;

namespace eSyaEnterprise_UI.ApplicationCodeTypes
{
    public  class ApplicationCodeTypeValues
    {
        #region Product SetUp
        public const int Nationality = 51;
        public const int PaymentMethod = 87;
        public const int InstrumentType = 88;
        public const int RangePeriod = 253;
        #endregion

        #region Config Facalities

        public const int Clinic = 83;
        public const int ConsultationType = 84; 
        #endregion

        #region Manage Inventory
        public const int PackUnit = 101;
        #endregion

        #region Manage ManageRates
        public const int RateType = 85;
        #endregion

        #region Vendor
        public const int VendorClass = 20;
        public const int PaymentPreferredMode = 80;
        #endregion

        #region End User
        //public const int PreferredLanguage = 8; not used
        public const int UserGroup = 1;
        public const int UserRole = 2;
        public const int SecurityQuestions = 3;
        #endregion

        #region Token System
        
        public const int FloorId = 5;


        #endregion

        #region Config Patient
        public const int PatientCategory = 59;
        public const int ConfigPatientRateType = 85;
        public const int PatientType = 58;
        public const int DocumentListforPatientTypeCategoryLink = 61;

        #endregion

        #region Config Pharma

        //public const int DrugClass = 201; changed to getting  from Master    

        //public const int TherapueticClass = 202; changed to getting  from Master
        public const int PharmacyGroup = 203;
        public const int DrugForms = 204;
        public const int MethodOfAdministration = 205;
        //public const int PharmacyGroup = 1;
        #endregion

        #region ConfigServices
        public const int ServiceFor = 4;
        #endregion

        #region Admin
        public const int DepartmentCategory = 62;
        public const int Uompurchase = 102; 
        public const int Uomstock = 102;
        #endregion

        #region ConfigProduct
        public const int ServiceCriteria = 91;
        public const int ServiceProvider = 81;
        #endregion

        //public const int TasKList = 4;not used
        //public const int Religion = 52; not used
        //public const int Caste = 53; not used
        //public const int PatientAccess = 54; not used
        //public const int PreRegistrationInfo = 55; not used
        //public const int BloodGroup = 57; not used
        //public const int SourceofReferrenceOrRequestChannel = 60; not used
        //public const int ServiceProviderClassforDoctor = 81; not used
        //public const int ServiceProviderCategoryforDoctor = 82; not used
        //public const int BillSuspendType = 86; not used

        #region ServiceProvider
        public const int Gender = 270;
        public const int TraiffFrom = 271;
        public const int DoctorClass = 272;
        public const int DoctorCategory = 273;
        public const int SeniorityLevel = 274;
        #endregion

        #region Manage Pharma
        public const int DrugPacking = 206;
        #endregion

        
    }
}

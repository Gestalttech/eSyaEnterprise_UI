namespace eSyaEnterprise_UI.Areas.ConfigServices.Models
{
    

    public class DO_ServiceCode
    {
        public int ServiceId { get; set; }
        public int ServiceClassId { get; set; }
        public int ServiceFor { get; set; }
        public string ServiceDesc { get; set; } = null!;
        public string? ServiceShortDesc { get; set; }
        public string Gender { get; set; } = null!;
        public string? InternalServiceCode { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedOn { get; set; }
        public string TerminalID { get; set; }
        public string? ServiceTypeDesc { get; set; }
        public string? ServiceGroupDesc { get; set; }
        public string? ServiceClassDesc { get; set; }
        public bool BusinessLinkStatus { get; set; }
        public int BusinessKey { get; set; }
        public decimal ServiceCost { get; set; }
    }
    public class DO_ServiceType
    {
        public int ServiceTypeId { get; set; }
        public string ServiceTypeDesc { get; set; }
        public int PrintSequence { get; set; }
        public bool ActiveStatus { get; set; }

    }
    public class DO_ServiceGroup
    {
        public int ServiceGroupId { get; set; }
        public int ServiceTypeId { get; set; }
        public string ServiceGroupDesc { get; set; }
        public string ServiceCriteria { get; set; }
        public int PrintSequence { get; set; }
        public bool ActiveStatus { get; set; }

    }
    public class DO_ServiceClass
    {
        public int ServiceClassId { get; set; }
        public int ServiceGroupId { get; set; }
        public string ServiceClassDesc { get; set; }
        public bool IsBaseRateApplicable { get; set; }
        public int ParentId { get; set; }
        public int PrintSequence { get; set; }
        public bool ActiveStatus { get; set; }

    }
}

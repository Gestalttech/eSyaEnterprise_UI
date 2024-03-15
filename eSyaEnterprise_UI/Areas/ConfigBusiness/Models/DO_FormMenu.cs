namespace eSyaEnterprise_UI.Areas.ConfigBusiness.Models
{
    public class DO_FormMenu
    {
        public int MenuItemId { get; set; }
        public string MenuItemName { get; set; }
        public int MainMenuId { get; set; }
        public int FormId { get; set; }
        public string? FormNameClient { get; set; }
        public int FormIndex { get; set; }
        public bool ActiveStatus { get; set; }
        public int UserId { get; set; }
        public string TerminalId { get; set; }
        //property for UserGroup 
        public int MenuKey { get; set; }

        public int ParentId { get; set; }

        public string FormInternalID { get; set; }
        public string NavigateUrl { get; set; }
        public string Area { get; set; }
        public string Controller { get; set; }
        public string View { get; set; }

        public List<DO_FormMenu>? l_FormMenu { get; set; }
    }
}

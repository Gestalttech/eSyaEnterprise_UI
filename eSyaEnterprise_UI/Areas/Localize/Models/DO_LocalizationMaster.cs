using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.Localize.Models
{
    public class DO_LocalizationMaster
    {
        public bool IsInsert { get; set; }
        public int TableCode { get; set; }
        public string SchemaName { get; set; }
        public string TableName { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
        public int Isadd { get; set; }
    }
}

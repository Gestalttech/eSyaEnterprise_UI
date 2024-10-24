﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.TokenSystem.Models
{
    public class DO_TokenConfiguration
    {
        public string TokenType { get; set; }
        public string TokenDesc { get; set; }
        public string? ConfirmationUrl { get; set; }
        public string? QrcodeUrl { get; set; }
        public int DisplaySequence { get; set; }
        public string TokenPrefix { get; set; }
        public int TokenNumberLength { get; set; }
        public bool IsEnCounter { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormId { get; set; }
        public int UserID { get; set; }
        public string TerminalID { get; set; }
    }
}

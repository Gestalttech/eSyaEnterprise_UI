﻿using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.Vendor.Controllers
{
    public class PartNumberController : Controller
    {
        [Area("Vendor")]
        public IActionResult EVN_04_00()
        {
            return View();
        }
    }
}

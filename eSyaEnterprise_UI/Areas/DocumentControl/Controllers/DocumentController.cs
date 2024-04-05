using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.DocumentControl.Data;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.DocumentControl.Controllers
{
    public class DocumentController : Controller
    {
        private readonly IeSyaDocumentControlAPIServices _documentControlAPIServices;
        private readonly ILogger<DocumentController> _logger;

        public DocumentController(IeSyaDocumentControlAPIServices documentControlAPIServices, ILogger<DocumentController> logger)
        {
            _documentControlAPIServices = documentControlAPIServices;
            _logger = logger;
        }

        #region Define Business - Document Link
        [Area("DocumentControl")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EDC_02_00()
        {
            return View();
        }
        #endregion
    }
}

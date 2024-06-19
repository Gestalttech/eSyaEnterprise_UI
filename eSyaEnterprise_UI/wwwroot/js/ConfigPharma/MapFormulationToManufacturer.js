$(function () {
    fnLoadGridManufacturer();
});

function fnLoadManufacturer() {
    if ($('#cboDrugFormulation').val() != '' || $('#cboDrugFormulation').val() != 0 || $('#cboDrugFormulation').val() != null || $('#cboDrugFormulation').val() != undefined) {
        fnLoadGridManufacturer();
    }
    else {
        fnAlert("w", "EPH_07_00", "UI0341", errorMsg.SelectFormulation);
        return;
    }
}

function fnLoadGridManufacturer() {
    var Formulation = $("#cboDrugFormulation").val();
    var URL = getBaseURL() + '/Formulation/GetDrugManufacturer?Formulation=' + Formulation;

    $("#jqgFormulationToManufacturer").jqGrid('GridUnload');
    $("#jqgFormulationToManufacturer").jqGrid({
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ManufacturerID, localization.ManufacturerName, localization.ManfShortName, localization.Status],
        colModel: [
            { name: "ManufacturerId", width: 10, editable: true, align: 'left', hidden: true },
            { name: "ManufacturerName", width: 135, editable: true, align: 'left', hidden: false },
            { name: "ManfShortName", width: 10, editable: true, align: 'left', hidden: true },
            { name: "ActiveStatus", editable: false, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpFormulationToManufacturer",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',
        caption: localization.FormulationToManufacturer,
        cellsubmit: 'clientArray',
        onSelectRow: function (id) {
            if (id) { $('#jqgFormulationToManufacturer').jqGrid('editRow', id, true); }
        },
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgFormulationToManufacturer").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            fnJqgridSmallScreen('jqgFormulationToManufacturer');
        }
    }).jqGrid('navGrid', '#jqpFormulationToManufacturer', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpFormulationToManufacturer', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshFormulationToManufacturer
    });
    $("#btnSaveFormulatioManufacturer").show();
}

function fnRefreshFormulationToManufacturer() {
    $("#jqgFormulationToManufacturer").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}


function fnSaveFormulationToManufacturer() {

}
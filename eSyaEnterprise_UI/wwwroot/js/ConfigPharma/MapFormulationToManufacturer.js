$(function () {
   
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


function fnAppendComposition() {
   
    $("#txtCompositionId").val('');
    $("#txtCompositionDesc").val('');

    $.ajax({
        url: getBaseURL() + '/Formulation/GetCompositionbyFormulationID?formulationId=' + $('#cboDrugFormulation').val(),
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            if (response != null) {
                
                $("#txtCompositionId").val(response.CompositionId);
                $("#txtCompositionDesc").val(response.DrugCompDesc);
                fnLoadGridManufacturer();
            } else {
                $("#jqgFormulationToManufacturer").jqGrid('GridUnload');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);

        }
    });
}
function fnLoadGridManufacturer() {
    var Formulation = $("#cboDrugFormulation").val();
    var URL = getBaseURL() + '/Formulation/GetLinkedManufacturerwithFormulation?formulationId=' + Formulation + '&compositionId=' + $("#txtCompositionId").val();

    $("#jqgFormulationToManufacturer").jqGrid('GridUnload');
    $("#jqgFormulationToManufacturer").jqGrid({
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ManufacturerID, localization.ManufacturerName, localization.Status],
        colModel: [
            { name: "ManufacturerId", width: 10, editable: true, align: 'left', hidden: true },
            { name: "ManufacturerName", width: 205, editable: false, align: 'left', hidden: false },
            { name: "ActiveStatus", editable: false, width:25, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
        ],
        rowNum: 10000,
        rownumWidth: '55',
        pgtext: null,
        pgbuttons:null,
        emptyrecords: "No records to Veiw",
        pager: "#jqpFormulationToManufacturer",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
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
    fnAddGridSerialNoHeading();
    $("#btnSaveFormulatioManufacturer").show();
}

function fnRefreshFormulationToManufacturer() {
    $("#jqgFormulationToManufacturer").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnSaveFormulationToManufacturer() {
    if (IsStringNullorEmpty($("#cboDrugFormulation").val() == "0" || $("#cboDrugFormulation").val() == "")) {
        fnAlert("w", "EMR_03_00", "UI0064", "Please select Formulation");
        return;
    }
    if (IsStringNullorEmpty($("#txtCompositionId").val() == "0")) {
        fnAlert("w", "EMR_03_00", "UI0342", "Composition is not linked to selected Formulation");
        return;
    }

    $("#jqgFormulationToManufacturer").jqGrid('editCell', 0, 0, false);
    var manfctlinklist = [];
    var id_list = jQuery("#jqgFormulationToManufacturer").jqGrid('getDataIDs');

    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgFormulationToManufacturer').jqGrid('getRowData', rowId);

        manfctlinklist.push({
            FormulationId: $("#cboDrugFormulation").val(),
            CompositionId: $("#txtCompositionId").val(),
            ManufacturerId: rowData.ManufacturerId,
            ActiveStatus: rowData.ActiveStatus
        });
    }
    objdata = {
        FormulationId: $("#cboDrugFormulation").val(),
        CompositionId: $("#txtCompositionId").val(),
        manfctlist: manfctlinklist
    };

    $("#btnSaveFormulatioManufacturer").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Formulation/InsertOrUpdateManufacturerLinkwithFormulation',
        type: 'POST',
        datatype: 'json',
        data: { obj: objdata },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#jqgFormulationToManufacturer").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveFormulatioManufacturer").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveFormulatioManufacturer").attr("disabled", false);
        }
    });
}

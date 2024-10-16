﻿$(document).ready(function () {
    fnLoadLinkParameterSChemaGrid();
});

function fnLoadLinkParameterSChemaGrid() {

    var parametertype = $("#cboparametertype").val();

    $("#jqgLinkParameterSchema").GridUnload();

    if (!IsStringNullorEmpty(parametertype)) {

        $("#jqgLinkParameterSchema").jqGrid({
            url: getBaseURL() + '/Parameters/GetParameterLinkSchema?parametertype=' + parametertype,
            datatype: "json",
            contenttype: "application/json; charset-utf-8",
            mtype: 'POST',
            colNames: [localization.LinkParameterType, localization.LinkParameterId, localization.ParameterDesc, localization.Schema, localization.ActiveStatus],
            colModel: [
                { name: "LinkParameterType", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
                { name: "LinkParameterId", width: 50, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
                { name: "ParameterDesc", width: 160, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
                { name: "SchemaId", width: 150, editable: true, align: 'left', edittype: 'text', editoptions: { maxlength: 10 } },
                { name: "ActiveStatus", editable: true, width: 50, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            ],
            rowNum: 10000,
            rownumWidth: 55,
            pager: "#jqpLinkParameterSchema",
            pgtext: null,
            caption: "Table Field Language Mapping",
            pgbuttons: null,
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            height: 'auto',
            width: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: true,
            loadonce: true,
            cellEdit: true,
            editurl: 'url',
            cellsubmit: 'clientArray',
            onSelectRow: function (id) {
                if (id) { $('#jqgLinkParameterSchema').jqGrid('editRow', id, true); }
            },
            ondblClickRow: function (rowid) {
            },
            loadComplete: function (data) {
                $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
                $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
                $("#jqgLinkParameterSchema").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                SetGridControlByAction();
                fnAddGridSerialNoHeading(); fnJqgridSmallScreen("jqgLinkParameterSchema");
            }
        }).jqGrid('navGrid', '#jqpLinkParameterSchema', { add: false, edit: false, search: false, del: false, refresh: false });
    }
}

function fnSave() {

    if (IsStringNullorEmpty($("#cboparametertype").val())) {
        fnAlert("w", "EPS_31_00", "UI0216", errorMsg.add_E1);
        return false;
    }
    

    var l_par = [];
    var ids = jQuery("#jqgLinkParameterSchema").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgLinkParameterSchema').jqGrid('getRowData', rowId);

        if (!IsStringNullorEmpty(rowData.SchemaId)) {
            l_par.push({
                LinkParameterType: $("#cboparametertype").val(),
                LinkParameterId: rowData.LinkParameterId,
                SchemaId: rowData.SchemaId,
                ActiveStatus: rowData.ActiveStatus
            });
        }
    }

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Parameters/InsertOrUpdateLinkParameterSchema',
        type: 'POST',
        datatype: 'json',
        data: { obj: l_par },
        async: false,
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#jqgLinkParameterSchema").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSave").attr("disabled", false);
            }
            $("#btnSave").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSave").attr("disabled", false);
        }
    });

}


$(document).on('focusout', '[role="gridcell"] *', function () {
    $("#jqgLinkParameterSchema").jqGrid('editCell', 0, 0, false);
});

function SetGridControlByAction() {
    $("#btnSave").attr("disabled", false);
    if (_userFormRole.IsEdit === false) {
        $("#btnSave").attr("disabled", true);
    }
}
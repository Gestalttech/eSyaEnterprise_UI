var RateTypelist = [];

$(document).ready(function () {

    RateTypelist.push(0 + ': Select');
    $.each(RateTypes, function (i, data) { RateTypelist.push(data.ApplicationCode + ':' + data.CodeDesc); })
    RateTypelist = RateTypelist.join(';')
   

});

function fnBusinessKeyChange() {
    var _businesskey = $("#cboBusinessKey").val();
    var _patienttype = $("#cboPatientTypes").val();
    if (_businesskey == 0 || _patienttype==0) {
        $("#jqgMapPatientCategoryBusiness").jqGrid('GridUnload');
        $("#divSaveSection").hide();
    }
    else {
        console.log(_patienttype);
        fnLoadPatientTypeCategoryMapBusinessLink();
    }
    if (_patienttype == "580002") {
        $("#jqgMapPatientCategoryBusiness").hideCol("RateType");
    }
}

function fnLoadPatientTypeCategoryMapBusinessLink() {
    $("#jqgMapPatientCategoryBusiness").jqGrid('GridUnload');
    $("#jqgMapPatientCategoryBusiness").jqGrid({
        url: getBaseURL() + '/ConfigPatient/Business/GetAllPatientCategoryBusinessLink?businesskey=' + $("#cboBusinessKey").val() + '&patienttypeId=' + $("#cboPatientTypes").val(),
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.PatientTypeId, localization.PatientCategoryId, localization.PatientType, localization.PatientCategory, localization.RateType, localization.Status],
          colModel: [
            { name: "BusinessKey", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientTypeId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientCategoryId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
              { name: "PatientTypeDesc", width: 100, hidden: true , editable: false, editoptions: { disabled: true }, align: 'left' },
              { name: "PatientCategoryDesc", width: 100, editable: false, editoptions: { disabled: true }, align: 'left' },
              { name: "RateType", editable: true, cellEdit: true, width: 100, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: RateTypelist }},
              { name: "ActiveStatus", editable: true, width: 30, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },

        ],
        rowNum: 100000,
        pgtext: null,
        pgbuttons:null,
        rownumWidth:'55',
        loadonce: true,
        pager: "#jqpMapPatientCategoryBusiness",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0,
        cellEdit: true,
        caption: localization.MapPatientCategoryBusiness,
        editurl: 'url',
        cellsubmit: 'clientArray',
        
        onSelectRow: function (id) {
            if (id) { $('#jqgMapPatientCategoryBusiness').jqGrid('editRow', id, true); }
        },
        caption: "MapPatientCategoryBusiness",
        loadComplete: function () {
            fnJqgridSmallScreen("jqgMapPatientCategoryBusiness");
            $("#divSaveSection").show();
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
        },
    }).jqGrid('navGrid', '#jqpMapPatientCategoryBusiness', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpMapPatientCategoryBusiness', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPatientCategoryBusiness
    })
    fnAddGridSerialNoHeading();
}

function fnGridRefreshPatientCategoryBusiness() {
    $("#jqgMapPatientCategoryBusiness").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnSavePatientCategoryBusinessLink() {
    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $('#cboBusinessKey').val() == '' || $('#cboBusinessKey').val() == '0') {
        fnAlert("w", "EPM_02_00", "UI0064", errorMsg.BusinessLocation_E1);
        return;
    }
    if (IsStringNullorEmpty($("#cboPatientTypes").val()) || $('#cboPatientTypes').val() == '' || $('#cboPatientTypes').val() == '0') {
        fnAlert("w", "EPM_02_00", "UI0274", errorMsg.PatientType_E2);
        return;
    }
  
    $("#jqgMapPatientCategoryBusiness").jqGrid('editCell', 0, 0, false);
  
 
    var $grid = $("#jqgMapPatientCategoryBusiness");
    var obj = [];
    var ids = jQuery("#jqgMapPatientCategoryBusiness").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgMapPatientCategoryBusiness').jqGrid('getRowData', rowId);

        /*if (rowData.RateType!="0") {*/
            obj.push({
                BusinessKey: $('#cboBusinessKey').val(),
                PatientTypeId: $("#cboPatientTypes").val(),
                RateType: $("#cboPatientTypes").val() == "580002"? 0:rowData.RateType,
                PatientCategoryId: rowData.PatientCategoryId,
                ActiveStatus: rowData.ActiveStatus,

            });
        //}
    }


    $("#btnSavePatientCategoryBusinessLink").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/ConfigPatient/Business/InsertOrUpdatePatientCategoryBusinessLink',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response.Status === true) {

                fnAlert("s", "", response.StatusCode,response.Message);
                fnGridRefresh();
                $("#btnSavePatientCategoryBusinessLink").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode,response.Message);
                $("#btnSavePatientCategoryBusinessLink").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode,error.statusText);
            $("#btnSavePatientCategoryBusinessLink").attr("disabled", false);
        }
    });

    $("#btnSavePatientCategoryBusinessLink").attr("disabled", false);
}

function fnGridRefresh() {
    $("#jqgMapPatientCategoryBusiness").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnClearPatientCategoryBusinessLink() {

    fnGridRefresh();
}
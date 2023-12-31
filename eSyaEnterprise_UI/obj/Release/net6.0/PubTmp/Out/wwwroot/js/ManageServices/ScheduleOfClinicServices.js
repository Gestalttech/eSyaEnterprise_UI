﻿var AddFlag = true;

function fnLoadGrid() {
    if ($('#cboBusinessKey').val() != '') {
        fnLoadClinicServiceLink();
    }
}

function fnLoadClinicServiceLink() {
    $("#jqgClinicServiceLink").jqGrid('GridUnload');
    $("#jqgClinicServiceLink").jqGrid({
        url: getBaseURL() + '/ClinicService/GetClinicServiceLinkByBKey?businessKey=' + $('#cboBusinessKey').val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ClinicDesc, localization.ConsultationDesc, localization.ServiceDesc, localization.VisitRule, localization.Active],
        colModel: [

            { name: "ClinicDesc", width: 50, editable: false, align: 'left' },
            { name: "ConsultationDesc", width: 50, editable: false, align: 'left' },
            { name: "ServiceDesc", width: 50, editable: false, align: 'left' },
            { name: "VisitRule", width: 20, editable: false, align: 'left' },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: "Button", width: 20, editable: false, align: 'center', hidden: false, formatter: function (cellValue, options, rowObject) {
            //        return "<button type='button' style='width:100px' class='btn btn-primary' onclick=fnGridEditRatePlan('" + rowObject.RateType + "')><i class='fas fa-external-link-alt c-white'></i> Edit  </button>";
            //    }
            //}

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to View",
        pager: "#jqpClinicServiceLink",
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
        align: "left",
        scrollOffset: 0,
        caption: "Clinic Service Link",
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgClinicServiceLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

        }
    }).jqGrid('navGrid', '#jqpClinicServiceLink', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpClinicServiceLink', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddClinicServiceLink
        });
}
function fnLoadConsultationType() {
    var ClinicType = $("#cboClinicType").val();
    var BusinessKey = $("#cboBusinessKey").val();
    $.ajax({
        url: getBaseURL() + '/ClinicService/GetConsultationTypeByBKeyClinicType',
        data: {
            businessKey: BusinessKey,
            clinictype: ClinicType

        },
        success: function (result) {
            $("#cboConsultationType").empty();
            $('#cboConsultationType').selectpicker('refresh');
            $("#cboConsultationType").append('<option value="0">' + localization.Select + '</option>');
            $('#cboConsultationType').selectpicker('refresh');
            for (var i = 0; i < result.length; i++) {
                $("#cboConsultationType").append('<option value="' + result[i].ApplicationCode + '"> ' + result[i].CodeDesc + ' </option>');
                $('#cboConsultationType').selectpicker('refresh');
            }
        }
    });
}
function fnGridAddClinicServiceLink() {
    fnClearFields();
    AddFlag = true;
    $('#PopupClinicServiceLink').find('.modal-title').text(localization.AddClinicServiceLink);
    $("#btnSave").html("<i class='fa fa-save'></i> " + localization.Save);
    $('#PopupClinicServiceLink').modal('show');
}
function fnClearFields() {
    $('#cboClinicType').val('0');
    $('#cboClinicType').selectpicker('refresh');
    $('#cboService').val('0');
    $('#cboService').selectpicker('refresh');
    $("#cboConsultationType").html('<option value="0"> Select</option>');
    $('#cboConsultationType').selectpicker('refresh');
    $('#txtVisitRule').val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
}
function fnSaveClinicServiceLink() {
    if ($("#cboClinicType").val() == "0") {
        fnAlert("w", "EMS_02_00", "UI0194", errorMsg.ClinicType_E6);
        return;
    }
    if ($("#cboConsultationType").val() == "0") {
        fnAlert("w", "EMS_02_00", "UI0195", errorMsg.ConsultationType_E7);
        return;
    }
    if ($("#cboService").val() == "0") {
        fnAlert("w", "EMS_02_00", "UI0196", errorMsg.Service_E8);
        return;
    }
    if (IsStringNullorEmpty($("#txtVisitRule").val()) || $('#txtVisitRule').val() <= '0') {
        fnAlert("w", "EMS_02_00", "UI0196", errorMsg.VisitRule_E9);
        return;
    }

    $("#btnSave").attr("disabled", true);

    var obj = {
        BusinessKey: $('#cboBusinessKey').val(),
        ClinicId: $('#cboClinicType').val(),
        ConsultationId: $('#cboConsultationType').val(),
        ServiceId: $('#cboService').val(),
        VisitRule: $('#txtVisitRule').val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        //AddFlag:AddFlag,
    }

    $.ajax({
        url: getBaseURL() + '/ClinicService/AddClinicServiceLink',
        type: 'POST',
        datatype: 'json',
        data: obj,
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $('#PopupClinicServiceLink').modal('hide');
                $("#jqgClinicServiceLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSave").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSave").attr("disabled", false);
        }
    });

}



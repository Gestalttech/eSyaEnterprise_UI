
$(document).ready(function () {


    $.contextMenu({
        selector: "#btnClinicServiceLink",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditClinicServiceLink(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditClinicServiceLink(event, 'view') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");

});
function fnLoadGrid() {
    if ($('#cboBusinessKey').val() != '') {
        fnLoadClinicServiceLink();
    }
}
function fnLoadClinicServiceLink() {
    $("#jqgClinicServiceLink").jqGrid('GridUnload');
    $("#jqgClinicServiceLink").jqGrid({
        url: getBaseURL() + '/ClinicService/GetClinicServiceLinkbyBusinesskey?businessKey=' + $('#cboBusinessKey').val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", localization.ClinicDesc, "", localization.ConsultationDesc, "", localization.ServiceDesc, localization.VisitRule, localization.Active, localization.Actions],
        colModel: [
            { name: "ClinicId", width: 50, editable: false, align: 'left',hidden:true },
            { name: "ClinicDesc", width: 50, editable: false, align: 'left' },
            { name: "ConsultationId", width: 50, editable: false, align: 'left', hidden: true },
            { name: "ConsultationDesc", width: 50, editable: false, align: 'left' },
            { name: "ServiceId", width: 50, editable: false, align: 'left', hidden: true },
            { name: "ServiceDesc", width: 50, editable: false, align: 'left' },
            { name: "VisitRule", width: 20, editable: false, align: 'left' },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnClinicServiceLink"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },

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
        caption: localization.ClinicServiceLink,
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgClinicServiceLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

        }
    }).jqGrid('navGrid', '#jqpClinicServiceLink', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpClinicServiceLink', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddClinicServiceLink
        });
    fnBindClinics();
}
function fnGridAddClinicServiceLink() {
    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $("#cboBusinessKey").val() == "0" || $("#cboBusinessKey").val() == 0) {
        fnAlert("w", "EMS_04_00", "UI0064", errorMsg.BusinessLocation_E10);
        return;
    }
    else {
        fnClearFields();
        fnBindClinics();
        $('#PopupClinicServiceLink').find('.modal-title').text(localization.AddClinicServiceLink);
        $("#btnSave").html("<i class='fa fa-save'></i> " + localization.Save);
        $('#PopupClinicServiceLink').modal('show');
        $("#chkActiveStatus").prop('disabled', true);
    }
}
function fnEditClinicServiceLink(e, actiontype) {

    var rowid = $("#jqgClinicServiceLink").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgClinicServiceLink').jqGrid('getRowData', rowid);

    fnClearFields();
    fnBindClinics();
    $("#cboClinicType").val(rowData.ClinicId).selectpicker('refresh');
    fnBindConsultations();
    $("#cboConsultationType").val(rowData.ConsultationId).selectpicker('refresh');
    $("#cboService").val(rowData.ServiceId).selectpicker('refresh');
    $("#txtVisitRule").val(rowData.VisitRule);
    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }
    
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EMS_04_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupClinicServiceLink').modal('show');
        $('#PopupClinicServiceLink').find('.modal-title').text(localization.EditClinicServiceLink);
        $("#btnSave").html("<i class='fa fa-sync'></i> " + localization.Update);
        $("#cboClinicType").next().prop('disabled', true);
        $("#cboConsultationType").next().prop('disabled', true);
        $("#cboService").next().prop('disabled', true);
        $("#chkActiveStatus").prop('disabled', false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EMS_04_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupClinicServiceLink').modal('show');
        $('#PopupClinicServiceLink').find('.modal-title').text(localization.ViewClinicServiceLink);
        $("#btnSave").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#cboClinicType").next().prop('disabled', true);
        $("#cboConsultationType").next().prop('disabled', true);
        $("#cboService").next().prop('disabled', true);
        $("#txtVisitRule").prop('disabled', true);
    }
}
function fnClearFields() {
    //$('#cboClinicType').val('0');
    //$('#cboClinicType').selectpicker('refresh');
    //$('#cboConsultationType').val('0');
    //$('#cboConsultationType').selectpicker('refresh');
    $('#cboService').val('0');
    $('#cboService').selectpicker('refresh');
    $('#txtVisitRule').val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSave").show();
    $("#cboClinicType").next().prop('disabled', false).selectpicker('refresh');
    $("#cboConsultationType").next().prop('disabled', false).selectpicker('refresh');
    $("#cboService").next().prop('disabled', false).selectpicker('refresh');
    $("#txtVisitRule").prop('disabled', false);
    $("#chkActiveStatus").prop('disabled', false);
}
function fnSaveClinicServiceLink() {
    if (IsStringNullorEmpty($("#cboBusinessKey").val())||$("#cboBusinessKey").val() == "0" || $("#cboBusinessKey").val() == 0) {
        fnAlert("w", "EMS_04_00", "UI0194", errorMsg.ClinicType_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboClinicType").val()) ||$("#cboClinicType").val() == "0" || $("#cboClinicType").val() == 0) {
        fnAlert("w", "EMS_04_00", "UI0194", errorMsg.ClinicType_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboConsultationType").val()) ||$("#cboConsultationType").val() == "0" || $("#cboConsultationType").val() == 0) {
        fnAlert("w", "EMS_04_00", "UI0195", errorMsg.ConsultationType_E7);
        return;
    }
    if (IsStringNullorEmpty($("#cboService").val()) ||$("#cboService").val() == "0" || $("#cboService").val() == 0) {
        fnAlert("w", "EMS_04_00", "UI0196", errorMsg.Service_E8);
        return;
    }
    if (IsStringNullorEmpty($("#txtVisitRule").val()) || $('#txtVisitRule').val() <= '0') {
        fnAlert("w", "EMS_04_00", "UI0197", errorMsg.VisitRule_E9);
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
       
    }

    $.ajax({
        url: getBaseURL() + '/ClinicService/AddOrUpdateClinicServiceLink',
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

function fnBusinessKey_onChange() {
    fnLoadClinicServiceLink();
 
}
function fnClinicType_onChange()
{
    fnBindConsultations();
}
function fnBindClinics() {
    $("#cboClinicType").empty();

    $.ajax({
        url: getBaseURL() + '/ClinicService/GetClinicbyBusinesskey?businessKey=' + $("#cboBusinessKey").val(),
        type: 'POST',
        datatype: 'json',
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboClinicType").empty();

                $("#cboClinicType").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboClinicType").append($("<option></option>").val(response[i]["ApplicationCode"]).html(response[i]["CodeDesc"]));
                }
                $('#cboClinicType').selectpicker('refresh');

            }
            else {
                $("#cboClinicType").empty();
                $("#cboClinicType").append($("<option value='0'> Select </option>"));
                $('#cboClinicType').selectpicker('refresh');
            }

        },
        async: false,
        processData: false
    });

    fnBindConsultations();
}
function fnBindConsultations() {
    $("#cboConsultationType").empty();
    $.ajax({
        url: getBaseURL() + '/ClinicService/GetConsultationbyClinicIdandBusinesskey?clinicId=' + $("#cboClinicType").val() + '&businessKey=' + $("#cboBusinessKey").val(),
        type: 'POST',
        datatype: 'json',
        error: function (xhr) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboConsultationType").empty();

                $("#cboConsultationType").append($("<option value='0'> Select</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboConsultationType").append($("<option></option>").val(response[i]["ApplicationCode"]).html(response[i]["CodeDesc"]));
                }
                $('#cboConsultationType').selectpicker('refresh');
            }
            else {
                $("#cboConsultationType").empty();
                $("#cboConsultationType").append($("<option value='0'> Select</option>"));
                $('#cboConsultationType').selectpicker('refresh');
            }

        },
        async: false,
        processData: false
    });

}



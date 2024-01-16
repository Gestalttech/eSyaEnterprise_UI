var formID;
var prevSelectedID;

$(document).ready(function () {
    $("#pnlMainMenu").hide();
    fnTreeSize();
    fnLoadSpecialtyCode();
    $('#chkActiveStatus').parent().addClass("is-checked");
});

function fnLoadSpecialtyCode() {

    $.ajax({
        url: getBaseURL() + '/Specialty/GetSpecialtyTree',
        success: function (result) {
            $('#jstSpecialtyCode').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': false }
            });
        }
    });

    $("#jstSpecialtyCode").on('loaded.jstree', function () {
        $("#jstSpecialtyCode").jstree('open_all');
    });

    $('#jstSpecialtyCode').on("changed.jstree", function (e, data) {

        if (data.node !== undefined) {
            if (prevSelectedID !== data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#pnlMainMenu").hide();

                if (data.node.parent === "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#Add').on('click', function () {
                        $(".mdl-card__title-text").text(localization.AddSpecialty);
                        fnClearFields();
                        fnSetControlStatus(false);
                        $("#btnSaveSpecialty").html('<i class="fa fa-plus"></i> ' + localization.Add);
                        $("#btnSaveSpecialty").attr("disabled", _userFormRole.IsInsert === false);
                        $("#pnlMainMenu").show();
                        $("#btnSaveSpecialty").show();
                    });
                }
                else if (data.node.parent === "H0") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>');

                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#pnlMainMenu').hide();
                            fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        $(".mdl-card__title-text").text(localization.ViewSpecialty);
                        $("#btnSaveSpecialty").hide();
                        fnSetControlStatus(true);
                        fnShowSpecialtyDetail(data.node.id);
                        $("#pnlMainMenu").show();
                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#pnlMainMenu').hide();
                            fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $("#btnSaveSpecialty").html('<i class="fa fa-sync"></i> ' + localization.Update);
                        $(".mdl-card__title-text").text(localization.EditSpecialty);
                        $("#btnSaveSpecialty").show();
                        fnSetControlStatus(false);
                        fnShowSpecialtyDetail(data.node.id);
                        $("#pnlMainMenu").show();
                    });
                }
                else {
                    fnClearFields();
                    $("#pnlMainMenu").hide();
                }
            }
        }
    });
}

function fnShowSpecialtyDetail(specialtyId) {

    $.ajax({
        url: getBaseURL() + '/Specialty/GetSpecialtyCode?specialtyId=' + specialtyId,
        type: 'POST',
        datatype: 'json',
        success: function (response) {

            if (response !== null) {
                $('#txtSpecialtyId').val(response.SpecialtyID);
                $('#txtSpecialtyDesc').val(response.SpecialtyDesc);
                $('#cboGender').val(response.Gender);
                $('#cboGender').selectpicker('refresh');
                $('#cboSpecialtyType').val(response.SpecialtyType);
                $('#cboSpecialtyType').selectpicker('refresh');
                $('#cboSpecialtyGroup').val(response.SpecialtyGroup);
                $('#cboSpecialtyGroup').selectpicker('refresh');
                $('#txtFocusArea').val(response.FocusArea);
                $('#txtAgeRangeFrom').val(response.AgeRangeFrom);
                $('#cboRangeFromPeriod').val(response.RangePeriodFrom).selectpicker('refresh');
                $('#txtAgeRangeTo').val(response.AgeRangeTo);
                $('#cboRangeToPeriod').val(response.RangePeriodTo).selectpicker('refresh');
                if (response.ActiveStatus === true)
                    $('#chkActiveStatus').parent().addClass("is-checked");
                else
                    $('#chkActiveStatus').parent().removeClass("is-checked");
            }
            else {
                fnClearFields();
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);

        }
    });
}

function fnDeleteNode() {

    var selectedNode = $('#jstSpecialtyCode').jstree().get_selected(true);

    if (selectedNode.length !== 1) {
        fnAlert("w", "ECP_04_00", "UI0122", errorMsg.Specialty_E6);
    }
    else {
        selectedNode = selectedNode[0];
        if (selectedNode.id === "H0") {
            fnAlert("w", "ECP_04_00", "UI0122", errorMsg.Specialty_E6);
        }
        else if (selectedNode.parent === "H0") {

            var obj = {};

            obj.SpecialtyId = selectedNode.id;
            obj.ActiveStatus = false;

            $("#btnDeleteNode").attr("disabled", true);
            $.ajax({
                url: getBaseURL() + '/Specialty/DeleteSpecialtyCodes',
                type: 'POST',
                datatype: 'json',
                data: obj,
                async: false,
                success: function (response) {
                    if (response.Status === true) {
                        fnAlert("s", "", response.StatusCode, response.Message);
                        $("#jstSpecialtyCode").jstree("destroy");
                        fnLoadSpecialtyCode();
                        fnClearFields();
                        //$('#pnlMainMenu').hide();
                    }
                    else {
                        fnAlert("e", "", response.StatusCode, response.Message);
                    }
                    $("#btnDeleteNode").attr("disabled", false);
                },
                error: function (error) {
                    fnAlert("e", "", error.StatusCode, error.statusText);
                    $("#btnDeleteNode").attr("disabled", false);
                }
            });
        }
        else {
            fnAlert("w", "ECP_04_00", "UI0123", errorMsg.SpecialtyCodeDelete_E7);
        }
    }
}

function fnExpandAll() {
    $('#jstSpecialtyCode').jstree('open_all');
}

function fnCollapseAll() {
    $('#jstSpecialtyCode').jstree('close_all');
}

function fnTreeSize() {
    $("#jstSpecialtyCode").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });
}

function fnSaveSpecialtyCodes() {

    if (fnValidateBeforeSave() === false)
        return;

    $("#btnSaveSpecialty").attr('disabled', true);

    var obj =
    {
        SpecialtyID: $('#txtSpecialtyId').val(),
        SpecialtyDesc: $('#txtSpecialtyDesc').val(),
        Gender: $('#cboGender').val(),
        SpecialtyType: $('#cboSpecialtyType').val(),
        SpecialtyGroup: $('#cboSpecialtyGroup').val(),
        FocusArea: $('#txtFocusArea').val(),
        AgeRangeFrom: $('#txtAgeRangeFrom').val(),
        RangePeriodFrom: $('#cboRangeFromPeriod').val(),
        AgeRangeTo: $('#txtAgeRangeTo').val(),
        RangePeriodTo: $('#cboRangeToPeriod').val(),
        ActiveStatus: $('#chkActiveStatus').parent().hasClass("is-checked")
    };

    var URL;
    if ($('#txtSpecialtyId').val() !== "")
        URL = getBaseURL() + '/Specialty/UpdateSpecialtyCodes';
    else
        URL = getBaseURL() + '/Specialty/InsertSpecialtyCodes';

    //$("#btnSaveSpecialty").html('<i class="fa fa-spinner fa-spin"></i> ' + localization.wait);
    $("#btnSaveSpecialty").attr('disabled', true);
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: obj,
        //contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response !== null) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#pnlMainMenu").hide();
                    $('#jstSpecialtyCode').jstree("destroy");
                    fnLoadSpecialtyCode();
                    fnClearFields();
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                    $("#btnSaveSpecialty").attr('disabled', false);
                }

                $("#btnSaveSpecialty").html('<i class="fa fa-plus"></i> ' + localization.Add);
                $("#btnSaveSpecialty").attr('disabled', false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveSpecialty").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveSpecialty").attr("disabled", false);
            $("#btnSaveSpecialty").html('<i class="fa fa-plus"></i> ' + localization.Add);
        }
    });
    $("#btnSaveSpecialty").attr('disabled', false);
}

function fnClearFields() {
    $('#txtSpecialtyId').val('');
    $('#txtSpecialtyDesc').val('');
    $('#txtFocusArea').val('');
    $('#txtAgeRangeFrom').val('');
    $('#txtAgeRangeTo').val('');
    $("#cboGender").val('A').selectpicker('refresh');
    $("#cboSpecialtyType").val('G').selectpicker('refresh');
    $("#cboSpecialtyGroup").val('0').selectpicker('refresh');
    $("#cboRangeFromPeriod").val('0').selectpicker('refresh');
    $("#cboRangeToPeriod").val('0').selectpicker('refresh');
    $('#chkActiveStatus').parent().addClass("is-checked");
}

function fnSetControlStatus(isdisabled) {
    $("#txtSpecialtyDesc").prop("disabled", isdisabled);
    $("#cboGender").prop("disabled", isdisabled);
    $('#cboGender').selectpicker('refresh');
    $("#cboSpecialtyType").prop("disabled", isdisabled);
    $('#cboSpecialtyType').selectpicker('refresh');
    $("#cboSpecialtyGroup").prop("disabled", isdisabled);
    $('#cboSpecialtyGroup').selectpicker('refresh');
    $("#cboRangeFromPeriod").prop("disabled", isdisabled).selectpicker('refresh');
    $("#cboRangeToPeriod").prop("disabled", isdisabled).selectpicker('refresh');
    $("#txtFocusArea").prop("disabled", isdisabled);
    $("#txtAgeRangeFrom").prop("disabled", isdisabled);
    $("#txtAgeRangeTo").prop("disabled", isdisabled);
    $("#chkActiveStatus").prop("disabled", isdisabled);

}

function fnValidateBeforeSave() {

    if ($('#txtSpecialtyDesc').val() === "" || $('#txtSpecialtyDesc').val() === null) {
        fnAlert("w", "ECP_04_00","UI0124",errorMsg.SpecialtyCodeDesc_E8);
        $('#txtSpecialtyDesc').focus();
        return false;
    }
    if (IsStringNullorEmpty($('#cboGender').val())) {
        fnAlert("w", "ECP_04_00", "UI0125", errorMsg.Gender_E9);
        $('#cboGender').focus();
        return false;
    }

    if (IsStringNullorEmpty($('#cboSpecialtyType').val())) {
        fnAlert("w", "ECP_04_00", "UI0116", errorMsg.ServiceType_E10);
        $('#cboSpecialtyType').focus();
        return false;
    }
    if (IsStringNullorEmpty($('#cboSpecialtyGroup').val()) || $('#cboSpecialtyGroup').val() == '0' || $('#cboSpecialtyGroup').val() == "0") {
        fnAlert("w", "ECP_04_00", "UI0126", errorMsg.SpecialtyGroup_E11);
        $('#cboSpecialtyGroup').focus();
        return false;
    }
    if (IsStringNullorEmpty($('#txtAgeRangeFrom').val())) {
        fnAlert("w", "ECP_04_00", "UI0240", errorMsg.AgeRangeFrom_E13);
        $('#txtAgeRangeFrom').focus();
        return false;
    }
    if (IsStringNullorEmpty($('#cboRangeFromPeriod').val()) || $('#cboRangeFromPeriod').val() == '0' || $('#cboRangeFromPeriod').val()=="0") {
        fnAlert("w", "ECP_04_00", "UI0241", errorMsg.SelectRangeFromPeriod_E14);
        $('#cboRangeFromPeriod').focus();
        return false;
    }
    if (IsStringNullorEmpty($('#txtAgeRangeTo').val())) {
        fnAlert("w", "ECP_04_00", "UI0242", errorMsg.AgeRangeTo_E15);
        $('#txtAgeRangeTo').focus();
        return false;
    }
    if (IsStringNullorEmpty($('#cboRangeToPeriod').val()) || $('#cboRangeToPeriod').val() == '0' || $('#cboRangeToPeriod').val() == "0") {
        fnAlert("w", "ECP_04_00", "UI0243", errorMsg.SelectRangeToPeriod_E16);
        $('#cboRangeToPeriod').focus();
        return false;
    }
    if ($('#txtSpecialtyId').val() === "" && $('#chkActiveStatus').parent().hasClass("is-checked") === false) {
        fnAlert("w", "ECP_04_00", "UI0127", errorMsg.SelectStatus_E12);
        $('#chkActiveStatus').focus();
        return false;
    }
    return true;
}
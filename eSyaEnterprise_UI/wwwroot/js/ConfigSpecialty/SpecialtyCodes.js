var formID;
var prevSelectedID;

$(document).ready(function () {
    $("#pnlMainMenu").hide();
    fnLoadSpecialtyCode();
    $('#chkActiveStatus').parent().addClass("is-checked");
});

function fnLoadSpecialtyCode() {

    $.ajax({
        url: getBaseURL() + '/ConfigSpecialty/Specialty/GetSpecialtyTree',
        success: function (result) {
            $('#jstSpecialtyCode').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': false }
            });
            fnTreeSize("#jstSpecialtyCode");
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
                        fnLoadAgeRangeGrid();
                    });
                }
                else if (data.node.parent === "H0") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>');

                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#pnlMainMenu').hide();
                            fnAlert("w", "ECP_04_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        $(".mdl-card__title-text").text(localization.ViewSpecialty);
                        $("#btnSaveSpecialty").hide();
                        fnSetControlStatus(true);
                        fnShowSpecialtyDetail(data.node.id);
                        fnLoadAgeRangeGrid();
                        $("#pnlMainMenu").show();

                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#pnlMainMenu').hide();
                            fnAlert("w", "ECP_04_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $("#btnSaveSpecialty").html('<i class="fa fa-sync"></i> ' + localization.Update);
                        $(".mdl-card__title-text").text(localization.EditSpecialty);
                        $("#btnSaveSpecialty").show();
                        fnSetControlStatus(false);
                        fnShowSpecialtyDetail(data.node.id);
                        fnLoadAgeRangeGrid();
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
        url: getBaseURL() + '/ConfigSpecialty/Specialty/GetSpecialtyCode?specialtyId=' + specialtyId,
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
                url: getBaseURL() + '/ConfigSpecialty/Specialty/DeleteSpecialtyCodes',
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

    $("#btnSaveSpecialty").attr('disabled', true);

    if (fnValidateBeforeSave() === false)
        return;

    $("#jqgAgeRange").jqGrid('editCell', 0, 0, false).attr("value");
    var _agelinks = [];
    var ids = jQuery("#jqgAgeRange").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgAgeRange').jqGrid('getRowData', rowId);


        _agelinks.push({
            AgeRangeId: rowData.AgeRangeId,
            RangeDesc: rowData.RangeDesc,
            AgeRangeFrom: rowData.AgeRangeFrom,
            RangeFromPeriod: rowData.RangeFromPeriod,
            AgeRangeTo: rowData.AgeRangeTo,
            RangeToPeriod: rowData.RangeToPeriod,
            ActiveStatus: rowData.ActiveStatus
        });

    }

    var obj =
    {
        SpecialtyID: $('#txtSpecialtyId').val(),
        SpecialtyDesc: $('#txtSpecialtyDesc').val(),
        Gender: $('#cboGender').val(),
        SpecialtyType: $('#cboSpecialtyType').val(),
        SpecialtyGroup: $('#cboSpecialtyGroup').val(),
        FocusArea: $('#txtFocusArea').val(),
        ActiveStatus: $('#chkActiveStatus').parent().hasClass("is-checked"),
        lstAgerangeSpecilatyLink: _agelinks
    };

    var URL;
    if ($('#txtSpecialtyId').val() !== "")
        URL = getBaseURL() + '/ConfigSpecialty/Specialty/UpdateSpecialtyCodes';
    else
        URL = getBaseURL() + '/ConfigSpecialty/Specialty/InsertSpecialtyCodes';

    //$("#btnSaveSpecialty").html('<i class="fa fa-spinner fa-spin"></i> ' + localization.wait);
  
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
                    $("#btnSaveSpecialty").attr('disabled', false);
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
    $("#cboGender").val('A').selectpicker('refresh');
    $("#cboSpecialtyType").val('G').selectpicker('refresh');
    $("#cboSpecialtyGroup").val('0').selectpicker('refresh');
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
    $("#txtFocusArea").prop("disabled", isdisabled);
    $("#chkActiveStatus").prop("disabled", isdisabled);

}
function fnValidateBeforeSave() {

    if ($('#txtSpecialtyDesc').val() === "" || $('#txtSpecialtyDesc').val() === null) {
        fnAlert("w", "ECP_04_00", "UI0124", errorMsg.SpecialtyCodeDesc_E8);
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

    if ($('#txtSpecialtyId').val() === "" && $('#chkActiveStatus').parent().hasClass("is-checked") === false) {
        fnAlert("w", "ECP_04_00", "UI0127", errorMsg.SelectStatus_E12);
        $('#chkActiveStatus').focus();
        return false;
    }
    return true;
}
function fnLoadAgeRangeGrid() {

    $("#jqgAgeRange").GridUnload();


    $("#jqgAgeRange").jqGrid({
        url: getBaseURL() + '/ConfigSpecialty/Specialty/GetAgeRangeMatrixLinkbySpecialtyId?specialtyId=' + $('#txtSpecialtyId').val(),
        datatype: "json",
        mtype: 'POST',
        rownumbers: true,

        colNames: [localization.AgeRangeId, localization.RangeDesc, localization.AgeRangeFrom,"", localization.RangeFromPeriod, localization.AgeRangeTo,"",localization.RangeToPeriod, localization.ActiveStatus],
        colModel: [
            { name: 'AgeRangeId', key: true, index: 'AgeRangeId', width: 0, sortable: false, hidden: true },
            { name: 'RangeDesc', index: 'RangeDesc', width: 100, sortable: false },
            { name: 'AgeRangeFrom', index: 'AgeRangeFrom', width: 80, sortable: false },
            { name: 'RangeFromPeriod', index: 'RangeFromPeriod', width: 80, sortable: false, hidden: true },
            { name: 'RangeFromPeriodDesc', index: 'RangeFromPeriodDesc', width: 50, sortable: false },
            { name: 'AgeRangeTo', index: 'AgeRangeTo', width: 60, sortable: false },
            { name: 'RangeToPeriod', index: 'RangeToPeriod', width: 60, sortable: false, hidden: true },
            { name: 'RangeToPeriodDesc', index: 'RangeToPeriodDesc', width: 50, sortable: false },
            {
                name: 'ActiveStatus', index: 'ActiveStatus', width: 70, resizable: false, align: 'center',
                formatter: "checkbox", formatoptions: { disabled: false },
                edittype: "checkbox", editoptions: { value: "true:false" }
            },
        ],
        caption: localization.AgeRange,
        height: 'auto',
        width: '200',
        rowNum: 100,
        viewrecords: true,
        gridview: true,
        loadonce: true,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: true,
        onSelectRow: function (id) {
            if (id) { $('#jqgAgeRange').jqGrid('editRow', id, true); }
        },
        loadComplete: function () {
            var ids = $('#jqgAgeRange').jqGrid('getDataIDs');
            var i = 0;
            for (i = 0; i < ids.length; i++) {
                if (ids[i])
                    $('#jqgAgeRange').jqGrid('editRow', ids[i]);
            }
            $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-pager").css('width', $("#pnlMainModuleHeading").width() - 20);
            var scrollPosition = 0
            jQuery("#jqgAgeRange").closest(".ui-jqgrid-bdiv").scrollTop(scrollPosition);
            fnJqgridSmallScreen("jqgAgeRange");
        }
    });

    fnTreeSize("#jstSpecialtyCode");

}
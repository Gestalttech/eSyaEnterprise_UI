var formID;
var prevSelectedID;

$(document).ready(function () {
    $("#pnlMainMenu").hide();
    fnTreeSize();
});

function fnLoadSpecialtyLink() {
    $("#pnlMainMenu").hide();
    $('#jstSpecialtyClinicLink').jstree('destroy');
    if ($('#cboBusinessKey').val() === '')
        return;
    fnCreateSpecialtyTree();
}

function fnCreateSpecialtyTree() {

    $.ajax({
        url: getBaseURL() + '/ConfigSpecialty/Business/GetSpecialtyLinkTree?businessKey=' + $('#cboBusinessKey').val(),
        success: function (result) {

            $('#jstSpecialtyClinicLink').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true }
            });
        }
    });

    $("#jstSpecialtyClinicLink").on('loaded.jstree', function () {
        $("#jstSpecialtyClinicLink").jstree('open_all');
    });

    $('#jstSpecialtyClinicLink').on("changed.jstree", function (e, data) {
        if (data.node !== undefined) {
            if (prevSelectedID !== data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#pnlMainMenu").hide();

                if (data.node.parent === "#") {
                    if (data.node.id.startsWith("N")) {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>');
                        $('#Add').on('click', function () {
                            fnClearFields();
                            fnSpecialtyParameter(data.node.id.substring(1, 10));
                            $(".mdl-card__title-text").text(localization.AddSpecialtyLink);
                            $("#btnSaveSpecialty").html('<i class="fa fa-plus"></i> ' + localization.Save);
                            $("#btnSaveSpecialty").attr("disabled", _userFormRole.IsInsert === false);
                            $("#pnlMainMenu").show();
                            $("#btnSaveSpecialty").show();
                        });
                    }
                    else {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>');
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>');

                        $('#View').on('click', function () {
                            if (_userFormRole.IsView === false) {
                                $('#pnlMainMenu').hide();
                                fnAlert("w", "ECP_05_00", "UIC03", errorMsg.vieweauth_E3);
                                return;
                            }
                            fnSpecialtyParameter(data.node.id.substring(1, 10));
                            $(".mdl-card__title-text").text(localization.ViewSpecialtyLink);
                            $("#btnSaveSpecialty").hide();
                            $("#pnlMainMenu").show();
                        });

                        $('#Edit').on('click', function () {
                            if (_userFormRole.IsEdit === false) {
                                $('#pnlMainMenu').hide();
                                fnAlert("w", "ECP_05_00", "UIC02", errorMsg.editauth_E2);
                                return;
                            }
                            fnSpecialtyParameter(data.node.id.substring(1, 10));
                            $(".mdl-card__title-text").text(localization.EditSpecialtyLink);
                            $("#btnSaveSpecialty").html('<i class="fa fa-sync"></i> ' + localization.Update);
                            $("#btnSaveSpecialty").attr("disabled", _userFormRole.IsEdit === false);
                            $("#pnlMainMenu").show();
                            $("#btnSaveSpecialty").show();
                        });
                    }
                }
                else {
                    $("#pnlMainMenu").hide();
                    fnClearFields();
                }
            }
        }
    });
}

function fnTreeSize() {
    $("#jstSpecialtyClinicLink").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });
}

function fnSpecialtyParameter(specialtyId) {

    fnFillSpecialtyDetail(specialtyId);
    eSyaParams.ClearValue();
    $.ajax({
        url: getBaseURL() + '/ConfigSpecialty/Business/GetSpecialtyParameter?businessKey=' + $('#cboBusinessKey').val() + '&specialtyId=' + specialtyId,
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            if (response !== null) {
                eSyaParams.SetJSONValue(response);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
    /*
    $("#jqgSpecialtyClinic").jqGrid('GridUnload');
    $("#jqgSpecialtyClinic").jqGrid({
        url: getBaseURL() + '/Specialty/GetSpecialtyClinicLink?businessKey=' + $('#cboBusinessKey').val() + '&specialtyId=' + specialtyId,
        datatype: "json",
        contenttype: "application/json; charset-utf-8",
        mtype: 'GET',
        //jsonReader: { repeatDoctors: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Clinic ID", localization.Clinic, localization.Status],
        colModel: [
            { name: 'ClinicID', key: true, index: 'ActionId', width: 0, sortable: false, hidden: true },
            { name: 'ClinicDesc', index: 'ActionDesc', width: 150, sortable: false, editable: false },
            { name: 'ActiveStatus', index: 'ActiveStatus', width: 75, align: 'center', sortable: false, formatter: 'checkbox', editable: true, edittype: "checkbox", editoptions: { value: "true:false" }, formatoptions: { disabled: false } }
        ],
        caption: "",
        height: 'auto',
        width: '200',
        rowNum: 15,
        rownumbers: true,
        viewrecords: true,
        gridview: true,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: true
        //url:null
    });*/
}

function fnFillSpecialtyDetail(specialtyId) {

    $.ajax({
        url: getBaseURL() + '/ConfigSpecialty/Business/GetSpecialtyCode?specialtyId=' + specialtyId,
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
                fnLoadAgeRangeGrid();
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

function fnSaveSpecialtyClinicLink() {

    var obj =
    {
        BusinessKey: $('#cboBusinessKey').val(),
        SpecialtyID: $('#txtSpecialtyId').val(),
        ActiveStatus: true
    };

    var objPar = eSyaParams.GetJSONValue();

    var specialtyId = $('#txtSpecialtyId').val();
    var businessKey = $('#cboBusinessKey').val();
    $("#btnSaveSpecialty").attr('disabled', true);
    var URL;
    URL = getBaseURL() + '/ConfigSpecialty/Business/InsertSpecialtyBusinessLinkList';
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj, objPar, specialtyId, businessKey },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#pnlMainMenu").hide();
                $("#btnSaveSpecialty").html('<i class="fa fa-spinner fa-spin"></i> ' + localization.wait);
                $("#btnSaveSpecialty").attr('disabled', false);
                $('#jstSpecialtyClinicLink').jstree('destroy');
                fnCreateSpecialtyTree();
                fnClearFields();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveSpecialty").attr('disabled', false);
            }

            $("#btnSaveSpecialty").html('<i class="fa fa-plus"></i> ' + localization.Save);
            $("#btnSaveSpecialty").attr('disabled', false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveSpecialty").attr("disabled", false);
            $("#btnSaveSpecialty").html('<i class="fa fa-plus"></i> ' + localization.Save);
        }
    });
}

function fnClearFields() {
    eSyaParams.ClearValue();
}

function fnLoadAgeRangeGrid() {

    $("#jqgBSLAgeRange").GridUnload();


    $("#jqgBSLAgeRange").jqGrid({
        url: getBaseURL() + '/ConfigSpecialty/Specialty/GetAgeRangeMatrixLinkbySpecialtyId?specialtyId=' + $('#txtSpecialtyId').val(),
        datatype: "json",
        mtype: 'POST',
        rownumbers: true,

        colNames: [localization.AgeRangeId, localization.RangeDesc, localization.AgeRangeFrom, localization.RangeFromPeriod, localization.AgeRangeTo, localization.RangeToPeriod, localization.ActiveStatus],
        colModel: [
            { name: 'AgeRangeId', key: true, index: 'AgeRangeId', width: 0, sortable: false, hidden: true },
            { name: 'RangeDesc', index: 'RangeDesc', width: 80, sortable: false },
            { name: 'AgeRangeFrom', index: 'AgeRangeFrom', width: 40, sortable: false },
            { name: 'RangeFromPeriod', index: 'RangeFromPeriod', width: 40, sortable: false, formatter: 'select', editoptions: { value: "Y: Year;D: Day" } },
            { name: 'AgeRangeTo', index: 'AgeRangeTo', width: 40, sortable: false },
            { name: 'RangeToPeriod', index: 'RangeToPeriod', width: 40, sortable: false, formatter: 'select', editoptions: { value: "Y: Year;D: Day" } },
            {
                name: 'ActiveStatus', index: 'ActiveStatus', width: 40, resizable: false, align: 'center',
                formatter: "checkbox", formatoptions: { disabled: true },
                edittype: "checkbox", editoptions: { value: "true:false" }
            },
        ],
        caption: localization.AgeRange,
        height: 'auto',
        width: 'auto',
        rowNum: 100,
        viewrecords: true,
        gridview: true,
        loadonce: true,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: true,
        onSelectRow: function (id) {
            },
        
        loadComplete: function () {
            
            $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-pager").css('width', '100'+'%');
            
            fnJqgridSmallScreen("jqgBSLAgeRange");
        }
    });
    fnAddGridSerialNoHeading();
    fnTreeSize();

}
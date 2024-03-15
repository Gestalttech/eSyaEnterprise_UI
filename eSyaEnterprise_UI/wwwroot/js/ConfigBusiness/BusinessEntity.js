var NodeID;
var prevSelectedID;

$(document).ready(function () {

    $("#pnlMainMenu").hide();
    LoadBusinessEntityTree();
    $("#btnDeleteNode").attr("disabled", _userFormRole.IsDelete === false);
    $("#txtNoofUnits").attr('readonly', true);
    $("#txtNoofUnits").inputmask({ regex: "^[0-9]{1,7}(\\.\\d{1,2})?$" });
    $("#divChkActiveStatus").css('display', 'none');
});
function fnHideshowUnits() {
    var ddlunitval = $('#cboUnitType').val();
    if (ddlunitval === "S") {

        $("#txtNoofUnits").attr('readonly', true);
        $('#txtNoofUnits').val('1');
    }
    else {
        $("#txtNoofUnits").attr('readonly', false);
    }
}
function LoadBusinessEntityTree() {
    $.ajax({
        //url: getBaseURL() + '/License/GetBusinessEntitiesforTreeView',
        success: function (result) {
            fnGetBusinessEntities_Success(result);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function fnGetBusinessEntities_Success(dataArray) {
    $("#jstBusinessEntity").jstree({
        "state": { "checkbox_disabled": true },
        "checkbox": {
            "keep_selected_style": false
        },
        core: { 'data': dataArray, 'check_callback': true, 'multiple': true }

    });

    $("#jstBusinessEntity").on('loaded.jstree', function () {
        $("#jstBusinessEntity").jstree('open_all');
        $("#jstBusinessEntity").jstree()._open_to(prevSelectedID);
        $('#jstBusinessEntity').jstree().select_node(prevSelectedID);

    });

    $('#jstBusinessEntity').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                if (data.node.id == "0") {
                    fnClearFields();
                    $("#pnlMainMenu").hide();
                }
                else {

                    $('#View').remove();
                    $('#Edit').remove();
                    $('#Add').remove();

                    $("#pnlMainMenu").hide();

                    if (data.node.parent == "#") {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')

                        $('#Add').on('click', function () {
                            if (_userFormRole.IsInsert === false) {
                                $('#pnlMainMenu').hide();
                                fnAlert("w", "ECB_01_00", "UIC01", errorMsg.addauth_E1);
                                return;
                            }

                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.AddBusinessEntity);
                            fnClearFields();
                            $("#btnSaveBusinessEntity").show();
                            $("input,textarea").attr('readonly', false);
                            $("input[type=checkbox]").attr('disabled', false);
                            $("#chkActiveStatus").attr('disabled', true);
                            $("#txtNoActiveofUnits").attr('readonly', true);
                            $("#txtNoofUnits").attr('readonly', true);
                            $('#txtNoofUnits').val('1');
                            $("#btnSaveBusinessEntity").html('<i class="fa fa-save"></i> ' + localization.Save);
                            $("#divChkActiveStatus").css('display', 'none');
                            fnGridLoadPreferredLanguage();
                        });


                    }
                    else if (data.node.id.startsWith("FM")) {

                        NodeID = 0;
                        NodeID = data.node.id.substring(2).split("_")[1];

                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')



                        $('#View').on('click', function () {

                            if (_userFormRole.IsView === false) {
                                $('#pnlMainMenu').hide();
                                fnAlert("w", "ECB_01_00", "UIC03", errorMsg.vieweauth_E3);
                                return;
                            }

                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.ViewBusinessEntity);
                            $('#txtBusinessEntityId').val(NodeID);

                            fnFillBusinessEntityInfo();
                            fnGridLoadPreferredLanguage();
                            $("#btnSaveBusinessEntity").hide();
                            $("input,textarea").attr('readonly', true);
                            $("input[type=checkbox]").attr('disabled', true);
                            $("#txtNoActiveofUnits").attr('readonly', true);
                            $("#divChkActiveStatus").css('display', 'flex');
                            $("#chkActiveStatus").attr('disabled', true);
                        });

                        $('#Edit').on('click', function () {
                            if (_userFormRole.IsEdit === false) {
                                $('#pnlMainMenu').hide();
                                fnAlert("w", "ECB_01_00", "UIC02", errorMsg.editauth_E2);
                                return;
                            }

                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.EditBusinessEntity);
                            $('#txtBusinessEntityId').val(NodeID);


                            $("#btnSaveBusinessEntity").show();
                            $("input,textarea").attr('readonly', false);
                            $("input[type=checkbox]").attr('disabled', false);
                            $("#chkActiveStatus").attr('disabled', true);
                            fnFillBusinessEntityInfo();
                            fnGridLoadPreferredLanguage();
                            $("#divChkActiveStatus").css('display', 'none');
                            $("#txtNoActiveofUnits").attr('readonly', true);
                            $("#btnSaveBusinessEntity").html('<i class="fa fa-sync"></i> ' + localization.Update);
                            //$("#btnSaveBusinessEntity").attr("disabled", _userFormRole.IsEdit === false);
                        });
                    }
                    else {
                        fnClearFields();
                        $("#pnlMainMenu").hide();
                    }
                }
            }
        }
    });

    $('#jstBusinessEntity').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstBusinessEntity').jstree().deselect_node(closingNode.children);
    });
    fnTreeSize("#divJstBusinessEntity");
};

function fnFillBusinessEntityInfo() {
    if ($("#txtBusinessEntityId").val() != '' && $("#txtBusinessEntityId").val() != undefined) {
        $.ajax({
            async: false,
            // url: getBaseURL() + "/License/GetBusinessEntityInfo?BusinessId=" + $("#txtBusinessEntityId").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                $('#txtEntityDescription').val(result.BusinessDesc);

                if (result.BusinessUnitType === 'S') {
                    $("#txtNoofUnits").attr('readonly', true);
                }
                else {
                    $("#txtNoofUnits").attr('readonly', false);
                }
                $('#cboUnitType').val(result.BusinessUnitType);
                $('#cboUnitType').selectpicker('refresh');
                $('#txtNoofUnits').val(result.NoOfUnits);
                $('#txtNoActiveofUnits').val(result.ActiveNoOfUnits);
                $("#txtNoActiveofUnits").attr('readonly', true);
                if (result.ActiveStatus == 1) {
                    $("#chkActiveStatus").parent().addClass("is-checked");
                }
                else { $('#chkActiveStatus').parent().removeClass("is-checked"); }

                if (result.UsageStatus == 1) {
                    $("#chkUsageStatus").parent().addClass("is-checked");
                }
                else { $('#chkUsageStatus').parent().removeClass("is-checked"); }
            }
        });
    }

    //fnGridLoadUserRoleActionLink();
}

function fnSaveBusinessEntity() {

    if (fnValidationBusinessEntity() === false) {
        return;
    }
    $("#jqgUserRoleActionLink").jqGrid('editCell', 0, 0, false).attr("value");

    $("#btnSaveBusinessEntity").attr('disabled', true);
    var EntityID = $("#txtBusinessEntityId").val();
    var businessentity;
    if (EntityID == null || EntityID == "") {

        var obj = [];
        var gvT = $('#jqgUserRoleActionLink').jqGrid('getRowData');
        for (var i = 0; i < gvT.length; ++i) {
            if (!IsStringNullorEmpty(gvT[i]['Pldesc'])) {
                var _objBusinessEntity = {
                    BusinessId: 0,
                    CultureCode: gvT[i]['CultureCode'],
                    CultureDesc: gvT[i]['CultureDesc'],
                    Pldesc: gvT[i]['Pldesc'],
                    UsageStatus: gvT[i]['UsageStatus'],
                    ActiveStatus: gvT[i]['ActiveStatus']
                }
                obj.push(_objBusinessEntity);
            }
        }



        businessentity = {
            BusinessId: 0,
            BusinessDesc: $("#txtEntityDescription").val(),
            //IsMultiSegmentApplicable: $("#chkIsMultiSegmentApplicable").parent().hasClass("is-checked"),
            BusinessUnitType: $('#cboUnitType').val(),
            NoOfUnits: $('#txtNoofUnits').val(),
            UsageStatus: $("#chkUsageStatus").parent().hasClass("is-checked"),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            ActiveNoOfUnits: $('#txtNoActiveofUnits').val(),
            l_Preferredlang: obj
        };
    }

    else {

        var obj = [];
        var gvT = $('#jqgUserRoleActionLink').jqGrid('getRowData');
        for (var i = 0; i < gvT.length; ++i) {
            if (!IsStringNullorEmpty(gvT[i]['Pldesc'])) {

                var _objBusinessEntity = {
                    BusinessId: $("#txtBusinessEntityId").val(),
                    CultureCode: gvT[i]['CultureCode'],
                    CultureDesc: gvT[i]['CultureDesc'],
                    Pldesc: gvT[i]['Pldesc'],
                    DefaultLanguage: gvT[i]['DefaultLanguage'],
                    UsageStatus: gvT[i]['UsageStatus'],
                    ActiveStatus: gvT[i]['ActiveStatus']
                }
                obj.push(_objBusinessEntity);

            }
        }
        businessentity = {
            BusinessId: $("#txtBusinessEntityId").val(),
            BusinessDesc: $("#txtEntityDescription").val(),
            //IsMultiSegmentApplicable: $("#chkIsMultiSegmentApplicable").parent().hasClass("is-checked"),
            BusinessUnitType: $('#cboUnitType').val(),
            NoOfUnits: $('#txtNoofUnits').val(),
            UsageStatus: $("#chkUsageStatus").parent().hasClass("is-checked"),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            ActiveNoOfUnits: $('#txtNoActiveofUnits').val(),
            l_Preferredlang: obj
        };
    }
    $.ajax({
        //url: getBaseURL() + '/License/InsertOrUpdateBusinessEntity',
        type: 'POST',
        datatype: 'json',
        data: { businessentity },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                location.reload();

                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveBusinessEntity").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveBusinessEntity").attr('disabled', false);
        }
    });
}

function fnValidationBusinessEntity() {

    if (IsStringNullorEmpty($("#txtEntityDescription").val())) {
        fnAlert("w", "ECB_01_00", "UI0046", errorMsg.EntityDesc_E6);
        return false;
    }

    if ($('#cboUnitType').val() === "M") {
        if (IsStringNullorEmpty($("#txtNoofUnits").val())) {
            fnAlert("w", "ECB_01_00", "UI0047", errorMsg.NoOfUnits_E7);
            return false;
        }
        if (Number($("#txtNoofUnits").val()) <= 1) {
            fnAlert("w", "ECB_01_00", "UI0048", errorMsg.NoOfUnitsGreater_E8);
            return false;
        }
    }
}

function fnClearFields() {

    $("#txtBusinessEntityId").val('');
    $("#txtEntityDescription").val('');
    //$("#chkIsMultiSegmentApplicable").parent().removeClass("is-checked");
    $('#cboUnitType').val('S').selectpicker('refresh');
    $('#txtNoofUnits').val('');
    $('#txtNoActiveofUnits').val('0');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveBusinessEntity").html('<i class="fa fa-plus"></i> Add');
}

function fnValidationBusinessEntityOnDelete() {

    if (IsStringNullorEmpty($("#txtBusinessEntityId").val())) {
        fnAlert("w", "ECB_01_00", "UI0049", errorMsg.BusinessEntity_E9)
        return false;
    }

    if (IsStringNullorEmpty($("#txtEntityDescription").val())) {
        fnAlert("w", "ECB_01_00", "UI0050", errorMsg.Entity_E10)
        return false;
    }
}

function fnDeleteNode() {

    if (fnValidationBusinessEntityOnDelete() === false) {
        return;
    }
    $("#btnDeleteNode").attr('disabled', true);
    $.ajax({
        //url: getBaseURL() + '/License/DeleteBusinessEntity?BusinessEntityId=' + $("#txtBusinessEntityId").val(),
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                location.reload();

                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                return false;
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function fnExpandAll() {
    $('#jstBusinessEntity').jstree('open_all');
}
function fnCollapseAll() {
    fnClearFields();
    $("#pnlMainMenu").hide();
    $('#jstBusinessEntity').jstree('close_all');
}
function fnTreeSize() {

    if ($(document).width() < 575) {
        $("#jstBusinessEntity,#divJstBusinessEntity").css({
            'height': 50 + '%',
            'overflow': 'auto'
        });
    }
    else {
        $("#jstBusinessEntity").css({
            'height': $(window).innerHeight() - 136,
            'overflow': 'auto'
        });
    }
}



function fnGridLoadPreferredLanguage() {
    $("#jqgUserRoleActionLink").jqGrid('GridUnload');
    $("#jqgUserRoleActionLink").jqGrid({
        // url: getBaseURL() + '/License/GetPreferredLanguagebyBusinessKey?BusinessId=' + $("#txtBusinessEntityId").val(),
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessId, localization.CultureCode, localization.CultureDescription, localization.PreferredLanguage, localization.DefaultLanguage, localization.Active],
        colModel: [
            { name: "BusinessId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "CultureCode", width: 30, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "CultureDesc", width: 70, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "Pldesc", width: 70, editable: true, editoptions: { disabled: false }, align: 'left' },
            { name: "DefaultLanguage", editable: true, width: 70, align: 'left !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },

        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpUserRoleActionLink",
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
        cellsubmit: 'clientArray',
        caption: localization.UserRoleActionLink,
        onSelectRow: function (id) {
            if (id) { $('#jqgUserRoleActionLink').jqGrid('editRow', id, true); }
        },
        caption: 'User Role Action Link',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgUserRoleActionLink");
        },
    }).jqGrid('navGrid', '#jqpUserRoleActionLink', { add: false, edit: false, search: false, del: false, refresh: false });
}


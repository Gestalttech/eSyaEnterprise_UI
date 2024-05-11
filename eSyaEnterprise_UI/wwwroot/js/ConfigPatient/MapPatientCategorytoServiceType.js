var NodeID;
var prevSelectedID;
  
function fnBusinessKey_OnChange() {
    var _businesskey = $("#cboBusinessKey").val();
    var _patienttype = $("#cboPatientTypes").val();
    $("#pnlMapPatientCategoryServiceType").hide();
    if (_businesskey == 0 || _patienttype == 0) {
        $("#jstMapPatientCategoryServiceType").jstree('destroy').empty();
    }
    else {
        $("#jstMapPatientCategoryServiceType").jstree('destroy').empty();
        fnLoadPatientCategoryTree();
    }
}
function fnPatientType_OnChange() {
    var _businesskey = $("#cboBusinessKey").val();
    var _patienttype = $("#cboPatientTypes").val();
    $("#pnlMapPatientCategoryServiceType").hide();
    if (_businesskey == 0 || _patienttype == 0) {
        $("#jstMapPatientCategoryServiceType").jstree('destroy').empty();

    }
    else {
        $("#jstMapPatientCategoryServiceType").jstree('destroy').empty();
        fnLoadPatientCategoryTree();
    }
}

function fnLoadPatientCategoryTree() {
    $.ajax({
        url: getBaseURL() + '/ConfigPatient/ServiceType/GetPatientCategoriesforTreeViewbyPatientType?PatientTypeId=' + $("#cboPatientTypes").val(),
        success: function (result) {
            fnGetPatientCategory_Success(result);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function fnGetPatientCategory_Success(dataArray) {

    $("#jstMapPatientCategoryServiceType").jstree({
        "state": { "checkbox_disabled": true },
        "checkbox": {
            "keep_selected_style": false
        },
        core: { 'data': dataArray, 'check_callback': true, 'multiple': true }

    });

    $("#jstMapPatientCategoryServiceType").on('loaded.jstree', function () {
        $("#jstMapPatientCategoryServiceType").jstree('open_all');
        $("#jstMapPatientCategoryServiceType").jstree()._open_to(prevSelectedID);
        $('#jstMapPatientCategoryServiceType').jstree().select_node(prevSelectedID);

    });

    $('#jstMapPatientCategoryServiceType').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                if (data.node.id == "0") {

                    $("#pnlMapPatientCategoryServiceType").hide();
                }
                else {


                    $('#View').remove();
                    $('#Edit').remove();
                    $('#Add').remove();

                    $("#pnlMapPatientCategoryServiceType").hide();

                    if (data.node.parent == "#") {
                        $('#pnlMapPatientCategoryServiceType').hide();
                    }
                    else if (data.node.id.startsWith("FM")) {
                        $('#View').remove();
                        $('#Edit').remove();
                        $('#Add').remove();
                        NodeID = 0;
                        NodeID = data.node.id.substring(2).split("_")[1];
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:5px;padding-right:5px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:5px;padding-right:5px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:5px;padding-right:5px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#Add').on('click', function () {
                            if (_userFormRole.IsInsert === false) {
                                fnAlert("w", "EPM_05_00", "UIC01", errorMsg.addauth_E1);
                                return;
                            }
                            $('#pnlMapPatientCategoryServiceType').hide();

                            fnGridLoadPatientCategoryServiceType(NodeID,);

                            $("#pnlMapPatientCategoryServiceType").show();
                            $(".mdl-card__title-text").text(localization.AddPatientCategory);
                            $("#btnAddMapPatientCategoryServiceType").show();
                            $("#btnAddMapPatientCategoryServiceType").html('<i class="fa fa-save"></i> ' + localization.Save);
                           

                        });
                        $('#Edit').on('click', function () {
                            if (_userFormRole.IsEdit === false) {
                                fnAlert("w", "EPM_05_00", "UIC02", errorMsg.editauth_E2);
                                return;
                            }
                            $('#pnlMapPatientCategoryServiceType').hide();

                            fnGridLoadPatientCategoryServiceType(NodeID,);

                            $("#pnlMapPatientCategoryServiceType").show();
                            $(".mdl-card__title-text").text(localization.EditPatientCategory);
                            $("#btnAddMapPatientCategoryServiceType").show();
                            $("#btnAddMapPatientCategoryServiceType").html('<i class="fa fa-sync"></i> ' + localization.Update);
                           
                        });

                        $('#View').on('click', function () {
                            if (_userFormRole.IsView === false) {
                                fnAlert("w", "EPM_05_00", "UIC03", errorMsg.vieweauth_E3);
                                return;
                            }
                            $('#pnlMapPatientCategoryServiceType').hide();

                            fnGridLoadPatientCategoryServiceType(NodeID,);

                            $("#pnlMapPatientCategoryServiceType").show();
                            $(".mdl-card__title-text").text(localization.ViewPatientCategory);
                            $("#btnAddMapPatientCategoryServiceType").hide();
                            $("#btnAddMapPatientCategoryServiceType").html('<i class="fa fa-sync"></i> ' + localization.Update);
                           
                        });
                    }
                    else {

                        $("#pnlMapPatientCategoryServiceType").hide();
                    }
                }
            }
        }
    });

    $('#jstMapPatientCategoryServiceType').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstMapPatientCategoryServiceType').jstree().deselect_node(closingNode.children);
    });
    fnTreeSize("#jstMapPatientCategoryServiceType");
};

function fnGridLoadPatientCategoryServiceType(nodeID) {

    $("#jqgPatientCategoryServiceType").GridUnload();

    $("#jqgPatientCategoryServiceType").jqGrid({
        url: getBaseURL() + '/ConfigPatient/ServiceType/GetPatientTypeCategoryServiceTypeInfo?businesskey=' + $("#cboBusinessKey").val() + '&PatientTypeId=' + $("#cboPatientTypes").val() + '&PatientCategoryId=' + nodeID,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.PatientTypeId, localization.PatientCategoryId, localization.ServiceType, localization.RateType, localization.ServiceTypeDesc, localization.RateTypeDesc, localization.Active],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "PatientTypeId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "PatientCategoryId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "ServiceType", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "RateType", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "ServiceTypeDesc", width: 150, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "RateTypeDesc", width: 150, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ActiveStatus", editable: true, width: 50, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
        ],
        pager: "#jqpPatientCategoryServiceType",
        rowNum: 10000,
        pgtext: null,
        pgbuttons: null,
        rownumWidth: '55',
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: false,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        caption: localization.MapPatientCategoryServiceType,
        
        loadComplete: function (data) {

            if (data == null) {
                $("#pnlMapPatientCategoryServiceType").hide();
                fnAlert("w", "EPM_05_00", "UI0310", errorMsg.NoDoc_E14);
            }
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
            fnJqgridSmallScreen("jqgPatientCategoryServiceType");

        },
        loadBeforeSend: function () {
            $("[id*='_edit']").css('text-align', 'center');
        },
        onSelectRow: function (rowid, status, e) {
        },
    }).jqGrid('navGrid', '#jqpPatientCategoryServiceType', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpPatientCategoryServiceType', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPatientCategoryServiceType
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgPatientCategoryServiceType"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnSavePatientTypeCategoryServiceTypeLink() {

    if (fnValidateServiceTypeLink() === false) {
        return;
    }
    $("#jqgPatientCategoryServiceType").jqGrid('editCell', 0, 0, false).attr("value");

    $("#btnAddMapPatientCategoryServiceType").attr('disabled', true);


    var obj = [];
    var gvT = $('#jqgPatientCategoryServiceType').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {

        var _spec = {
            BusinessKey: $("#cboBusinessKey").val(),
            PatientTypeId: $("#cboPatientTypes").val(),
            PatientCategoryId: NodeID,
            PatientCatgDocId: gvT[i]['PatientCatgDocId'],
            PatientCatgoryServiceTypeDesc: gvT[i]['PatientCatgoryServiceTypeDesc'],
            ActiveStatus: gvT[i]['ActiveStatus']
        };
        obj.push(_spec);

    }

    $.ajax({
        url: getBaseURL() + '/ConfigPatient/ServiceType/InsertOrUpdatePatientCategoryServiceTypeLink',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $('#pnlMapPatientCategoryServiceType').hide();
                $("#btnAddMapPatientCategoryServiceType").attr('disabled', false);
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnAddMapPatientCategoryServiceType").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnAddMapPatientCategoryServiceType").attr('disabled', false);
        }
    });
}

function fnValidateServiceTypeLink() {

    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $("#cboBusinessKey").val() == "0" || $("#cboBusinessKey").val() == 0) {
        fnAlert("w", "EPM_05_00", "UI0064", errorMsg.BusinessLocation_E11);
        return false;
    }

    if (IsStringNullorEmpty($("#cboPatientTypes").val()) || $("#cboPatientTypes").val() == "0" || $("#cboPatientTypes").val() == 0) {
        fnAlert("w", "EPM_05_00", "UI0274", errorMsg.PatientType_E12);
        return false;
    }
    if (IsStringNullorEmpty(NodeID) || NodeID == "0" || NodeID == 0) {
        fnAlert("w", "EPM_05_00", "UI0275", errorMsg.PatientCategory_E13);
        return false;
    }
}
function fnExpandAll() {
    $('#jstMapPatientCategoryServiceType').jstree('open_all');
}

function fnCollapseAll() {
    $("#pnlMapPatientCategoryServiceType").hide();
    $('#jstMapPatientCategoryServiceType').jstree('close_all');
}

function fnGridRefreshPatientCategoryServiceType() {
    $("#jqgPatientCategoryServiceType").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}


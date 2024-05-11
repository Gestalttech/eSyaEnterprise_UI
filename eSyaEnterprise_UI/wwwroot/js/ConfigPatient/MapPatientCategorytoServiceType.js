var NodeID;
var prevSelectedID;


$(document).ready(function () {
     $.contextMenu({
        selector: "#btnServiceType",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditServiceType(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditServiceType(event, 'view') } },
 
        },
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
});


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
        colNames: [localization.BusinessKey, localization.PatientTypeId, localization.PatientCategoryId, localization.ServiceType, localization.RateType, localization.ServiceType, localization.RateType, localization.Active ,localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "PatientTypeId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "PatientCategoryId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "ServiceType", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "RateType", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "ServiceTypeDesc", width: 150, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "RateTypeDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ActiveStatus", editable: true, width: 50, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
            {
                name: 'edit', search: false, align: 'left', width: 50, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnServiceType"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
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
                fnAlert("w", "EPM_05_00", "UI0311", errorMsg.Noservice_E14);
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
    }).jqGrid('navButtonAdd', '#jqpPatientCategoryServiceType', {caption: '<span class="fa fa-plus"></span> Add', buttonicon: "none", id: "custAdd", position: "first", onClickButton: fnAddPatientCategoryServiceType
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgPatientCategoryServiceType"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}
var _isInsert = true;
function fnAddPatientCategoryServiceType() {
    _isInsert = true;
    if (_userFormRole._isInsert === false) {
        fnAlert("w", "EPM_05_00", "UIC01", errorMsg.addauth_E1);
        return;
    }
    fnClearFields();
   
    $('#PopupServiceType').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupServiceType').find('.modal-title').text(localization.AddServiceType);
    $("#btnSaveServiceType").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveServiceType").show();
    //$("#btndeActiveServiceType").hide();
    $("#cboServiceType").next().attr('disabled', false);
    $("#cboRateType").next().attr('disabled', false);
}

function fnEditServiceType(e, actiontype) {
    var rowid = $("#jqgPatientCategoryServiceType").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgPatientCategoryServiceType').jqGrid('getRowData', rowid);
    fnClearFields();
    $("#cboServiceType").val(rowData.ServiceType).selectpicker('refresh');
    $("#cboServiceType").next().attr('disabled', true);
    $("#cboRateType").val(rowData.RateType).selectpicker('refresh');
    $("#cboRateType").next().attr('disabled', true);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveServiceType").attr("disabled", false);
    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPM_05_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupServiceType').modal('show');
        $('#PopupServiceType').find('.modal-title').text(localization.UpdateServiceType);
        $("#btnSaveServiceType").html('<i class="fa fa-sync"></i>' + localization.Update);
        //$("#btndeActiveServiceType").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveServiceType").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPM_05_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupServiceType').modal('show');
        $('#PopupServiceType').find('.modal-title').text(localization.ViewServiceType);
        $("#btnSaveServiceType").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveServiceType").hide();    
        //$("#btndeActiveServiceType").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupServiceType").on('hidden.bs.modal', function () {
            $("#btnSaveServiceType").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnSavePatientTypeCategoryServiceTypeLink() {

    if (fnValidateServiceTypeLink() === false) {
        return;
    }
    $("#jqgPatientCategoryServiceType").jqGrid('editCell', 0, 0, false).attr("value");

    $("#btnAddMapPatientCategoryServiceType").attr('disabled', true);


   
    var obj = {
            BusinessKey: $("#cboBusinessKey").val(),
            PatientTypeId: $("#cboPatientTypes").val(),
            PatientCategoryId: NodeID,
            ServiceType: $("#cboServiceType").val(),
            RateType: $("#cboRateType").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        };
       

    

    $.ajax({
        url: getBaseURL() + '/ConfigPatient/ServiceType/InsertOrUpdatePatientTypeCategoryServiceTypeLink',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnGridRefreshPatientCategoryServiceType();
                $("#btnAddMapPatientCategoryServiceType").attr('disabled', false);
                $('#PopupServiceType').modal('hide');
                fnClearFields();
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
    if (IsStringNullorEmpty($("#cboServiceType").val()) || $("#cboServiceType").val() == "0" || $("#cboServiceType").val() == 0) {
        fnAlert("w", "EPM_05_00", "UI0064", "Please Select Service Type");
        return false;
    }

    if (IsStringNullorEmpty($("#cboRateType").val()) || $("#cboRateType").val() == "0" || $("#cboRateType").val() == 0) {
        fnAlert("w", "EPM_05_00", "UI0274", "Please Select Rate Type");
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

function fnClearFields() {
    $("#cboServiceType").val(0).selectpicker('refresh');
    $("#cboRateType").val(0).selectpicker('refresh');
   $("#btnSaveServiceType").attr("disabled", false);
}
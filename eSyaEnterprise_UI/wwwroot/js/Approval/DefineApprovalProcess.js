var actiontype = "";
var _isInsert = true;
var FormID = "0";
var prevSelectedID = '';
$(function () {
    $("#txtAPEffectiveFrom").datepicker({
        minDate: 0,
        dateFormat: _cnfDateFormat,
    });
    $("#txtAPEffectiveTill").datepicker({
        minDate: 0,
        dateFormat: _cnfDateFormat,
    });
    $.contextMenu({
        selector: "#btnValueBasedApproval",
        trigger: 'left',
         items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditValueBasedApproval('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditValueBasedApproval('view') } },
        }
       
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
//    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});


function fnOnChangeBusinessKey() {
  
    var _businessKey = $("#cboBusinessKey").val();
    if (_businessKey != "0" ||  _businessKey != 0 ) {

        fnLoadFormsTree();
        $("#pnlApprovalProcess").css('display', 'none');
    }
    else {
        $("#jstApprovalProcess").jstree("destroy"); $("#pnlApprovalProcess").css('display', 'none');
    }
}


/* Dropdown change function starts */
function fnOnChangeApproval() {
   
    var _approvalType = $("#cboApprovalType").val();
    if (_approvalType == "70001" || _approvalType == 70001) {
        $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
        $("#secValueBasedApproval").hide();
        $("#secLevelBasedApproval,#btnSaveApprovalLevel").show();
        fnLoadGridLevelBasedApproval();
    }
    if (_approvalType == "70002" || _approvalType == 70002) {
        $("#secLevelBasedApproval,#btnSaveApprovalLevel").hide();
        $("#secValueBasedApproval").show();
        fnLoadGridValueBasedApproval();
        $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
        fnLoadGridLevelBasedApproval_popup();
    }
    if (_approvalType == "0" || _approvalType == 0) {
        $("#secValueBasedApproval").hide(); $("#secLevelBasedApproval,#btnSaveApprovalLevel").hide();
    }
}

/* Dropdown change function ends */




/* Jstree starts*/

function fnLoadFormsTree() {
    prevSelectedID = '';
    $("#jstApprovalProcess").jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/Approval/Process/GetFormsForApproval',
        type: 'Post',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {

            $("#jstApprovalProcess").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstApprovalProcess");
            $(window).on('resize', function () {
                fnTreeSize("#jstApprovalProcess");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

    $("#jstApprovalProcess").on('loaded.jstree', function () {
        $("#jstApprovalProcess").jstree()._open_to(prevSelectedID);
        $('#jstApprovalProcess').jstree().select_node(prevSelectedID);
    });

    $('#jstApprovalProcess').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                var parentNode = $("#jstApprovalProcess").jstree(true).get_parent(data.node.id);

                if (parentNode == "FM") {

                    $("#lblSelectedFormName").text(data.node.text);
                    FormID = data.node.id;

                    $("#cboApprovalType").val('0').selectpicker('refresh');
                    fnGetExistingApprovalType();

                    //fnLoadGridLevelBasedApproval();
                    $("#pnlApprovalProcess").css('display', 'block');
                    $("#chkATActiveStatus").parent().addClass("is-checked");
                    $("#chkATActiveStatus").prop('disabled', true);
                }
                else {
                    $("#pnlApprovalProcess").css('display', 'none');
                }

            }
        }
    });
    $('#jstApprovalProcess').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstApprovalProcess').jstree().deselect_node(closingNode.children);
    });
}


function fnALExpandAll() {
    $('#jstApprovalProcess').jstree('open_all');
}

function fnALCollapseAll() {
    $("#pnlApprovalProcess").hide();
   
    $('#jstApprovalProcess').jstree('close_all');
}

/* Jstree ends*/

/* Save Approval Type */
function fnSaveApprovalLevels() {
   
    if (validationApprovalType() === false) {
        return;
    }
    if (!validateAtLeastOneCheckbox('jqgLevelBasedApproval')) {
        fnAlert("w", "EAP_01_00", "UI0402", errorMsg.CheckOneApproval_E5);
        return;
    } 

    $("#jqgLevelBasedApproval").jqGrid('editCell', 0, 0, false).attr("value");
    $("#btnSaveApprovalLevel").attr('disabled', true);

    var $grid = $("#jqgLevelBasedApproval");
    var _levelslinks = [];
    var ids = jQuery("#jqgLevelBasedApproval").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgLevelBasedApproval').jqGrid('getRowData', rowId);


        _levelslinks.push({
            ApprovalLevel: rowData.ApprovalLevel,
            ActiveStatus: rowData.ActiveStatus
        });

    }
    var _objatype = {
        BusinessKey: $("#cboBusinessKey").val(),
        FormId: FormID,
        ApprovalType: $("#cboApprovalType").val(),
        ActiveStatus: $("#chkATActiveStatus").parent().hasClass("is-checked"),
        lst_ApprovalLevels: _levelslinks
    };

    $.ajax({
        url: getBaseURL() + '/Approval/Process/InsertOrUpdateApprovalLevel',
        type: 'POST',
        datatype: 'json',
        data: { obj: _objatype },

        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveApprovalLevel").attr('disabled', false);
                $("#pnlApprovalProcess").css('display', 'none');
                fnLoadFormsTree();
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveApprovalLevel").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveApprovalLevel").attr('disabled', false);
        }
    });
}
function validationApprovalType() {

    if ($("#cboBusinessKey").val() <= 0) {
        fnAlert("w", "EAP_01_00", "UI0064", errorMsg.SelectBusinessLocation_E6);
        return;
    }

    if (IsStringNullorEmpty(FormID) || FormID == "0") {
        fnAlert("w", "EAP_01_00", "UI0108", errorMsg.SelectForm_E7);
        return false;
    }
    if (IsStringNullorEmpty($("#cboApprovalType").val()) || $("#cboApprovalType").val() == "0") {
        fnAlert("w", "EAP_01_00", "UI0302", "Select a Approval type");
        return false;
    }
}

function validateAtLeastOneCheckbox(jqgLevelBasedApproval) {
   
    let isChecked = false;
    const rows = $("#" + jqgLevelBasedApproval).getDataIDs(); // Get all row IDs
    for (let i = 0; i < rows.length; i++) {
        const isRowChecked = $("#" + jqgLevelBasedApproval).jqGrid('getCell', rows[i], 'ActiveStatus');
        if (isRowChecked == 'true') {
            isChecked = true;
            break;
        }
    }
    return isChecked;
}
/*End Save Approval Type*/

function fnClearApprovalProcess() {
    $("#pnlApprovalProcess").css('display', 'none');
    fnLoadFormsTree();
}

/*Level Based Approval Starts*/
function fnLoadGridLevelBasedApproval() {

    $("#jqgLevelBasedApproval").GridUnload();

    $("#jqgLevelBasedApproval").jqGrid({
        url: getBaseURL() + '/Approval/Process/GetApprovalLevelsbyCodeType?businesskey=' + $("#cboBusinessKey").val()
            + '&formId=' + FormID + '&approvaltype=' + $("#cboApprovalType").val(),
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.LevelId, localization.LevelDescription, localization.Active],
        colModel: [
            { name: "ApprovalLevel", width: 250, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "ApprovalLevelDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ActiveStatus", width: 110, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false }, },
        ],
        pager: "#jqpLevelBasedApproval",
        rowNum: 10,
        sortable: false,
        rowList: [10, 20, 50, 100],
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
        forceFit: true, caption: localization.LevelBasedApproval,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgLevelBasedApproval");
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');

        },
        onSelectRow: function (rowid, status, e) {

        },
    }).jqGrid('navGrid', '#jqpLevelBasedApproval', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpLevelBasedApproval', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshLevelBasedApproval
    });

   
    fnAddGridSerialNoHeading();
}
function fnGridRefreshLevelBasedApproval() {
    $("#jqgLevelBasedApproval").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

/*Level Based Approval Ends*/

/*Value Based Approval Starts*/
function fnLoadGridValueBasedApproval() {

    $("#jqgValueBasedApproval").GridUnload();

    $("#jqgValueBasedApproval").jqGrid({
        url: getBaseURL() + '/Approval/Process/GetApprovalValuesbyFormID?businesskey=' + $("#cboBusinessKey").val()
            + '&formId=' + FormID + '&approvaltype=' + $("#cboApprovalType").val(),
        datatype: 'json',
        mtype: 'POST',
       ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.ValueFrom, localization.ValueTo, localization.EffectiveFrom, localization.EffectiveTill, localization.Active, localization.Actions],
        colModel: [
            

            { name: "ValueFrom", width:100, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            { name: "ValueTo", width:100, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            {
                name: "EffectiveFrom", index: 'FromDate', width: 80, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: "EffectiveTill", index: 'FromTill', width:80, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "ActiveStatus", width: 55, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 55, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnValueBasedApproval"><i class="fa fa-ellipsis-v"></i></button>'
                }
            }, ],
        pager: "#jqpValueBasedApproval",
        rowNum: 10,
        sortable: false,
        rowList: [10, 20, 50, 100],
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
        forceFit: true, caption: localization.ValueBasedApproval,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgValueBasedApproval");
        },
        onSelectRow: function (rowid, status, e) {

        },
    }).jqGrid('navGrid', '#jqpValueBasedApproval', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpValueBasedApproval', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshValueBasedApproval
    }).jqGrid('navButtonAdd', '#jqpValueBasedApproval', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddValueBasedApproval
    });

  
    fnAddGridSerialNoHeading();
}


function fnAddValueBasedApproval() {
    fnLoadGridLevelBasedApproval_popup();
    $("#PopupApprovalProcess").modal('show');
    $("#btnSaveApprovalValues").show();
    $("#chkAPActiveStatus").parent().addClass("is-checked");
    $("#chkAPActiveStatus").prop('disabled', true);
    $("#btnDeactiveApprovalProcess").hide();
    $("#txtAPValueFrom,#txtAPValueTo,#txtAPEffectiveFrom,#txtAPEffectiveTill").val('');
    $("#txtAPValueFrom,#txtAPValueTo,#txtAPEffectiveFrom,#txtAPEffectiveTill").attr('disabled', false);
    $('#PopupApprovalProcess').find('.modal-title').text(localization.AddValueBasedApproval);
}

function fnEditValueBasedApproval(actiontype) {
   
    var rowid = $("#jqgValueBasedApproval").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgValueBasedApproval').jqGrid('getRowData', rowid);
   
    $("#txtAPValueFrom").val(rowData.ValueFrom);
    $("#txtAPValueTo").val(rowData.ValueTo);
    
    if (rowData.EffectiveFrom !== null) {
        setDate($('#txtAPEffectiveFrom'), fnGetDateFormat(rowData.EffectiveFrom));
    }
    else {
        $('#txtAPEffectiveFrom').val('');
    }

    if (rowData.EffectiveTill !== null) {
        setDate($('#txtAPEffectiveTill'), fnGetDateFormat(rowData.EffectiveTill));
    }
    else {
        $('#txtAPEffectiveTill').val('');
    }
    if (rowData.ActiveStatus == 'true') {
        $("#chkAPActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkAPActiveStatus").parent().removeClass("is-checked");
    }
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EAP_01_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupApprovalProcess').modal('show');
        $('#PopupApprovalProcess').find('.modal-title').text(localization.EditValueBasedApproval);
        $("#btnSaveApprovalValues").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#txtAPValueFrom,#txtAPValueTo,#txtAPEffectiveFrom").attr('disabled', true);
        $("#txtAPEffectiveTill").attr('disabled', false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EAP_01_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupApprovalProcess').modal('show');
        $('#PopupApprovalProcess').find('.modal-title').text(localization.ViewValueBasedApproval);
        $("#chkActiveStatus").prop('disabled', true);
        $("#txtAPValueFrom,#txtAPValueTo,#txtAPEffectiveFrom,#txtAPEffectiveTill").attr('disabled', true);
        $("#btnSaveApprovalValues").hide();
    }

    
}

function fnGridRefreshValueBasedApproval() {
    $("#jqgValueBasedApproval").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}


function fnClearApproval() {
    $("#chkAPActiveStatus").parent().addClass("is-checked");
    $("#chkAPActiveStatus").prop('disabled', true);
}

/*Value Based Approval Ends*/

/* For Popup -  Level Based Approval grid Starts */
function fnLoadGridLevelBasedApproval_popup() {

    $("#jqgLevelBasedApproval_popup").GridUnload();

    $("#jqgLevelBasedApproval_popup").jqGrid({
        url: getBaseURL() + '/Approval/Process/GetApprovalLevelsbyCodeType?businesskey=' + $("#cboBusinessKey").val()
            + '&formId=' + FormID + '&approvaltype=' + $("#cboApprovalType").val(),
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.LevelId, localization.LevelDescription, localization.Active],
        colModel: [
            { name: "ApprovalLevel", width: 250, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "ApprovalLevelDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ActiveStatus", width: 110, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false }, },
         ],
        pager: "#jqpLevelBasedApproval_popup",
        rowNum: 10,
        sortable: false,
        rowList: [10, 20, 50, 100],
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
        forceFit: true, caption: localization.LevelBasedApproval,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgLevelBasedApproval_popup");
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');

        },
        onSelectRow: function (rowid, status, e) {

        },
    }).jqGrid('navGrid', '#jqpLevelBasedApproval_popup', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpLevelBasedApproval_popup', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshLevelBasedApproval_popup
    });
    fnAddGridSerialNoHeading();
}

function fnGridRefreshLevelBasedApproval_popup() {
    $("#jqgLevelBasedApproval_popup").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}


$("#PopupApprovalProcess").on('hidden.bs.modal', function () {
    fnGridRefreshLevelBasedApproval_popup();
});
$("#PopupApprovalProcess").on('shown.bs.modal', function () {
    $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
})
/* Level Based Approval grid Ends */



/* Save Approval Values */
function fnSaveApprovalValues() {

    if (validationApprovalValues() === false) {
        return;
    }
    if (!validateAtLeastOneCheckboxValues('jqgLevelBasedApproval_popup')) {
        fnAlert("w", "EAP_01_00", "UI0064", "Please check at least one Approval Level.");
        return;
    }

    $("#jqgLevelBasedApproval_popup").jqGrid('editCell', 0, 0, false).attr("value");
    $("#btnSaveApprovalValues").attr('disabled', true);

    var $grid = $("#jqgLevelBasedApproval_popup");
    var _valuelinks = [];
    var _valubased = [];
    var ids = jQuery("#jqgLevelBasedApproval_popup").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgLevelBasedApproval_popup').jqGrid('getRowData', rowId);


        _valuelinks.push({
            ApprovalLevel: rowData.ApprovalLevel,
            ActiveStatus: rowData.ActiveStatus
        });

    }

    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgLevelBasedApproval_popup').jqGrid('getRowData', rowId);


        _valubased.push({
            BusinessKey: $("#cboBusinessKey").val(),
            FormId: FormID,
            ApprovalLevel: rowData.ApprovalLevel,
            ValueFrom: $("#txtAPValueFrom").val(),
            ValueTo: $("#txtAPValueTo").val(),
            EffectiveFrom: getDate($("#txtAPEffectiveFrom")),
            EffectiveTill: getDate($("#txtAPEffectiveTill")),
            ActiveStatus: rowData.ActiveStatus 
        });

    }
    var _objvalue = {
        BusinessKey: $("#cboBusinessKey").val(),
        FormId: FormID,
        ValueFrom: $("#txtAPValueFrom").val(),
        ValueTo: $("#txtAPValueTo").val(),
        EffectiveFrom: getDate($("#txtAPEffectiveFrom")),
        EffectiveTill: getDate($("#txtAPEffectiveTill")),
        ApprovalType: $("#cboApprovalType").val(),
        ActiveStatus: $("#chkAPActiveStatus").parent().hasClass("is-checked"),
        lst_ApprovalLevels: _valuelinks,
        lst_ApprovalValues: _valubased
    };

    $.ajax({
        url: getBaseURL() + '/Approval/Process/InsertOrUpdateApprovalValueBased',
        type: 'POST',
        datatype: 'json',
        data: { obj: _objvalue },

        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveApprovalValues").attr('disabled', false);
                
                $("#PopupApprovalProcess").modal('hide');
                fnGridRefreshValueBasedApproval();
                fnLoadFormsTree();
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveApprovalValues").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveApprovalValues").attr('disabled', false);
        }
    });
}
function validationApprovalValues() {

    if ($("#cboBusinessKey").val() <= 0) {
        fnAlert("w", "EAP_01_00", "UI0064", errorMsg.SelectBusinessLocation_E4);
        return;
    }

    if (IsStringNullorEmpty(FormID) || FormID == "0") {
        fnAlert("w", "EAP_01_00", "UI0181", "Select a form");
        return false;
    }
    if (IsStringNullorEmpty($("#cboApprovalType").val()) || $("#cboApprovalType").val() == "0") {
        fnAlert("w", "EAP_01_00", "UI0302", "Select a Approval type");
        return false;
    }

    if (IsStringNullorEmpty($("#txtAPValueFrom").val())) {
        fnAlert("w", "EAP_01_00", "UI0181", "Please Enter Value From");
        return false;
    }
    if (IsStringNullorEmpty($("#txtAPValueTo").val()) || $("#txtAPValueTo").val()=="0") {
        fnAlert("w", "EAP_01_00", "UI0181", "Please Enter Effective Value To");
        return false;
    }
    if (IsStringNullorEmpty($("#txtAPEffectiveFrom").val())) {
        fnAlert("w", "EAP_01_00", "UI0181", "Please Select Effective From");
        return false;
    }
}

function validateAtLeastOneCheckboxValues(jqgLevelBasedApproval_popup) {

    let isChecked = false;
    const rows = $("#" + jqgLevelBasedApproval_popup).getDataIDs(); // Get all row IDs
    for (let i = 0; i < rows.length; i++) {
        const isRowChecked = $("#" + jqgLevelBasedApproval_popup).jqGrid('getCell', rows[i], 'ActiveStatus');
        if (isRowChecked == 'true') {
            isChecked = true;
            break;
        }
    }
    return isChecked;
}
/*End Save Approval Type*/

function fnGetExistingApprovalType() {
   
        $.ajax({
           
            url: getBaseURL() + '/Approval/Process/GetApprovalTypebyFormID?businesskey=' + $("#cboBusinessKey").val()
                + '&formId=' + FormID ,
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != null) {
                    $("#cboApprovalType").val(result.ApprovalType).selectpicker('refresh');
                    $("#cboApprovalType").attr("disabled", true).selectpicker('refresh');
                    fnOnChangeApproval();
                }
                else
                {
                   
                    $("#cboApprovalType").val("0").selectpicker('refresh');
                    $("#cboApprovalType").attr("disabled", false).selectpicker('refresh');
                    fnOnChangeApproval();
                }
                
            }
        });
    

    //fnGridLoadUserRoleActionLink();
}

var actiontype = "";
var actionParameterType = "";
$(document).ready(function () {
    
    fnGridLoadParameterHeader();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnParametersHeader",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgAddViewParameter: { name: "Add/View Parameter", icon: "add", callback: function (key, opt) { fnParametersInfoPopup(event) } },
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditParametersType(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditParametersType(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditParametersType(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnGridLoadParameterHeader() {
    $('#jqgParametersHeader').jqGrid('GridUnload');
    $("#jqgParametersHeader").jqGrid({
        url: getBaseURL() + '/Parameters/GetParametersHeaderInformation',
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        ignoreCase: true,
        colNames: [localization.ParameterType, localization.ParameterTypeDescription, localization.Active, localization.Actions],
        colModel: [
            { name: "ParameterType", width: 45, align: 'left', editable: false, editoptions: { maxlength: 4 } },
            { name: "ParameterHeaderDesc", width: 155, editable: false, align: 'left', editoptions: { maxlength: 50 } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

            //{
            //    name: 'edit', search: false, align: 'left', width: 180, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="UploadQuotation btn-xs ui-button ui- widget ui-corner-all btn-jqgrid" title="View " onclick="return fnParametersInfoPopup(event);"><i class="fa fa-plus"></i>Add/View Parameter</button>' +
            //            ' <button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditParametersType(event,\'edit\')"><i class="fas fa-pen"></i>' +localization.Edit+'</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditParametersType(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View +' </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnEditParametersType(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete +'</button >';
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnParametersHeader"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpParametersHeader",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0, caption:'Parameters Header',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgParametersHeader");
        },

        onSelectRow: function (rowid, status, e) {
            var $self = $(this), $target = $(e.target),
                p = $self.jqGrid("getGridParam"),
                rowData = $self.jqGrid("getLocalRow", rowid),
                $td = $target.closest("tr.jqgrow>td"),
                iCol = $td.length > 0 ? $td[0].cellIndex : -1,
                cmName = iCol >= 0 ? p.colModel[iCol].name : "";

            switch (cmName) {
                case "id":
                    if ($target.hasClass("myedit")) {
                        alert("edit icon is clicked in the row with rowid=" + rowid);
                    } else if ($target.hasClass("mydelete")) {
                        alert("delete icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                case "serial":
                    if ($target.hasClass("mylink")) {
                        alert("link icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                default:
                    break;
            }

        },
    }).
        jqGrid('navGrid', '#jqpParametersHeader', { add: false, edit: false, search: true, searchtext: 'Search', del: false, refresh: false }, {}, {}, {}, {
            closeOnEscape: true,
            caption: "Search...",
            multipleSearch: true,
            Find: "Find",
            Reset: "Reset",
            odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }],
        }).jqGrid('navButtonAdd', '#jqpParametersHeader', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddParametersType
        }).
        jqGrid('navButtonAdd', '#jqpParametersHeader', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshParametersHeader
        });
    fnAddGridSerialNoHeading();
}

function fnAddParametersType() {
    fnClearParameterTypeFields();
    $("#PopupParametersHeader").modal('show');
    $('#PopupParametersHeader').find('.modal-title').text(localization.AddParameterType);
    $('#txtParameterTypeId').attr('readonly', false);
    $("#btnSaveParametersType").html("<i class='fa fa-save'></i> " + localization.Save);
    $("#chkPTActiveStatus").parent().addClass("is-checked");
    $("#chkPTActiveStatus").prop('disabled', true);
    actionParameterType = "I";
    $("#btnDeactivateParametersType").hide();
}

function fnEditParametersType(e, actiontype) {
    var rowid = $("#jqgParametersHeader").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgParametersHeader').jqGrid('getRowData', rowid);
   
    $('#txtParameterTypeId').val(rowData.ParameterType).attr('readonly', true);
    $('#txtParameterTypeDescription').val(rowData.ParameterHeaderDesc);
    if (rowData.ActiveStatus == 'true') {
        $("#chkPTActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkPTActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveParametersType").attr('disabled', false);
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $("#PopupParametersHeader").modal('show');
        $("#chkPTActiveStatus").prop('disabled', true);
        $('#PopupParametersHeader').find('.modal-title').text(localization.UpdateParameterType);
        $("#btnSaveParametersType").html("<i class='fa fa-sync'></i> " + localization.Update);
        $("#btnDeactivateParametersType").hide();
        actionParameterType = "U";
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $("#PopupParametersHeader").modal('show');
        $('#PopupParametersHeader').find('.modal-title').text(localization.ViewParameterType);
        $("#btnSaveParametersType").hide();
        $("input,textarea").attr('readonly', true);
        //$("input[type=checkbox]").attr('disabled', true);
        $("#chkPTActiveStatus").prop('disabled', true);
        $("#btnDeactivateParametersType").hide();
        actionParameterType = "V";
        $("#PopupParametersHeader").on('hidden.bs.modal', function () {
            $("#btnSaveParametersType").show();
            $("#chkPTActiveStatus").prop('disabled', true);
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            //$("input[type=checkbox]").attr('disabled', false);
        });
    }

    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not authorized to Delete");
            return;
        }
        $("#PopupParametersHeader").modal('show');
        $('#PopupParametersHeader').find('.modal-title').text('Active / De Active Parameter Type');
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateParametersType").html(localization.Deactivate);
        }
        else {
            $("#btnDeactivateParametersType").html(localization.Activate);
        }

        $("#btnSaveParametersType").hide();
        $("#btnDeactivateParametersType").show();
        $("input,textarea").attr('readonly', true);
        $("#chkPTActiveStatus").prop('disabled', true);
        actionParameterType = "V";
        $("#PopupParametersHeader").on('hidden.bs.modal', function () {
            $("#btnSaveParametersType").show();
            $("#chkPTActiveStatus").prop('disabled', true);
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnParametersInfoPopup(e) {

    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgParametersHeader').getRowData(rowid);
    var rowid = $("#jqgParametersHeader").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgParametersHeader').jqGrid('getRowData', rowid);
    $("#PopupParameterDetail").modal(true);
    $("#txtParameterType").val('');
    $("#txtParameterType").val(rowData.ParameterType);
    $("#lblParameterType").text(rowData.ParameterHeaderDesc);
    $("#chkActiveStatus").parent().addClass("is-checked");
    fnGridLoadParameters();
}

function fnClearParameterTypeFields() {
    $("#txtParameterTypeId").val('');
    $("#txtParameterTypeDescription").val('');
    $("#chkPTActiveStatus").prop('disabled', false);
    $("#chkPTActiveStatus").parent().removeClass("is-checked");
    $("#btnSaveParametersType").attr('disabled', false);
}

function fnSaveParameterType() {

    if (IsStringNullorEmpty($("#txtParameterTypeId").val())) {
        toastr.warning("Please Enter Parameter Type Id");
        return false;
    }
    if ($("#txtParameterTypeId").val() == 0) {
        toastr.warning("Parameter Type Id should not be 0");
        return false;
    }
    if (IsStringNullorEmpty($("#txtParameterTypeDescription").val())) {
        toastr.warning("Please Enter Parameter Type Description");
        return false;
    }

    var pa_rh = {
        ParameterType: $("#txtParameterTypeId").val(),
        ParameterHeaderDesc: $("#txtParameterTypeDescription").val(),
        ActiveStatus: $("#chkPTActiveStatus").parent().hasClass("is-checked")
    }
    $("#btnSaveParametersType").attr('disabled', true);

    var URL = getBaseURL() + '/Parameters/InsertIntoParameterHeader';
    if (actionParameterType == "U")
        URL = getBaseURL() + '/Parameters/UpdateParameterHeader';

    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { pa_rh },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                fnClearParameterTypeFields();
                fnGridRefreshParametersHeader();
                $("#btnSaveParametersType").attr('disabled', false);
                $("#PopupParametersHeader").modal('hide');
            }
            else {
                toastr.error(response.Message);
            }
            $("#btnSaveParametersType").attr('disabled', false);
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveParametersType").attr("disabled", false);
        }
    });
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnDeleteParameterType() {

    var a_status; 
    //Activate or De Activate the status
    if ($("#chkPTActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    } 
    $("#btnDeactivateParametersType").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Parameters/ActiveOrDeActiveParameterHeader?status=' + a_status + '&parm_type=' + $("#txtParameterTypeId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateParametersType").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupParametersHeader').modal('hide');
                fnClearParameterTypeFields();
                fnGridRefreshParametersHeader();
                $("#btnDeactivateParametersType").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateParametersType").attr("disabled", false);
                $("#btnDeactivateParametersType").html(localization.Deactivate);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateParametersType").attr("disabled", false);
            $("#btnDeactivateParametersType").html(localization.Deactivate);
        }
    });
}

// Add/View Paramertes
function fnGridLoadParameters() {
    $('#jqgParameters').jqGrid('GridUnload');
    $("#jqgParameters").jqGrid({
        url: getBaseURL() + '/Parameters/GetParametersInformationByParameterType?parameterType=' + $("#txtParameterType").val(),
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ParameterType, localization.ParameterID, localization.ParameterDescription, localization.ValueType, localization.Active, localization.Actions],
        colModel: [
            { name: "ParameterType", width: 150, editable: true, align: 'left', editoptions: { maxlength: 4 }, hidden: true },
            { name: "ParameterId", width:88, editable: true, align: 'left', editoptions: { maxlength: 4 }},
            { name: "ParameterDesc", width: 280, editable: true, align: 'left', editoptions: { maxlength: 50 } },
            {
                name: "ParameterValueType", editable: true, width: 80, align: "left", edittype: "select", resizable: false, formatter: 'select',
                editoptions: {
                    value: "A: Amount;B: Boolean;D:Description;P: Percentage;V: Value"
                }
            },
            { name: "ActiveStatus", width: 45, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'action', search: false, align: 'left', width: 80, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" onclick="return fnEditParameters(event,\'edit\')"><i class="fas fa-pen"></i></button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditParameters(event,\'view\')"><i class="far fa-eye"></i></button>'

                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50, 100],
        rownumWidth:55,
        emptyrecords: "No records to View",
        pager: "#jqpParameters",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        scrollOffset: 0, caption: 'Parameters',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgParameters");
        },
    }).jqGrid('navGrid', '#jqpParameters', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpParameters', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshParameters
        }).jqGrid('navButtonAdd', '#jqpParameters', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'custAdd', position: 'first', onClickButton: fnAddParameters
        });
    fnAddGridSerialNoHeading();
}

function fnAddParameters() {
    fnClearFields();
    fnUserAction(false);
    $('#PopupParameters').find('.modal-title').text(localization.AddParameters);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveParameters").html(localization.Save).show();
}

function fnEditParameters(e, actiontype) {

        var rowid = $(e.target).parents("tr.jqgrow").attr('id');
        var rowData = $('#jqgParameters').jqGrid('getRowData', rowid);
    $('#txtParameterId').val(rowData.ParameterId).attr('readonly', true);
    $('#txtParameterDescription').val(rowData.ParameterDesc);
    $('#cboParameterValueType').val(rowData.ParameterValueType);
    $('#cboParameterValueType').selectpicker('refresh');  
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }  
    $("#btnSaveParameters").attr('disabled', false);
    fnUserAction(false);
     if (actiontype.trim() == "edit") {
        $("#chkActiveStatus").prop('disabled', false);
        $("#btnSaveParameters").html('Update').show();
    }
    if (actiontype.trim() == "view") {
        $("#btnSaveParameters").hide();
        $("#chkActiveStatus").prop('disabled', true);
        fnUserAction(true);
        
    }
}

function fnUserAction(val) {
    $("input,textarea").attr('readonly', val);
    $("select").next().attr('disabled', val);
    //$("input[type=checkbox]").attr('disabled', val);
}

function fnSaveParameters() {
   
    if (IsStringNullorEmpty($("#txtParameterDescription").val())) {
        toastr.warning("Please Enter Parameter Description");
        return false;
    }

    var pa_rm = {
        ParameterType: $("#txtParameterType").val(),
        ParameterId: $("#txtParameterId").val() === '' ? 0 : $("#txtParameterId").val(),
        ParameterDesc: $("#txtParameterDescription").val(),
        ParameterValueType: $("#cboParameterValueType").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
    $("#btnSaveParameters").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Parameters/InsertOrUpdateParameters',
        type: 'POST',
        datatype: 'json',
        data: { pa_rm },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveParameters").attr('disabled', false);
                $("#txtParameterDescription").val('');
                $("#cboParameterValueType").val('B').selectpicker('refresh');;
                fnGridRefreshParameters();
                //$("#PopupParameters").modal('hide');

            }
            else {
                toastr.error(response.Message);
                $("#btnSaveParameters").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveParameters").attr("disabled", false);
        }
    });
}

function fnGridRefreshParametersHeader() {
    $("#jqgParametersHeader").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnGridRefreshParameters() {
    $("#jqgParameters").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtParameterId").val('');
    $("#txtParameterId").hide();
    $("#txtParameterDescription").val('');
    $("#cboParameterValueType").val('B');
    $("#cboParameterValueType").selectpicker('refresh');
    $("#chkActiveStatus").prop('disabled', false);
    $("#chkActiveStatus").parent().removeClass("is-checked");
    $("#btnSaveParameters").attr('disabled', false);
    
}
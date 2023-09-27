var isedit;

$(document).ready(function () {
    fnGridLoadBusinessSubscription();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnBusinessSubscription",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditBusinessSubscription(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditBusinessSubscription(event, 'view') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
});
var actiontype = "";

function fnGridLoadBusinessSubscription() {
    var BusinessKey = $("#cboBusinessLocation").val();
    var URL = getBaseURL() + '/License/GetBusinessSubscription?BusinessKey=' + BusinessKey;

    $("#jqgBusinessSubscription").jqGrid('GridUnload');
    $("#jqgBusinessSubscription").jqGrid({
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.SubscriptionFrom, localization.SubscriptionTill, localization.Active, localization.Actions],
        colModel: [
            {
                name: 'SubscribedFrom', index: 'SubscribedFrom', width: 90, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat },
            },

            {
                name: 'SubscribedTill', index: 'SubscribedTill', width: 90, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat },
            },
            { name: "ActiveStatus", editable: false, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'Action', search: false, align: 'left', width: 54, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditBusinessSubscription(event,\'edit\')"><i class="fas fa-pencil-alt"></i> ' + localization.Edit + ' </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditBusinessSubscription(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>'

            //    }
            //}
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnBusinessSubscription"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpBusinessSubscription",
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
        scrollOffset: 0,
        caption:'Business Subscription',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen('jqgBusinessSubscription');
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

    }).jqGrid('navGrid', '#jqpBusinessSubscription', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpBusinessSubscription', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshBusinessSubscription
        }).jqGrid('navButtonAdd', '#jqpBusinessSubscription', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddBusinessSubscription
    });
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    if (_userFormRole.IsEdit === false) {
        var eleDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < eleDisable.length; i++) {
            eleDisable[i].disabled = true;
            eleDisable[i].className = "ui-state-disabled";
        }
    }
}

function fnAddBusinessSubscription() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val()=="0") {
        toastr.warning("Please select a Business Location");
        return;
    }
    fnClearFields();
    isedit = 0;
    document.getElementById("txtSubscribedFrom").disabled = false;
    $("#divBusinessSubscriptionGrid").hide();
    $("#divBusinessSubsciptionForm").css("display", "block");
    fnEnableInformationDetail(false);
    $("#chkActiveStatus").attr('disabled', true);
    $("#btnSaveBusinessSubscription").show();
    $("#btnSaveBusinessSubscription").html("<i class='fa fa-save'></i> "+localization.Save);
}

function fnGridRefreshBusinessSubscription() {
    $("#jqgBusinessSubscription").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

}

function fnEditBusinessSubscription(e, actiontype) {
    fnClearFields();
    isedit = 1;
   
    var rowid = $("#jqgBusinessSubscription").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgBusinessSubscription').jqGrid('getRowData', rowid);
    if (rowData.SubscribedFrom !== null) {
        setDate($('#txtSubscribedFrom'), fnGetDateFormat(rowData.SubscribedFrom));
    }
    else {
        $('#txtSubscribedFrom').val('');
    }
    document.getElementById("txtSubscribedFrom").disabled = true;
    if (rowData.SubscribedTill !== null) {
        setDate($('#txtSubscribedTill'), fnGetDateFormat(rowData.SubscribedTill));
    }
    else {
        $('#txtSubscribedTill').val('');
    }

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }

    $("#divBusinessSubscriptionGrid").hide();
    $("#divBusinessSubsciptionForm").css("display", "block");
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not authorized to Edit");
            return;
        }
        $("#btnSaveBusinessSubscription").show();
        fnEnableInformationDetail(false);
        $("#chkActiveStatus").attr('disabled', true);
        $("#btnSaveBusinessSubscription").html("<i class='fa fa-sync'></i> "+localization.Update);
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not authorized to View");
            return;
        }
        $("#btnSaveBusinessSubscription").show();
        $("#btnSaveBusinessSubscription").hide();
        fnEnableInformationDetail(true);
        $("#chkActiveStatus").attr('disabled', true);
    }
}

function fnEnableInformationDetail(val) {
    $("input,textarea").attr('readonly', val);
}

function fnValidateBusinessSubscription() {
    if (IsStringNullorEmpty($("#txtSubscribedFrom").val())) {
        toastr.warning("Please enter the Subscribed From Date");
        return false;
    }
    if (IsStringNullorEmpty($("#txtSubscribedTill").val())) {
        toastr.warning("Please enter the Subscribed Till Date");
        return false;
    }
}

function fnSaveBusinessSubscription(){
    if (fnValidateBusinessSubscription() === false) {
        return;
    }
    var busssubs = {
        BusinessKey: $("#cboBusinessLocation").val(),
        SubscribedFrom: getDate($("#txtSubscribedFrom")),
        SubscribedTill: getDate($("#txtSubscribedTill")),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        isEdit: isedit
    }
    $("#btnSaveBusinessSubscription").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/License/InsertOrUpdateBusinessSubscription',
        type: 'POST',
        data: { busssubs },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveBusinessSubscription").attr('disabled', false);
                fnCloseBusinessSubscription();
                fnGridRefreshBusinessSubscription();
                return true;
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveBusinessSubscription").attr('disabled', false);
                return false;
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveBusinessSubscription").attr('disabled', false);
        }
    })
}


function fnCloseBusinessSubscription() {
    $("#btnSaveBusinessSubscription").hide();
    fnEnableInformationDetail(false);
    $("#divBusinessSubscriptionGrid").show();
    $("#divBusinessSubsciptionForm").css("display", "none");
}

function fnClearBusinessSubscription() {
    fnClearFields();
}

function fnClearFields() {
    $('#txtSubscribedFrom').val('');
    $('#txtSubscribedTill').val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveBusinessSubscription").attr('disabled', false);
}
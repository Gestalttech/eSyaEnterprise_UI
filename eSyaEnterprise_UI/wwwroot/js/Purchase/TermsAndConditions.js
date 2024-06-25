$(function () {
    fnGridLoadTermsAndConditions();

    $.contextMenu({
        selector: "#btnTermsAndConditions",
        trigger: "left",
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditTermsAndConditions(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditTermsAndConditions(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditTermsAndConditions(event, 'delete') } },

        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

});


var _isInsert = true;


function fnGridLoadTermsAndConditions() {

    $("#jqgTermsAndConditions").GridUnload();

    $("#jqgTermsAndConditions").jqGrid({

        url: '',
        datatype: 'local',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.TcType, localization.TcClass, localization.TempDescription, localization.TcAnnexure, localization.Active, localization.Actions],
        colModel: [
            { name: "TcType", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "TcClass", width: 150, align: 'left', editable: true, formatter: 'select', edittype: 'select',  resizable: false, hidden: false },
            { name: "TempDescription", width: 180, align: 'left', editable: true, editoptions: { maxlength: 75 }, resizable: false, hidden: false },
            {
              name: 'TcAnnexure', width: 200, align: 'left', editable: true, edittype: 'textarea', editoptions: { rows: 1, cols: 40 }, resizable: true, hidden: false
            },
            { name: "ActiveStatus", width: 40, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'left', width: 40, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnTermsAndConditions"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpTermsAndConditions",
        rowNum: 10,
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
        forceFit: true,
        caption: localization.TermsAndConditions,
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpTermsAndConditions");
        },

        onSelectRow: function (rowid, status, e) {
        },

    }).jqGrid('navGrid', '#jqpTermsAndConditions', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpTermsAndConditions', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", position: "first", onClickButton: fnGridRefreshTermsAndConditions
    }).jqGrid('navButtonAdd', '#jqpTermsAndConditions', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddTermsAndConditions
    });
    fnAddGridSerialNoHeading();
}



function fnAddTermsAndConditions() {
    
        $('#PopupTermsAndConditions').modal({ backdrop: 'static', keyboard: false });
        $('#PopupTermsAndConditions').find('.modal-title').text(localization.AddTermsAndConditions);
        $("#chkActiveStatus").parent().addClass("is-checked");
        fnClearFields();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveTermsAndConditions").html('<i class="fa fa-save"></i>' + localization.Save);
        $("#btnSaveTermsAndConditions").show();
         $('#PopupTermsAndConditions').modal('show');
        _isInsert = true;
    
}




function fnGridRefreshTermsAndConditions() {
    $("#jqgTermsAndConditions").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnClearFields() {

   
}


function fnSaveTermsAndConditions() { }
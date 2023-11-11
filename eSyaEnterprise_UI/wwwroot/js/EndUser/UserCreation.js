
var UserID;
var prevSelectedID;
var formID;
var BusinessKey;
var UserGroup;
var UserType;
var UserAuth;

$(document).ready(function () {
    fnGridLoadUserCreation();
    
    fnGridUserSegment();
     
    
    $('#txtSearch').keyup(function () {
        var searchString = $(this).val();
        $('#jstUserGroup').jstree('search', searchString);
    });

    $("#dvForm").hide();
    $("#divUserCreationForm").css('display', 'none');
    $("#divUserCreationGrid").show();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnEndUserCreation",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditUserCreation(event) } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
});

function fnGridLoadUserCreation() {
    //if ($("#txtUserAuthetication").val() == 0)
    //    var URL = getBaseURL() + '/UserCreation/GetUserMaster';
    //else
    //    var URL = getBaseURL() + '/UserCreation/GetUserMasterForUserAuthentication';

    $("#jqgUserCreation").jqGrid('GridUnload');
    $("#jqgUserCreation").jqGrid({
      //  url: URL,
        url:'',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["User ID", localization.LoginID, localization.LoginDescription, localization.IsSignInBlocked, localization.IsActivated, localization.IsDeActivated,localization.Active, localization.Actions],
        colModel: [
            { name: "UserID", width: 120, editable: true, align: 'left', hidden: true },
            { name: "LoginID", width: 120, editable: true, align: 'left', hidden: false },
            { name: "LoginDesc", width: 300, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "IsSignInBlocked", editable: false, width: 55, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "IsActivated", editable: false, width: 50, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "IsDeActivated", editable: false, width: 50, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
          
            { name: "ActiveStatus", editable: false, width: 40, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'Edit', search: false, align: 'left', width: 170, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditUserCreation(event)"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>'

            //    }
            //}
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnEndUserCreation"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpUserCreation",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        rownumWidth:55,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        forceFit: true,
        width: 'auto',
        autowidth: true, caption:'User Creation',
        //onSelectRow: function (rowid) {
        //    UserID = $("#jqgUserCreation").jqGrid('getCell', rowid, 'UserID');

        //},
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen("jqgUserCreation");
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

        shrinkToFit: true,
        scrollOffset: 0
    }).
        jqGrid('navGrid', '#jqpUserCreation', { add: false, edit: false, search: true, searchtext: 'Search', del: false, refresh: false }, {}, {}, {}, {
            closeOnEscape: true,
            caption: "Search...",
            multipleSearch: true,
            Find: "Find",
            Reset: "Reset",
            odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }],
        }).jqGrid('navButtonAdd', '#jqpUserCreation', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddUserCreation
        }).
        jqGrid('navButtonAdd', '#jqpUserCreation', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshUserCreation
        });

        //jqGrid('navGrid', '#jqpUserCreation', { add: false, edit: false, search: true, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpUserCreation', {
        //caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshUserCreation
        //}).jqGrid('navButtonAdd', '#jqpUserCreation', {
        //    caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddUserCreation
        //});
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    if ($("#txtUserAuthetication").val() == 1)
        $('#jqgAdd').addClass('ui-state-disabled');

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

function fnGridRefreshUserCreation() {
    $("#jqgUserCreation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnGridAddUserCreation() {
    $('#txtUserId').val(''); 
    $('#txtLoginId').val('');
    $('#txtLoginDescription').val('');
    $('#txtPassword').val('');
    $('#cboMobileNo').val("0");
    $('#cboMobileNo').selectpicker('refresh');
    $('#txtMobileNo').val('');
    $('#txtemailid').val('');
    $("#chkAllowMobileLogin").parent().removeClass("is-checked");
    $("#chkIsApprover").parent().removeClass("is-checked");
    $('#Photoimage').val('');
    $('#DSimage').val('');
    $('#imgPhotoimageblah').removeAttr('src');
    $('#imgDSimageblah').removeAttr('src');

    fnGridUserSegment();
    $("#jqgUserBusinessSegment").trigger('reloadGrid');
    UserID = 0;
    
    //location.href = getBaseURL() + "/eSyaUser/UserCreation/_UserCreation?UserID=" + UserID;
    //$("#divUserCreationForm").css('display', 'block');
    $("#PopupUserCreation").modal('show');
    $("#divUserCreationGrid").hide();
    $("#txtPassword").attr('disabled', false);
    $("#txtLoginId").attr('disabled', false);
    $("#jqBusinessSegmentDiv").hide();
    $('#cboDoctor').val("0");
    $('#cboDoctor').selectpicker('refresh');
    $("#chkIsDoctor").parent().removeClass("is-checked"); 
    $("#divcboDoctors").hide();
} 

function fnEditUserCreation(e) {
    var rowid = $("#jqgUserCreation").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgUserCreation').jqGrid('getRowData', rowid);
    UserID = rowData.UserID;
        
    $("#txtUserId").val(UserID);
    if (UserID !== '' && UserID !== undefined) {
        $("#divUserCreationForm").css('display', 'block');
        $("#divUserCreationGrid").hide();
        $("#txtPassword").attr('disabled', true);
        $("#txtLoginId").attr('disabled', true);
        $("#jqBusinessSegmentDiv").show();
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EEU_03_00", "UIC02", errorMsg.editauth_E2);
            fnCancelUserMaster();
            return;
        }

        fnFillUserCreationValues();
        //location.href = getBaseURL() + "/eSyaUser/UserCreation/_UserCreation?UserID=" + UserID;
    }
}


function fnGridUserSegment() {

    var UserID = $("#txtUserId").val();
    if (UserID == null || UserID == "") {
        UserID = 0;
    }
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnUserBusinessSegment",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditBusinessSegment(event) } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnViewBusinessSegment(event) } },
            jqgDelete: { name: localization.UserRole, icon: "delete", callback: function (key, opt) { fnAddMenuLink(event) } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-bars'></i>" + localization.UserRole + " </span>");

    var URL = getBaseURL() + '/UserCreation/GetUserBusinessLocation?UserID=' + UserID;
    $("#jqgUserBusinessSegment").jqGrid('GridUnload');
    $("#jqgUserBusinessSegment").jqGrid({
       // url: URL,
      // mtype: 'Post',
        datatype: 'local',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["IU Status", "Business Key", localization.LocationDescription, localization.PreferredLanguage, localization.ISDCode, localization.AllowMFY, localization.MobileNo, localization.WhatsappNo,localization.Active, localization.Actions],
        colModel: [
            { name: "IUStatus", width: 20, editable: false, align: 'left', hidden: true },
            { name: "BusinessKey", width: 20, editable: false, align: 'left', hidden: true },
            { name: "LocationDescription", width: 100, editable: true, align: 'left' },
            { name: "PreferredLanguage", width: 100, editable: true, align: 'left' },
            { name: "ISDCode", width: 100, editable: true, align: 'left' },
            { name: "AllowMTFY", editable: false, width: 40, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            { name: "MobileNo", width: 100, editable: true, align: 'left' },  
            { name: "WhatsappNo", width: 100, editable: true, align: 'left' },  
            { name: "ActiveStatus", editable: false, width: 40, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
           
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnUserBusinessSegment"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        loadonce: true,
        pager: "#jqpUserBusinessSegment",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        multiselect: false,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true, caption:'User Business Segment',
        loadComplete: function () {
            fnJqgridSmallScreen('jqgUserBusinessSegment');
           
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

        scrollOffset: 0
    }).jqGrid('navGrid', '#jqpUserBusinessSegment', { add: false, edit: false, search: false, del: false, refresh: false });
    $("#jqgUserBusinessSegment").jqGrid('inlineNav', '#jqpUserBusinessSegment',
        {
            edit: false,
            editicon: " fa fa-pen",
            edittext: "Edit",
            add: false,
            addicon: "fa fa-plus",
            addtext: "Add",
            save: true,
            savetext: "  Save ",
            saveicon: "fa fa-save",
            cancelicon: "fa fa-ban",
            canceltext: "  Cancel ",
            editParams: {
                keys: false,
                oneditfunc: function (formid) {

                    $("#" + formid + "_LanguageCode").prop('disabled', true);
                    $("#" + formid + "_TableCode").prop('disabled', true);
                },
                url: null,

                extraparam: {

                },

                successfunc: function (result) {
                },
                aftersavefunc: null,
                errorfun: null,
                afterrestorefun: null,
                restoreAfterError: true,
                mtype: "POST"
            },
            addParams: {
                useDefValues: true,
                position: "last",
                addRowParams: {
                    keys: true,
                    url: null,
                    extraparam: {

                    },

                    oneditfunc: function (rowid) {

                    },
                    successfunc: function (result) {
                    }
                }
            }
        });
}

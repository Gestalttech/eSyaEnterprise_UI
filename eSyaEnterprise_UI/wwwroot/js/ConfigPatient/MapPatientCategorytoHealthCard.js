
$(function () {
    fnLoadGridHealthCardDetails();

    $.contextMenu({
       selector: "#btnHealthCardDetails",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditHealthCardDetails('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditHealthCardDetails('view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditHealthCardDetails('delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

    $.contextMenu({
        selector: "#btnHealthCardRates",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditHealthCardRates('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditHealthCardRates('view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditHealthCardRates('delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});


function fnLoadGridHealthCardDetails() {

    $("#jqgHealthCardDetails").GridUnload();

    $("#jqgHealthCardDetails").jqGrid({
        //url: getBaseURL() + '/Actions/GetAllActions',
        url:'',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.PatientTypeId, localization.PatientCategoryId, localization.HealthCardId, localization.OfferStartDate, localization.OfferEndDate, localization.CardValidityInMonths, localization.CareCardNoPattern, localization.IsSpecialtySpecific, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "PatientTypeId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "PatientCategoryId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "HealthCardId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            {
                name: "OfferStartDate", width: 40, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: "OfferEndDate", width: 40, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },

            { name: "CardValidityInMonths", width: 40, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "CareCardNoPattern", width: 40, align: 'left', editable: true, editoptions: { maxlength: 150 }, hidden: false, resizable: false },
            { name: "IsSpecialtySpecific", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnHealthCardDetails"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpHealthCardDetails",
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
        forceFit: true, caption: localization.HealthCardDetails,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgHealthCardDetails");
        },
        onSelectRow: function (rowid, status, e) {
            
        },
    }).jqGrid('navGrid', '#jqpHealthCardDetails', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpHealthCardDetails', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshHealthCardDetails
    }).jqGrid('navButtonAdd', '#jqpHealthCardDetails', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddHealthCardDetails
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgHealthCardDetails"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}
function fnGridRefreshHealthCardDetails() {
    $("#jqgHealthCardDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnAddHealthCardDetails() {
    $("#divGridHealthCard").hide();
    $("#divFormHealthCard").show();
    fnSetSidebar();
    $("#HealthCardDetails-tab").addClass("active");
    $("#HealthCardDetails").addClass("show active");
  
}

function fnIsSpecialtySpecific() {
    debugger;
    var _lblIsSpecialtySpecific = $("#lblIsSpecialtySpecific");
    if (!_lblIsSpecialtySpecific.hasClass('is-checked')) {
        fnLoadGridSpecialtyLink();
        $("#divSpecialtyLink").show();
    }
    else {
        $("#divSpecialtyLink").hide();
    }
}

function fnLoadGridSpecialtyLink() {

    $("#jqgSpecialtyLink").GridUnload();

    $("#jqgSpecialtyLink").jqGrid({
        //url: getBaseURL() + '/Actions/GetAllActions',
        url: '',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.HealthCardId, localization.SpecialtyId,localization.SpecialtyDesc,localization.Active],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "HealthCardId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "SpecialtyId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "SpecialtyDesc", width: 250, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
        ],

        pager: "#jqpSpecialtyLink",
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
        forceFit: true, caption: localization.SpecialtyLink,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgSpecialtyLink");
        },
        onSelectRow: function (rowid, status, e) {

        },
    }).jqGrid('navGrid', '#jqpSpecialtyLink', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpSpecialtyLink', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSpecialtyLink
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgSpecialtyLink"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnGridRefreshSpecialtyLink() {
    $("#jqgSpecialtyLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}



function fnLoadGridHealthCardRates() {

    $("#jqgHealthCardRates").GridUnload();

    $("#jqgHealthCardRates").jqGrid({
        //url: getBaseURL() + '/Actions/GetAllActions',
        url: '',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.HealthCardId, localization.CurrencyCode, localization.EffectiveFrom, localization.EffectiveTill, localization.CardCharges, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "HealthCardId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "CurrencyCode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            {
                name: "EffectiveFrom", width: 40, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: "EffectiveTill", width: 40, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "CardCharges", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnHealthCardRates"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpHealthCardRates",
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
        forceFit: true, caption: localization.SpecialtyLink,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgHealthCardRates");
        },
        onSelectRow: function (rowid, status, e) {

        },
    }).jqGrid('navGrid', '#jqpHealthCardRates', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpHealthCardRates', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshHealthCardRates
    }).jqGrid('navButtonAdd', '#jqpHealthCardRates', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddHealthCardRates
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgHealthCardRates"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddHealthCardRates() {
    $("#divHealthCardRates").show('500');
}

$("#HealthCardDetails-tab").on('click', function () {
    $("#divHealthCardRates").hide();
})
function fnCurrency_onChange() {

}
function fnGridRefreshHealthCardRates() {
    $("#jqgHealthCardRates").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}


function fnSetSidebar() {
    var _tabcontent = $(".tab-content").offset();
    var _fullH = $(window).height();
    var _newTabH = (_fullH - _tabcontent.top - 15);
    var windW = $(window).width();
    if (windW > 1099) {
        $(".tab-content,#HealthCard-pills-tab").css({ "height": _newTabH, "overflow-y": "auto" });
    }
    else {
        $(".tab-content").css({ "height": _newTabH, "overflow-y": "auto" });
    }
}

function fnCloseHealthCardDetails() {
    $("#divGridHealthCard").show();
    $("#divFormHealthCard").hide();
    $(".tab-pane").removeClass('active show');
    $("#HealthCard-pills-tab button").removeClass("active");
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
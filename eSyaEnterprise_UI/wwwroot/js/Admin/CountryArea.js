$(function () {
    fnGridLoadZipcodeHeader();
    $.contextMenu({
        selector: "#btnZipcode",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditZipcode(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditZipcode(event, 'view') } },
            //jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditZipcode(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
});

function fnISDCountryCode_onChange() {

    fnBindStatesCodes();
    //fnBindCitiesCodes();
    //fnGridLoadZipcodeHeader();
}

function fnBindStatesCodes() {
    var IsdzCountry = $("#cboZipCountry").val();
    $("#cboStateCode").empty();
    $.ajax({
        url: getBaseURL() + '/CountryArea/GetActiveStatesbyISDCode?isdCode=' + IsdzCountry,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboStateCode").empty();

                $("#cboStateCode").append($("<option value='0'> Select State </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboStateCode").append($("<option></option>").val(response[i]["StateCode"]).html(response[i]["StateDesc"]));
                }
                $('#cboStateCode').selectpicker('refresh');

            }
            else {
                $("#cboStateCode").empty();
                $("#cboStateCode").append($("<option value='0'> Select State </option>"));
                $('#cboStateCode').selectpicker('refresh');
            }

        },
        async: false,
        processData: false
    });

    fnBindCitiesCodes();
    //fnGridLoadZipcodeHeader();
}

function fnBindCitiesCodes() {
    var IsdzCountry = $("#cboZipCountry").val();
    $("#cboCityCode").empty();
    $.ajax({
        url: getBaseURL() + '/CountryArea/GetActiveCitiesbyStateCode?isdCode=' + IsdzCountry + '&stateCode=' + $("#cboStateCode").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboCityCode").empty();

                $("#cboCityCode").append($("<option value='0'> Select City</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboCityCode").append($("<option></option>").val(response[i]["CityCode"]).html(response[i]["CityDesc"]));
                }
                $('#cboCityCode').selectpicker('refresh');
            }
            else {
                $("#cboCityCode").empty();
                $("#cboCityCode").append($("<option value='0'> Select City</option>"));
                $('#cboCityCode').selectpicker('refresh');
            }

        },
        async: false,
        processData: false
    });

    fnGridLoadZipcodeHeader();

}

var actiontype = "";

var _isInsert = true;

function fnGridLoadZipcodeHeader() {
    var IsdzCountry = $("#cboZipCountry").val();
    var statecode = $("#cboStateCode").val();
    var citycode = $("#cboCityCode").val();

    $("#jqgZipcode").jqGrid('GridUnload');
    $("#jqgZipcode").jqGrid({
        url: getBaseURL() + '/CountryArea/GetAddressAreaHeader?isdCode=' + IsdzCountry + '&stateCode=' + statecode + '&cityCode=' + citycode,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ISDCode, localization.StateCode, localization.StateDesc, localization.CityCode, localization.CityDesc, localization.ZipCode, localization.ZipDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "Isdcode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "StateCode", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "StateDesc", width: 120, editable: true, align: 'left', resizable: false, hidden: true, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "CityCode", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "CityDesc", width: 120, editable: true, align: 'left', resizable: false, hidden: true, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "Zipcode", width: 50, editable: true, align: 'left', hidden: false },
            { name: "Zipdesc", width: 120, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnZipcode"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpZipcode",
        rowNum: 100000,
        rowList: [10, 20, 50],
        rownumWidth: '55',
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
        scrollOffset: 0, caption: localization.ZipcodeList,
        loadComplete: function () {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgZipcode");

        },
    }).jqGrid('navGrid', '#jqpZipcode', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpZipcode', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshZipcode
    }).jqGrid('navButtonAdd', '#jqpZipcode', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddZipcode
    });
    fnAddGridSerialNoHeading();
}

function fnAddZipcode() {

    var id = $("#cboZipCountry").val();
    var sid = $("#cboStateCode").val();
    var cid = $("#cboCityCode").val();
    if (id === 0 || id === "0" || IsStringNullorEmpty($("#cboZipCountry").val())) {
        fnAlert("w", "EAD_01_00", "UI0158", errorMsg.CountryAdd_E6);
    }
    else if (sid === 0 || sid === "0" || IsStringNullorEmpty($("#cboStateCode").val())) {
        fnAlert("w", "EAD_01_00", "UI0159", errorMsg.StateAdd_E7);
    }
    else if (cid === 0 || cid === "0" || IsStringNullorEmpty($("#cboCityCode").val())) {
        fnAlert("w", "EAD_01_00", "UI0162", errorMsg.SelectCity_E10); 
    }
    else {
        fnClearAreaHeaderFields();
        fnGridLoadCountryAreaDetails();
        $("#txtZipcode,#txtZipCodeDescription").prop('readonly', false);
        $('#PopupZipcode').modal('show');
        $('#PopupZipcode').modal({ backdrop: 'static', keyboard: false });
        $('#PopupZipcode').find('.modal-title').text(localization.AddZipCode);
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveCountryArea").html('<i class="fa fa-save"></i>  ' + localization.Save);
        $("#btnSaveCountryArea").show();
        _isInsert = true;
    }
}

function fnEditZipcode(e, actiontype) {

    var rowid = $("#jqgZipcode").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgZipcode').jqGrid('getRowData', rowid);

    $("#txtZipcode").val(rowData.Zipcode);
    $("#txtZipCodeDescription").val(rowData.Zipdesc);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveCountryArea").attr('disabled', false);


    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
            return;
        }

        $('#PopupZipcode').modal('show');
        $('#PopupZipcode').find('.modal-title').text(localization.EditZipCode);
        fnGridLoadCountryAreaDetails();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveCountryArea").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btnSaveCountryArea").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#txtZipcode").prop('readonly', true);
        _isInsert = false;
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupZipcode').modal('show');
        fnGridLoadCountryAreaDetails();
        $('#PopupZipcode').find('.modal-title').text(localization.ViewZipCode);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveCountryArea").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }
}

function fnGridRefreshZipcode() {
    $("#jqgZipcode").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearAreaHeaderFields() {
    $("#txtZipcode").val("");
    $("#txtZipCodeDescription").val("");
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveCountryArea").attr('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
//Country Area Grid and its functions starts

function fnGridLoadCountryAreaDetails() {

    var IsdzCountry = $("#cboZipCountry").val();
    var statecode = $("#cboStateCode").val();
    var citycode = $("#cboCityCode").val();
    var zipcode = $("#txtZipcode").val();

    $("#jqgCountryArea").jqGrid('GridUnload');
    $("#jqgCountryArea").jqGrid({
        url: getBaseURL() + '/CountryArea/GetAddressAreaDetails?isdCode=' + IsdzCountry + '&stateCode=' + statecode + '&cityCode=' + citycode + '&zipCode=' + zipcode,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ISDCode, localization.ZipCode, localization.ZipSerialNumber, localization.Area, localization.Active],
        colModel: [
            { name: "Isdcode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "Zipcode", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "ZipserialNumber", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            {
                name: "Area", width: 400, editable: true, edittype: 'text', align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 100 },
                editrules: { custom_func: validateAreaDesc, custom: true }
            },
            { name: "ActiveStatus", width: 155, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false", defaultValue: 'true' }, formatoptions: { disabled: true } },
        ],
        pager: "#jqpCountryArea",
        rowNum: 10000,
        rowList: [],
        pgtext: null,
        pgbuttons: false,
        rownumWidth: '55',
        loadonce: true,
        viewrecords: false,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0, caption: localization.CountryArea,
        editurl: 'clientArray', jqModal: false,

        onSelectRow: function (rowid, status, e) {
            console.log(e);
            $("#jqgCountryArea_iledit").removeClass('ui-state-disabled');
        },
        ondblClickRow: function (rowid) {
            $("#jqgCountryArea_iledit").trigger('click');
        },
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgCountryArea");
            fnGridRefreshCountryAreaDetails();
            $("#jqgCountryArea_iledit").addClass('ui-state-disabled');
        },
    }).jqGrid('navGrid', '#jqpCountryArea', { add: false, edit: false, search: false, del: false, refresh: false });

    $("#jqgCountryArea").jqGrid('inlineNav', '#jqpCountryArea',
        {
            edit: true,
            editicon: " fa fa-pen",
            edittext: " Edit",
            add: true,
            addicon: "fa fa-plus",
            addtext: " Create New",
            save: true,
            savetext: " Add to Grid",
            saveicon: "fa fa-save",
            cancel: true,
            cancelicon: "fa fa-ban",
            canceltext: " Cancel",
            refresh: true,
            refreshtext: "Refresh",
            refreshicon: "fa fa-sync",
            restoreAfterSelect: false,
            editParams: {
                keys: true,
                oneditfunc: function (result) {

                },
                url: null,
                successfunc: function (result) {

                },
                extraparam: function () {

                },
                addParams: {
                    useDefValues: true,
                    position: "last",
                    addRowParams: {
                        keys: true,
                        oneditfunc: function (rowID, value) {
                            $("#txtZipcode,#txtZipCodeDescription").prop('readonly', true);
                        },
                    }
                }
            }
        });


    fnAddGridSerialNoHeading();

}
$("div").on('click', '#jqgCountryArea_iledit', function () {
    alert();
});
function fnSaveCountryArea() {

    if ($("#cboZipCountry").val() === 0 || $("#cboZipCountry").val() === "0" || IsStringNullorEmpty($("#cboZipCountry").val())) {
        fnAlert("w", "EAD_01_00", "UI0160", errorMsg.SelectCountry_E8);
        return;
    }
    if ($("#cboStateCode").val() === 0 || $("#cboStateCode").val() === "0" || IsStringNullorEmpty($("#cboStateCode").val())) {
        fnAlert("w", "EAD_01_00", "UI0161", errorMsg.SelectState_E9);
        return;
    }
    if ($("#cboCityCode").val() === 0 || $("#cboCityCode").val() === "0" || IsStringNullorEmpty($("#cboCityCode").val())) {
        fnAlert("w", "EAD_01_00", "UI0162", errorMsg.SelectCity_E10);
        return;
    }
    if (IsStringNullorEmpty($("#txtZipcode").val())) {
        fnAlert("w", "EAD_01_00", "UI0163", errorMsg.ZipCode_E11);
        return;
    }
    if (IsStringNullorEmpty($("#txtZipCodeDescription").val())) {
        fnAlert("w", "EAD_01_00", "UI0164", errorMsg.ZipDesc_E12);
        return;
    }

    $("#jqgCountryArea").jqGrid('editCell', 0, 0, false);

    var lstareadetails = [];
    var dataIDs = $('#jqgCountryArea').getDataIDs();
    for (i = 0; i < dataIDs.length; i++) {
        var rowData = $('#jqgCountryArea').jqGrid('getRowData', dataIDs[i]);

        var pattern = /<input/;

        if (pattern.test(rowData.Area)) {
            fnAlert("w", "EAD_01_00", "UI0165", errorMsg.ClickAdd_E13);
            return;
        }
        else {
            lstareadetails.push({
                "Isdcode": $("#cboZipCountry").val(),
                "Zipcode": $("#txtZipcode").val(),
                //"ZipserialNumber": rowData.ZipserialNumber === '' ? 0 : rowData.ZipSerialNumber,
                "ZipserialNumber": rowData.ZipserialNumber,
                "Area": rowData.Area,
                "ActiveStatus": rowData.ActiveStatus,
            });
        }
    };

    objdetails = {

        Isdcode: $("#cboZipCountry").val(),
        StateCode: $("#cboStateCode").val(),
        CityCode: $("#cboCityCode").val(),
        Zipcode: $("#txtZipcode").val(),
        Zipdesc: $("#txtZipCodeDescription").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        _lstAddressdetails: lstareadetails
    }

    $("#btnSaveCountryArea").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/CountryArea/InsertOrUpdateIntoZipAreaHeaderDetails',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objdetails },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveCountryArea").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#btnSaveCountryArea").attr('disabled', false);
                fnGridRefreshZipcode();
                $('#PopupZipcode').modal('hide');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveCountryArea").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveCountryArea").attr("disabled", false);
        }
    });
}

function fnGridRefreshCountryAreaDetails() {
    $("#jqgCountryArea").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function validateAreaDesc(value, Area) {
    if (value == "" || value == null) {
        fnAlert("w", "EAD_01_00", "UI0166", errorMsg.AreaDesc_E14);
        return [false, ''];
    }
    else {
        return [true, ""];
    }

}



$("#btnCancelCountryArea").click(function () {
    fnClearAreaHeaderFields();
    $("#jqgZipcode").jqGrid('resetSelection');
    $('#PopupZipcode').modal('hide');
});
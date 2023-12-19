$(document).ready(function () {
    //fnSetCurrentdate();
});

function fnLoadGrid() {
    if ($('#cboBusinessKey').val() != '') {
        fnLoadSpecialtyUnits();
    }

}
function fnLoadSpecialtyUnits() {
    $("#jqgSpecialtyUnits").jqGrid('GridUnload');
    $("#jqgSpecialtyUnits").jqGrid({
        url: getBaseURL() + '/SpecialtyTeaching/GetSpecialtyListByBusinessKey?businessKey=' + $('#cboBusinessKey').val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.SpecialtyID, localization.SpecialtyDesc, "", ""],

        colModel: [

            { name: "SpecialtyID", width: 10, editable: false, align: 'left', hidden: true },
            { name: "SpecialtyDesc", width: 100, editable: false, align: 'left' },
            {
                name: "Button", width: 50, editable: false, align: 'left', hidden: false, formatter: function (cellValue, options, rowObject) {
                    var i = options.rowId;
                    return "<button id=btnEdit_" + i + " type='button' style='margin-right: 5px;' class='btn btn-primary' onclick=fnEditUnitsValidity('" + rowObject.SpecialtyID + "') > <i class='fas fa-edit c-white'></i>" + localization.Units + "</button >";

                }
            },
            {
                name: "Button", width: 50, editable: false, align: 'left', hidden: false, formatter: function (cellValue, options, rowObject) {
                    var i = options.rowId;
                    return "<button id=btnEdit_" + i + " type='button' style='margin-right: 5px;' class='btn btn-primary' onclick=fnEditIPInfo('" + rowObject.SpecialtyID + "') > <i class='fas fa-edit c-white'></i>" + localization.IPInfo + "</button >";

                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpSpecialtyUnits",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',

        cellsubmit: 'clientArray',

        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgSpecialtyUnits").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
        }
    }).jqGrid('navGrid', '#jqpSpecialtyUnits', { add: false, edit: false, search: false, del: false, refresh: false });

}
function fnEditUnitsValidity(spid) {
    $('#hdSPID').val(spid);
    var rows = jQuery("#jqgSpecialtyUnits").getDataIDs();
    for (a = 0; a < rows.length; a++) {
        row = jQuery("#jqgSpecialtyUnits").getRowData(rows[a]);
        if (row['SpecialtyID'] === spid) {
            $('#txtSpecialty').val(row['SpecialtyDesc']);
            break;
        }
    }


    $("#PopupEditUnitsValidity").modal('show');
    fnGetUnitsValidity(spid);
}

function fnGetUnitsValidity(spid) {
    $("#jqgUnitsDetail").jqGrid('GridUnload');
    $("#jqgUnitsDetail").jqGrid({
        url: getBaseURL() + '/SpecialtyTeaching/GetUnitsValidityBySpecialty?businessKey=' + $('#cboBusinessKey').val() + '&specialtyId=' + spid,
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.FromDate, localization.EffectiveTill, localization.NoOfUnints, localization.Active],

        colModel: [
            //{ name: "EffectiveFrom", width: 100, editable: false, align: 'left', formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/Y' } },
            {
                name: 'EffectiveFrom', index: 'EffectiveFrom', width: 140, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'EffectiveTill', index: 'EffectiveTill', width: 140, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "NoOfUnits", width: 100, editable: false, align: 'left' },
            { name: "ActiveStatus", width: 50, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpUnitsDetail",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',

        cellsubmit: 'clientArray',

        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgUnitsDetail").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
        }
    }).jqGrid('navGrid', '#jqpUnitsDetail', { add: false, edit: false, search: false, del: false, refresh: false });

}

function fnAddSpecialtyUnitsValidity() {
    debugger;
    var txtServiceTypeDesc = $("#txtNUnits").val();
    var fdate = $("#txtfromdate").val();
    if (txtServiceTypeDesc == "" || txtServiceTypeDesc == null || txtServiceTypeDesc == undefined || txtServiceTypeDesc == "0") {
        fnAlert("w", "ECP_06_00", "UI0128", errorMsg.NoOfUnits_E1);
        return false;
    } else if (fdate == "" || fdate == null || fdate == undefined)
    {
        fnAlert("w", "ECP_06_00", "UI0128", "Please Select Effective From Date");
        return false;
    }
    else {
        $("#btnAddUnit").attr("disabled", true);
        var sp = $('#hdSPID').val();
        var obj = {
            BusinessKey: $('#cboBusinessKey').val(),
            SpecialtyId: sp,
            EffectiveFrom: getDate($("#txtfromdate")),
            NoOfUnits: $('#txtNUnits').val()
        }
        $.ajax({
            url: getBaseURL() + '/SpecialtyTeaching/InsertSpecialtyUnitsValidity',
            type: 'POST',
            datatype: 'json',
            data: obj,
            success: function (response) {
                if (response.Status == true) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    fnGetUnitsValidity(sp);

                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
                $("#btnAddUnit").attr("disabled", false);
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnAddUnit").attr("disabled", false);
            }
        });
    }
}

function fnEditIPInfo(spid) {
    $('#hdSPId').val(spid);
    var rows = jQuery("#jqgSpecialtyUnits").getDataIDs();
    for (a = 0; a < rows.length; a++) {
        row = jQuery("#jqgSpecialtyUnits").getRowData(rows[a]);
        if (row['SpecialtyID'] === spid) {
            $('#txtspecialty').val(row['SpecialtyDesc']);
            break;
        }
    }

    fnclear();
    $("#PopupEditIPInfo").modal('show');
    fnGetIPInfo(spid);
}

function fnGetIPInfo(spid) {
    $.ajax({
        url: getBaseURL() + '/SpecialtyTeaching/GetSpecialtyIPInfo?businessKey=' + $('#cboBusinessKey').val() + '&specialtyId=' + spid,
        success: function (result) {
            if (result != null) {
                $("#txtNPatient").val(result.NewPatient);
                $("#txtRPatient").val(result.RepeatPatient);
                $("#txtMBed").val(result.NoOfMaleBeds);
                $("#txtFBed").val(result.NoOfFemaleBeds);
                $("#txtCBed").val(result.NoOfCommonBeds);
                $("#txtMStay").val(result.MaxStayAllowed);
            }

        }
    });
}
function fnclear() {
    $("#txtNPatient").val('');
    $("#txtRPatient").val('');
    $("#txtMBed").val('');
    $("#txtFBed").val('');
    $("#txtCBed").val('');
    $("#txtMStay").val('');
}


function fnAddOrUpdateIPInfo() {

    $("#btnAddIPInfo").attr("disabled", true);
    //var fromdate = $("#txtfromdate").val();
    var sp = $('#hdSPId').val();
    var obj = {
        BusinessKey: $('#cboBusinessKey').val(),
        SpecialtyId: sp,
        //EffectiveFrom: fromdate,
        EffectiveFrom: getDate($("#txtfromdate")),
        NoOfUnits: $('#txtNUnits').val(),
        NewPatient: $("#txtNPatient").val(),
        RepeatPatient: $("#txtRPatient").val(),
        NoOfMaleBeds: $("#txtMBed").val(),
        NoOfFemaleBeds: $("#txtFBed").val(),
        NoOfCommonBeds: $("#txtCBed").val(),
        MaxStayAllowed: $("#txtMStay").val(),
    }
    $.ajax({
        url: getBaseURL() + '/SpecialtyTeaching/AddOrUpdateSpecialtyIPInfo',
        type: 'POST',
        datatype: 'json',
        data: obj,
        success: function (response) {
            if (response.Status == true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnGetUnitsValidity(sp);
                $("#PopupEditIPInfo").modal('hide');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnAddIPInfo").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnAddIPInfo").attr("disabled", false);
        }
    });

}

function fnSetCurrentdate() {
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day;
    document.getElementById("txtfromdate").value = today;
}

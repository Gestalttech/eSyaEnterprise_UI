function CheckDigits(e) {

    if (e.which == 46) {
        if ($(this).val().indexOf('.') != -1) {
            return false;
        }
    }

    if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
        return false;
    }

}
//$(function () {
//    GetDoctorStatutoryDetails();
//})
function fnCboISDCodes_change() {
    GetDoctorStatutoryDetails();
}

function GetDoctorStatutoryDetails() {
    $("#jqgDoctorProfileStatutoryDetails").jqGrid('GridUnload');
    $("#jqgDoctorProfileStatutoryDetails").jqGrid({
        url: getBaseURL() + '/Doctor/GetDoctorStatutoryDetails?doctorId=' + $("#txtDoctorId").val() + '&isdCode=' + $("#cboStatutoryDetailsIsdcode").val(),
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["Doctor Id", "Isd Code", "Statutory Code", "Statutory Description", "Statutory Value", "Tax Perc", "Effective From", "Effective Till", "Select"],
        colModel: [
            { name: "DoctorId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "Isdcode", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "StatutoryCode", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "StatutoryDescription", width: 350, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "StatutoryValue", width: 315, align: 'left', editable: true, edittype: "text", editoptions: { maxlength: 25 }, },
            {
                name: 'TaxPerc', index: 'TaxPerc', editable: true, edittype: "text", width: 150,
                editoptions: { maxlength: 7, onkeypress: 'return CheckDigits(event)' }
            },

            {
                name: 'EffectiveFrom', index: 'EffectiveFrom', width: 150, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat },
                editable: true, editoptions: {
                    size: 20,
                    dataInit: function (el) {
                        $(el).datepicker({ dateFormat: _cnfDateFormat });
                    }
                }
            },

            {
                name: 'EffectiveTill', index: 'EffectiveTill', width: 150, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat },
                editable: true, editoptions: {
                    size: 20,
                    dataInit: function (el) {
                        $(el).datepicker({ dateFormat: _cnfDateFormat });
                    }
                }
            },

            { name: "ActiveStatus", editable: true, width: 100, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpDoctorProfileStatutoryDetails",
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
        cellEdit: true,
        cellsubmit: 'clientArray',

        onSelectRow: function (rowid, iRow, iCol, e) {

            if (iCol === 7) {
                date = $("#jqgDoctorProfileStatutoryDetails").jqGrid('getCell', rowid, "EffectiveFrom");
                strdate = date;
                date = moment(date, 'DD-MM-YYYY').toDate();


                //$("#dtServiceRateDate").datepicker().datepicker("setDate", date);
                var row = $("#jqgDoctorProfileStatutoryDetails").closest('tr.jqgrow');
                $("#" + rowid + "_EffectiveFrom", row[0]).val(date);
                Selectedrowid = rowid;
            }
            if (iCol === 8) {
                date = $("#jqgDoctorProfileStatutoryDetails").jqGrid('getCell', rowid, "EffectiveTill");
                strdate = date;
                date = moment(date, 'DD-MM-YYYY').toDate();


                //$("#dtServiceRateDate").datepicker().datepicker("setDate", date);
                var row = $("#jqgDoctorProfileStatutoryDetails").closest('tr.jqgrow');
                $("#" + rowid + "_EffectiveTill", row[0]).val(date);
                Selectedrowid = rowid;
            }
        },
        caption: 'Doctor Statutory Details',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgDoctorProfileStatutoryDetails");
        },
    }).jqGrid('navGrid', '#jqpDoctorProfileStatutoryDetails', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnSaveDoctorStatutoryDetails() {
    if ($('#txtDoctorId').val() == '' || $('#txtDoctorId').val() == '0') {
        fnAlert("w", "ESP_01_00", "UI0314", errorMsg_std.DoctorProfile_E2);
        return;
    }
    if ($('#cboStatutoryDetailsIsdcode').val() == '' || $('#cboStatutoryDetailsIsdcode').val() == '0') {
        fnAlert("w", "ESP_01_00", "UI0034", errorMsg_std.ISDCode_E1);
        return;
    }
    $("#jqgDoctorProfileStatutoryDetails").jqGrid('editCell', 0, 0, false);

    var obj = [];
    var gvT = $('#jqgDoctorProfileStatutoryDetails').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {
        if (!IsStringNullorEmpty(gvT[i]['StatutoryValue']) && !IsStringNullorEmpty(gvT[i]['TaxPerc'])
            && !IsStringNullorEmpty(gvT[i]['EffectiveFrom'])) {
            var bu_bd = {
                DoctorId: $('#txtDoctorId').val(),
                Isdcode: $('#cboStatutoryDetailsIsdcode').val(),
                StatutoryCode: gvT[i]['StatutoryCode'],
                StatutoryValue: gvT[i]['StatutoryValue'],
                TaxPerc: gvT[i]['TaxPerc'],
                EffectiveFrom: GetGridDate(gvT[i]['EffectiveFrom']),
                EffectiveTill: GetGridDate(gvT[i]['EffectiveTill']),
                ActiveStatus: gvT[i]['ActiveStatus']
            }
            obj.push(bu_bd);
        }
    }

    $("#btnSaveDoctorStatutoryDetails").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/Doctor/InsertOrUpdateDoctorStatutoryDetails',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response.Status === true) {

                fnAlert("s", "", response.StatusCode, response.Message);
                fnGridRefresh();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveDoctorStatutoryDetails").attr("disabled", false);
        }
    });

    $("#btnSaveDoctorStatutoryDetails").attr("disabled", false);
}

function fnGridRefresh() {
    $("#jqgDoctorProfileStatutoryDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnClearBusinessStatutory() {

    fnGridRefresh();
}

function fnBindDoctorStatutoryISDBusinessLink() {
    $("#cboStatutoryDetailsIsdcode").empty();

    $.ajax({
        url: getBaseURL() + '/Doctor/GetISDCodesbyDoctorId?doctorId=' + $("#txtDoctorId").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        //success: function (response, data) {
        success: function (data) {
           
            if (data != null) {
                //refresh each time
                $("#cboStatutoryDetailsIsdcode").empty();
                $("#cboStatutoryDetailsIsdcode").append($("<option value='0'> Select </option>"));
                var $select = $("#cboStatutoryDetailsIsdcode");

                data.forEach(function (item) {
                    var optionContent = '<img src="' + item["CountryFlag"] + '" style="width: 20px; height: 20px; margin-right: 8px;" />' + item["CountryName"] + ' (+' + item["Isdcode"] + ')';
                    $select.append($('<option></option>')
                        .val(item["Isdcode"])
                        .attr('data-content', optionContent)
                        .text(item["CountryName"] + '  (+' + item["Isdcode"] + ')'));
                });

                // Refresh the selectpicker to apply changes
                $select.selectpicker('refresh');

            }
            else {
                $("#cboStatutoryDetailsIsdcode").empty();
                $("#cboStatutoryDetailsIsdcode").append($("<option value='0'> Select </option>"));
                $("#cboStatutoryDetailsIsdcode").val(_cnfISDCode);
                $("#cboStatutoryDetailsIsdcode").val('0');
                $('#cboStatutoryDetailsIsdcode').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function OnlyNumeric(e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        return false;
    }
}

$(function () {
    fnGridDoctorProfileBusinessLink();
})
function fnGridDoctorProfileBusinessLink() {
    $("#jqgDoctorProfileBusinessLink").jqGrid('GridUnload');
    $("#jqgDoctorProfileBusinessLink").jqGrid(
        {
            //url: getBaseURL() + '/Doctors/GetDoctorBusinessLinkList?doctorId=' + $('#txtDoctorId').val(),
            datatype: 'json',
            mtype: 'POST',
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
            colNames: [loalization_bl.BusinessKey, loalization_bl.Businesslocation, 'Time Slot In Mins', 'Patient Per Hour', 'Select'],
            colModel: [
                { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
                { name: 'BusinessLocation', index: 'LocationDescription', width: '850', resizable: false, hidden: false },

                {
                    name: 'TimeSlotInMins', index: 'TimeSlotInMins', editable: true, edittype: "text", width: 110,
                    editoptions: { maxlength: 2, onkeypress: 'return OnlyNumeric(event)' },
                },

                //{
                //    name: 'TimeSlotInMins', width: 110, formatter: 'number', editable: true, sortable: false, resizable: false,
                //    align: 'right',
                //    formatter: function ResultInput(cellValue, option, rowObject) {
                //        debugger;
                //        if (cellValue == undefined || cellValue == '')
                //            cellValue = 0

                //        if (!$.isEmptyObject(rowObject)) {
                //            var TimeSlotInMins = rowObject.TimeSlotInMins;
                //            if (rowObject.st)
                //                return "<input id='txtTimeSlotInMins_" + TimeSlotInMins + "_TimeSlotInMins" + option.rowId + "' style='width: 100%;text-align:right'  value='" + cellValue + "'  onkeypress= 'return OnlyNumeric(event)' disabled />";
                //            else
                //                return "<input id='txtTimeSlotInMins_" + TimeSlotInMins + "_" + option.rowId + "' class='TimeSlotInMins_" + TimeSlotInMins + "' data-ertype='" + TimeSlotInMins + "' style='width: 100%;text-align:right'  value='" + cellValue + "'  onkeypress= 'return OnlyNumeric(event)' onchange='return fntxtCostAmount_Change(event,$(this))' />";
                //        }
                //        else {
                //            return '';
                //        }
                //    },
                //    //summaryType: 'sum', summaryRound: 2, summaryRoundType: 'round'

                //},

                {
                    name: 'PatientCountPerHour', index: 'PatientCountPerHour', editable: true, edittype: "text", width: 110,
                    editoptions: { maxlength: 2, onkeypress: 'return OnlyNumeric(event)' },
                    //editrules: { custom: true, custom_func: fncalculateTimeslotinMins }
                },
                {
                    name: 'ActiveStatus', index: 'ActiveStatus', width: 100, resizable: false, align: 'center',
                    formatter: "checkbox", formatoptions: { disabled: false },
                    edittype: "checkbox", editoptions: { value: "true:false" }
                },
            ],
            rowNum: 10,
            rowList: [10, 20, 50, 100],
            rownumWidth: '55',
            loadonce: true,
            pager: "#jqpDoctorProfileBusinessLink",
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            height: 'auto',
            width: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: true,
            scroll: false,
            scrollOffset: 0,
            cellEdit: true,
            cellsubmit: 'clientArray',
            caption: localization.BusinessLink,
            onSelectRow: function (id) {

                if (id) { $('#jqgDoctorProfileBusinessLink').jqGrid('editRow', id, true); }
            },

            rowattr: function (item) {
                if (_formEdit === false) {
                    return { "class": "ui-state-disabled ui-jqgrid-disablePointerEvents" };
                }
            },
            beforeSelectRow: function (rowid, e) {
                if ($(e.target).closest("tr.jqgrow").hasClass("ui-state-disabled")) {
                    return false;
                }
                return true;
            },
            //ondblClickRow: function (rowid) 
            //{
            //    debugger;
            //    //var ro = $("#jqgDoctorProfileBusinessLink").closest('tr.jqgrow');
            //    //$("#" + rowid + "_TimeSlotInMins").prop('disabled', true);
            //    var cont = $('#jqgDoctorProfileBusinessLink').getCell(rowid, 'TimeSlotInMins');
            //    var val = getCellValue(cont);

            //    var rowData = jQuery("#jqgDoctorProfileBusinessLink").getRowData(rowid);
            //    var colData = rowData['TimeSlotInMins']; 

            //    var tslot = $("#jqgDoctorProfileBusinessLink").jqGrid('getCell', rowid, "TimeSlotInMins");
            //    var r = 60 / tslot;
            //    var row = $("#jqgDoctorProfileBusinessLink").closest('tr.jqgrow');
            //    $("#" + rowid + "_PatientCountPerHour", row[0]).val(r).prop('disabled',true);

            //    //$(e.target).closest("tr.jqgrow").hasClass("ui-state-disabled");


            //    var phour = $("#jqgDoctorProfileBusinessLink").jqGrid('getCell', rowid, "PatientCountPerHour");
            //    var res = 60 / phour;
            //    var ro = $("#jqgDoctorProfileBusinessLink").closest('tr.jqgrow');
            //    $("#" + rowid + "_TimeSlotInMins", ro[0]).val(res).prop('disabled', true);

            //},

            //ondblClickRow: function (rowid) {
            //    debugger;
            //    var tslot = $("#jqgDoctorProfileBusinessLink").jqGrid('getCell', rowid, "TimeSlotInMins");

            //        var r = 60 / tslot;
            //        var row = $("#jqgDoctorProfileBusinessLink").closest('tr.jqgrow');
            //        $("#" + rowid + "_PatientCountPerHour", row[0]).val(r);
            //        $("#" + rowid + "_TimeSlotInMins", row[0]).focusout(function () {
            //            $("#" + rowid + "_PatientCountPerHour", ro[0]).prop('disabled', true);
            //        })


            //    //$(e.target).closest("tr.jqgrow").hasClass("ui-state-disabled");


            //    var phour = $("#jqgDoctorProfileBusinessLink").jqGrid('getCell', rowid, "PatientCountPerHour");
            //    var res = 60 / phour;
            //    var ro = $("#jqgDoctorProfileBusinessLink").closest('tr.jqgrow');
            //    $("#" + rowid + "_TimeSlotInMins", ro[0]).val(res);
            //    $("#" + rowid + "_PatientCountPerHour", row[0]).focusout(function () {
            //        $("#" + rowid + "_TimeSlotInMins", ro[0]).prop('disabled', true);
            //    })

            //},
            ondblClickRow: function (rowid, iRow, iCol, e) {
                debugger;

                if (iCol === 3) {


                    var phour = $("#jqgDoctorProfileBusinessLink").jqGrid('getCell', rowid, "PatientCountPerHour");
                    if (phour !== "0" && phour !== '0' && phour !== undefined && phour !== '') {
                        var res = Math.round(60 / phour);

                        $("#" + rowid + "_TimeSlotInMins").val(res);
                        $("#" + rowid + "_TimeSlotInMins").prop('disabled', true);


                        $("#" + rowid + "_PatientCountPerHour").prop('disabled', true);
                    }
                    else {
                        var ro = $("#jqgDoctorProfileBusinessLink").closest('tr.jqgrow');
                        $("#" + rowid + "_TimeSlotInMins", ro[0]).val('0');
                        $("#" + rowid + "_PatientCountPerHour").prop('disabled', true);
                    }


                }
                if (iCol === 4) {


                    var tslot = $("#jqgDoctorProfileBusinessLink").jqGrid('getCell', rowid, "TimeSlotInMins");
                    if (tslot !== "0" && tslot !== '0' && tslot !== undefined && tslot !== '') {
                        var res = Math.round(60 / tslot);
                        $("#" + rowid + "_PatientCountPerHour").val(res);
                        $("#" + rowid + "_PatientCountPerHour").prop('disabled', true);
                        $("#" + rowid + "_TimeSlotInMins").prop('disabled', true);
                    }
                    else {
                        var ro = $("#jqgDoctorProfileBusinessLink").closest('tr.jqgrow');
                        $("#" + rowid + "_PatientCountPerHour", ro[0]).val('0');
                        $("#" + rowid + "_TimeSlotInMins").prop('disabled', true);
                    }


                }

                //var tslot = $("#jqgDoctorProfileBusinessLink").jqGrid('getCell', rowid, "TimeSlotInMins");
                //var r = 60 / tslot;
                //var row = $("#jqgDoctorProfileBusinessLink").closest('tr.jqgrow');
                //$("#" + rowid + "_PatientCountPerHour", row[0]).val(r);

                //var phour = $("#jqgDoctorProfileBusinessLink").jqGrid('getCell', rowid, "PatientCountPerHour");
                //var res = 60 / phour;
                //var ro = $("#jqgDoctorProfileBusinessLink").closest('tr.jqgrow');
                //$("#" + rowid + "_TimeSlotInMins", ro[0]).val(res);
            },

            //onCellSelect: function (rowid, iCol, content, event) {
            //    debugger;

            //    if (iCol === 3) {

            //        $("#" + rowid + "_PatientCountPerHour").prop('disabled', true);
            //        var phour = $("#" + rowid + "_PatientCountPerHour").val();
            //        if (phour !== "0" && phour !== '0' && phour !== undefined && phour !=='') {
            //            var res = 60 / phour;
            //            $("#" + rowid + "_PatientCountPerHour").val(res);
            //            $("#" + rowid + "_TimeSlotInMins").prop('disabled', true);

            //            //var ro = $("#jqgDoctorProfileBusinessLink").closest('tr.jqgrow');
            //            //$("#" + rowid + "_TimeSlotInMins", ro[0]).val(res).prop('disabled', true);
            //            $("#" + rowid + "_PatientCountPerHour").prop('disabled', true);
            //            //return;
            //        }
            //        else {
            //            var ro = $("#jqgDoctorProfileBusinessLink").closest('tr.jqgrow');
            //            $("#" + rowid + "_TimeSlotInMins", ro[0]).val('0').prop('disabled', true);
            //            $("#" + rowid + "_PatientCountPerHour").prop('disabled', true);
            //            //return;
            //        }


            //    }

            //    if (iCol === 4) {

            //        $("#" + rowid + "_TimeSlotInMins").prop('disabled', true);
            //        var tslot = $("#" + rowid + "_TimeSlotInMins").val();
            //        if (tslot !== "0" && tslot !== '0' && tslot !== undefined && tslot !== '') {
            //            var res = 60 / tslot;
            //            //var ro = $("#jqgDoctorProfileBusinessLink").closest('tr.jqgrow');
            //            $("#" + rowid + "_PatientCountPerHour").val(res);
            //            $("#" + rowid + "_PatientCountPerHour").prop('disabled', true);
            //            //$("#" + rowid + "_PatientCountPerHour", ro[0]).val(res).prop('disabled', true);
            //            $("#" + rowid + "_TimeSlotInMins").prop('disabled', true);
            //            //return;
            //        }
            //        //else {
            //        //    var ro = $("#jqgDoctorProfileBusinessLink").closest('tr.jqgrow');
            //        //    $("#" + rowid + "_PatientCountPerHour", ro[0]).val('0').prop('disabled', true);
            //        //    $("#" + rowid + "_TimeSlotInMins").prop('disabled', true);
            //        //    //return;
            //        //}


            //    }



            //}
        }).jqGrid('navGrid', '#jqpDoctorProfileBusinessLink', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnGridRefreshDoctorProfileBusinessLinkGrid() {
    $("#jqgDoctorProfileBusinessLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnSaveDoctorProfileBusinessLink() {
    if ($('#txtDoctorId').val() == '' || $('#txtDoctorId').val() == '0') {
        fnAlert("w", "ESP_01_00", "UI0314", errorMsg_bl.CreateDoctorProfile_E4);
        return;
    }

    $("#jqgDoctorProfileBusinessLink").jqGrid('editCell', 0, 0, false);

    $("#btnSaveDoctorProfileBusinessLink").attr('disabled', false);

    var obj = [];
    var rowData = $('#jqgDoctorProfileBusinessLink').jqGrid('getRowData');

    for (var i = 0; i < rowData.length; i++) {
        var sp =
        {
            BusinessKey: rowData[i]['BusinessKey'],
            DoctorId: $('#txtDoctorId').val(),
            TimeSlotInMins: rowData[i]['TimeSlotInMins'],
            PatientCountPerHour: rowData[i]['PatientCountPerHour'],
            ActiveStatus: rowData[i]['ActiveStatus']
        };
        obj.push(sp);
    }

    $.ajax({
        url: getBaseURL() + '/Doctors/InsertIntoDoctorBusinessLink',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    fnGridDoctorProfileBusinessLink();
                    $("#btnSaveDoctorProfileBusinessLink").attr('disabled', false);
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                    $("#btnSaveDoctorProfileBusinessLink").attr('disabled', false);
                }
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveDoctorProfileBusinessLink").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveDoctorProfileBusinessLink").attr("disabled", false);
        }
    });
}




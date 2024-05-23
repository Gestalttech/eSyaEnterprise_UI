$(document).ready(function () {
    //fnGridDoctorSpecialtyLink();
    $('#cboLocation').selectpicker('refresh');
    $('#cboSpecialty').selectpicker('refresh');
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDoctorSpecialtyLink",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgDelete: { name: "D-Activate", icon: "delete", callback: function (key, opt) { fnDeleteSpecialty(event) } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i> D-Activate </span>");
});

function fnGridDoctorSpecialtyLink() {
    $("#jqgDoctorSpecialtyLink").jqGrid('GridUnload');
    $("#jqgDoctorSpecialtyLink").jqGrid(
        {
            url: getBaseURL() + '/Doctors/GetSpecialtyListByDoctorId?doctorId=' + $('#txtDoctorId').val(),
            datatype: 'json',
            mtype: 'POST',
            //ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
            colNames: [localization_sl.BusinessKey, localization_sl.BusinessLocation, localization_sl.SpecialtyID, localization_sl.Specialty, localization_sl.Active, localization_sl.Actions],
            colModel: [
                { name: "BusinessKey", width: 170, editable: true, align: 'left', hidden: true },
                { name: "LocationDesc", width: 170, editable: true, align: 'left', hidden: false },
                { name: "SpecialtyID", width: 170, resizable: false, hidden: true },
                { name: "SpecialtyDesc", width: 170, resizable: false, hidden: false },
                {
                    name: 'ActiveStatus', index: 'ActiveStatus', width: 70, resizable: false, align: 'center', formatter: "checkbox", edittype: "checkbox", editoptions: { value: "true:false" }
                },
                //{
                //    name: 'delete', search: false, align: 'center', width: 100, sortable: false, resizable: false,
                //    formatter: function (cellValue, options, rowdata, action) {
                //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid cancel-button" id="jqgDSPDelete", onclick="return fnDeleteSpecialty(event)"><i class="far fa-trash-alt"></i> ' + localization.Delete + ' </button>'
                //    }
                //},
                {
                    name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                    formatter: function (cellValue, options, rowdata, action) {
                        return '<button class="mr-1 btn btn-outline" id="btnDoctorSpecialtyLink"><i class="fa fa-ellipsis-v"></i></button>'
                    }
                },
            ],
            rowNum: 10,
            rowList: [10, 20, 50, 100],
            rownumWidth: 55,
            loadonce: true,
            pager: "#jqpDoctorSpecialtyLink",
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

            loadComplete: function (data) {
                SetDoctorSpecialtyGridControlByAction("jqgDoctorSpecialtyLink");
                $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-pager").css('width', '100%');
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
        }).jqGrid('navGrid', '#jqpDoctorSpecialtyLink', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnGridRefreshDoctorSpecialtyLinkGrid() {
    $("#jqgDoctorSpecialtyLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnDeleteSpecialty(e) {

    var rowid = $("#jqgDoctorSpecialtyLink").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorSpecialtyLink').jqGrid('getRowData', rowid);
    //alert(JSON.stringify(rowData));
    if (rowData != null) {

        var obj = {
            BusinessKey: rowData.BusinessKey,
            SpecialtyID: rowData.SpecialtyID,
            DoctorID: $('#txtDoctorId').val(),
            ActiveStatus: false
        }

        $.ajax({
            url: getBaseURL() + '/Doctors/UpdateDoctorSpecialtyLink',
            type: 'POST',
            datatype: 'json',
            data: { obj },
            success: function (response) {
                if (response != null) {
                    if (response.Status) {
                        fnAlert("s", "", response.StatusCode, response.Message);
                        fnGridDoctorSpecialtyLink();

                    }
                    else {
                        fnAlert("e", "", response.StatusCode, response.Message);

                    }
                }
                else {
                    fnAlert("s", "", response.StatusCode, response.Message);

                }
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);

            }
        });
    }
}

function fnLoadSpecialty() {
    $('#cboSpecialty').selectpicker('refresh');
    $.ajax({
        url: getBaseURL() + '/Facilities/Specialty/GetSpecialtyListForBusinessKey?businessKey=' + $('#cbospecialtyLocation').val(),
        type: 'POST',
        datatype: 'json',
        async: false,
        success: function (response) {
            var options = $("#cboSpecialty");
            $("#cboSpecialty").empty();
            $("#cboSpecialty").append($("<option value='0'>Choose Specialty</option>"));
            $.each(response, function () {
                options.append($("<option />").val(this.SpecialtyID).text(this.SpecialtyDesc));
            });

            if ($('#cboSpecialty option').length == 2) {
                $('#cboSpecialty').prop('selectedIndex', 1);
                $('#cboSpecialty').selectpicker('refresh');
            } else {

                $("#cboSpecialty").val($('#cboSpecialty option:first').val());
                $('#cboSpecialty').selectpicker('refresh');
            }



            $('#chkSpecialtyActiveStatus').parent().addClass("is-checked");
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);

        }
    });
}

function fnSaveDoctorSpecialtyLink() {
    if ($('#txtDoctorId').val() == '' || $('#txtDoctorId').val() == '0') {
        toastr.warning("Please Select Doctor");
        return;
    }
    if ($('#cbospecialtyLocation').val() == '' || $('#cbospecialtyLocation').val() == '0') {
        toastr.warning("Please Select Location");
        $('#cbospecialtyLocation').focus();
        return;
    }
    if ($('#cboSpecialty').val() == '' || $('#cboSpecialty').val() == '0') {
        toastr.warning("Please Select Specialty");
        $('#cboSpecialty').focus();
        return;
    }
    if ($('#chkSpecialtyActiveStatus').parent().hasClass("is-checked") == false) {
        toastr.warning("Please Select Active Status");
        $('#chkSpecialtyActiveStatus').focus();
        return;
    }
    //alert($('#chkSpecialtyActiveStatus').parent().hasClass("is-checked"));

    $("#btnDoctorSpecialtySave").attr("disabled", true);

    var obj = {
        BusinessKey: $('#cbospecialtyLocation').val(),
        SpecialtyID: $('#cboSpecialty').val(),
        DoctorID: $('#txtDoctorId').val(),
        ActiveStatus: $('#chkSpecialtyActiveStatus').parent().hasClass("is-checked")
    }

    $.ajax({
        url: getBaseURL() + '/Doctors/InsertDoctorSpecialtyLink',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    fnGridDoctorSpecialtyLink();
                    //$('#cboSpecialty').val('');
                    //$('#cboSpecialty').selectpicker('refresh');
                    $("#btnDoctorSpecialtySave").attr('disabled', false);
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                    $("#btnDoctorSpecialtySave").attr('disabled', false);
                }
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDoctorSpecialtySave").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDoctorSpecialtySave").attr("disabled", false);
        }
    });
}

function SetDoctorSpecialtyGridControlByAction(jqg) {


    if (_formDelete === false) {
        var eleDisable = document.querySelectorAll('#jqgDSPDelete');
        for (var i = 0; i < eleDisable.length; i++) {
            eleDisable[i].disabled = true;
            eleDisable[i].className = "ui-state-disabled";
        }

    }
}


function fnBindDoctorLocationbyDoctorId() {
    $('#cbospecialtyLocation').selectpicker('refresh');
    $.ajax({
        type: "Post",
        url: getBaseURL() + '/Doctors/GetDoctorLinkWithBusinessLocation?doctorId=' + $('#txtDoctorId').val(),
        dataType: "json",
        success: function (response, data) {

            if (response != null) {
                //refresh each time
                $("#cbospecialtyLocation").empty();
                $("#cbospecialtyLocation").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cbospecialtyLocation").append($("<option></option>").val(response[i]["BusinessKey"]).html(response[i]["BusinessLocation"]));
                }
                $('#cbospecialtyLocation').selectpicker('refresh');
            }
            else {
                $("#cbospecialtyLocation").empty();
                $("#cbospecialtyLocation").append($("<option value='0'> Select </option>"));
                $('#cbospecialtyLocation').selectpicker('refresh');
            }

            if ($('#cbospecialtyLocation option').length == 2) {
                $('#cbospecialtyLocation').prop('selectedIndex', 1);
                $('#cbospecialtyLocation').selectpicker('refresh');
            }
            else {

                $("#cbospecialtyLocation").val($('#cbospecialtyLocation option:first').val());
                $('#cbospecialtyLocation').selectpicker('refresh');
            }
            fnLoadSpecialty();
        },
        async: false,
        processData: false
    });


}
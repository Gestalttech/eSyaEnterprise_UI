function fnLoadClinicBusinessList() {
    $('#cboClinicBusinessLocation').selectpicker('refresh');
    $('#jstClinicConsultantTree').jstree("destroy");

    $.ajax({
        //url: getBaseURL() + '/Doctors/GetDoctorLocationbyDoctorId?doctorId=' + $('#txtDoctorId').val(),
        url: getBaseURL() + '/Doctor/GetDoctorLinkWithBusinessLocation?doctorId=' + $('#txtDoctorId').val(),
        type: 'POST',
        datatype: 'json',
        async: false,
        success: function (data) {
           
            var options = $("#cboClinicBusinessLocation");
            $("#cboClinicBusinessLocation").empty();
            $("#cboClinicBusinessLocation").append($("<option value='0'>Choose Location</option>"));
            $.each(data, function () {
                options.append($("<option />").val(this.BusinessKey).text(this.BusinessLocation));
            });
            if ($('#cboClinicBusinessLocation option').length == 2) {
                $('#cboClinicBusinessLocation').prop('selectedIndex', 1);
                $('#cboClinicBusinessLocation').selectpicker('refresh');
            } else {

                $("#cboClinicBusinessLocation").val($('#cboClinicBusinessLocation option:first').val());
                $('#cboClinicBusinessLocation').selectpicker('refresh');
            }

            fnLoadClinicSpecialty();

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);

        }
    });
}

function fnLoadClinicSpecialty() {
    $('#cboClinicSpecialty').selectpicker('refresh');

    $.ajax({
        url: getBaseURL() + '/Doctor/GetSpecialtyListByBKeyDoctorId?businessKey=' + $('#cboClinicBusinessLocation').val() + '&doctorId=' + $('#txtDoctorId').val(),
        type: 'POST',
        datatype: 'json',
        async: false,
        success: function (response) {
            var opt = $("#cboClinicSpecialty");
            $("#cboClinicSpecialty").empty();
            $("#cboClinicSpecialty").append($("<option value='0'>Choose Specialty</option>"));
            $.each(response, function () {
                opt.append($("<option />").val(this.SpecialtyID).text(this.SpecialtyDesc));
            });

            if ($('#cboClinicSpecialty option').length == 2) {
                $('#cboClinicSpecialty').prop('selectedIndex', 1);
                $('#cboClinicSpecialty').selectpicker('refresh');
            } else {

                $("#cboClinicSpecialty").val($('#cboClinicSpecialty option:first').val());
                $('#cboClinicSpecialty').selectpicker('refresh');
            }



            fnLoadClinicConsultantTree();
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);

        }
    });
}

function fnLoadClinicConsultantTree() {
    $('#jstClinicConsultantTree').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/Doctor/GetClinicConsultantTreeList?businessKey=' + $("#cboClinicBusinessLocation").val() + '&specialtyId=' + $('#cboClinicSpecialty').val() + '&doctorId=' + $('#txtDoctorId').val(),
        success: function (result) {

            $('#jstClinicConsultantTree').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
                "plugins": ["checkbox"],
                "checkbox": {
                    "keep_selected_style": false
                },
            });
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function fnSaveClinicDoctorLink() {

    if (IsStringNullorEmpty($('#cboClinicBusinessLocation').val()) || $('#cboClinicBusinessLocation').val() == '0') {
        
        fnAlert("w", "ESP_01_00", "UI0330", errorMsg_cl.Location_E1);
        $('#cboClinicBusinessLocation').focus();
        return;
    }

    if (IsStringNullorEmpty($('#cboClinicSpecialty').val()) || $('#cboClinicSpecialty').val() == '0') {
        fnAlert("w", "ESP_01_00", "UI0200", errorMsg_cl.Specialty_E2);
        $('#cboClinicSpecialty').focus();
        return;
    }

    if (IsStringNullorEmpty($('#txtDoctorId').val())) {
        
        fnAlert("w", "ESP_01_00", "UI0141", errorMsg_cl.SelectDoctor_E3);
        return;
    }

    var obj = [];

    var treeUNodes = $('#jstClinicConsultantTree').jstree(true).get_json('#', { 'flat': true });
    $.each(treeUNodes, function () {
        if (this.parent != "#" && this.parent != "CL0") {
            var node_ids = this.id.split("_");
            var dc = {
                BusinessKey: $('#cboClinicBusinessLocation').val(),
                SpecialtyId: $('#cboClinicSpecialty').val(),
                DoctorId: $('#txtDoctorId').val(),
                //ClinicId: node_ids[0],
                //ConsultationId: node_ids[2],
                ClinicId: node_ids[2],
                ConsultationId: node_ids[0],
                ActiveStatus: this.state.selected
            }
            obj.push(dc);
        }
    });


    $("#btnSave").attr('disabled', true);

    var URL;
    URL = getBaseURL() + '/Doctor/InsertUpdateDoctorClinicLink';
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { do_cl: obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSave").attr('disabled', false);
                $("#btnSave").html('<i class="fa fa-save"></i> ' + localization.Save);
                fnLoadClinicConsultantTree();
            }

            $("#btnSave").html('<i class="fa fa-save"></i> ' + localization.Save);
            $("#btnSave").attr('disabled', false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSave").attr("disabled", false);
            $("#btnSave").html('<i class="fa fa-save"></i> ' + localization.Save);
        }
    });
}

function fnExpandAll() {
    $('#jstClinicConsultantTree').jstree('open_all');
}

function fnCollapseAll() {
    $('#jstClinicConsultantTree').jstree('close_all');
}
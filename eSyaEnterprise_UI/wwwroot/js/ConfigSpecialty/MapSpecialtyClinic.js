
$(document).ready(function () {
    
    
});
function GetMappedSpecialtyListbyBusinessKey() {
    $('#cboSpecialty').selectpicker('refresh');
    $.ajax({
        url: getBaseURL() + '/ConfigSpecialty/Clinic/GetMappedSpecialtyListbyBusinessKey?businessKey=' + $('#cboBusinesskey').val(),
        type: 'POST',
        datatype: 'json',
        async: false,
        success: function (response) {
            var options = $("#cboSpecialty");
            $("#cboSpecialty").empty();
            $("#cboSpecialty").append($("<option value='0'> " +localization.Select+ " </option>"));
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
            fnLoadMapedSpecialtyClinicConsultationType();
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);

        }
    });
}
function fnLoadMapedSpecialtyClinicConsultationType() {
    $('#jstMapSpecialtyClinic').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/ConfigSpecialty/Clinic/GetMapedSpecialtyClinicConsultationTypeBySpecialtyID?businessKey=' + $("#cboBusinesskey").val() + '&specialtyId=' + $("#cboSpecialty").val(),
        success: function (result) {

            $('#jstMapSpecialtyClinic').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
                "plugins": ["checkbox"],
                "checkbox": {
                    "keep_selected_style": false
                },
            });
            fnTreeSize("#jstMapSpecialtyClinic");
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function fnSaveMapSpecialtyClinic() {

    if ($('#cboBusinesskey').val() == '' || $('#cboBusinesskey').val() == '0' || $('#cboBusinesskey').val() == "0") {
        fnAlert("w", "ECP_07_00", "UI0064", errorMsg.BusinessLocation_E1);
        $('#cboBusinesskey').focus();
        return;
    }
    if ($('#cboSpecialty').val() == '' || $('#cboSpecialty').val() == '0' || $('#cboSpecialty').val() == "0") {
        fnAlert("w", "ECP_07_00", "UI0200", erorMsg.Specialty_E2);
        $('#cboSpecialty').focus();
        return;
    }
    var obj = [];

    var treeUNodes = $('#jstMapSpecialtyClinic').jstree(true).get_json('#', { 'flat': true });
    $.each(treeUNodes, function () {
        if (this.parent != "#" && this.parent != "CL0") {
            var node_ids = this.id.split("_");
            var cc = {
                BusinessKey: $('#cboBusinesskey').val(),
                SpecialtyId: $('#cboSpecialty').val(),
                //ClinicId: node_ids[0],
                //ConsultationId: node_ids[2],
                ConsultationId: node_ids[0],
                ClinicId: node_ids[2],
                ActiveStatus: this.state.selected
            }
            obj.push(cc);
        }
    });

    $("#btnSaveMapSpecialtyClinic").attr('disabled', true);

    var URL;
    URL = getBaseURL() + '/ConfigSpecialty/Clinic/InsertUpdateSpecialtyClinicConsultationTypeLink';
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { do_cl: obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnLoadMapedSpecialtyClinicConsultationType();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveMapSpecialtyClinic").html('<i class="fa fa-save"></i>' + localization.Save);
                $("#btnSaveMapSpecialtyClinic").attr('disabled', false);
            }

            $("#btnSaveMapSpecialtyClinic").html('<i class="fa fa-save"></i>' + localization.Save);
            $("#btnSaveMapSpecialtyClinic").attr('disabled', false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveMapSpecialtyClinic").attr("disabled", false);
            $("#btnSaveMapSpecialtyClinic").html('<i class="fa fa-save"></i>' + localization.Save);
        }
    });
}

function fnExpandAll() {
    $('#jstMapSpecialtyClinic').jstree('open_all');
}

function fnCollapseAll() {
    $('#jstMapSpecialtyClinic').jstree('close_all');
}

 
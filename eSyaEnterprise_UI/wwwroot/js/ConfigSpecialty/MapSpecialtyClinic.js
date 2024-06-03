
$(document).ready(function () {
    
    
});

function fnLoadMapSpecialtyClinic() {
    $('#jstMapSpecialtyClinic').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/ConsultationClinics/GetClinicConsultantTreeList?businessKey=' + $("#cboBusinessLocation").val(),
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

    if ($('#cboBusinessLocation').val() == '') {
        fnAlert("w", "ECP_07_00", "UI0064", errorMsg.BusinessLocation_E1);
        $('#cboBusinessLocation').focus();
        return;
    }

    var obj = [];

    var treeUNodes = $('#jstMapSpecialtyClinic').jstree(true).get_json('#', { 'flat': true });
    $.each(treeUNodes, function () {
        if (this.parent != "#" && this.parent != "CL0") {
            var node_ids = this.id.split("_");
            var cc = {
                BusinessKey: $('#cboBusinessLocation').val(),

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
    URL = getBaseURL() + '/ConsultationClinics/InsertUpdateOPClinicLink';
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { op_cl: obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnLoadClinicConsultantTree();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveMapSpecialtyClinic").html('<i class="fa fa-save"></i> Save');
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

 
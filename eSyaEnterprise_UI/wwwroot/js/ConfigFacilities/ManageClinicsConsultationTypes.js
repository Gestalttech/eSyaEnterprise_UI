
$(document).ready(function () {
    //$('#cboBusinessLocation').selectpicker('refresh');
    fnTreeSize();
    $(window).on('resize', function () {
        fnTreeSize();
    });
});

function fnLoadClinicConsultantTree() {
    $('#jstClinicConsultantTree').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/ConsultationClinics/GetClinicConsultantTreeList?businessKey=' + $("#cboBusinessLocation").val(),
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

function fnSaveOPClinic() {

    if ($('#cboBusinessLocation').val() == '') {
        fnAlert("w", "ECP_05_00","UI0064",errorMsg.BusinessLocation_E1);
        $('#cboBusinessLocation').focus();
        return;
    }

    var obj = [];

    var treeUNodes = $('#jstClinicConsultantTree').jstree(true).get_json('#', { 'flat': true });
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

    //$("#btnSaveOPClinic").html('<i class="fa fa-spinner fa-spin"></i> wait');
    $("#btnSaveOPClinic").attr('disabled', true);

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
                $("#btnSaveOPClinic").html('<i class="fa fa-save"></i> Save');
                $("#btnSaveOPClinic").attr('disabled', false);
            }

            $("#btnSaveOPClinic").html('<i class="fa fa-save"></i>' +localization.Save);
            $("#btnSaveOPClinic").attr('disabled', false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveOPClinic").attr("disabled", false);
            $("#btnSaveOPClinic").html('<i class="fa fa-save"></i>' +localization.Save);
        }
    });
}

function fnExpandAll() {
    $('#jstClinicConsultantTree').jstree('open_all');
}

function fnCollapseAll() {
    $('#jstClinicConsultantTree').jstree('close_all');
}

function fnTreeSize() {
    $("#jstClinicConsultantTree").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });
}
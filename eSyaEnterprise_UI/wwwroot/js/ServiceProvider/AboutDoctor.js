function fnGetDoctorProfileAboutDetails() {

    debugger;
    $.ajax({
        url: getBaseURL() + '/Doctor/GetAboutDoctorbydoctorId?doctorId=' + $('#txtDoctorId').val(),
        type: 'POST',
        datatype: 'json',
        success: function (response) {

            if (response != null) {

                fnFillDoctorAboutDetails(response);
            }
            else {
                fnClearDoctorAboutDetails();

            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);

        }
    });

}

function fnFillDoctorAboutDetails(data) {

    $('#txtLanguagesKnown').val(data.LanguageKnown);
    $('#txtExperience').val(data.Experience);
    $('#txtCertification').val(data.CertificationCourse);
    $('#txtDoctorRemarks').val(data.DoctorRemarks);
    tinyMCE.activeEditor.setContent('');

    if (data.AboutDoctor != null) {
        tinyMCE.activeEditor.setContent(data.AboutDoctor);


    }
    else {
        tinyMCE.activeEditor.setContent('');

    }
    //if (data.ProfileImagePath != null)
    //{
    //    $('#imgPhotoimageblah').attr('src', data.ProfileImagePath);


    //}
    //else {
    //    $('#imgPhotoimageblah').attr('src', '');

    //}

    if (data.ActiveStatus == true)
        $('#chkActiveStatus').parent().addClass("is-checked");
    else
        $('#chkActiveStatus').parent().removeClass("is-checked");
    $("#btnSaveAboutDoctor").html('<i class="fa fa-sync"></i>' + localization.Update);
}

function fnClearDoctorAboutDetails() {
    $('#txtLanguagesKnown').val('');
    $('#txtExperience').val('');
    $('#txtCertification').val('');
    $('#txtDoctorRemarks').val('');
    tinyMCE.activeEditor.setContent('');
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSaveAboutDoctor").html('<i class="far fa-save"></i> ' + localization.Save);

}

function fnSaveDoctorAboutDetails() {

    if (IsStringNullorEmpty($("#txtDoctorId").val())) {
        fnAlert("w", "ESP_01_00", "UI0322", errorMsg_ad.DoctorDetails_E1);
        return;
    }
    if ($("#txtDoctorId").val() === 0 || $("#txtDoctorId").val() === "0") {
        fnAlert("w", "ESP_01_00", "UI0322", errorMsg_ad.DoctorDetails_E1);
        return;
    }
    if (IsStringNullorEmpty($("#txtLanguagesKnown").val())) {
        fnAlert("w", "ESP_01_00", "UI0323", errorMsg_ad.LanguageKnown_E2);
        return;
    }
    if (IsStringNullorEmpty($("#txtExperience").val())) {
        fnAlert("w", "ESP_01_00", "UI0324", errorMsg_ad.Experience_E3);
        return;
    }
    if (IsStringNullorEmpty($("#txtCertification").val())) {
        fnAlert("w", "ESP_01_00", "UI0325", errorMsg_ad.Certification_E4);
        return;
    }
    if (IsStringNullorEmpty(tinyMCE.get('txtAboutDoctor').getContent())) {
        fnAlert("w", "ESP_01_00", "UI0326", errorMsg_ad.AboutDoctor_E5);
        return;
    }
    if (IsStringNullorEmpty($("#txtDoctorRemarks").val())) {
        fnAlert("w", "ESP_01_00", "UI0327", errorMsg_ad.DoctorRemarks_E6);
        return;
    }


    var obj = new FormData();
    
    obj.append("DoctorId", document.getElementById("txtDoctorId").value);
    obj.append("LanguageKnown", document.getElementById("txtLanguagesKnown").value);
    obj.append("Experience", document.getElementById("txtExperience").value);
    obj.append("DoctorRemarks", document.getElementById("txtDoctorRemarks").value);
    obj.append("CertificationCourse", document.getElementById("txtCertification").value);
    obj.append("AboutDoctor", tinyMCE.get('txtAboutDoctor').getContent());
    obj.append("ActiveStatus", $('#chkActiveStatus').parent().hasClass("is-checked"));

    $.ajax({
        url: getBaseURL() + '/Doctor/InsertOrUpdateIntoAboutDoctor',
        type: "POST",
        data: obj,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            if (response !== null) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#btnSaveAboutDoctor").attr('disabled', false);
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                    $("#btnSaveAboutDoctor").attr('disabled', false);
                }
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveAboutDoctor").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", response.StatusCode, response.Message);;
            $("#btnSaveAboutDoctor").attr("disabled", false);
        }
    });
    $("#btnSaveAboutDoctor").attr('disabled', false);
}
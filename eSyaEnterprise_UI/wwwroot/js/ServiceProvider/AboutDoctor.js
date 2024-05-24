function fnGetDoctorProfileAboutDetails() {


    $.ajax({
        url: getBaseURL() + '/Doctors/GetDoctordetailsbydoctorId?doctorId=' + $('#txtDoctorId').val(),
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
    //$('#imgPhotoimageblah').attr('src', '');
    //document.getElementById('Photoimage').value="";
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSaveAboutDoctor").html('<i class="far fa-save"></i> ' + localization.Save);

}

function fnSaveDoctorAboutDetails() {

    if (IsStringNullorEmpty($("#txtDoctorId").val())) {
        toastr.warning("Please add the Doctor details");
        return;
    }
    if ($("#txtDoctorId").val() === 0 || $("#txtDoctorId").val() === "0") {
        toastr.warning("Please add the Doctor details");
        return;
    }
    if (IsStringNullorEmpty($("#txtLanguagesKnown").val())) {
        toastr.warning("Please Enter the Language Known");
        return;
    }
    if (IsStringNullorEmpty($("#txtExperience").val())) {
        toastr.warning("Please Enter the Experience");
        return;
    }
    if (IsStringNullorEmpty($("#txtCertification").val())) {
        toastr.warning("Please Enter the Certification");
        return;
    }
    if (IsStringNullorEmpty(tinyMCE.get('txtAboutDoctor').getContent())) {
        toastr.warning("Please Enter the About Doctor");
        return;
    }
    if (IsStringNullorEmpty($("#txtDoctorRemarks").val())) {
        toastr.warning("Please Enter the Doctor Remarks");
        return;
    }


    var obj = new FormData();
    //appending image file object
    //obj.append("Imagefile", $("#Photoimage").get(0).files[0]);
    obj.append("DoctorId", document.getElementById("txtDoctorId").value);
    obj.append("LanguageKnown", document.getElementById("txtLanguagesKnown").value);
    obj.append("Experience", document.getElementById("txtExperience").value);
    obj.append("DoctorRemarks", document.getElementById("txtDoctorRemarks").value);
    obj.append("CertificationCourse", document.getElementById("txtCertification").value);
    obj.append("AboutDoctor", tinyMCE.get('txtAboutDoctor').getContent());
    obj.append("ActiveStatus", $('#chkActiveStatus').parent().hasClass("is-checked"));

    $.ajax({
        url: getBaseURL() + '/Doctors/InsertOrUpdateIntoDoctordetails',
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
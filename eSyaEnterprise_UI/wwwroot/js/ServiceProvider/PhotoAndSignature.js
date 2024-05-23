//var srcdoc = "";
srcdoc = `<video id="video" width="200" height="200" autoplay></video>
    <canvas id="canvas" width="200" height="200" style="display:none"></canvas>`
//$("#iframePhoto").attr('srcdoc', srcdoc);
let camera_button = document.querySelector("#btnCapturePhoto");
let video = document.querySelector("#video");
//let video = $("#iframePhoto").contents().find("video").html();
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
//let canvas = $("#iframePhoto").contents().find("canvas").html();
let removePhoto = document.querySelector("#remove-photo");

camera_button.addEventListener('click', async function () {
    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.style.display = "inline-block";
    video.style.width = 200;
    video.style.height = 200;
    video.srcObject = stream;
    //await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    //    .then(stream => video.srcObject = stream)
    //    .catch(e => log(e.name + ": " + e.message));
});

click_button.addEventListener('click', function () {

    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    let image_data_url = canvas.toDataURL('image/jpeg');
    video.pause();
    $("#video").css('display', 'none');
    $("#canvas").css('display', 'inline-block');
    // data url of the image
    document.getElementById('imgPhoto').style.display = "block";
    document.getElementById('imgPhoto').innerHTML = '<img id="imgPhotoimageblah" src=" ' + image_data_url + '"  alt="Doctor Image" class="img-thumbnail"/> <input class="fileInput" id="FileUpload1" type="file" name="file" onchange="readPhotoimage(this);" accept="image/*" enctype="multipart/form-data" style="visibility:hidden" />';
    stream.off();
});
removePhoto.addEventListener('click', function () {
    $("#canvas").css('display', 'none'); $("#divCapturePhoto,#divbtnCapturePhoto").css('display', 'none');
});
$("#btnUploadPhoto").click(function () {
    $("#divUploadPhoto").css('display', 'block');
    $("#divCapturePhoto,#divbtnCapturePhoto").css('display', 'none');
    $("#imgPhotoimageblah").attr('src', "");
    $("#FileUpload1").trigger("click");
});

$("#btnUploadSignature").click(function () {
    $("#divUploadSignature").css('display', 'inline-block');
    $("#imgSignatureblah").attr('src', "");
    $("#FileUpload2").trigger("click");
});
$("#btnCapturePhoto").click(function () {
    $("#divUploadPhoto").css('display', 'none');
    document.getElementById('imgPhoto').style.display = "block";
    $("#divCapturePhoto,#divbtnCapturePhoto").css('display', 'inline-block');
    $("#canvas").css('display', 'none');
    $("#video").css('display', 'inline-block');
});
$("#btnRemoveUploadPhoto").click(function () { $("#divUploadPhoto").css('display', 'none'); });

$(function () {
    $("#canvas").css('display', 'none');
})

function fnClearDoctorImageFields() {
    $('#Photoimage').val('');
    $('#imgPhotoimageblah').removeAttr('src');
    $('#imgSignatureblah').val('');
    $('#imgSignatureblah').removeAttr('src');
    $("#canvas").css('display', 'none');
    //$('#imgPhotoimageblah').attr('src', '');
    //document.getElementById('Photoimage').value="";
}

function fnGetDoctorProfileImage() {

    fnClearDoctorImageFields();
    $.ajax({
        url: getBaseURL() + '/Doctors/GetDoctorProfileImagebyDoctorId?doctorId=' + $('#txtDoctorId').val(),
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            if (response != null) {
                fnFillDoctorImageData(response);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
        }
    });

}

function fnFillDoctorImageData(data) {
    fnClearDoctorImageFields();
    if (data.DoctorProfileImage !== null && data.DoctorProfileImage !== "") {
        document.getElementById('imgPhoto').style.display = "inline-block";
        document.getElementById('imgPhoto').innerHTML = '<img id="imgPhotoimageblah" src=" ' + data.DoctorProfileTitle + '"  alt=" &nbsp; Doctor Image" class="img-thumbnail"   /> <input class="fileInput" id="FileUpload1" type="file" name="file" onchange="readPhotoimage(this);" accept="image/*" enctype="multipart/form-data" style="visibility:hidden" />';
    }
    if (data.DoctorSignatureImage !== null && data.DoctorSignatureImage !== "") {
        document.getElementById('divUploadSignature').style.display = "inline-block";
        document.getElementById('divUploadSignature').innerHTML = '<img id="imgSignatureblah" src=" ' + data.DoctorSignatureTitle + '"  alt=" &nbsp; Doctor Signature"   /> <input class="fileInput" id="FileUpload2" type="file" name="file" onchange="readSinatureimage(this);" accept="image/*" enctype="multipart/form-data" style="visibility:hidden" />';
    }

}

function fnSaveDoctorProfileImage() {
    if ($('#txtDoctorId').val() == '' || $('#txtDoctorId').val() == '0') {
        toastr.warning("Please Create Doctor First");
        return;
    }

    var Imagefile = '';
    var sigfile = '';
    if ($('#imgPhoto img').attr('src') !== undefined) {

        Imagefile = ($('#imgPhoto img').attr('src').indexOf('TakePicture.jpg') > 0) ? null : $('#imgPhoto img').attr('src');// Data URI
    }
    if ($('#divUploadSignature img').attr('src') !== undefined) {

        sigfile = ($('#divUploadSignature img').attr('src').indexOf('TakePicture.jpg') > 0) ? null : $('#divUploadSignature img').attr('src');// Data URI
    }
    if (Imagefile == '' || Imagefile.trim() == 'undefined') {
        toastr.warning("Please Upload Or Capture Doctor Image");
        return;
    }
    if (sigfile == '' || sigfile.trim() == 'undefined') {
        toastr.warning("Please Upload Doctor Signature");
        return;
    }

    $("#btnSaveDoctorProfileImage").attr("disabled", true);

    var obj = {
        DoctorId: $('#txtDoctorId').val(),
        //DoctorProfileImage: file,
        //DoctorSignatureImage: sigfile
        DoctorProfileTitle: Imagefile,
        DoctorSignatureTitle: sigfile
    };

    $.ajax({
        url: getBaseURL() + '/Doctors/InsertIntoDoctorProfileImage',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response !== null) {
                if (response.Status) {
                    toastr.success(response.Message);

                    $("#btnSaveDoctorProfileImage").attr('disabled', false);
                }
                else {
                    toastr.error(response.Message);
                    $("#btnSaveDoctorProfileImage").attr('disabled', false);
                }
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveDoctorProfileImage").attr('disabled', false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveDoctorProfileImage").attr("disabled", false);
        }
    });
    $("#btnSaveDoctorProfileImage").attr('disabled', false);
}
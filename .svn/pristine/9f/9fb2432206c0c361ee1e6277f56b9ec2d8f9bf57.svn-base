
$(document).ready(function () {
    fnGridLoadUploadUserPhoto();
    $.contextMenu({
        selector: "#btnUploadUserPhoto",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditUploadUserPhoto(event) } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-upload'></i>" + localization.Upload + " </span>");
   
});


function fnGridLoadUploadUserPhoto() {
   
    $("#jqgUploadUserPhoto").jqGrid('GridUnload');
    $("#jqgUploadUserPhoto").jqGrid({
        url: getBaseURL() +'/Photo/GetActiveUsersforPhoto',
        datatype: 'json',
        mtype: 'GET',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.UserId, localization.UserDesc, localization.EmailId, localization.IsUserAuthorised, localization.Photo, localization.Active, localization.Actions],
        colModel: [
            { name: "UserID", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "LoginDesc", width: 150, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "EMailId", width: 150, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "IsUserAuthenticated", width: 55, editable: false, editoptions: { disabled: true }, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
           
            {
                name: 'userimage',
                sortable: false,
                editable: true,
                edittype: 'file',
                hidden: false,
                editoptions: {
                    enctype: "multipart/form-data",

                    dataEvents: [{
                        type: 'change',
                        fn: function (e) {
                            var Filename = $('#ShowUserPhoto').attr('src').split('/').pop();
                            imgName = Filename;
                            var input = document.getElementById("ShowUserPhoto");
                            var fReader = new FileReader();
                            fReader.readAsDataURL(input.files[0]);
                            fReader.onloadend = function (event) {
                                var img = document.getElementById("ShowUserPhoto");
                                img.src = event.target.result;
                                img.height = "25";
                            }
                        }
                    }]
                },
                width: 25,
                align: 'center',
                formatter: jgImageFormatter,
                search: false
            },

            { name: "ActiveStatus", editable: true, width: 30, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnUploadUserPhoto"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpUploadUserPhoto",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: false,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        caption: localization.UploadUserPhoto,
      
        onSelectRow: function (id) {
            if (id) { $('#jqpUploadUserPhoto').jqGrid('editRow', id, true); }
        },
        
        loadComplete: function () {
            fnJqgridSmallScreen("jqpUploadUserPhoto");
        },
    }).jqGrid('navGrid', '#jqpUploadUserPhoto', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpUploadUserPhoto', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshGridUploadUserPhoto
    });
}
function jgImageFormatter(cellValue, options, rowObject) {
    var imageHtml = "<img class='gridUserPhoto' id='img" + options.rowId + "' src='" + rowObject.userimage + "' originalValue='" + rowObject.userimage + "'  />"
    return imageHtml;
}

function fnFillUserPhoto() {

   
        $.ajax({
            async: false,
            url: getBaseURL() + "/Photo/GetUserPhotobyUserID?UserID=" + $("#txtUserID").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {

                if (result.userimage !== null && result.userimage !== "") {
                    document.getElementById('imgPhoto').innerHTML = '<img id="imgPhotoimageblah" src=" ' + result.userimage + '"  alt=" &nbsp; User Image"   /> <input class="fileInput" id="FileUpload1" type="file" name="file" onchange="readPhotoimage(this);" accept="image/*" enctype="multipart/form-data" />';
                }
                
            }
        });
  

}

function fnEditUploadUserPhoto(e, actiontype) {
    var rowid = $("#jqgUploadUserPhoto").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgUploadUserPhoto').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();
    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);
    fnClearUserPhoto();
    $("#btnSaveUserPhoto").attr('disabled', false);
    $("#lblLoginDescription").text(rowData.LoginDesc);
    $("#txtUserID").val(rowData.UserID);
    fnFillUserPhoto();
    $("#PopupUserPhoto").modal('show');
    
}


function fnRefreshGridUploadUserPhoto() {
    $("#jqgUploadUserPhoto").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#PopupUserPhoto").on('hidden.bs.modal', function () {
    $("#jqgUploadUserPhoto").trigger('reloadGrid');
    fnClearPhoto();
})

function fnClearUserPhoto() {
    $('#txtUserID').val('')
    $('#lblLoginDescription').text('');
    $('#Photoimage').val('');
    $('#imgPhotoimageblah').removeAttr('src');
}

function fnSaveUserPhoto() {
    var file = '';
    if (IsStringNullorEmpty($("#txtUserID").val())) {
        fnAlert("w", "EEU_03_00", "UI0133", "User ID Required");
        return;
    }
    $("#btnSaveUserPhoto").attr('disabled', true);
    if ($('#imgPhoto img').attr('src') !== undefined) {

        file = ($('#imgPhoto img').attr('src').indexOf('TakePicture.jpg') > 0) ? null : $('#imgPhoto img').attr('src');// Data URI
    }

    $("#btnSaveUserPhoto").attr('disabled', true);


    objuser = {
        UserID: $("#txtUserID").val(),
        
    };
    $.ajax({
        async: false,
        url: getBaseURL() + '/Photo/UploadUserPhoto',
        type: 'POST',
        data: {
            obj: objuser,
            file: file,
        },
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveUserPhoto").attr('disabled', false);
                $("#PopupUserPhoto").modal('hide');
                fnRefreshGridUploadUserPhoto();
                fnClearUserPhoto();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveUserPhoto").attr('disabled', false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveUserPhoto").attr("disabled", false);
        }
    });
}
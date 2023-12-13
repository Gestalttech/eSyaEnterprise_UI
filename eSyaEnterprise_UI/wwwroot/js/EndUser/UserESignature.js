var _sig = '';
$(document).ready(function () {
   

    fnGridLoadUserESignature();
    $.contextMenu({
        selector: "#btnUserESignature",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditUserESignature(event) } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-upload'></i>" + localization.Upload + " </span>");
   
});

$(document).ready(function () {
    $("#signature").jSignature({
        UndoButton: false,
        width: '100%',
        height: 200,
        autoFit: true,
        lineWidth: 2,
        lineColor: '#ABCDEF',
        background: '#EEEEEE',
        border: '1px solid red',
        'decor-color': 'transparent',
    })
});




function fnGridLoadUserESignature() {
    
    $("#jqgUserESignature").jqGrid('GridUnload');
    $("#jqgUserESignature").jqGrid({
        url: getBaseURL() +'/eSignature/GetActiveUsersforSignature',
        datatype: 'json',
        mtype: 'GET',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.UserID, localization.LoginDesc, localization.EmailId, localization.IsUserAuthenticated, localization.IsUserDeactivated, localization.usersignature, localization.Active, localization.Actions],
        colModel: [
            { name: "UserID", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "LoginDesc", width: 150, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "EMailId", width: 150, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "IsUserAuthenticated", width: 45, editable: false, editoptions: { disabled: true }, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "IsUserDeactivated", width: 45, editable: false, editoptions: { disabled: true }, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'usersignature',
                sortable: false,
                editable: true,
                edittype: 'file',
                hidden: false,
                editoptions: {
                    enctype: "multipart/form-data",

                    dataEvents: [{
                        type: 'change',
                        fn: function (e) {
                            var Filename = $('#ShowUserSignature').attr('src').split('/').pop();
                            imgName = Filename;
                            var input = document.getElementById("ShowUserSignature");
                            var fReader = new FileReader();
                            fReader.readAsDataURL(input.files[0]);
                            fReader.onloadend = function (event) {
                                var img = document.getElementById("ShowUserSignature");
                                img.src = event.target.result;
                                img.height = "25";
                            }
                        }
                    }]
                },
                width: 35,
                align: 'center',
                formatter: jgImageFormatter,
                search: false
            },

            { name: "ActiveStatus", editable: true, width: 30, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnUserESignature"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpUserESignature",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        scroll:false,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        caption: localization.UserESignature,
        onSelectRow: function (id) {
            
        },
        
        loadComplete: function () {
            fnJqgridSmallScreen("jqgUserESignature");
        },
    }).jqGrid('navGrid', '#jqpUserESignature', { add: false, edit: false, search: false, del: false, refresh: false}).jqGrid('navButtonAdd', '#jqpUserESignature', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshGridUserESignature
    });
}

function jgImageFormatter(cellValue, options, rowObject) {
    var imageHtml = "<img class='gridUserSignature' id='img" + options.rowId + "' src='" + rowObject.usersignature + "' originalValue='" + rowObject.usersignature + "'  />"
    return imageHtml;
}
function fnFillUsereSignature() {


    $.ajax({
        async: false,
        url: getBaseURL() + "/eSignature/GetUsereSignaturebyUserID?UserID=" + $("#txtUserID").val(),
        type: 'post',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
           
            $("#imgSignaturee").attr('src', '');
            $('#signature').jSignature("reset");

            if (result !== null && result !== "") {
                document.getElementById('divShowESignature').innerHTML = '<img id="imgShowESignature" src=" ' + result.usersignature + '"  alt=" &nbsp; User eSignature"   /> ';
               

                if (result.usersignature !== null && result.usersignature !== "") {
                    document.getElementById('divShowESignature').innerHTML = '<img id="imgShowESignature" src=" ' + result.usersignature + '"  alt=" &nbsp; User eSignature"   /> ';
                    $("#divAddSignature").css('display', 'none');
                    $("#divESignature,#imgSignaturee").css('display', 'block');
                    $("#divESignature img").attr('src', result.usersignature);
                    $("#btnSaveUserESignature").attr('disabled', true);
                }
                else {
                    $("#divAddSignature").css('display', 'block');
                    $("#divESignature,#imgSignaturee").css('display', 'none');
                    $("#btnSaveUserESignature").attr('disabled', false);
                }
            }
            else
            {
                $("#divAddSignature").css('display', 'block');
                $("#divESignature,#imgSignaturee").css('display', 'none');
                $("#btnSaveUserESignature").attr('disabled', false);   
            }
        }
    });


}
function fnRefreshGridUserESignature() {
    $("#jqgUserESignature").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}


function fnEditUserESignature(e, actiontype) {
    var rowid = $("#jqgUserESignature").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgUserESignature').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();
    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);
    $("#txtUserID").val(rowData.UserID);
    $("#lblLoginDesc").text(rowData.LoginDesc);
    $('#imgSignaturee').attr('src', '');
    $('#signature').jSignature("reset");
    fnFillUsereSignature();
    $("#PopupUserESignature").modal('show');
    
}
function fnChangeSignature() {
    $("#signature").resize();
    $("#divAddSignature").css('display', 'block');
    $("#divESignature,#imgSignaturee").css('display', 'none');
}
function fnSaveUserESignature() {
   
    var file = '';
    var _signatureinbase64 = '';


  
    _signatureinbase64 = $('#signature').jSignature("getData");


    $('#imgSignaturee').attr('src', _signatureinbase64);
    
   
    if (IsStringNullorEmpty($("#txtUserID").val())) {
        fnAlert("w", "EEU_08_00", "UI0133", "User ID Required");
        return;
    }
    if ($('#divESignature img').attr('src') !== undefined) {

        file = ($('#divESignature img').attr('src').indexOf('TakePicture.jpg') > 0) ? null : $('#divESignature img').attr('src');// Data URI
    }

    if (IsStringNullorEmpty(file)) {
        fnAlert("w", "EEU_08_00", "UI0133", "Signature Required");
        return;
    }

    
    $("#btnSaveUserESignature").attr('disabled', true);

    
    objuser = {
        UserID: $("#txtUserID").val(),

    };
    $.ajax({
        async: false,
        url: getBaseURL() + '/eSignature/InsertOrUpdateUsereSignature',
        type: 'POST',
        data: {
            obj: objuser,
            file: file,
        },
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveUserESignature").attr('disabled', false);
                $("#PopupUserESignature").modal('hide');
                fnRefreshGridUserESignature();
                
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveUserESignature").attr('disabled', false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveUserESignature").attr("disabled", false);
        }
    });


    
}
function fnRefreshGridUserESignature() {
    $("#jqgUserESignature").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#PopupUserESignature").on('shown.bs.modal', function () {
    $("#signature").resize();
})
$("#PopupUserESignature").on('hidden.bs.modal', function (e) {
    e.preventDefault();
    $('#signature').jSignature("reset");
    $("#jqgUserESignature").trigger('reloadGrid');
})
$('.clear-button').on('click', function (e) {
    e.preventDefault();
    $('#signature').jSignature("reset");
});

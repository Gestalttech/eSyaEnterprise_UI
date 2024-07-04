var formID;
var prevSelectedID;
var _IsInser = false;
$(function () {
    fnLoadBookType();
})
function fnLoadBookType() {
    $("#divBookTypes").hide();
    $('#jstBookTypes').jstree('destroy');
    fnCreateBookTypeTree();
}

function fnCreateBookTypeTree() {

    $.ajax({
        url: getBaseURL() + '/BookType/GetBookTypes',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {

            $('#jstBookTypes').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true }
            });
            fnTreeSize("#jstBookTypes");
        }
    });

    $("#jstBookTypes").on('loaded.jstree', function () {
        $("#jstBookTypes").jstree('open_all');
    });

    $('#jstBookTypes').on("changed.jstree", function (e, data) {
        if (data.node !== undefined) {
            if (prevSelectedID !== data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#divBookTypes").hide();
               
                var parentNode = $("#jstBookTypes").jstree(true).get_parent(data.node.id);
                if (parentNode == "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#Add').on('click', function () {
                        fnClearFields();
                        _IsInser = true;
                        $(".mdl-card__title-text").text(localization.AddBookTypes);
                        $("#btnSaveBookTypes").html('<i class="fa fa-save"></i> ' + localization.Save);
                        $("#btnSaveBookTypes").attr("disabled", _userFormRole.IsInsert === false);
                        $("#divBookTypes").show();
                        $("#btnSaveBookTypes").show();

                        $("#chkActiveStatus").parent().addClass("is-checked");
                        $("#chkActiveStatus").attr("disabled", true);
                        $("#chkPaymentMethodLinkReq").attr("disabled", false);
                        $("#txtBookType").attr("disabled", false); 
                        $("#txtBookTypeDescription").attr("disabled", false); 
                    });
                }
                else if (parentNode == "BT") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>');

                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#divBookTypes').hide();
                            fnAlert("w", "EAC_01_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        _IsInser = false;

                        $(".mdl-card__title-text").text(localization.ViewBookTypes);
                        $("#btnSaveBookTypes").hide();
                        $("#divBookTypes").show();
                     
                        BookTypeID = data.node.id;
                        fnFillBookTypeDetail(BookTypeID);
                        $("#txtBookType").attr("disabled", true); 
                        $("#chkActiveStatus").attr("disabled", true);
                        $("#chkPaymentMethodLinkReq").attr("disabled", true);
                        $("#txtBookTypeDescription").attr("disabled", true); 
                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#divBookTypes').hide();
                            fnAlert("w", "EAC_01_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        _IsInser = false;
                        $(".mdl-card__title-text").text(localization.EditBookTypes);
                        $("#btnSaveBookTypes").html('<i class="fa fa-sync"></i> ' + localization.Update);
                        $("#btnSaveBookTypes").attr("disabled", _userFormRole.IsEdit === false);
                        $("#divBookTypes").show();
                        $("#btnSaveBookTypes").show();
                         
                        BookTypeID = data.node.id;
                        fnFillBookTypeDetail(BookTypeID);
                        $("#txtBookType").attr("disabled", true); 
                        $("#chkActiveStatus").attr("disabled", true);
                        $("#chkPaymentMethodLinkReq").attr("disabled", false);
                        $("#txtBookTypeDescription").attr("disabled", false); 
                    });
                }

                else {
                    $("#divBookTypes").hide();
                    fnClearFields();
                }
            }
        }
    });
}

function fnFillBookTypeDetail(BookTypeID) {
    $.ajax({
        url: getBaseURL() + '/BookType/GetBooksbyType',
        data: {
            booktype: BookTypeID
        },
        success: function (result) {
            $("#txtBookType").val(result.BookType);
            $("#txtBookTypeDescription").val(result.BookTypeDesc);

            if (result.PaymentMethodLinkReq == true)
                $('#chkPaymentMethodLinkReq').parent().addClass("is-checked");
            else
                $('#chkPaymentMethodLinkReq').parent().removeClass("is-checked");


            if (result.ActiveStatus == true)
                $('#chkActiveStatus').parent().addClass("is-checked");
            else
                $('#chkActiveStatus').parent().removeClass("is-checked");
        }
    });
}
function fnAddOrUpdateBookType() {
    var txtBookType = $("#txtBookType").val();
    var txtBookTypeDescription = $("#txtBookTypeDescription").val();
     
    if (txtBookType == "" || txtBookType == null || txtBookType == undefined) {
        fnAlert("w", "EAC_01_00", "UI0345", errorMsg.BookType_E3);
        return false;
    }
    else if (txtBookTypeDescription == "" || txtBookTypeDescription == null || txtBookTypeDescription == undefined) {
        fnAlert("w", "EAC_01_00", "UI0346", errorMsg.BookTypeDescription_E4);
        return false;
    }
    else {
        $("#btnSaveBookTypes").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/BookType/InsertOrUpdateIntoBookType',
            type: 'POST',
            datatype: 'json',
            data: {
                BookType: $("#txtBookType").val()  ,
                BookTypeDesc: $("#txtBookTypeDescription").val(),
                PaymentMethodLinkReq: $("#chkPaymentMethodLinkReq").parent().hasClass("is-checked"),
                IsInser: _IsInser,
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
            },
            success: function (response) {
                if (response.Status == true) {
                    fnAlert("s", "", response.StatusCode, response.Message);  
                    $("#jstServiceTypeTree").jstree("destroy");
                    fnLoadBookType();

                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
                $("#btnSaveBookTypes").attr("disabled", false);
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnSaveBookTypes").attr("disabled", false);
            }
        });
    }
} 
function fnExpandAll() {
    $('#jstBookTypes').jstree('open_all');
}
function fnCollapseAll() {
    fnClearFields();
    $("#divBookTypes").hide();
    $('#jstBookTypes').jstree('close_all');
}
function fnCloseTheBookType() {
    $("#divBookTypes").hide();
}
function fnClearFields() {
    $("#txtBookType").val('');
    $("#txtBookTypeDescription").val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkPaymentMethodLinkReq").parent().removeClass("is-checked");
}
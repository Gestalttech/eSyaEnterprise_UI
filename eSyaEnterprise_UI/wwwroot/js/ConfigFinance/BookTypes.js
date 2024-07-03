var formID;
var prevSelectedID;
$(function () {
    fnLoadSpecialtyLink();
})
function fnLoadSpecialtyLink() {
    $("#divBookTypes").hide();
    $('#jstBookTypes').jstree('destroy');
    fnCreateBookTypeTree();
}

function fnCreateBookTypeTree() {

    $.ajax({
       // url: getBaseURL() + '/ConfigSpecialty/Business/GetSpecialtyLinkTree?businessKey=' + $('#cboBusinessKey').val(),
       url: '',
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

                if (data.node.parent === "#") {
                    if (data.node.id.startsWith("N")) {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>');
                        $('#Add').on('click', function () {
                            fnClearFields();
                          
                            $(".mdl-card__title-text").text(localization.AddBookTypes);
                            $("#btnSaveBookTypes").html('<i class="fa fa-save"></i> ' + localization.Save);
                            $("#btnSaveBookTypes").attr("disabled", _userFormRole.IsInsert === false);
                            $("#divBookTypes").show();
                            $("#btnSaveBookTypes").show();
                      
                            $("#chkActiveStatus").parent().addClass("is-checked");
                        });
                    }
                    else {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>');
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>');

                        $('#View').on('click', function () {
                            if (_userFormRole.IsView === false) {
                                $('#divBookTypes').hide();
                                fnAlert("w", "EAC_01_00", "UIC03", errorMsg.vieweauth_E3);
                                return;
                            }
                            fnSpecialtyParameter(data.node.id.substring(1, 10));
                            $(".mdl-card__title-text").text(localization.ViewBookTypes);
                            $("#btnSaveBookTypes").hide();
                            $("#divBookTypes").show();
                            if (rowData.ActiveStatus == 'true')
                                $("#chkActiveStatus").parent().addClass("is-checked");
                            else
                                $("#chkActiveStatus").parent().removeClass("is-checked");
                        });

                        $('#Edit').on('click', function () {
                            if (_userFormRole.IsEdit === false) {
                                $('#divBookTypes').hide();
                                fnAlert("w", "EAC_01_00", "UIC02", errorMsg.editauth_E2);
                                return;
                            }
                            $(".mdl-card__title-text").text(localization.EditBookTypes);
                            $("#btnSaveBookTypes").html('<i class="fa fa-sync"></i> ' + localization.Update);
                            $("#btnSaveBookTypes").attr("disabled", _userFormRole.IsEdit === false);
                            $("#divBookTypes").show();
                            $("#btnSaveBookTypes").show();
                            if (rowData.ActiveStatus == 'true')
                                $("#chkActiveStatus").parent().addClass("is-checked");
                            else
                                $("#chkActiveStatus").parent().removeClass("is-checked");
                        });
                    }
                }
                else {
                    $("#divBookTypes").hide();
                    fnClearFields();
                }
            }
        }
    });
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
    $("#txtBookTypeDescription").val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkPaymentMethodLinkReq").parent().removeClass("is-checked");
}
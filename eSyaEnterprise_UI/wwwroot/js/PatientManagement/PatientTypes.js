var RateTypelist = [];
var NodeID;
var prevSelectedID;
var Isactivestatus = false;
var isinsert = false;
$(document).ready(function () {

    $.each(RateTypes, function (i, data) { RateTypelist.push(data.Value + ':' + data.Text); })
    RateTypelist = RateTypelist.join(';')
    $("#pnlMainMenu").hide();
    LoadPatientTypeTree();
});

function LoadPatientTypeTree() {
    $.ajax({
        url: getBaseURL() + '/PatientTypes/GetAllPatientTypesforTreeView',
        success: function (result) {
            fnGetPatientType_Success(result);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function fnGetPatientType_Success(dataArray) {
    $("#jsTreePatientType").jstree({
        "state": { "checkbox_disabled": true },
        "checkbox": {
            "keep_selected_style": false
        },
        //"plugins": ["checkbox"],
        core: { 'data': dataArray, 'check_callback': true, 'multiple': true }
    });

    $("#jsTreePatientType").on('loaded.jstree', function () {

        $("#jsTreePatientType").jstree('open_all');
        $("#jsTreePatientType").jstree()._open_to(prevSelectedID);
        $('#jsTreePatientType').jstree().select_node(prevSelectedID);

    });

    $('#jsTreePatientType').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                if (data.node.id == "0") {
                    fnClearFields();
                    $("#pnlMainMenu").hide();
                }
                else {

                    $('#View').remove();
                    $('#Edit').remove();
                    $('#Add').remove();

                    $("#pnlMainMenu").hide();

                    if (data.node.parent == "MM") {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#555555"aria-hidden="true"></i></span>')

                        $('#Add').on('click', function () {
                            if (_userFormRole.IsInsert === false) {
                                $('#pnlMainMenu').hide();
                                fnAlert("w", "EPT_01_00", "UIC01", errorMsg.addauth_E1);
                                return;
                            }
                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.AddPatientCategory);
                            fnClearFields();


                            $('#txtPatientTypeId').val(data.node.id.substring(2));

                            $("#txtPatientCategoryId").val('');

                            $("input[id*='chk']").attr('disabled', false);
                            //Enable category dropdown and check boxes
                            $("#cboPatientcategory").prop('disabled', false).selectpicker("refresh");
                            Isactivestatus = false;
                            isinsert = true;
                            $("#btnAddPatientType").show();
                            $("input,textarea").attr('readonly', false);
                            $("select").next().attr('disabled', false);
                            $("#btnAddPatientType").html('<i class="fa fa-plus"></i> ' + localization.Save);
                            $("#chkActiveStatus").parent().addClass("is-checked");
                            $("#chkActiveStatus").attr('disabled', true);
                            $('#chkIsOpenBill').parent().removeClass("is-checked");
                            $("#chkIsOpenBill").attr('disabled', false);
                            $('#chkIsInstantBill').parent().removeClass("is-checked");
                            $("#chkIsInstantBill").attr('disabled', false);
                            $("input[type=checkbox]").attr('disabled', false);
                        });
                    }
                    else if (data.node.id.startsWith("SM")) {

                        NodeID = 0;
                        NodeID = data.node.id.substring(2).split("_")[1];

                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#555555"aria-hidden="true"></i></span>')
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#555555"aria-hidden="true"></i></span>')

                        $('#View').on('click', function () {

                            if (_userFormRole.IsView === false) {
                                $('#pnlMainMenu').hide();
                                fnAlert("w", "EPT_01_00", "UIC03", errorMsg.vieweauth_E3);
                                return;
                            }

                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.ViewPatientCategory);
                            $('#txtPatientCategoryId').val(NodeID);
                            $('#txtPatientTypeId').val(data.node.id.substring(2).split("_")[0]);

                            fnFillPatientCategoryInfo();

                            //disableing check boxes
                            Isactivestatus = true;
                            isinsert = false;
                            $("#btnAddPatientType").hide();
                            $("input,textarea").attr('readonly', true);
                            $("select").next().attr('disabled', true);
                            $("input[type=checkbox]").attr('disabled', true);
                        });

                        $('#Edit').on('click', function () {

                            if (_userFormRole.IsEdit === false) {
                                $('#pnlMainMenu').hide();
                                fnAlert("w", "EPT_01_00", "UIC02", errorMsg.editauth_E2);
                                return;
                            }

                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.EditPatientCategory);
                            $('#txtPatientCategoryId').val(NodeID);
                            $('#txtPatientTypeId').val(data.node.id.substring(2).split("_")[0]);

                            fnFillPatientCategoryInfo();

                            //enableing check boxes
                            Isactivestatus = false;
                            isinsert = false;
                            //disable category dropdown
                            $("#cboPatientcategory").next().attr('disabled', true).selectpicker("refresh");
                            //$("#cboRateType").next().attr('disabled', false).selectpicker("refresh");

                            $("#btnAddPatientType").show();
                            $("input,textarea").attr('readonly', false);
                            //$("select").next().attr('disabled', false);
                            $("input[type=checkbox]").attr('disabled', false);
                            $("#btnAddPatientType").html('<i class="fa fa-sync"></i> ' + localization.Update);
                        });


                    }
                    else {
                        fnClearFields();
                        $("#pnlMainMenu").hide();
                    }
                }
            }
        }
    });

    $('#jsTreePatientType').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jsTreePatientType').jstree().deselect_node(closingNode.children);
    });
    fnTreeSize('#jsTreePatientType');
};

function fnFillPatientCategoryInfo() {
    if ($("#txtPatientCategoryId").val() != '' && $("#txtPatientCategoryId").val() != undefined) {
        $.ajax({
            async: false,
            url: getBaseURL() + "/PatientTypes/GetPatientCategoryInfo?PatientTypeId=" + $("#txtPatientTypeId").val() + "&PatientCategoryId=" + $("#txtPatientCategoryId").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                $("#txtPatientTypeId").val('');
                $("#txtPatientTypeId").val(result.PatientTypeId);
                $('#cboPatientcategory').val(result.PatientCategoryId);
                $('#cboPatientcategory').selectpicker('refresh');
                //$('#cboRateType').val(result.RateType);
                //$('#cboRateType').selectpicker('refresh');

                if (result.GenerateInstantBill == 1) {
                    $("#chkIsInstantBill").parent().addClass("is-checked");
                }
                else { $('#chkIsInstantBill').parent().removeClass("is-checked"); }

                if (result.GenerateOpenBill == 1) {
                    $("#chkIsOpenBill").parent().addClass("is-checked");
                }
                else { $('#chkIsOpenBill').parent().removeClass("is-checked"); }

                if (result.ActiveStatus == 1) {
                    $("#chkActiveStatus").parent().addClass("is-checked");
                }
                else { $('#chkActiveStatus').parent().removeClass("is-checked"); }
                eSyaParams.ClearValue();
                eSyaParams.SetJSONValue(result.l_ptypeparams);
            }
        });
    }
}

function fnSavePatientCategory() {

    if (validationPatientCategory() === false) {
        return;
    }

    $("#btnAddPatientType").attr('disabled', true);

    var obj = {
        PatientTypeId: $("#txtPatientTypeId").val(),
        PatientCategoryId: $("#cboPatientcategory").val(),
        //RateType: $("#cboRateType").val(),
        GenerateInstantBill: $("#chkIsInstantBill").parent().hasClass("is-checked"),
        GenerateOpenBill: $("#chkIsOpenBill").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
    };

    var fmParams = eSyaParams.GetJSONValue();
    obj.l_ptypeparams = fmParams;

    $.ajax({
        url: getBaseURL() + '/PatientTypes/InsertOrUpdatePatientCategory',
        type: 'POST',
        datatype: 'json',
        data: { isinsert: isinsert, obj: obj },
        async: false,
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                location.reload();
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnAddPatientType").attr('disabled', false);
                return false;
            }
        },
        error: function (error) {
            $("#btnAddPatientType").attr('disabled', false);
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function validationPatientCategory() {

    if (IsStringNullorEmpty($("#cboPatientcategory").val()) || $("#cboPatientcategory").val() === "0" || $("#cboPatientcategory").val() === "") {
        fnAlert("w", "EPT_01_00", "UI0188", errorMsg.SelectCategory_E6);
        return false;
    }

    //if (IsStringNullorEmpty($("#cboRateType").val())||$("#cboRateType").val() === "0" || $("#cboRateType").val() === "") {
    //    toastr.warning("Please Select Rate Type");
    //    return false;
    //}

}

function fnClearFields() {
    $("#txtPatientTypeId").val('');
    $("#cboPatientcategory").val('0');
    $("#cboPatientcategory").selectpicker('refresh');
    //$("#cboRateType").val('0').selectpicker('refresh');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").attr('disabled', true);
    $("#btnAddPatientType").html('<i class="fa fa-save"></i>  ' + localization.Save);
    $("#btnAddPatientType").attr('disabled', false);
    eSyaParams.ClearValue();
}

function fnExpandAll() {
    $('#jsTreePatientType').jstree('open_all');
}

function fnCollapseAll() {
    fnClearFields();
    $("#pnlMainMenu").hide();
    $('#jsTreePatientType').jstree('close_all');
}

function fnTreeSize() {
    $("#jsTreePatientType").css({
        'height': $(window).innerHeight() - 136,
        'overflow': 'auto'
    });
}

function fnDisableActivecheckboxs() {
    if (Isactivestatus === true) {
        $("input[type=checkbox]").attr('disabled', true);
    }
    if (Isactivestatus === false) {
        $("input[type=checkbox]").attr('disabled', false);
    }
}
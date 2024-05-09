$(function () {

});
function fnBusinessKeyChange() {
    var _businesskey = $("#cboBusinessKey").val();
    var _patienttype = $("#cboPatientTypes").val();
    if (_businesskey == 0 || _patienttype == 0) {
        $("#jqgMapPatientCategoryDocument").jqGrid('GridUnload');
    }
    else {
        fnLoadPatientTypeCategoryMapDocumentLink();
    }
}

function fnLoadPatientCategoryTree() {
    $.ajax({
        url: getBaseURL() + '/Specialty/GetAllPatientCategoryforTreeView?BusinessKey=' + $("#cboBusinessKey").val(),
        success: function (result) {
            fnGetPatientCategory_Success(result);
         },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function fnGetPatientCategory_Success() {
    $("#jstMapPatientCategorySpecialty").jstree({
        "state": { "checkbox_disabled": true },
        "checkbox": {
            "keep_selected_style": false
        },
        //"plugins": ["checkbox"],
        core: { 'data': dataArray, 'check_callback': true, 'multiple': true }
    });

    $("#jstMapPatientCategorySpecialty").on('loaded.jstree', function () {

        $("#jsTreePatientType").jstree('open_all');
        $("#jsTreePatientType").jstree()._open_to(prevSelectedID);
        $('#jsTreePatientType').jstree().select_node(prevSelectedID);

    });
    $('#jstMapPatientCategorySpecialty').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                if (data.node.id == "0") {
                    fnClearFields();
                    $("#pnlMapPatientCategorySpecialty").hide();
                }
                else {

                    $('#View').remove();
                    $('#Edit').remove();
                    $('#Add').remove();

                    $("#pnlMapPatientCategorySpecialty").hide();

                    if (data.node.parent == "MM") {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')

                        $('#Add').on('click', function () {
                            if (_userFormRole.IsInsert === false) {
                                $('#pnlMapPatientCategorySpecialty').hide();
                                fnAlert("w", "EPM_04_00", "UIC01", errorMsg.addauth_E1);
                                return;
                            }
                            $("#pnlMapPatientCategorySpecialty").show();
                            $(".mdl-card__title-text").text(localization.AddPatientCategory);
                            fnClearFields();


                            $('#txtPatientTypeId').val(data.node.id.substring(2));

                            $("#txtPatientCategoryId").val('');

                            $("input[id*='chk']").attr('disabled', false);
                            //Enable category dropdown and check boxes
                            $("#cboPatientcategory").prop('disabled', false).selectpicker("refresh");
                            Isactivestatus = false;
                            isinsert = true;
                            $("#btnAddMapPatientCategorySpecialty").show();
                            $("input,textarea").attr('readonly', false);
                            $("select").next().attr('disabled', false);
                            $("#btnAddMapPatientCategorySpecialty").html('<i class="fa fa-plus"></i> ' + localization.Save);
                            $("#chkActiveStatus").parent().addClass("is-checked");
                            $("#chkActiveStatus").attr('disabled', true);
                            $("input[type=checkbox]").attr('disabled', false);
                        });
                    }
                    else if (data.node.id.startsWith("SM")) {

                        NodeID = 0;
                        NodeID = data.node.id.substring(2).split("_")[1];

                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')

                        $('#View').on('click', function () {

                            if (_userFormRole.IsView === false) {
                                $('#pnlMapPatientCategorySpecialty').hide();
                                fnAlert("w", "EPM_04_00", "UIC03", errorMsg.vieweauth_E3);
                                return;
                            }

                            $("#pnlMapPatientCategorySpecialty").show();
                            $(".mdl-card__title-text").text(localization.ViewPatientCategory);
                            $('#txtPatientCategoryId').val(NodeID);
                            $('#txtPatientTypeId').val(data.node.id.substring(2).split("_")[0]);

                            fnFillPatientCategoryInfo();

                            //disable the check boxes
                            Isactivestatus = true;
                            isinsert = false;
                            $("#btnAddMapPatientCategorySpecialty").hide();
                            $("input,textarea").attr('readonly', true);
                            $("select").next().attr('disabled', true);
                            $("input[type=checkbox]").attr('disabled', true);
                        });

                        $('#Edit').on('click', function () {

                            if (_userFormRole.IsEdit === false) {
                                $('#pnlMapPatientCategorySpecialty').hide();
                                fnAlert("w", "EPM_04_00", "UIC02", errorMsg.editauth_E2);
                                return;
                            }

                            $("#pnlMapPatientCategorySpecialty").show();
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

                            $("#btnAddMapPatientCategorySpecialty").show();
                            $("input,textarea").attr('readonly', false);
                            //$("select").next().attr('disabled', false);
                            $("input[type=checkbox]").attr('disabled', false);
                            $("#btnAddMapPatientCategorySpecialty").html('<i class="fa fa-sync"></i> ' + localization.Update);
                        });


                    }
                    else {
                        fnClearFields();
                        $("#pnlMapPatientCategorySpecialty").hide();
                    }
                }
            }
        }
    });
}


function fnClearFields() {
    $("#cboBusinessKey").val('0').selectpicker('refresh');
    $("#cboPatientTypes").val('0').selectpicker('refresh');
}

function fnExpandAll() {
    $('#jstMapPatientCategorySpecialty').jstree('open_all');
}

function fnCollapseAll() {
    fnClearFields();
    $("#pnlMapPatientCategorySpecialty").hide();
    $('#jstMapPatientCategorySpecialty').jstree('close_all');
}
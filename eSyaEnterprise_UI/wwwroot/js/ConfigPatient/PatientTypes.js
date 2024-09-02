var RateTypelist = [];
var NodeID;
var prevSelectedID;
var Isactivestatus = false;
var isinsert = false;
$(document).ready(function () {

    $.each(RateTypes, function (i, data) { RateTypelist.push(data.Value + ':' + data.Text); })
    RateTypelist = RateTypelist.join(';')
    $("#pnlPatientTypeCategory").hide();
    LoadPatientTypeTree();
});
function fnSubledgerType_onChange() {

    fnBindPatientCategories();
   
}

function fnBindPatientCategories() {
    var ledgertype = $("#cboSubledgerType").val();
    $("#cboPatientcategory").empty();
    $.ajax({
        url: getBaseURL() + '/PatientType/GetPatientCategorybySubledgerType?subledgertype=' + ledgertype,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboPatientcategory").empty();

                $("#cboPatientcategory").append($("<option value='0'> Select Patient Category </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboPatientcategory").append($("<option></option>").val(response[i]["ApplicationCode"]).html(response[i]["CodeDesc"]));
                }
                $('#cboPatientcategory').selectpicker('refresh');

            }
            else {
                $("#cboPatientcategory").empty();
                $("#cboPatientcategory").append($("<option value='0'> Select Patient Category </option>"));
                $('#cboPatientcategory').selectpicker('refresh');
            }

        },
        async: false,
        processData: false
    });

    
}
function LoadPatientTypeTree() {
    $.ajax({
        url: getBaseURL() + '/PatientType/GetAllPatientTypesforTreeView',
        success: function (result) {
            fnGetPatientType_Success(result);
           
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function fnGetPatientType_Success(dataArray) {
    $("#jstPatientType").jstree({
        "state": { "checkbox_disabled": true },
        "checkbox": {
            "keep_selected_style": false
        },
        //"plugins": ["checkbox"],
        core: { 'data': dataArray, 'check_callback': true, 'multiple': true }
    });

    $("#jstPatientType").on('loaded.jstree', function () {

        $("#jstPatientType").jstree('open_all');
        $("#jstPatientType").jstree()._open_to(prevSelectedID);
        $('#jstPatientType').jstree().select_node(prevSelectedID);

    });

    $('#jstPatientType').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                
                if (data.node.id == "0") {
                    fnClearFields();
                    $("#pnlPatientTypeCategory").hide();
                }
                else {

                    $('#View').remove();
                    $('#Edit').remove();
                    $('#Add').remove();

                    $("#pnlPatientTypeCategory").hide();

                    if (data.node.parent == "MM") {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')

                        $('#Add').on('click', function () {
                            if (_userFormRole.IsInsert === false) {
                                $('#pnlPatientTypeCategory').hide();
                                fnAlert("w", "EMP_01_00", "UIC01", errorMsg.addauth_E1);
                                return;
                            }
                            $("#pnlPatientTypeCategory").show();
                            $(".mdl-card__title-text").text(localization.AddPatientCategory);
                            fnClearFields();

                            
                            $('#txtPatientTypeId').val(data.node.id.substring(2));

                            $("#txtPatientCategoryId").val('');

                            $("input[id*='chk']").attr('disabled', false);
                            //Enable category dropdown and check boxes
                            $("#cboSubledgerType").prop('disabled', false).selectpicker("refresh");

                            $("#cboPatientcategory").prop('disabled', false).selectpicker("refresh");
                            Isactivestatus = false;
                            isinsert = true;
                            $("#btnAddPatientType").show();
                            $("input,textarea").attr('readonly', false);
                            $("select").next().attr('disabled', false);
                            $("#btnAddPatientType").html('<i class="fa fa-plus"></i> ' + localization.Save);
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
                                $('#pnlPatientTypeCategory').hide();
                                fnAlert("w", "EMP_01_00", "UIC03", errorMsg.vieweauth_E3);
                                return;
                            }

                            $("#pnlPatientTypeCategory").show();
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
                                $('#pnlPatientTypeCategory').hide();
                                fnAlert("w", "EMP_01_00", "UIC02", errorMsg.editauth_E2);
                                return;
                            }

                            $("#pnlPatientTypeCategory").show();
                            $(".mdl-card__title-text").text(localization.EditPatientCategory);
                            $('#txtPatientCategoryId').val(NodeID);
                            $('#txtPatientTypeId').val(data.node.id.substring(2).split("_")[0]);
                            $("#btnAddPatientType").attr('disabled', false);
                            fnFillPatientCategoryInfo();

                            //enableing check boxes
                            Isactivestatus = false;
                            isinsert = false;
                            //disable category dropdown
                            $("#cboSubledgerType").next().attr('disabled', true).selectpicker("refresh");
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
                        $("#pnlPatientTypeCategory").hide();
                    }
                }
            }
        }
    });

    $('#jstPatientType').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstPatientType').jstree().deselect_node(closingNode.children);
    });
    fnTreeSize('#jstPatientType');
};

function fnFillPatientCategoryInfo() {
    if ($("#txtPatientCategoryId").val() != '' && $("#txtPatientCategoryId").val() != undefined) {
        $.ajax({
            async: false,
            url: getBaseURL() + "/PatientType/GetPatientCategoryInfo?PatientTypeId=" + $("#txtPatientTypeId").val() + "&PatientCategoryId=" + $("#txtPatientCategoryId").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                $("#txtPatientTypeId").val('');
                $("#txtPatientTypeId").val(result.PatientTypeId);
                $('#cboSubledgerType').val(result.Description);
                $('#cboSubledgerType').selectpicker('refresh');
                fnBindPatientCategories();
                $('#cboPatientcategory').val(result.PatientCategoryId);
                $('#cboPatientcategory').selectpicker('refresh');
                //$('#cboRateType').val(result.RateType);
                //$('#cboRateType').selectpicker('refresh');

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
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
    };
    var fmParams = eSyaParams.GetJSONValue();
    var _count = 0;
    for (i = 0; i < fmParams.length; i++) {
        if (fmParams[i].ParmAction == false || fmParams[i].ParmAction == "false") {
            _count++;
        }
     }
    if (fmParams.length == _count) {
        fnAlert("w", "EPM_01_00", "", errorMsg.parameterSelect_E6);
        $("#btnAddPatientType").attr('disabled', false);
        return;
    }
    else {
        obj.l_ptypeparams = fmParams;

        $.ajax({
            url: getBaseURL() + '/PatientType/InsertOrUpdatePatientCategory',
            type: 'POST',
            datatype: 'json',
            data: { isinsert: isinsert, obj: obj },
            async: false,
            success: function (response) {
                if (response.Status) {
                    debugger;
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#pnlPatientTypeCategory").hide();
                    $("#jstPatientType").jstree("destroy");
                    LoadPatientTypeTree();
                    prevSelectedID = "";
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
}

function validationPatientCategory() {

    if (IsStringNullorEmpty($("#cboSubledgerType").val()) || $("#cboSubledgerType").val() === "0" || $("#cboSubledgerType").val() === "") {
        fnAlert("w", "EMP_01_00", "UI0188", "Please select Subledger Type");
        return false;
    }
    if (IsStringNullorEmpty($("#cboPatientcategory").val()) || $("#cboPatientcategory").val() === "0" || $("#cboPatientcategory").val() === "") {
        fnAlert("w", "EMP_01_00", "UI0188", errorMsg.SelectCategory_E6);
        return false;
    }
    
}

function fnClearFields() {
    
    $("#txtPatientTypeId").val('');
    $("#cboSubledgerType").val('0');
    $("#cboSubledgerType").selectpicker('refresh');
    $("#cboPatientcategory").val('0');
    $("#cboPatientcategory").selectpicker('refresh');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").attr('disabled', true);
    $("#btnAddPatientType").html('<i class="fa fa-save"></i>  ' + localization.Save);
    $("#btnAddPatientType").attr('disabled', false);
    eSyaParams.ClearValue();
}

function fnExpandAll() {
    $('#jstPatientType').jstree('open_all');
}

function fnCollapseAll() {
    fnClearFields();
    $("#pnlPatientTypeCategory").hide();
    $('#jstPatientType').jstree('close_all');
}

function fnDisableActivecheckboxs() {
    if (Isactivestatus === true) {
        $("input[type=checkbox]").attr('disabled', true);
    }
    if (Isactivestatus === false) {
        $("input[type=checkbox]").attr('disabled', false);
    }
}
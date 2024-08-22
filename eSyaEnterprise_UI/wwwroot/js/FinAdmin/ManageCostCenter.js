var prevSelectedID = "";
var _CostCenterClassID = "";
var _CostCenterID = "";

$(function () {

    $('#chkCCActiveStatus').parent().addClass("is-checked");
    //$("#btnCCAdd").attr("disabled", _userFormRole.IsInsert === false);
    //$("#btnCCDeleteNode").attr("disabled", _userFormRole.IsDelete == false ? false : true);
    fnLoadSACCategoryTree();
    $("#divCostCenterClass,#divCostCenterClassDesc").hide();
});

function fnLoadSACCategoryTree() {
    $("#jstCostCenter").jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/CostCenter/GetCostCenterMenuForTree',
        //url:'',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',

        success: function (result) {
            $("#jstCostCenter").jstree({ core: { data: result, multiple: false } });

            //$("#jstCostCenter").jstree({
            //    core: {

            //        'data': [
            //            { "id": "pa", "parent": "#", "text": "Cost Center Class" },
            //            { "id": "CL", "parent": "pa", "text": "Patient Care" },
            //            { "id": "CD1", "parent": "CL", "text": "Maadi" },
            //            { "id": "CD2", "parent": "CL", "text": "Zayed" },
            //        ],
            //        multiple: false
            //    }
            //});
            //error: function (error) {
            //    alert(error.statusText)
            //}

            

            //fnTreeSize("#jstCostCenter");
            //$(window).on('resize', function () {
            //    fnTreeSize("#jstCostCenter");
            //})
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

    $("#jstCostCenter").on('loaded.jstree', function () {
        $("#jstCostCenter").jstree()._open_to(prevSelectedID);
        $('#jstCostCenter').jstree().select_node(prevSelectedID);
    });
    $('#jstCostCenter').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View,#ViewClass,#AddClassDesc,#ViewClassDesc,#EditClassDesc').remove();
                $('#Edit,#EditClass').remove();
                $('#Add,#AddClass').remove();
                $("#divCostCenterClass").hide();
                debugger;
                var parentNode = $("#jstCostCenter").jstree(true).get_parent(data.node.id);
                _CostCenterClassID = parentNode;
                // If Parent node is selected
                if (parentNode == "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="AddClass" style="padding-left:10px;">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                     $('#AddClass').on('click', function () {
                        //if (_userFormRole.IsInsert === false) {
                        //    $('#divCostCenterClass').hide();
                        //    fnAlert("w", "ECS_06_00", "UIC01", errorMsg.addauth_E1);
                        //    return;
                        //}
                         $("#pnlCostCenterClassDescHeading .mdl-card__title-text").text(localization.AddCostCenterClass);

                        $("#txtCostCenterClassDescription").val('');
                         $('#chkCCClassActiveStatus').parent().addClass("is-checked");
                        $("#btnSaveCCClass").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSaveCCClass").show();
                         _CostCenterID = "0";
                         _CostCenterClassID = data.node.id;
                        $("#divCostCenterClass").show();
                        $("#divCostCenterClassDesc").hide();
                        $("#txtCostCenterClassDescription").attr("disabled", false);
                         $("#chkCCClassActiveStatus").prop("disabled", false);

                    });
                   
                }
                // If Type node is selected
                else if (parentNode == "CL") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="AddClassDesc" style="padding-left:10px;">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="EditClass" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="ViewClass" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                   
                    $('#AddClassDesc').on('click', function () {
                        //if (_userFormRole.IsInsert === false) {
                        //    $('#divCostCenterClass').hide();
                        //    fnAlert("w", "ECS_06_00", "UIC01", errorMsg.addauth_E1);
                        //    return;
                        //}
                        $("#pnlCostCenterClassDescHeading .mdl-card__title-text").text(localization.AddCostCenter);
                         
                        $("#txtCostCenterDescription").val('');
                        $('#chkCCCDActiveStatus').parent().addClass("is-checked");
                        $("#btnSaveCCDesc").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSaveCCDesc").show();
                        _CostCenterID = "0";
                        _CostCenterClassID = data.node.id;
                        $("#divCostCenterClass").hide();
                        $("#divCostCenterClassDesc").show();
                        $("#txtCostCenterClassDescription").attr("disabled", false);
                        $("#chkCCCDActiveStatus").prop("disabled", false);
                        
                    });
                    $('#ViewClass').on('click', function () {
                        //if (_userFormRole.IsView === false) {
                        //    $('#divCostCenterClassDesc').hide();
                        //    fnAlert("w", "ECS_06_00", "UIC03", errorMsg.vieweauth_E3);
                        //    return;
                        //}
                        $("#pnlCostCenterClassDescHeading .mdl-card__title-text").text(localization.ViewCostCenterclass);
                        $("#btnSaveCCClass").hide();
                        _CostCenterClassID = data.node.id;
                        _CostCenterClassID = _CostCenterClassID.substring(1);
                        fnFillCostCentreClass(_CostCenterClassID);
                        $('#chkCCClassActiveStatus').parent().addClass("is-checked");
                        $("#divCostCenterClass").show();
                        $("#divCostCenterClassDesc").hide();
                        $("#chkCCClassActiveStatus").prop("disabled", true);

                    });

                    $('#EditClass').on('click', function () {
                        //if (_userFormRole.IsEdit === false) {
                        //    $('#divCostCenterClassDesc').hide();
                        //    fnAlert("w", "ECS_06_00", "UIC02", errorMsg.editauth_E2);
                        //    return;
                        //}
                        $("#pnlCostCenterClassDescHeading .mdl-card__title-text").text(localization.EditCostCenterclass);
                        $("#btnSaveCCClass").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnSaveCCClass").show();
                        _CostCenterClassID = data.node.id;
                        _CostCenterClassID = _CostCenterClassID.substring(1);
                        fnFillCostCentreClass(_CostCenterClassID);
                        $("#divCostCenterClass").show();
                        $("#divCostCenterClassDesc").hide();
                        $('#chkCCClassActiveStatus').parent().addClass("is-checked");
                        $("#txtCostCenterDescription").prop("disabled", false);
                        $("#chkCCCDActiveStatus").prop("disabled", false);

                    });
                }
                // If Child node is selected
                else {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="EditClassDesc" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="ViewClassDesc" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#ViewClassDesc').on('click', function () {
                        //if (_userFormRole.IsView === false) {
                        //    $('#divCostCenterClassDesc').hide();
                        //    fnAlert("w", "ECS_06_00", "UIC03", errorMsg.vieweauth_E3);
                        //    return;
                        //}
                        $("#pnlCostCenterClassDescHeading .mdl-card__title-text").text(localization.ViewCostCenter);

                        $("#txtCostCenterDescription").attr('disabled',true);
                        $('#chkCCCDActiveStatus').parent().addClass("is-checked");
                        $("#btnSaveCCDesc").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSaveCCDesc").hide();
                        _CostCenterID = data.node.id;
                        _CostCenterID = _CostCenterID.substring(1);
                        fnFillCostCentreCodes(_CostCenterID);
                        $("#divCostCenterClass").hide();
                        $("#divCostCenterClassDesc").show();
                        $("#chkCCCDActiveStatus").prop("disabled", true);
                       
                    });

                    $('#EditClassDesc').on('click', function () {
                        //if (_userFormRole.IsEdit === false) {
                        //    $('#divCostCenterClassDesc').hide();
                        //    fnAlert("w", "ECS_06_00", "UIC02", errorMsg.editauth_E2);
                        //    return;
                        //}
                        $("#pnlCostCenterClassDescHeading .mdl-card__title-text").text(localization.EditCostCenter);

                        $("#txtCostCenterDescription").attr('disabled', false);
                        $('#chkCCCDActiveStatus').parent().addClass("is-checked");
                        $("#btnSaveCCDesc").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSaveCCDesc").show();
                        _CostCenterID = data.node.id;
                        _CostCenterID = _CostCenterID.substring(1);
                        fnFillCostCentreCodes(_CostCenterID);
                        $("#divCostCenterClassDesc").show();
                        $("#txtCostCenterDescription").prop("disabled", false);
                        $("#chkCCCDActiveStatus").prop("disabled", false);
                        
                    });

                }
            }
        }
    });

    $('#jstCostCenter').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstCostCenter').jstree().deselect_node(closingNode.children);
    });

}

function fnFillCostCentreClass(_CostCenterClassID) {

}

function fnFillCostCentreCodes(_CostCenterID) {

}

function fnFillCostCenter(_SACCategoryID) {
    $.ajax({
        url:'',
        
        success: function (result) {
           
        }
    });
}

function fnAddUpdateCostCentreClass() {

    var CCClassDesc = $("#txtCostCenterClassDescription").val();
    if (CCClassDesc == "" || CCClassDesc == null || CCClassDesc == undefined) {
        fnAlert("w", "ECP_03_00", "UI0119", errorMsg.ServiceDesc_E6)
        return false;
    }

    else {
        $("#btnSaveCCClass").attr("disabled", true);
        
        var obj = {
            CostClassDesc: $("#txtCostCenterClassDescription").val(),
            ActiveStatus: $("#chkCCClassActiveStatus").parent().hasClass("is-checked"),
        }
        $.ajax({
            url: getBaseURL() + '/CostCenter/AddOrUpdateCostCenterClass',
            type: 'POST',
            datatype: 'json',
            data: {
                obj
            },
            success: function (response) {
                if (response.Status == true) {
                    if (_CostCenterClassID == 0) {
                        fnAlert("s", "", response.StatusCode, response.Message);
                        $("#txtServiceClassDesc").val('');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                    }
                    else {
                        fnAlert("s", "", response.StatusCode, response.Message);
                    }
                    $("#divCostCenterClass").hide();
                    $("#jstCostCenter").jstree("destroy");
                    fnLoadSACCategoryTree();  
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
                $("#btnSaveCCClass").attr("disabled", false);
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnSaveCCClass").attr("disabled", false);
            }
        });
    }
}

function fnCCExpandAll() {
    $("#jstCostCenter").jstree('open_all');
}
function fnCCCollapseAll() {
    $("#jstCostCenter").jstree('close_all');
    $('#divCostCenterClass').hide();
    $('#divCostCenterClassDesc').hide();
}

function fnClearCCClass() {
    $("#txtCostCenterClassDescription").val('');
    $('#divCostCenterClass').hide();
}
function fnCCClassDesc() {
    $("#txtCostCenterDescription").val('');
    $('#divCostCenterClassDesc').hide();
}
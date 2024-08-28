var prevSelectedID = "";
var _CostCenterClassID = "";
var _CostCenterID = "";
var _isInsert = "";
$(function () {

    $('#chkCCActiveStatus').parent().addClass("is-checked");
    $("#btnCCAdd").attr("disabled", _userFormRole.IsInsert === false ? false : true);
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
            fnTreeSize("#jstCostCenter");

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

                var parentNode = $("#jstCostCenter").jstree(true).get_parent(data.node.id);
                
                // If Parent node is selected
                
                if (parentNode == "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="AddClass" style="padding-left:10px;">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                     $('#AddClass').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $('#divCostCenterClass').hide();
                            fnAlert("w", "ECS_06_00", "UIC01", errorMsg.addauth_E1);
                            return;
                        }
                         $("#pnlCostCenterClassDescHeading .mdl-card__title-text").text(localization.AddCostCenterClass);

                        $("#txtCostCenterClassDescription").val('');
                         $('#chkCCClassActiveStatus').parent().addClass("is-checked");
                        $("#btnSaveCCClass").html("<i class='fa fa-save'></i> " + localization.Save);
                         $("#btnSaveCCClass").show();
                         _CostCenterID = 0;
                         _CostCenterClassID = "0";
                         _CostCenterClassID = data.node.id;
                        $("#divCostCenterClass").show();
                        $("#divCostCenterClassDesc").hide();
                        $("#txtCostCenterClassDescription").attr("disabled", false);
                         $("#chkCCClassActiveStatus").prop("disabled", false);
                         _isInsert = 1;
                    });
                   
                }
                // If Type node is selected
                else if (parentNode.substring(0,2) == "HD") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="AddClassDesc" style="padding-left:10px;">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="EditClass" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="ViewClass" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                   
                    $('#AddClassDesc').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $('#divCostCenterClass').hide();
                            fnAlert("w", "ECS_06_00", "UIC01", errorMsg.addauth_E1);
                            return;
                        }
                        $("#pnlCostCenterClassDescHeading .mdl-card__title-text").text(localization.AddCostCenter);
                        $("#txtCostCenterDescription").prop("disabled", false);
                        $("#txtCostCenterDescription").val('');
                        $('#chkCCCDActiveStatus').parent().addClass("is-checked");
                        $("#btnSaveCCDesc").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSaveCCDesc").show();
                        _CostCenterID = 0;
                        _CostCenterClassID = "0";
                        _CostCenterClassID = data.node.id;
                        _CostCenterClassID = _CostCenterClassID.substring(2);
                        
                        $("#divCostCenterClass").hide();
                        $("#divCostCenterClassDesc").show();
                        $("#txtCostCenterClassDescription").attr("disabled", false);
                        $("#chkCCCDActiveStatus").prop("disabled", false);
                        _isInsert = 1;
                    });
                    $('#ViewClass').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#divCostCenterClassDesc').hide();
                            fnAlert("w", "ECS_06_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        $("#pnlCostCenterClassDescHeading .mdl-card__title-text").text(localization.ViewCostCenterclass);
                        $("#btnSaveCCClass").hide();
                        _CostCenterID = 0;
                        _CostCenterClassID = "0";
                        _CostCenterClassID = data.node.id;
                        _CostCenterClassID = _CostCenterClassID.substring(2);
                        
                        $('#chkCCClassActiveStatus').parent().addClass("is-checked");
                        $("#divCostCenterClass").show();
                        $("#divCostCenterClassDesc").hide();
                        $("#chkCCClassActiveStatus").prop("disabled", true);
                        fnFillCostCentreClass(_CostCenterClassID);
                        _isInsert = 0;
                    });

                    $('#EditClass').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#divCostCenterClassDesc').hide();
                            fnAlert("w", "ECS_06_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $("#pnlCostCenterClassDescHeading .mdl-card__title-text").text(localization.EditCostCenterclass);
                        $("#btnSaveCCClass").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnSaveCCClass").show();
                        _CostCenterID = 0;
                        _CostCenterClassID = "0";
                        _CostCenterClassID = data.node.id;
                        _CostCenterClassID = _CostCenterClassID.substring(2);
                        
                        $("#divCostCenterClass").show();
                        $("#divCostCenterClassDesc").hide();
                        $('#chkCCClassActiveStatus').parent().addClass("is-checked");
                        $("#txtCostCenterDescription").prop("disabled", false);
                        $("#chkCCCDActiveStatus").prop("disabled", false);

                        fnFillCostCentreClass(_CostCenterClassID);
                        _isInsert = 0;
                    });
                }
                // If Child node is selected
                else {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="EditClassDesc" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="ViewClassDesc" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#ViewClassDesc').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#divCostCenterClassDesc').hide();
                            fnAlert("w", "ECS_06_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        $("#pnlCostCenterClassDescHeading .mdl-card__title-text").text(localization.ViewCostCenter);

                        $("#txtCostCenterDescription").attr('disabled',true);
                        $('#chkCCCDActiveStatus').parent().addClass("is-checked");
                        $("#btnSaveCCDesc").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSaveCCDesc").hide();

                        _CostCenterID = 0;
                        _CostCenterClassID = 0;
                        _CostCenterID = data.node.id;
                        _CostCenterID = _CostCenterID.substring(2);

                        var parentNode = $("#jstCostCenter").jstree(true).get_parent(data.node.id);
                        
                        _CostCenterClassID = parentNode;
                        _CostCenterClassID = _CostCenterClassID.substring(2);
                        $("#divCostCenterClass").hide();
                        $("#divCostCenterClassDesc").show();
                        $("#chkCCCDActiveStatus").prop("disabled", true);
                        fnFillCostCentreCodes(_CostCenterID);
                        _isInsert = 0;
                    });

                    $('#EditClassDesc').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#divCostCenterClassDesc').hide();
                            fnAlert("w", "ECS_06_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $("#pnlCostCenterClassDescHeading .mdl-card__title-text").text(localization.EditCostCenter);

                        $("#txtCostCenterDescription").attr('disabled', false);
                        $('#chkCCCDActiveStatus').parent().addClass("is-checked");
                        $("#btnSaveCCDesc").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSaveCCDesc").show();

                        _CostCenterID = 0;
                        _CostCenterClassID = 0;
                        _CostCenterID = data.node.id;
                        _CostCenterID = _CostCenterID.substring(2);

                        var parentNode = $("#jstCostCenter").jstree(true).get_parent(data.node.id);
                        
                        _CostCenterClassID = parentNode;
                        _CostCenterClassID = _CostCenterClassID.substring(2);

                        $("#divCostCenterClassDesc").show();
                        $("#txtCostCenterDescription").prop("disabled", false);
                        $("#chkCCCDActiveStatus").prop("disabled", false);
                        fnFillCostCentreCodes(_CostCenterID);
                        _isInsert = 0;
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
    $.ajax({
        url: getBaseURL() + '/CostCenter/GetCostCenterClassByCode',
        data: {
            CostCenterClass: _CostCenterClassID
        },
        success: function (result) {            
            $("#txtCostCenterClassDescription").val(result[0].CostClassDesc);
            if (result[0].ActiveStatus == true)
                $('#chkCCClassActiveStatus').parent().addClass("is-checked");
            else
                $('#chkCCClassActiveStatus').parent().removeClass("is-checked");
            
        }
    });
}
function fnFillCostCentreCodes(_CostCenterID) {
    $.ajax({
        url: getBaseURL() + '/CostCenter/GetCostCenterCodes',
        data: {
            CostCentreCode: _CostCenterID
        },
        success: function (result) {
            debugger;
            $("#txtCostCenterDescription").val(result[0].CostCenterDesc);
            if (result[0].ActiveStatus == true)
                $('#chkCCCDActiveStatus').parent().addClass("is-checked");
            else
                $('#chkCCCDActiveStatus').parent().removeClass("is-checked");
        }
    });
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
        fnAlert("w", "EFA_01_00", "UI0119", errorMsg.CostCentreClassDesc_E6)
        return false;
    }

    else {
        $("#btnSaveCCClass").attr("disabled", true);
        
        var obj = {
            IsInsert: _isInsert,
            CostCenterClass: _CostCenterClassID,
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
                        $("#txtCostCenterClassDescription").val('');
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

function fnAddUpdateCostCentreCodes() {
    var CCCodesDesc = $("#txtCostCenterDescription").val();
    if (CCCodesDesc == "" || CCCodesDesc == null || CCCodesDesc == undefined) {
        fnAlert("w", "EFA_01_00", "UI0119", errorMsg.ServiceDesc_E6)
        return false;
    }

    else {
        $("#btnSaveCCDesc").attr("disabled", true);

        var obj = {
            IsInsert: _isInsert,
            CostCenterCode: _CostCenterID,
            CostCenterDesc: $("#txtCostCenterDescription").val(),
            CostCenterClass: _CostCenterClassID,
            ActiveStatus: $("#chkCCCDActiveStatus").parent().hasClass("is-checked"),
        }
        $.ajax({
            url: getBaseURL() + '/CostCenter/AddOrUpdateCostCenterCodes',
            type: 'POST',
            datatype: 'json',
            data: {
                obj
            },
            success: function (response) {
                if (response.Status == true) {
                    if (_CostCenterID == 0) {
                        fnAlert("s", "", response.StatusCode, response.Message);
                        $("#txtCostCenterDescription").val('');
                        $('#chkCCCDActiveStatus').parent().addClass("is-checked");
                    }
                    else {
                        fnAlert("s", "", response.StatusCode, response.Message);
                    }
                    $("#divCostCenterClassDesc").hide();
                    $("#jstCostCenter").jstree("destroy");
                    fnLoadSACCategoryTree();
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
                $("#btnSaveCCDesc").attr("disabled", false);
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnSaveCCDesc").attr("disabled", false);
            }
        });
    }
}

function fnDeleteNode() {
    if (_CostCenterClassID != 0 && _CostCenterID != 0)
        fnDeleteCostCentreCodes();
    else if (_CostCenterClassID != 0 && _CostCenterID == 0)
        fnDeleteCostCentreClass();
    else {
        fnAlert("w", "EFA_01_00", "UI0119", errorMsg.ServiceDesc_E6)
        return false;
    }
}

function fnDeleteCostCentreClass() {
    if (_CostCenterClassID == "" || _CostCenterClassID == null || _CostCenterClassID == undefined) {
        fnAlert("w", "EFA_01_00", "UI0119", errorMsg.ServiceDesc_E6)
        return false;
    }

    else {
        $("#btnCCDeleteNode").attr("disabled", true);

        $.ajax({
            url: getBaseURL() + '/CostCenter/DeleteCostCenterClass',
            type: 'POST',
            datatype: 'json',
            data: {
                CostCenterClass: _CostCenterClassID
            },
            success: function (response) {
                if (response.Status == true) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#divCostCenterClass").hide();
                    $("#divCostCenterClassDesc").hide();
                    $("#jstCostCenter").jstree("destroy");
                    fnLoadSACCategoryTree();
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
                $("#btnCCDeleteNode").attr("disabled", false);
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnCCDeleteNode").attr("disabled", false);
            }
        });
    }
}

function fnDeleteCostCentreCodes() {
    if (_CostCenterID == "" || _CostCenterID == null || _CostCenterID == undefined) {
        fnAlert("w", "EFA_01_00", "UI0119", errorMsg.ServiceDesc_E6)
        return false;
    }

    else {
        $("#btnCCDeleteNode").attr("disabled", true);

        $.ajax({
            url: getBaseURL() + '/CostCenter/DeleteCostCenter',
            type: 'POST',
            datatype: 'json',
            data: {
                CostCenterCode: _CostCenterID
            },
            success: function (response) {
                if (response.Status == true) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#divCostCenterClass").hide();
                    $("#divCostCenterClassDesc").hide();
                    $("#jstCostCenter").jstree("destroy");
                    fnLoadSACCategoryTree();
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
                $("#btnCCDeleteNode").attr("disabled", false);
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnCCDeleteNode").attr("disabled", false);
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
var SACCodesID = "0";
var ServiceGroupID = "0";
var CodesParentID = "0";
var prevSelectedID = '';
var flag = "f";
var SACClassID = "0";
var SACCategoryID = "0";    
var _isInsert = false;
var ClassParentID = "0";
$(document).ready(function () {
 
    $('#chkSACCodesActiveStatus').parent().addClass("is-checked");
    $("#btnSCAdd").attr("disabled", _userFormRole.IsInsert === false);
    $("#btnDelete").attr("disabled", _userFormRole.IsDelete === false);
});
function fnISDCountryCode_onChange() {
    $("#dvSACCodes").hide();
    var _ISDCode = $("#cboSACCodesIsdcode").val();
    if (_ISDCode != 0) {
        fnLoadSACCodesTree();
    }
}

$(window).on('resize', function () {
    fnTreeSize("#jstSACCodesTree");
})

function fnLoadSACCodesTree() {

    $("#jstSACCodesTree").jstree("destroy");

    $.ajax({
        url: getBaseURL() + '/SACCodes/GetSACCodes?ISDCode=' + $("#cboSACCodesIsdcode").val(),
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#jstSACCodesTree").jstree({ core: { data: result, multiple: false } });
        },
        error: function (error) {
            alert(error.statusText)
        }
    });
    $("#jstSACCodesTree").on('loaded.jstree', function () {
        $("#jstSACCodesTree").jstree()._open_to(prevSelectedID);
        $('#jstSACCodesTree').jstree().select_node(prevSelectedID);
    });

    $('#jstSACCodesTree').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvSACCodes").hide();


                var parentNode = $("#jstSACCodesTree").jstree(true).get_parent(data.node.id);

                // If Root is selected
                if (parentNode == '#') {
                    SACCategoryID = "0";
                    $("#dvSACCodes").hide();
                }
                // If Service Type node is selected
                else if (parentNode == 'SC') {
                    $("#dvSACCodes").hide();
                    SACCategoryID = "0";
                }
                // If Service Group node is selected
                else if (parentNode.startsWith('T')) {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')

                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $('#dvSACCodes').hide();
                            fnAlert("w", "ECS_07_00", "UIC01", errorMsg.addauth_E1);
                            return;
                        }
                      
                        $("#pnlAddSACCodes .mdl-card__title-text").text("Add SAC Codes");
                        $("#txtServiceClassDesc").val('');
                        /*  $('#chkBaseRateApplicable').parent().removeClass("is-checked");*/
                        $('#chkSACCodesActiveStatus').parent().addClass("is-checked");
                        $("#btnSCAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#chkSACCodesActiveStatus").prop("disabled", true);
                        $("#btnSCAdd").show();
                        $("#dvSACCodes").show();
                        /*ServiceClassID = "0";*/
                        SACCodesID = "0";
                        SACCategoryID = data.node.id;
                        SACClassID = parentNode.substring(1);

                        $("#txtSACClass").val('');
                        $("#txtSACCategory").val('');
                        $("#txtSACClass").val(SACClassID);
                        $("#txtSACCategory").val(SACCategoryID);
                        _isInsert = true;
                        $("#txtSACCodes").val('');
                        $("#txtSACCodesDesc").val('');
                        $("#txtSACCodes").attr("disabled", false);
                        $("#txtSACCodesDesc").attr("disabled", false);
                    });
                }
                // If Service Class node is selected
                else {
                    /*$('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i> </span>')*/
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:5px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i> </span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:5px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i> </span>')
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $('#dvSACCodes').hide();
                            fnAlert("w", "ECS_07_00", "UIC01", errorMsg.addauth_E1);
                            return;
                        }
                        $("#txtSACCodes").val('');
                        $("#txtSACCodesDesc").val('');
                        $("#txtSACCodes").attr("disabled", false);
                        $("#txtSACCodesDesc").attr("disabled", false);
                        $("#chkSACCodesActiveStatus").prop("disabled", true);
                        $("#pnlAddSACCodes .mdl-card__title-text").text("Add SAC Codes");
                        $('#chkSACCodesActiveStatus').parent().addClass("is-checked");
                        $("#btnSCAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSCAdd").show();
                        $("#dvSACCodes").show();
                        /*  ServiceClassID = "0";*/
                        SACCodesID = "0";
                        SACCategoryID = parentNode;
                        SACClassID = parentNode.substring(1);

                        $("#txtSACClass").val('');
                        $("#txtSACCategory").val('');
                        $("#txtSACClass").val(SACClassID);
                        $("#txtSACCategory").val(SACCategoryID);
                        _isInsert = true;
                        while (SACCategoryID.startsWith('C')) {
                            SACCategoryID = $("#jstSACCodesTree").jstree(true).get_parent(SACCategoryID);
                        };

                        ClassParentID = data.node.id.substring(1);

                    });
                    $('#View').on('click', function () {
                       
                        if (_userFormRole.IsView === false) {
                            $('#dvSACCodes').hide();
                            fnAlert("w", "ECS_07_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }

                        $("#txtSACCodes").attr("disabled", true);
                        $("#txtSACCodesDesc").attr("disabled", true);
                        $("#chkSACCodesActiveStatus").prop("disabled", true);
                        $("#pnlAddSACCodes .mdl-card__title-text").text("View SAC Codes");
                        $("#btnSCAdd").hide();
                        $("#dvSACCodes").show();
                        //ServiceClassID = data.node.id;
                        //ServiceClassID = ServiceClassID.substring(1);
                        //fnFillSACCodesDetail(ServiceClassID);
                        SACCodesID = data.node.id;
                        SACCodesID = SACCodesID.substring(1);
                        fnFillSACCodesDetail(SACCodesID);
                        _isInsert = false;
                    });

                    $('#Edit').on('click', function () {
                      
                        if (_userFormRole.IsEdit === false) {
                            $('#dvSACCodes').hide();
                            fnAlert("w", "ECS_07_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $("#txtSACCodes").attr("disabled", true);
                        $("#txtSACCodesDesc").attr("disabled", false);
                        $("#txtServiceClassDesc").prop("disabled", false);
                        $("#chkSACCodesActiveStatus").prop("disabled", true);
                        $("#pnlAddSACCodes .mdl-card__title-text").text("Edit SAC Codes");
                        $("#btnSCAdd").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnSCAdd").show();
                        $("#dvSACCodes").show();
                        //ServiceClassID = data.node.id;
                        //ServiceClassID = ServiceClassID.substring(1);
                        //fnFillSACCodesDetail(ServiceClassID);
                        SACCodesID = data.node.id;
                        SACCodesID = SACCodesID.substring(1);
                        fnFillSACCodesDetail(SACCodesID);
                        _isInsert = false;
                    });
                }

            }
        }

    });
    $('#jstSACCodesTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstSACCodesTree').jstree().deselect_node(closingNode.children);
    });
    fnTreeSize("#jstSACCodesTree");
}
function fnFillSACCodesDetail(SACCodesID) {
    $.ajax({
        url: getBaseURL() + '/SACCodes/GetSACCodeByCode?ISDCode=' + $("#cboSACCodesIsdcode").val()
            + '&SACCodeID=' + SACCodesID,
       
        success: function (result) {
            $("#txtSACClass").val('');
            $("#txtSACCategory").val('');
            $("#txtSACClass").val(result.Sacclass);
            $("#txtSACCategory").val(result.Saccategory);
            $("#txtSACCodes").val(result.Saccode);
            $("#txtSACCodesDesc").val(result.Sacdescription);
            if (result.ActiveStatus == true)
                $('#chkSACCodesActiveStatus').parent().addClass("is-checked");
            else
                $('#chkSACCodesActiveStatus').parent().removeClass("is-checked");
           
        }
    });

}
function fnAddOrUpdateSACCodes() {
   
    var txtSACCodes = $("#txtSACCodes").val()
    var txtSACCodesDesc = $("#txtSACCodesDesc").val()
    if ($("#txtSACClass").val() == "" || $("#txtSACClass").val() == null || $("#txtSACClass").val() == undefined) {
        fnAlert("w", "ECS_06_00", "UI0366", "SAC Class has not Selected");
        return;
    }
    if ($("#txtSACCategory").val() == "" || $("#txtSACCategory").val() == null || $("#txtSACCategory").val() == undefined) {
        fnAlert("w", "ECS_06_00", "UI0366", "SAC Category has not Selected");
        return;
    }
    if (txtSACCodes == "" || txtSACCodes == null || txtSACCodes == undefined) {
        fnAlert("w", "ECS_06_00", "UI0366", "Please enter SAC Code");
        return;
    }
    if (txtSACCodesDesc == "" || txtSACCodesDesc == null || txtSACCodesDesc == undefined) {
        fnAlert("w", "ECS_06_00", "UI0366", "Please enter SAC Codes description");
        return;
    }

    
    else {


        $("#btnSCAdd").attr("disabled", true);
        var obj = {
            Isdcode: $("#cboSACCodesIsdcode").val(),
            Sacclass: $("#txtSACClass").val(),
            Saccategory: $("#txtSACCategory").val(),
            Saccode: $("#txtSACCodes").val(),
            Sacdescription: $("#txtSACCodesDesc").val(),
            //ParentID: CodesParentID,
            ActiveStatus: $("#chkSACCodesActiveStatus").parent().hasClass("is-checked"),
            _isInsert: _isInsert
        }
        $.ajax({
            url: getBaseURL() + '/SACCodes/InsertOrUpdateSACCode',
            type: 'POST',
            datatype: 'json',
            data: {
                obj
            },
            success: function (response) {
                if (response.Status == true) {
                    $('#dvSACCodes').hide();
                    $("#txtSACClass").val('');
                    $("#txtSACCategory").val('');
                    $("#txtSACCodes").val('');
                    $("#txtSACCodesDesc").val('');
                    $('#chkSACCodesActiveStatus').parent().addClass("is-checked");
                    $("#jstSACCodesTree").jstree("destroy");
                    fnLoadSACCodesTree();
                    $("#btnSCAdd").attr("disabled", false);
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
                $("#btnSCAdd").attr("disabled", false);
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnSCAdd").attr("disabled", false);
            }
        });
    }
}
function fnSACCodesExpandAll() {
    $("#jstSACCodesTree").jstree('open_all');
}
function fnSACCodesCollapseAll() {
    $("#jstSACCodesTree").jstree('close_all');
    $('#dvSACCodes').hide();
}
 
function fnDeleteNode() {
    debugger;
    if (_userFormRole.IsDelete === false) {
        fnAlert("w", "ECS_07_00", "UIC04", errorMsg.deleteauth_E4);
        return;
    }
    var selectedNode = $('#jstSACCodesTree').jstree().get_selected(true);

    if (selectedNode.length != 1) {
        fnAlert("w", "ECS_07_00", "UI0121", "Select SAC Codes to delete");
    }
    else {

        selectedNode = selectedNode[0];

        if (!selectedNode.id.startsWith("C")) {
            fnAlert("w", "ECS_07_00", "UI0121", "Delete first node");
        }
        else {
           
            var SACCode = selectedNode.id.substring(1);

            $("#btnDelete").attr("disabled", true);
            if (confirm(localization.Doyouwanttodeletenode + selectedNode.text + ' ?')) {

                $.ajax({
                    url: getBaseURL() + '/SACCodes/DeleteSACCode?ISDCode=' + $("#cboSACCodesIsdcode").val() + '&SACCodeID=' + SACCode,
                    type: 'GET',
                    datatype: 'json',
                    success: function (response) {
                        if (response.Status === true) {
                            fnAlert("s", "", response.StatusCode, response.Message);
                            $("#jstSACCodesTree").jstree("destroy");
                            fnLoadSACCodesTree();
                        }
                        else {
                            fnAlert("e", "", response.StatusCode, response.Message);
                        }
                        $("#btnDelete").attr("disabled", false);
                    },
                    error: function (error) {
                        fnAlert("e", "", error.StatusCode, error.statusText);
                        $("#btnDelete").attr("disabled", false);
                    }
                });
            }
        }
    }
}


function fnClearSACCodes() {

    $("#txtSACClass").val('');
    $("#txtSACCategory").val('');
    $("#txtSACCodes").val('');
    $("#txtSACCodesDesc").val('');
    $("#dvSACCodes").hide();
}
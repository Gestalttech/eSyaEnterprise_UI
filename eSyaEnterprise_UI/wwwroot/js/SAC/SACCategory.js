var _SACCategoryID = "0";
var _SACClassID = "0";
var prevSelectedID = '';
var _isInsert = false;
$(document).ready(function () {
   
    $('#chkSACCategoryActiveStatus').parent().addClass("is-checked");
    $("#btnSGAdd").attr("disabled", _userFormRole.IsInsert === false);
    $("#btnDelete").attr("disabled", _userFormRole.IsDelete == false ? false:true);

});
function fnISDCountryCode_onChange() {
    
    var _ISDCode = $("#cboSACGIsdcode").val();
    if (_ISDCode != 0) {
        fnLoadSACCategoryTree();
    }
}
function fnLoadSACCategoryTree() {
    $("#jstSACCategoryTree").jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/SACCategory/GetSACCategories?ISDCode=' + $("#cboSACGIsdcode").val(),
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
       
        success: function (result) {
            $("#jstSACCategoryTree").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstSACCategoryTree");
            $(window).on('resize', function () {
                fnTreeSize("#jstSACCategoryTree");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

    $("#jstSACCategoryTree").on('loaded.jstree', function () {
        $("#jstSACCategoryTree").jstree()._open_to(prevSelectedID);
        $('#jstSACCategoryTree').jstree().select_node(prevSelectedID);
    });
    $('#jstSACCategoryTree').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvSACCategory").hide();
                debugger;
                var parentNode = $("#jstSACCategoryTree").jstree(true).get_parent(data.node.id);
                _SACClassID = parentNode;
                // If Parent node is selected
                if (parentNode == "#") {
                    $("#dvSACCategory").hide();
                }
                // If Type node is selected
                else if (parentNode == "SG") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#555555"aria-hidden="true"></i></span>')
                    
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $('#dvSACCategory').hide();
                            fnAlert("w", "ECS_06_00", "UIC01", errorMsg.addauth_E1);
                            return;
                        }
                        $("#pnlAddSACCategory .mdl-card__title-text").text(localization.AddSACCategory);
                        $("#txtSACCategory").val('');
                        $("#txtSACCategoryDescription").val('');
                        $('#chkSACCategoryActiveStatus').parent().addClass("is-checked");
                        $("#btnSGAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSGAdd").show();
                        _SACCategoryID = "0";
                        _SACClassID = data.node.id;
                        $("#dvSACCategory").show();
                        $("#txtSACCategory").attr("disabled", false);
                        $("#txtSACCategoryDescription").prop("disabled", false);
                        $("#chkSACCategoryActiveStatus").prop("disabled", false);
                        _isInsert = true;
                    });
                }
                // If Child node is selected
                else {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#555555"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#555555"aria-hidden="true"></i></span>')
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#dvSACCategory').hide();
                            fnAlert("w", "ECS_06_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        $("#pnlAddSACCategory .mdl-card__title-text").text(localization.ViewSACCategory);
                        $("#btnSGAdd").hide();
                        _SACCategoryID = data.node.id;
                        _SACCategoryID = _SACCategoryID.substring(1);
                        fnFillServiceCategoryDetail(_SACCategoryID);
                        $("#dvSACCategory").show();
                        $("#txtSACCategory").prop("disabled", true);
                        $("#txtSACCategoryDescription").prop("disabled", true);
                        $("#chkSACCategoryActiveStatus").prop("disabled", true);
                        _isInsert = false;
                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvSACCategory').hide();
                            fnAlert("w", "ECS_06_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $("#pnlAddSACCategory .mdl-card__title-text").text(localization.EditSACCategory);
                        $("#btnSGAdd").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnSGAdd").show();
                        _SACCategoryID = data.node.id;
                        _SACCategoryID = _SACCategoryID.substring(1);
                        fnFillServiceCategoryDetail(_SACCategoryID);
                        $("#dvSACCategory").show();

                        $("#txtSACCategory").attr("disabled", true);
                        $("#txtSACCategoryDescription").prop("disabled", false);
                        $("#chkSACCategoryActiveStatus").prop("disabled", false);
                        _isInsert = false;
                    });

                }
            }
        }
    });

    $('#jstSACCategoryTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstSACCategoryTree').jstree().deselect_node(closingNode.children);
    });

}
function fnFillServiceCategoryDetail(_SACCategoryID) {
    $.ajax({
        url: getBaseURL() + '/SACCategory/GetSACCategoryByCategoryID?ISDCode=' + $("#cboSACGIsdcode").val() + '&SACClassID=' + _SACClassID + '&SACCategoryID=' + _SACCategoryID,
        success: function (result) {
            $("#txtSACCategory").val(result.Saccategory);
            $("#txtSACCategoryDescription").val(result.SaccategoryDesc);
             
            if (result.ActiveStatus == true)
                $('#chkSACCategoryActiveStatus').parent().addClass("is-checked");
            else
                $('#chkSACCategoryActiveStatus').parent().removeClass("is-checked");
        }
    });
}
function fnAddOrUpdateSACCategory() {
    var txtSACCategory = $("#txtSACCategory").val()
    var txtSACCategoryDescription = $("#txtSACCategoryDescription").val()

    if (txtSACCategory == "" || txtSACCategory == null || txtSACCategory == undefined) {
        fnAlert("w", "ECS_06_00", "UI0366","Please enter SAC category");
        return false;
    }
    if (txtSACCategoryDescription == "" || txtSACCategoryDescription == null || txtSACCategoryDescription == undefined) {
        fnAlert("w", "ECS_06_00", "UI0366", "Please enter SAC category description");
        return false;
    }

   
        $("#btnSGAdd").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/SACCategory/InsertOrUpdateSACCategory',
            type: 'POST',
            datatype: 'json',
            data: {
                Isdcode: $("#cboSACGIsdcode").val(),
                Sacclass: _SACClassID,
                Saccategory: $("#txtSACCategory").val(), 
                SaccategoryDesc: $("#txtSACCategoryDescription").val(),
                ActiveStatus: $("#chkSACCategoryActiveStatus").parent().hasClass("is-checked"),
                _isInsert: _isInsert
            },
           
            success: function (response) {
                if (response.Status == true) {

                    fnAlert("s", "", response.StatusCode, response.Message);
                    $('#dvSACCategory').hide();
                    $("#txtSACCategory").val('');
                    $("#txtSACCategoryDescription").val('');
                    $('#chkSACCategoryActiveStatus').parent().addClass("is-checked");
                    $("#jstSACCategoryTree").jstree("destroy");
                    fnLoadSACCategoryTree();
                    $("#btnSGAdd").attr("disabled", false);
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
                $("#btnSGAdd").attr("disabled", false);
            },
           
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnSGAdd").attr("disabled", false);
            }
        });
    
}
function fnSACAExpandAll() {
    $("#jstSACCategoryTree").jstree('open_all');
}
function fnSACACollapseAll() {
    $("#jstSACCategoryTree").jstree('close_all');
    $('#dvSACCategory').hide();
}

 
function fnSACCategoryDeleteNode() {
    if (_userFormRole.IsDelete === false) {
        fnAlert("w", "ECS_06_00", "UIC04", errorMsg.deleteauth_E4);
        return;
    }
    if ($("#cboSACGIsdcode").val() == 0 || $("#cboSACGIsdcode").val() == '0' || IsStringNullorEmpty($("#cboSACGIsdcode").val())) {
        fnAlert("w", "ECS_06_00", "UI0119", "Please Select ISD Code");
        return;
    }
    var selectedNode = $('#jstSACCategoryTree').jstree().get_selected(true);

    if (selectedNode.length != 1) {
        fnAlert("w", "ECS_06_00", "UI0118", errorMsg.ServiceCategoryDelete_E9);
    }
    else {

        selectedNode = selectedNode[0];

        if (!selectedNode.id.startsWith("G")) {
            fnAlert("w", "ECS_06_00", "UI0118", errorMsg.ServiceCategoryDelete_E9);
        }
        else {
           
           var SACCategoryID = selectedNode.id.substring(1);

            $("#btnDelete").attr("disabled", true);
            if (confirm(localization.Doyouwanttodeletenode + selectedNode.text + ' ?')) {

                $.ajax({
                    url: getBaseURL() + '/SACCategory/DeleteSACCategory?ISDCode=' + $("#cboSACGIsdcode").val() + '&SACClassID=' + _SACClassID + '&SACCategoryID=' + SACCategoryID,
                    type: 'POST',
                    datatype: 'json',
                    success: function (response) {
                        if (response.Status) {
                            fnAlert("s", "", response.StatusCode, response.Message);
                            $("#jstSACCategoryTree").jstree("destroy");
                            fnLoadSACCategoryTree();
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
function fnClearSACCategory() {
    $("#txtSACCategory").val('');
    $("#txtSACCategoryDescription").val('');
    $('#chkSACCategoryActiveStatus').parent().removeClass('is-checked');
    $("#dvSACCategory").hide();
}
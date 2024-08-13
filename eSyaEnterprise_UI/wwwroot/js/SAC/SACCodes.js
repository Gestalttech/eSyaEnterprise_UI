var SACCodesID = "0";
var ServiceGroupID = "0";
var CodesParentID = "0";
var prevSelectedID = '';
var flag = "f";
$(document).ready(function () {
    fnLoadSACCodesTree();
    /*  $('#chkBaseRateApplicable').parent().removeClass("is-checked");*/
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSCAdd").attr("disabled", _userFormRole.IsInsert === false);
});
$(window).on('resize', function () {
    fnTreeSize("#jstSACCodesTree");
})
function fnLoadSACCodesTree() {
    $.ajax({
        url: getBaseURL() + '/SAC/GetSACCodes?ISDCode=' + $("#SACCodesIsdcode").val(),
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
                    ServiceGroupID = "0";
                    $("#dvSACCodes").hide();
                }
                // If Service Type node is selected
                else if (parentNode == 'SC') {
                    $("#dvSACCodes").hide();
                    ServiceGroupID = "0";
                }
                // If Service Group node is selected
                else if (parentNode.startsWith('T')) {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i Codes="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $('#dvSACCodes').hide();
                            fnAlert("w", "ECS_07_00", "UIC01", errorMsg.addauth_E1);
                            return;
                        }

                        $("#pnlAddSACCodes .mdl-card__title-text").text(localization.AddSACCodes);
                        $("#txtSACCodesDesc").val('');
                        /*  $('#chkBaseRateApplicable').parent().removeClass("is-checked");*/
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        $("#btnSCAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSCAdd").show();
                        $("#dvSACCodes").show();
                        SACCodesID = "0";
                        ServiceGroupID = data.node.id;
                        eSyaParams.ClearValue();
                    });
                }
                // If Service Codes node is selected
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
                        $("#txtSACCodesDesc").prop("disabled", false);
                        /* $("#chkBaseRateApplicable").prop("disabled", false);*/
                        $("#chkActiveStatus").prop("disabled", false);
                        $("#dvParameters").removeClass("disable-Param");
                        $("#pnlAddSACCodes .mdl-card__title-text").text(localization.AddSACCodes);
                        $("#txtSACCodesDesc").val('');
                        /* $('#chkBaseRateApplicable').parent().removeClass("is-checked");*/
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        $("#btnSCAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSCAdd").show();
                        $("#dvSACCodes").show();
                        SACCodesID = "0";
                        ServiceGroupID = parentNode;
                        while (ServiceGroupID.startsWith('C')) {
                            ServiceGroupID = $("#jstSACCodesTree").jstree(true).get_parent(ServiceGroupID);
                        };
                        eSyaParams.ClearValue();
                        CodesParentID = data.node.id.substring(1);

                    });
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#dvSACCodes').hide();
                            fnAlert("w", "ECS_07_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        $("#txtSACCodesDesc").prop("disabled", true);
                        /* $("#chkBaseRateApplicable").prop("disabled", true);*/
                        $("#chkActiveStatus").prop("disabled", true);
                        $("#dvParameters").addClass("disable-Param");
                        $("#pnlAddSACCodes .mdl-card__title-text").text(localization.ViewSACCodes);
                        $("#btnSCAdd").hide();
                        $("#dvSACCodes").show();
                        SACCodesID = data.node.id;
                        SACCodesID = SACCodesID.substring(1);
                        fnFillSACCodesDetail(SACCodesID);

                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvSACCodes').hide();
                            fnAlert("w", "ECS_07_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $("#txtSACCodesDesc").prop("disabled", false);
                        /* $("#chkBaseRateApplicable").prop("disabled", false);*/
                        $("#chkActiveStatus").prop("disabled", false);
                        $("#dvParameters").removeClass("disable-Param");
                        $("#pnlAddSACCodes .mdl-card__title-text").text(localization.EditSACCodes);
                        $("#btnSCAdd").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnSCAdd").show();
                        $("#dvSACCodes").show();
                        SACCodesID = data.node.id;
                        SACCodesID = SACCodesID.substring(1);
                        fnFillSACCodesDetail(SACCodesID);

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
        url: getBaseURL() + '/Services/GetSACCodesByID',
        data: {
            SACCodesID: SACCodesID
        },
        success: function (result) {
            $("#txtSACCodesDesc").val(result.SACCodesDesc);
            //if (result.IsBaseRateApplicable == true)
            //    $('#chkBaseRateApplicable').parent().addClass("is-checked");
            //else
            //    $('#chkBaseRateApplicable').parent().removeClass("is-checked");
            if (result.ActiveStatus == true)
                $('#chkActiveStatus').parent().addClass("is-checked");
            else
                $('#chkActiveStatus').parent().removeClass("is-checked");
            eSyaParams.ClearValue();
            eSyaParams.SetJSONValue(result.l_CodesParameter);
        }
    });

}
function fnAddOrUpdateSACCodes() {

    var txtSACCodesDesc = $("#txtSACCodesDesc").val();
    if (txtSACCodesDesc == "" || txtSACCodesDesc == null || txtSACCodesDesc == undefined) {
        fnAlert("w", "ECS_07_00", "UI0119", errorMsg.ServiceDesc_E6)
        return false;
    }

    else {


        $("#btnSCAdd").attr("disabled", true);
        var cPar = eSyaParams.GetJSONValue();
        var obj = {
            ServiceGroupID: ServiceGroupID,
            SACCodesID: SACCodesID,
            SACCodesDesc: $("#txtSACCodesDesc").val(),
            /* IsBaseRateApplicable: $("#chkBaseRateApplicable").parent().hasClass("is-checked"),*/
            ParentID: CodesParentID,
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            l_CodesParameter: cPar
        }
        $.ajax({
            url: getBaseURL() + '/Services/AddOrUpdateSACCodes',
            type: 'POST',
            datatype: 'json',
            data: {
                obj
            },
            success: function (response) {
                if (response.Status == true) {
                    if (SACCodesID == 0) {
                        fnAlert("s", "", response.StatusCode, response.Message);
                        $("#txtSACCodesDesc").val('');
                        /*$('#chkBaseRateApplicable').parent().removeClass("is-checked");*/
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        eSyaParams.ClearValue();
                        flag = "f";
                    }
                    else {
                        fnAlert("s", "", response.StatusCode, response.Message);
                    }
                    $("#jstSACCodesTree").jstree("destroy");
                    fnLoadSACCodesTree();

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
function fnMoveItemUpDown(updown) {
    var isMoveUp = false, isMoveDown = false;
    var str;
    if (updown === "U") {
        isMoveUp = true;
        str = ' up';
    }
    else if (updown === "D") {
        isMoveDown = true;
        str = ' down';
    }
    var selectedNode = $('#jstSACCodesTree').jstree().get_selected(true);

    if (selectedNode.length != 1) {
        fnAlert("w", "ECS_07_00", "UI0120", errorMsg.ServiceCodesMove_E7);
    }
    else {

        selectedNode = selectedNode[0];

        if (!selectedNode.id.startsWith("C")) {
            fnAlert("w", "ECS_07_00", "UI0120", errorMsg.ServiceCodesMove_E7);
        }
        else {
            var data = {};
            data.isMoveUp = isMoveUp;
            data.isMoveDown = isMoveDown;
            data.serviceGroupId = ServiceGroupID;
            data.ServiceCodesId = selectedNode.id.substring(1);

            $("#btnMoveUp").attr("disabled", true);
            $("#btnMoveDown").attr("disabled", true);
            if (confirm(localization.Doyouwanttomovenode + selectedNode.text + str + ' ?')) {

                $.ajax({
                    url: getBaseURL() + '/Services/UpdateServiceCodesIndex',
                    type: 'POST',
                    datatype: 'json',
                    data: data,
                    success: function (response) {
                        if (response.Status === true) {
                            fnAlert("s", "", response.StatusCode, response.Message);
                            $("#jstSACCodesTree").jstree("destroy");
                            fnLoadSACCodesTree();
                        }
                        else {
                            fnAlert("e", "", response.StatusCode, response.Message);
                        }
                        $("#btnMoveUp").attr("disabled", false);
                        $("#btnMoveDown").attr("disabled", false);
                    },
                    error: function (error) {
                        fnAlert("e", "", error.StatusCode, error.statusText);
                        $("#btnMoveUp").attr("disabled", false);
                        $("#btnMoveDown").attr("disabled", false);
                    }
                });
            }
        }
    }
}
function fnDeleteNode() {
    if (_userFormRole.IsDelete === false) {
        fnAlert("w", "ECS_07_00", "UIC04", errorMsg.deleteauth_E4);
        return;
    }
    var selectedNode = $('#jstSACCodesTree').jstree().get_selected(true);

    if (selectedNode.length != 1) {
        fnAlert("w", "ECS_07_00", "UI0121", errorMsg.ServiceCodesDel_E8);
    }
    else {

        selectedNode = selectedNode[0];

        if (!selectedNode.id.startsWith("C")) {
            fnAlert("w", "ECS_07_00", "UI0121", errorMsg.ServiceCodesDel_E8);
        }
        else {
            var data = {};
            data.ServiceCodesId = selectedNode.id.substring(1);

            $("#btnDelete").attr("disabled", true);
            if (confirm(localization.Doyouwanttodeletenode + selectedNode.text + ' ?')) {

                $.ajax({
                    url: getBaseURL() + '/Services/DeleteSACCodes',
                    type: 'POST',
                    datatype: 'json',
                    data: data,
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

var ServiceClassID = "0";
var ServiceGroupID = "0";
var ClassParentID = "0";
var prevSelectedID = '';
var flag = "f";
$(document).ready(function () {
    fnLoadServiceClassTree();
  /*  $('#chkBaseRateApplicable').parent().removeClass("is-checked");*/
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSCAdd").attr("disabled", _userFormRole.IsInsert === false);
});
$(window).on('resize', function () {
    fnTreeSize("#jstServiceClassTree");
})
function fnLoadServiceClassTree() {
    $.ajax({
        url: getBaseURL() + '/Services/GetServiceClasses',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#jstServiceClassTree").jstree({ core: { data: result, multiple: false } });
        },
        error: function (error) {
            alert(error.statusText)
        }
    });
    $("#jstServiceClassTree").on('loaded.jstree', function () {
        $("#jstServiceClassTree").jstree()._open_to(prevSelectedID);
        $('#jstServiceClassTree').jstree().select_node(prevSelectedID);
    });

    $('#jstServiceClassTree').on("changed.jstree", function (e, data) {


        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvServiceClass").hide();


                var parentNode = $("#jstServiceClassTree").jstree(true).get_parent(data.node.id);

                // If Root is selected
                if (parentNode == '#') {
                    ServiceGroupID = "0";
                    $("#dvServiceClass").hide();
                }
                // If Service Type node is selected
                else if (parentNode == 'SC') {
                    $("#dvServiceClass").hide();
                    ServiceGroupID = "0";
                }
                // If Service Group node is selected
                else if (parentNode.startsWith('T')) {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#555555"aria-hidden="true"></i></span>')
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $('#dvServiceClass').hide();
                            fnAlert("w", "ECP_03_00", "UIC01", errorMsg.addauth_E1);
                            return;
                        }

                        $("#pnlAddServiceClass .mdl-card__title-text").text(localization.AddServiceClass);
                        $("#txtServiceClassDesc").val('');
                      /*  $('#chkBaseRateApplicable').parent().removeClass("is-checked");*/
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        $("#btnSCAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSCAdd").show();
                        $("#dvServiceClass").show();
                        ServiceClassID = "0";
                        ServiceGroupID = data.node.id;
                        eSyaParams.ClearValue();
                    });
                }
                // If Service Class node is selected
                else {
                    /*$('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add">&nbsp;<i class="fa fa-plus" style="color:#555555"aria-hidden="true"></i> </span>')*/
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:5px">&nbsp;<i class="fa fa-eye" style="color:#555555"aria-hidden="true"></i> </span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:5px">&nbsp;<i class="fa fa-pen" style="color:#555555"aria-hidden="true"></i> </span>')
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $('#dvServiceClass').hide();
                            fnAlert("w", "ECP_03_00", "UIC01", errorMsg.addauth_E1);
                            return;
                        }
                        $("#txtServiceClassDesc").prop("disabled", false);
                       /* $("#chkBaseRateApplicable").prop("disabled", false);*/
                        $("#chkActiveStatus").prop("disabled", false);
                        $("#dvParameters").removeClass("disable-Param");
                        $("#pnlAddServiceClass .mdl-card__title-text").text(localization.AddServiceClass);
                        $("#txtServiceClassDesc").val('');
                       /* $('#chkBaseRateApplicable').parent().removeClass("is-checked");*/
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        $("#btnSCAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSCAdd").show();
                        $("#dvServiceClass").show();
                        ServiceClassID = "0";
                        ServiceGroupID = parentNode;
                        while (ServiceGroupID.startsWith('C')) {
                            ServiceGroupID = $("#jstServiceClassTree").jstree(true).get_parent(ServiceGroupID);
                        };
                        eSyaParams.ClearValue();
                        ClassParentID = data.node.id.substring(1);

                    });
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#dvServiceClass').hide();
                            fnAlert("w", "ECP_03_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        $("#txtServiceClassDesc").prop("disabled", true);
                       /* $("#chkBaseRateApplicable").prop("disabled", true);*/
                        $("#chkActiveStatus").prop("disabled", true);
                        $("#dvParameters").addClass("disable-Param");
                        $("#pnlAddServiceClass .mdl-card__title-text").text(localization.ViewServiceClass);
                        $("#btnSCAdd").hide();
                        $("#dvServiceClass").show();
                        ServiceClassID = data.node.id;
                        ServiceClassID = ServiceClassID.substring(1);
                        fnFillServiceClassDetail(ServiceClassID);

                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvServiceClass').hide();
                            fnAlert("w", "ECP_03_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $("#txtServiceClassDesc").prop("disabled", false);
                       /* $("#chkBaseRateApplicable").prop("disabled", false);*/
                        $("#chkActiveStatus").prop("disabled", false);
                        $("#dvParameters").removeClass("disable-Param");
                        $("#pnlAddServiceClass .mdl-card__title-text").text(localization.EditServiceClass);
                        $("#btnSCAdd").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnSCAdd").show();
                        $("#dvServiceClass").show();
                        ServiceClassID = data.node.id;
                        ServiceClassID = ServiceClassID.substring(1);
                        fnFillServiceClassDetail(ServiceClassID);

                    });
                }

            }
        }

    });
    $('#jstServiceClassTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstServiceClassTree').jstree().deselect_node(closingNode.children);
    });
    fnTreeSize("#jstServiceClassTree");
}


function fnFillServiceClassDetail(ServiceClassID) {
    $.ajax({
        url: getBaseURL() + '/Services/GetServiceClassByID',
        data: {
            ServiceClassID: ServiceClassID
        },
        success: function (result) {
            $("#txtServiceClassDesc").val(result.ServiceClassDesc);
            //if (result.IsBaseRateApplicable == true)
            //    $('#chkBaseRateApplicable').parent().addClass("is-checked");
            //else
            //    $('#chkBaseRateApplicable').parent().removeClass("is-checked");
            if (result.ActiveStatus == true)
                $('#chkActiveStatus').parent().addClass("is-checked");
            else
                $('#chkActiveStatus').parent().removeClass("is-checked");
            eSyaParams.ClearValue();
            eSyaParams.SetJSONValue(result.l_ClassParameter);
        }
    });

}
function fnAddOrUpdateServiceClass() {
   
    var txtServiceClassDesc = $("#txtServiceClassDesc").val();
    if (txtServiceClassDesc == "" || txtServiceClassDesc == null || txtServiceClassDesc == undefined) {
        fnAlert("w", "ECP_03_00", "UI0119", errorMsg.ServiceDesc_E6)
        return false;
    }

    else {


        $("#btnSCAdd").attr("disabled", true);
        var cPar = eSyaParams.GetJSONValue();
        var obj = {
            ServiceGroupID: ServiceGroupID,
            ServiceClassID: ServiceClassID,
            ServiceClassDesc: $("#txtServiceClassDesc").val(),
           /* IsBaseRateApplicable: $("#chkBaseRateApplicable").parent().hasClass("is-checked"),*/
            ParentID: ClassParentID,
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            l_ClassParameter: cPar
        }
        $.ajax({
            url: getBaseURL() + '/Services/AddOrUpdateServiceClass',
            type: 'POST',
            datatype: 'json',
            data: {
                obj
            },
            success: function (response) {
                if (response.Status == true) {
                    if (ServiceClassID == 0) {
                        fnAlert("s", "", response.StatusCode, response.Message);
                        $("#txtServiceClassDesc").val('');
                        /*$('#chkBaseRateApplicable').parent().removeClass("is-checked");*/
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        eSyaParams.ClearValue();
                        flag = "f";
                    }
                    else {
                        fnAlert("s", "", response.StatusCode, response.Message);
                    }
                    $("#jstServiceClassTree").jstree("destroy");
                    fnLoadServiceClassTree();

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
function fnExpandAll() {
    $("#jstServiceClassTree").jstree('open_all');
}
function fnCollapseAll() {
    $("#jstServiceClassTree").jstree('close_all');
    $('#dvServiceClass').hide();
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
    var selectedNode = $('#jstServiceClassTree').jstree().get_selected(true);

    if (selectedNode.length != 1) {
        fnAlert("w", "ECP_03_00", "UI0120", errorMsg.ServiceClassMove_E7);
    }
    else {

        selectedNode = selectedNode[0];

        if (!selectedNode.id.startsWith("C")) {
            fnAlert("w", "ECP_03_00", "UI0120", errorMsg.ServiceClassMove_E7);
        }
        else {
            var data = {};
            data.isMoveUp = isMoveUp;
            data.isMoveDown = isMoveDown;
            data.serviceGroupId = ServiceGroupID;
            data.ServiceClassId = selectedNode.id.substring(1);

            $("#btnMoveUp").attr("disabled", true);
            $("#btnMoveDown").attr("disabled", true);
            if (confirm(localization.Doyouwanttomovenode + selectedNode.text + str + ' ?')) {

                $.ajax({
                    url: getBaseURL() + '/Services/UpdateServiceClassIndex',
                    type: 'POST',
                    datatype: 'json',
                    data: data,
                    success: function (response) {
                        if (response.Status === true) {
                            fnAlert("s", "", response.StatusCode, response.Message);
                            $("#jstServiceClassTree").jstree("destroy");
                            fnLoadServiceClassTree();
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
        fnAlert("w", "ECP_03_00", "UIC04", errorMsg.deleteauth_E4);
        return;
    }
    var selectedNode = $('#jstServiceClassTree').jstree().get_selected(true);

    if (selectedNode.length != 1) {
        fnAlert("w", "ECP_03_00", "UI0121", errorMsg.ServiceClassDel_E8);
    }
    else {

        selectedNode = selectedNode[0];

        if (!selectedNode.id.startsWith("C")) {
            fnAlert("w", "ECP_03_00", "UI0121", errorMsg.ServiceClassDel_E8);
        }
        else {
            var data = {};
            data.ServiceClassId = selectedNode.id.substring(1);

            $("#btnDelete").attr("disabled", true);
            if (confirm(localization.Doyouwanttodeletenode + selectedNode.text + ' ?')) {

                $.ajax({
                    url: getBaseURL() + '/Services/DeleteServiceClass',
                    type: 'POST',
                    datatype: 'json',
                    data: data,
                    success: function (response) {
                        if (response.Status === true) {
                            fnAlert("s", "", response.StatusCode, response.Message);
                            $("#jstServiceClassTree").jstree("destroy");
                            fnLoadServiceClassTree();
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

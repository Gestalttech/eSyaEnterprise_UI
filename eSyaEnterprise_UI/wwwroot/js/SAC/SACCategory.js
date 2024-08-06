var ServiceCategoryID = "0";
var ServiceClassID = "0";
var prevSelectedID = '';
$(document).ready(function () {
    fnLoadServiceCategoryTree();
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSGAdd").attr("disabled", _userFormRole.IsInsert === false);
});
function fnLoadServiceCategoryTree() {
    $.ajax({
        url: getBaseURL() + '/SAC/GetServiceCategory',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (result) {
            $("#jstServiceCategoryTree").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstServiceCategoryTree");
            $(window).on('resize', function () {
                fnTreeSize("#jstServiceCategoryTree");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

    $("#jstServiceCategoryTree").on('loaded.jstree', function () {
        $("#jstServiceCategoryTree").jstree()._open_to(prevSelectedID);
        $('#jstServiceCategoryTree').jstree().select_node(prevSelectedID);
    });
    $('#jstServiceCategoryTree').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvServiceCategory").hide();

                var parentNode = $("#jstServiceCategoryTree").jstree(true).get_parent(data.node.id);

                // If Parent node is selected
                if (parentNode == "#") {
                    $("#dvServiceCategory").hide();
                }
                // If Type node is selected
                else if (parentNode == "SG") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $('#dvServiceCategory').hide();
                            fnAlert("w", "ECS_06_00", "UIC01", errorMsg.addauth_E1);
                            return;
                        }
                        $("#pnlAddServiceCategory .mdl-card__title-text").text(localization.AddServiceCategory);
                        $("#txtServiceCategoryDesc").val('');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        $("#btnSGAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSGAdd").show();
                        ServiceCategoryID = "0";
                        ServiceClassID = data.node.id;
                        $("#dvServiceCategory").show();
                        $("#txtServiceCategoryDesc").prop("disabled", false);
                        $("#chkActiveStatus").prop("disabled", false);
                    });
                }
                // If Child node is selected
                else {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#dvServiceCategory').hide();
                            fnAlert("w", "ECS_06_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        $("#pnlAddServiceCategory .mdl-card__title-text").text(localization.ViewServiceCategory);
                        $("#btnSGAdd").hide();
                        ServiceCategoryID = data.node.id;
                        ServiceCategoryID = ServiceCategoryID.substring(1);
                        fnFillServiceCategoryDetail(ServiceCategoryID);
                        $("#dvServiceCategory").show();
                        $("#txtServiceCategoryDesc").prop("disabled", true);
                        $("#chkActiveStatus").prop("disabled", true);

                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvServiceCategory').hide();
                            fnAlert("w", "ECS_06_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $("#pnlAddServiceCategory .mdl-card__title-text").text(localization.EditServiceCategory);
                        $("#btnSGAdd").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnSGAdd").show();
                        ServiceCategoryID = data.node.id;
                        ServiceCategoryID = ServiceCategoryID.substring(1);
                        fnFillServiceCategoryDetail(ServiceCategoryID);
                        $("#dvServiceCategory").show();
                        $("#txtServiceCategoryDesc").prop("disabled", false);
                        $("#chkActiveStatus").prop("disabled", false);

                    });

                }
            }
        }
    });

    $('#jstServiceCategoryTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstServiceCategoryTree').jstree().deselect_node(closingNode.children);
    });

}
function fnFillServiceCategoryDetail(ServiceCategoryID) {
    $.ajax({
        url: getBaseURL() + '/SAC/GetServiceCategoryByID',
        data: {
            ServiceCategoryID: ServiceCategoryID
        },
        success: function (result) {
            $("#txtServiceCategoryDesc").val(result.ServiceCategoryDesc);
            $("#cboservicecriteria").val(result.ServiceCriteria).selectpicker('refresh');
            if (result.ActiveStatus == true)
                $('#chkActiveStatus').parent().addClass("is-checked");
            else
                $('#chkActiveStatus').parent().removeClass("is-checked");
        }
    });
}
function fnAddOrUpdateServiceCategory() {
    var txtServiceCategoryDesc = $("#txtServiceCategoryDesc").val()
    if (txtServiceCategoryDesc == "" || txtServiceCategoryDesc == null || txtServiceCategoryDesc == undefined) {
        fnAlert("w", "ECS_06_00", "UI0366", errorMsg.ServiceCategoryDesc_E6);
        return false;
    }

    else {
        if (ServiceCategoryID == "0") {
            if (ServiceClassID == "0" || ServiceClassID == null || ServiceClassID == undefined) {
                fnAlert("w", "ECS_06_00", "UI0332", errorMsg.ServiceClassSelect_E7);
                return false;
            }
        }
        $("#btnSGAdd").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/SAC/AddOrUpdateServiceCategory',
            type: 'POST',
            datatype: 'json',
            data: {
                Isdcode: $("#cboSACAIsdcode").val(),
                Sacclass: ServiceClassID,
                Saccategory: ServiceCategoryID,
                SaccategoryDesc: $("#txtServiceCategoryDesc").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
            },
            async: false,
            success: function (response) {
                if (response.Status == true) {
                    if (ServiceCategoryID == 0) {
                        fnAlert("s", "", response.StatusCode, response.Message);
                        $("#txtServiceCategoryDesc").val('');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                    }
                    else {
                        fnAlert("s", "", response.StatusCode, response.Message);
                    }
                    $("#jstServiceCategoryTree").jstree("destroy");
                    fnLoadServiceCategoryTree();

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
}
function fnSACAExpandAll() {
    $("#jstServiceCategoryTree").jstree('open_all');
}
function fnSACACollapseAll() {
    $("#jstServiceCategoryTree").jstree('close_all');
    $('#dvServiceCategory').hide();
}

 
function fnDeleteNode() {
    if (_userFormRole.IsDelete === false) {
        fnAlert("w", "ECS_06_00", "UIC04", errorMsg.deleteauth_E4);
        return;
    }

    var selectedNode = $('#jstServiceCategoryTree').jstree().get_selected(true);

    if (selectedNode.length != 1) {
        fnAlert("w", "ECS_06_00", "UI0118", errorMsg.ServiceCategoryDelete_E9);
    }
    else {

        selectedNode = selectedNode[0];

        if (!selectedNode.id.startsWith("G")) {
            fnAlert("w", "ECS_06_00", "UI0118", errorMsg.ServiceCategoryDelete_E9);
        }
        else {
            var data = {};
            data.serviceCategoryId = selectedNode.id.substring(1);

            $("#btnDelete").attr("disabled", true);
            if (confirm(localization.Doyouwanttodeletenode + selectedNode.text + ' ?')) {

                $.ajax({
                    url: getBaseURL() + '/SAC/DeleteServiceCategory',
                    type: 'POST',
                    datatype: 'json',
                    data: data,
                    async: false,
                    success: function (response) {
                        if (response.Status === true) {
                            fnAlert("s", "", response.StatusCode, response.Message);
                            $("#jstServiceCategoryTree").jstree("destroy");
                            fnLoadServiceCategoryTree();
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

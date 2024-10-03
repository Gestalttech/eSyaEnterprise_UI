var ServiceTypeID = "0";
var prevSelectedID = '';
$(document).ready(function () {
    fnLoadServiceTypeTree()
    $('#chkSTActiveStatus').parent().addClass("is-checked");
    $("#btnSTAdd").attr("disabled", _userFormRole.IsInsert === false);
    // $("#btnDelete").attr("disabled", _userFormRole.IsDelete === false);

});
function fnLoadServiceTypeTree() {
    $.ajax({
        url: getBaseURL() + '/Services/GetServiceTypes',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#jstServiceTypeTree").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstServiceTypeTree");
            $(window).on('resize', function () {
                fnTreeSize("#jstServiceTypeTree");
            })
        },
        error: function (error) {
            fnAlert("", "", error.StatusCode, error.statusText);
        }
    });

    $("#jstServiceTypeTree").on('loaded.jstree', function () {
        $("#jstServiceTypeTree").jstree()._open_to(prevSelectedID);
        $('#jstServiceTypeTree').jstree().select_node(prevSelectedID);
    });

    $('#jstServiceTypeTree').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvServiceType").hide();
                //$(".divTreeActions").hide();
                var parentNode = $("#jstServiceTypeTree").jstree(true).get_parent(data.node.id);

                // If Parent node is selected
                if (parentNode == "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#555555"aria-hidden="true"></i> </span>')
                    $('#Add').on('click', function () {

                        if (_userFormRole.IsInsert === false) {
                            // $('#dvServiceType').hide();
                            fnAlert("w", "ECP_01_00", "UIC01", errorMsg.addauth_E1);
                            return;
                        }

                        $("#pnlAddServiceType .mdl-card__title-text").text(localization.AddServiceType);
                        $("#txtServiceTypeDesc").val('');
                        $('#chkSTActiveStatus').parent().addClass("is-checked");
                        $("#btnSTAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSTAdd").show();
                        $("#dvServiceType").show();
                        //$(".divTreeActions").show();
                        ServiceTypeID = "0";
                        $("#txtServiceTypeDesc").prop("disabled", false);
                        $("#chkSTActiveStatus").prop("disabled", false);
                    });
                }
                // If Child node is selected
                else if (parentNode == "ST") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#555555"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#555555"aria-hidden="true"></i></span>')
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#dvItemGroup').hide();
                            fnAlert("w", "ECP_01_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        $("#pnlAddServiceType .mdl-card__title-text").text(localization.ViewServiceType);
                        $("#btnSTAdd").hide();
                        $("#dvServiceType").show();
                        $(".divTreeActions").show();
                        ServiceTypeID = data.node.id;
                        $("#txtServiceTypeDesc").prop("disabled", true);
                        $("#chkSTActiveStatus").prop("disabled", true);
                        fnFillServiceTypeDetail(ServiceTypeID);

                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvItemGroup').hide();
                            fnAlert("w", "ECP_01_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $("#pnlAddServiceType .mdl-card__title-text").text(localization.EditServiceType);
                        $("#btnSTAdd").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnSTAdd").show();
                        $("#dvServiceType").show();
                        $(".divTreeActions").show();
                        ServiceTypeID = data.node.id;
                        $("#txtServiceTypeDesc").prop("disabled", false);
                        $("#chkSTActiveStatus").prop("disabled", false);
                        fnFillServiceTypeDetail(ServiceTypeID);

                    });



                }
                else {
                    $("#dvServiceType").hide();
                    // $(".divTreeActions").hide();
                }

            }
        }
    });
    $('#ItemGrouServiceTypeTreepTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstServiceTypeTree').jstree().deselect_node(closingNode.children);
    });
}
function fnFillServiceTypeDetail(ServiceTypeID) {
    $.ajax({
        url: getBaseURL() + '/Services/GetServiceTypeByID',
        data: {
            ServiceTypeID: ServiceTypeID
        },
        success: function (result) {
            $("#txtServiceTypeDesc").val(result.ServiceTypeDesc);
            if (result.ActiveStatus == true)
                $('#chkSTActiveStatus').parent().addClass("is-checked");
            else
                $('#chkSTActiveStatus').parent().removeClass("is-checked");
        }
    });
}
function fnAddOrUpdateServiceType() {
    var txtServiceTypeDesc = $("#txtServiceTypeDesc").val()
    if (txtServiceTypeDesc == "" || txtServiceTypeDesc == null || txtServiceTypeDesc == undefined) {
        fnAlert("w", "ECP_01_00","UI0112",errorMsg.ServiceDesc_E6);
        return false;
    }
    else {
        $("#btnSTAdd").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/Services/AddOrUpdateServiceType',
            type: 'POST',
            datatype: 'json',
            data: {
                ServiceTypeID: ServiceTypeID,
                ServiceTypeDesc: $("#txtServiceTypeDesc").val(),
                ActiveStatus: $("#chkSTActiveStatus").parent().hasClass("is-checked")
            },
            success: function (response) {
                if (response.Status == true) {
                    if (ServiceTypeID == 0) {
                        fnAlert("s", "", response.StatusCode, response.Message);
                        $("#txtServiceTypeDesc").val('');
                        $('#chkSTActiveStatus').parent().addClass("is-checked");
                    }
                    else {
                        fnAlert("s", "", response.StatusCode, response.Message);
                    }
                    $("#jstServiceTypeTree").jstree("destroy");
                    fnLoadServiceTypeTree();

                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
                $("#btnSTAdd").attr("disabled", false);
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnSTAdd").attr("disabled", false);
            }
        });
    }
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
    var selectedNode = $('#jstServiceTypeTree').jstree().get_selected(true);

    if (selectedNode.length != 1) {
        fnAlert("w", "ECP_01_00", "UI0113", errorMsg.ServiceType_E7);
    }
    else {
        selectedNode = selectedNode[0];
        var data = {};
        data.isMoveUp = isMoveUp;
        data.isMoveDown = isMoveDown;
        data.ServiceTypeId = selectedNode.id;
        $("#btnMoveUp").attr("disabled", true);
        $("#btnMoveDown").attr("disabled", true);
        if (confirm(localization.Doyouwanttomovenode + selectedNode.text + str + ' ?')) {

            $.ajax({
                url: getBaseURL() + '/Services/UpdateServiceTypeIndex',
                type: 'POST',
                datatype: 'json',
                data: data,
                success: function (response) {
                    if (response.Status === true) {
                        fnAlert("s", "", response.StatusCode, response.Message);
                        $("#jstServiceTypeTree").jstree("destroy");
                        fnLoadServiceTypeTree();
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
function fnDeleteNode() {
    if (_userFormRole.IsDelete === false) {
        fnAlert("w", "ECP_01_00", "UIC04", errorMsg.deleteauth_E4);
        return;
    }

    var selectedNode = $('#jstServiceTypeTree').jstree().get_selected(true);

    if (selectedNode.length != 1) {
        fnAlert("w", "ECP_01_00", "UI0114", errorMsg.ServiceTypeDel_E8);
    }
    else {
        selectedNode = selectedNode[0];
        var data = {};
        data.ServiceTypeId = selectedNode.id;

        $("#btnDelete").attr("disabled", true);
        if (confirm(localization.Doyouwanttodeletenode + selectedNode.text + ' ?')) {

            $.ajax({
                url: getBaseURL() + '/Services/DeleteServiceType',
                type: 'POST',
                datatype: 'json',
                data: data,
                success: function (response) {
                    if (response.Status === true) {
                        fnAlert("s", "", response.StatusCode, response.Message);
                        $("#jstServiceTypeTree").jstree("destroy");
                        fnLoadServiceTypeTree();
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


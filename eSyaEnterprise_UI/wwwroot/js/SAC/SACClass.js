var ServiceClassID = "0";
var prevSelectedID = '';
$(function () {
    $('#chkSCActiveStatus').parent().addClass("is-checked");
    $("#btnSCAdd").attr("disabled", _userFormRole.IsInsert === false);
    // $("#btnDelete").attr("disabled", _userFormRole.IsDelete === false);
});

function fnISDCountryCode_onChange() {
    debugger;
    var _ISDCode = $("#cboSACIsdcode").val();
    if (_ISDCode != 0) {
        fnLoadServiceClassTree();
    }
}
function fnLoadServiceClassTree() {
    $.ajax({
        url: getBaseURL() + '/SACClass/GetSACClasses?ISDCode=' + $("#cboSACIsdcode").val(),
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#jstServiceClassTree").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstServiceClassTree");
            $(window).on('resize', function () {
                fnTreeSize("#jstServiceClassTree");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
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
                //$(".divTreeActions").hide();
                var parentNode = $("#jstServiceClassTree").jstree(true).get_parent(data.node.id);

                // If Parent node is selected
                if (parentNode == "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i> </span>')
                    $('#Add').on('click', function () {

                        if (_userFormRole.IsInsert === false) {
                             $('#dvServiceClass').hide();
                            fnAlert("w", "ECS_05_00", "UIC01", errorMsg.addauth_E1);
                            return;
                        }

                        $("#pnlAddServiceClass .mdl-card__title-text").text(localization.AddServiceClass);
                        $("#txtServiceClassDesc").val('');
                        $('#chkSCActiveStatus').parent().addClass("is-checked");
                        $("#btnSCAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnSCAdd").show();
                        $("#dvServiceClass").show();
                        //$(".divTreeActions").show();
                        ServiceClassID = "0";
                        $("#txtServiceClassDesc").prop("disabled", false);
                        $("#chkSCActiveStatus").prop("disabled", false);
                    });
                }
                // If Child node is selected
                else if (parentNode == "ST") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#dvServiceClass').hide();
                            fnAlert("w", "ECS_05_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        $("#pnlAddServiceClass .mdl-card__title-text").text(localization.ViewServiceClass);
                        $("#btnSCAdd").hide();
                        $("#dvServiceClass").show();
                        $(".divTreeActions").show();
                        ServiceClassID = data.node.id;
                        $("#txtServiceClassDesc").prop("disabled", true);
                        $("#chkSCActiveStatus").prop("disabled", true);
                        fnFillServiceClassDetail(ServiceClassID);

                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvServiceClass').hide();
                            fnAlert("w", "ECS_05_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $("#pnlAddServiceClass .mdl-card__title-text").text(localization.EditServiceClass);
                        $("#btnSCAdd").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnSCAdd").show();
                        $("#dvServiceClass").show();
                        $(".divTreeActions").show();
                        ServiceClassID = data.node.id;
                        $("#txtServiceClassDesc").prop("disabled", false);
                        $("#chkSCActiveStatus").prop("disabled", false);
                        fnFillServiceClassDetail(ServiceClassID);

                    });



                }
                else {
                    $("#dvServiceClass").hide();
                    // $(".divTreeActions").hide();
                }

            }
        }
    });
    $('#jstServiceClassTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstServiceClassTree').jstree().deselect_node(closingNode.children);
    });
}

function fnFillServiceClassDetail(ServiceClassID) {
    $.ajax({
        url: getBaseURL() + '/SACClass/GetSACClassByClassID',
        data: {
            ServiceClassID: ServiceClassID
        },
        success: function (result) {
            $("#txtServiceClassDesc").val(result.ServiceClassDesc);
            if (result.ActiveStatus == true)
                $('#chkSCActiveStatus').parent().addClass("is-checked");
            else
                $('#chkSCActiveStatus').parent().removeClass("is-checked");

            if (result.UsageStatus == true)
                $('#chkSCUsageStatus').parent().addClass("is-checked");
            else
                $('#chkSCUsageStatus').parent().removeClass("is-checked");
        }
    });
}
function fnAddOrUpdateServiceClass() {
    var txtServiceClassDesc = $("#txtServiceClassDesc").val()
    if (txtServiceClassDesc == "" || txtServiceClassDesc == null || txtServiceClassDesc == undefined) {
        fnAlert("w", "ECS_05_00", "UI0119", errorMsg.ServiceDesc_E6);
        return false;
    }
    else {
        $("#btnSCAdd").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/SAC/AddOrUpdateServiceClass',
            type: 'POST',
            datatype: 'json',
            data: {
                Isdcode: $("#cboSACIsdcode").val(),
                Sacclass: ServiceClassID,
                SacclassDesc: $("#txtServiceClassDesc").val(),
                ActiveStatus: $("#chkSCActiveStatus").parent().hasClass("is-checked")
            },
            success: function (response) {
                if (response.Status == true) {
                    if (ServiceClassID == 0) {
                        fnAlert("s", "", response.StatusCode, response.Message);
                        $("#txtServiceClassDesc").val('');
                        $('#chkSCActiveStatus').parent().addClass("is-checked");
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
 function fnDeleteNode() {
    if (_userFormRole.IsDelete === false) {
        fnAlert("w", "ECS_05_00", "UIC04", errorMsg.deleteauth_E4);
        return;
    }

    var selectedNode = $('#jstServiceClassTree').jstree().get_selected(true);

    if (selectedNode.length != 1) {
        fnAlert("w", "ECS_05_00", "UI0114", errorMsg.ServiceClassDel_E8);
    }
    else {
        selectedNode = selectedNode[0];
        var data = {};
        data.ServiceClassId = selectedNode.id;

        $("#btnDelete").attr("disabled", true);
        if (confirm(localization.Doyouwanttodeletenode + selectedNode.text + ' ?')) {

            $.ajax({
                url: getBaseURL() + '/SAC/DeleteServiceClass',
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

function fnSACLExpandAll() {
    $("#jstServiceClassTree").jstree('open_all');
}
function fnSACLCollapseAll() {
    $("#jstServiceClassTree").jstree('close_all');
    $('#dvServiceClass').hide();
}
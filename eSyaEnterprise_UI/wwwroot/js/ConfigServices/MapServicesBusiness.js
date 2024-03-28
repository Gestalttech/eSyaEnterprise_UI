$(document).ready(function () {
    $("#btnSave").hide();
});
function fnLoadBusinessServiceTree() {
    $('#jstBusinessServiceTree').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/ServiceCodes/GetServiceBusinessLink?businessKey=' + $('#cboBusinessKey').val(),
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#jstBusinessServiceTree').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
                //"plugins": ["checkbox"],
                //"checkbox": {
                //    "keep_selected_style": true
                //},
            });

            fnTreeSize("#jstBusinessServiceTree");
            $(window).on('resize', function () {
                fnTreeSize("#jstBusinessServiceTree");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
    $("#btnSave").show();
    $("#jstBusinessServiceTree").on('loaded.jstree', function () {
        $("#jstBusinessServiceTree").jstree()._open_to(prevSelectedID);
        $('#jstBusinessServiceTree').jstree().select_node(prevSelectedID);
    });

    $('#jstBusinessServiceTree').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvServiceParameters").hide();

                var parentNode = $("#jstBusinessServiceTree").jstree(true).get_parent(data.node.id);

                if (parentNode == "#" || parentNode.startsWith('T') || parentNode == "SM") {
                    $("#dvServiceParameters").hide();
                }
                else if (parentNode.startsWith('G') || parentNode.startsWith('C')) {

                    if (data.node.id.startsWith('C')) {
                        $("#dvServiceParameters").hide();
                    }
                    else {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#View').on('click', function () {
                            if (_userFormRole.IsView === false) {
                                $('#dvServiceParameters').hide();
                                fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
                                return;
                            }
                            Editable = false;
                            ServiceID = data.node.id;
                            $("#txtServiceDesc").val(data.node.text);
                            $("#pnlAddServiceBusinessLink .mdl-card__title-text").text(localization.ViewServiceBusinessLinkServiceWise);
                            fnLoadServiceBusinessLinkGrid(ServiceID, Editable);
                            $("#btnSMAdd").hide();
                            $("#dvServiceParameters").show();

                        });

                        $('#Edit').on('click', function () {
                            if (_userFormRole.IsEdit === false) {
                                $('#dvServiceParameters').hide();
                                fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
                                return;
                            }
                            Editable = true;
                            ServiceID = data.node.id;
                            $("#txtServiceDesc").val(data.node.text);
                            $("#pnlAddServiceBusinessLink .mdl-card__title-text").text(localization.EditServiceBusinessLinkServiceWise);
                            fnLoadServiceBusinessLinkGrid(ServiceID, Editable);
                            $("#btnSMAdd").hide();
                            $("#dvServiceParameters").show();


                        });


                    }
                }
            }
        }
    });

    $('#jstBusinessServiceTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstBusinessServiceTree').jstree().deselect_node(closingNode.children);
    });
}
function fnSaveBusinessServiceLink() {

    if ($('#cboBusinessKey').val() == '') {
        fnAlert("w", "EBM_03_00", "UI0064", errorMsg.SelectBusinessLocation_E1);
        toastr.warning("Please Select a Business Location");
        $('#cboBusinessKey').focus();
        return;
    }

    var businessKey = $('#cboBusinessKey').val();
    var ServiceBusinessLink = [];

    var treeUNodes = $('#jstBusinessServiceTree').jstree(true).get_json('#', { 'flat': true });
    $.each(treeUNodes, function () {
        if (this.id.startsWith('S') && this.id != "SM") {
            var sbl = {
                BusinessKey: businessKey,
                ServiceId: this.id.substring(1),
                ActiveStatus: this.state.selected
            }
            ServiceBusinessLink.push(sbl);
        }
    });

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/ServiceCodes/UpdateServiceBusinessLocations',
        type: 'POST',
        datatype: 'json',
        data: {
            obj: ServiceBusinessLink
        },
        success: function (response) {
            if (response.Status == true) {
                fnAlert("s", "", response.StatusCode, response.Message);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSave").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSave").attr("disabled", false);
        }
    });
}

function fnExpandAll() {
    $("#jstBusinessServiceTree").jstree('open_all');
}
function fnCollapseAll() {
    $("#jstBusinessServiceTree").jstree('close_all');
    $("#dvServiceParameters").hide();
}


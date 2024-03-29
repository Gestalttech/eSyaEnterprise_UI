var ServiceID = "0";
var prevSelectedID = '';
var Editable = false;

$(document).ready(function () {
    $("#btnSave").hide();
    $("#divActions").hide();
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
                });
            $("#divActions").show();
            
            
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
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" title=' + localization.View +' style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" title=' + localization.Edit +' style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#View').on('click', function () {
                            if (_userFormRole.IsView === false) {
                                $('#dvServiceParameters').hide();
                                fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
                                return;
                            }
                            Editable = false;
                            ServiceID = data.node.id.substring(1);
                            //$("#txtServiceCost").val('').prop('disabled',true);
                            $("#pnlAddServiceCode .mdl-card__title-text").text(localization.ViewService);
                            fnFillBusinessServiceLinkDetail(ServiceID);
                            //$('#chkActiveStatus').prop('disabled', true);
                            $("#btnSave").hide();
                            $("#dvServiceParameters").show();
                            $("#dvServiceParameters").css('display', 'block');
                        });

                        $('#Edit').on('click', function () {
                            if (_userFormRole.IsEdit === false) {
                                $('#dvServiceParameters').hide();
                                fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
                                return;
                            }
                            Editable = true;
                            ServiceID = data.node.id.substring(1);
                            //$("#txtServiceCost").val(''); $("#txtServiceCost").val('').prop('disabled', false);
                            $("#txtServiceDesc").val(data.node.text);
                            $("#pnlAddServiceCode .mdl-card__title-text").text(localization.EditService);
                            fnFillBusinessServiceLinkDetail(ServiceID);
                            //$('#chkActiveStatus').prop('disabled', true);
                            $("#btnSave").show();
                            $("#dvServiceParameters").show();
                            $("#dvServiceParameters").css('display', 'block');

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

function fnFillBusinessServiceLinkDetail(ServiceID) {
    $.ajax({
        url: getBaseURL() + '/ServiceCodes/GetBusinessLocationServices?businessKey=' + $("#cboBusinessKey").val() + '&serviceId=' + ServiceID,
        success: function (result) {
            //debugger;
            //if (result != null) {
                //$("#txtServiceCost").val(result.ServiceCost);
               
                //if (result.ActiveStatus == true) {
                //    $('#chkActiveStatus').parent().addClass("is-checked");
                //}
                //else {
                //    $('#chkActiveStatus').parent().removeClass("is-checked");
                //};
                eSyaParams.ClearValue();
                eSyaParams.SetJSONValue(result.l_ServiceParameter);
            //}
            //else
            //{
            //    $('#chkActiveStatus').parent().addClass("is-checked");
            //}
        }
    });

}
function fnSaveBusinessServiceLink() {
   
    if (IsStringNullorEmpty($('#cboBusinessKey').val()) || $('#cboBusinessKey').val() == '0') {
        fnAlert("w", "EMS_03_00", "UI0064", errorMsg.SelectBusinessLocation_E1);
        return;
    }
    if (IsStringNullorEmpty(ServiceID) || ServiceID == '0' || ServiceID == 0) {
        fnAlert("w", "EMS_03_00", "UI0064", errorMsg.SelectBusinessLocation_E1);
        return;
    }
    $("#btnSave").attr("disabled", true);
    var sPar = eSyaParams.GetJSONValue();
    var sbl = {
                BusinessKey: $('#cboBusinessKey').val(),
                ServiceId: ServiceID,
                //ServiceCost: $('#txtServiceCost').val(), 
                //ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
                l_ServiceParameter: sPar
            }
    $.ajax({
        url: getBaseURL() + '/ServiceCodes/AddOrUpdateBusinessLocationServices',
        type: 'POST',
        datatype: 'json',
        data: {
            obj: sbl
        },
        success: function (response) {
            if (response.Status == true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                //$("#txtServiceCost").val('');
                //$('#chkActiveStatus').parent().addClass("is-checked");
                //$('#chkActiveStatus').prop('disabled', true);
                eSyaParams.ClearValue();
                //$('#jstBusinessServiceTree').jstree('refresh');
                fnLoadBusinessServiceTree()
                $("#dvServiceParameters").css('display', 'none');
                $("#dvServiceParameters").hide();
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
function fnCollapseParameter() {
    $("#dvServiceParameters").hide(); fnLoadBusinessServiceTree();
}




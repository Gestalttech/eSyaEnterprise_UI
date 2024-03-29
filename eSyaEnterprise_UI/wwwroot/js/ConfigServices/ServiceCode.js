var ServiceClassID = "0";
var ServiceGroupID = "0";
var ServiceTypeID = "0";
var ServiceID = "0";
var prevSelectedID = '';

$(document).ready(function () {
    fnLoadServiceCodeTree()
    $("#txtInternalServiceCode").val('');
    $('#chkActiveStatus').parent().addClass("is-checked");
    //$('#chkBillable').parent().addClass("is-checked");
    $("#btnSMAdd").attr("disabled", _userFormRole.IsInsert === false);
});
function fnLoadServiceCodeTree() {
    $.ajax({
        url: getBaseURL() + '/ServiceCodes/GetServiceCodes',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#ServiceCodeTree").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#ServiceCodeTree");
            $(window).on('resize', function () {
                fnTreeSize("#ServiceCodeTree");
            })
        },
        error: function (error) {
            fnAlert("e", "EMS_01_00", error.StatusCode, error.statusText);
        }
    });

    $("#ServiceCodeTree").on('loaded.jstree', function () {
        $("#ServiceCodeTree").jstree()._open_to(prevSelectedID);
        $('#ServiceCodeTree').jstree().select_node(prevSelectedID);
    });

    $('#ServiceCodeTree').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvServiceCode").hide();

                var parentNode = $("#ServiceCodeTree").jstree(true).get_parent(data.node.id);

                if (parentNode == "#" || parentNode.startsWith('T') || parentNode == "SM") {
                    $("#dvServiceCode").hide();
                }
                else if (parentNode.startsWith('G') || parentNode.startsWith('C')) {

                    if (data.node.id.startsWith('C')) {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#Add').on('click', function () {
                            if (_userFormRole.IsInsert === false) {
                                $('#dvServiceCode').hide();
                                fnAlert("w", "EMS_01_00", "UIC01", errorMsg.addauth_E1);
                                return;
                            }

                            $("#txtServiceDesc").prop("disabled", false);
                            $("#txtServiceShortDesc").prop("disabled", false);
                            $("#cboGender").prop("disabled", false);
                            $("#txtInternalServiceCode").prop("disabled", false);
                            $("#chkBillable").prop("disabled", false);
                            $("#chkActiveStatus").prop("disabled", false);
                            //$("#dvParameters").removeClass("disable-Param");


                            $("#pnlAddServiceCode .mdl-card__title-text").text(localization.AddService);
                            $("#txtServiceDesc").val('');
                            $("#txtServiceShortDesc").val('');
                            $("#txtInternalServiceCode").val('');
                            $("#cboGender").val('A');
                            $('#cboGender').selectpicker('refresh');
                            $('#chkBillable').parent().addClass("is-checked");
                            $('#chkActiveStatus').parent().addClass("is-checked");
                            $("#btnSMAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                            $("#btnSMAdd").show();
                            $("#dvServiceCode").show();
                            ServiceClassID = data.node.id.substring(1);
                            
                            if (parentNode.startsWith('G')) {
                                ServiceGroupID = parentNode.substring(1);
                            }
                            else {
                                ServiceGroupID = $("#ServiceCodeTree").jstree(true).get_parent(parentNode);
                                while (ServiceGroupID.startsWith('C')) {
                                    ServiceGroupID = $("#ServiceCodeTree").jstree(true).get_parent(ServiceGroupID);
                                };
                                ServiceGroupID = ServiceGroupID.substring(1);
                            }
                            ServiceTypeID = $("#ServiceCodeTree").jstree(true).get_parent("G" + ServiceGroupID).substring(1);
                            ServiceID = "0"
                        //    eSyaParams.ClearValue();
                        });
                    }
                    else {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#View').on('click', function () {
                            if (_userFormRole.IsView === false) {
                                $('#dvServiceCode').hide();
                                fnAlert("w", "EMS_01_00", "UIC03", errorMsg.vieweauth_E3);
                                return;
                            }

                            $("#txtServiceDesc").prop("disabled", true);
                            $("#txtServiceShortDesc").prop("disabled", true);
                            $("#cboGender").prop("disabled", true);
                            $("#txtInternalServiceCode").prop("disabled", true);
                            $("#chkBillable").prop("disabled", true);
                            $("#chkActiveStatus").prop("disabled", true);
                            $("#dvParameters").addClass("disable-Param");

                            $("#pnlAddServiceCode .mdl-card__title-text").text(localization.ViewService);
                            $("#btnSMAdd").hide();
                            $("#dvServiceCode").show();
                            ServiceID = data.node.id;
                            fnFillServiceDetail(ServiceID);

                        });

                        $('#Edit').on('click', function () {
                            if (_userFormRole.IsEdit === false) {
                                $('#dvServiceCode').hide();
                                fnAlert("w", "EMS_01_00", "UIC02", errorMsg.editauth_E2);
                                return;
                            }

                            $("#txtServiceDesc").prop("disabled", false);
                            $("#txtServiceShortDesc").prop("disabled", false);
                            $("#cboGender").prop("disabled", false);
                            $("#txtInternalServiceCode").prop("disabled", false);
                            $("#chkBillable").prop("disabled", false);
                            $("#chkActiveStatus").prop("disabled", false);
                            $("#dvParameters").removeClass("disable-Param");

                            $("#pnlAddServiceCode .mdl-card__title-text").text(localization.EditService);
                            $("#btnSMAdd").html("<i class='fa fa-sync'></i> " + localization.Update);
                            $("#btnSMAdd").show();
                            $("#dvServiceCode").show();
                            ServiceID = data.node.id;
                            fnFillServiceDetail(ServiceID);

                        });


                    }
                }
            }
        }
    });

    $('#ServiceCodeTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#ServiceCodeTree').jstree().deselect_node(closingNode.children);
    });
}
function fnFillServiceDetail(ServiceID) {
    $.ajax({
        url: getBaseURL() + '/ServiceCodes/GetServiceCodeByID',
        data: {
            ServiceID: ServiceID
        },
        success: function (result) {
            $("#txtServiceDesc").val(result.ServiceDesc);
            $("#txtServiceShortDesc").val(result.ServiceShortDesc);
            $("#txtInternalServiceCode").val(result.InternalServiceCode);
            $("#cboGender").val(result.Gender);
            $('#cboGender').selectpicker('refresh');
            $("#cboServicesFor").val(result.ServiceFor);
            $('#cboServicesFor').selectpicker('refresh'); 

            if (result.ActiveStatus == true) {
                $('#chkActiveStatus').parent().addClass("is-checked");
            }
            else {
                $('#chkActiveStatus').parent().removeClass("is-checked");
            };

            //eSyaParams.ClearValue();
            //eSyaParams.SetJSONValue(result.l_ServiceParameter);
        }
    });

}
function fnAddOrUpdateServiceCode() {
    if ($("#cboServicesFor").val() == "" || $("#cboServicesFor").val() == null || $("#cboServicesFor").val() == undefined || $("#cboServicesFor").val() == "0") {
        fnAlert("w", "EMS_01_00", "UI0192", "Please select Services For");
        return false;
    }
    if (ServiceClassID == "0" && ServiceID == "0") {
        fnAlert("w", "EMS_01_00", "UI0191", errorMsg.SelectServiceClass_E6);
        return false;
    };

    var txtServiceDesc = $("#txtServiceDesc").val();
    if (txtServiceDesc == "" || txtServiceDesc == null || txtServiceDesc == undefined) {
        fnAlert("w", "EMS_01_00", "UI0192", errorMsg.ServiceDesc_E7);
        return false;
    }

    

    else {

        $("#btnSMAdd").attr("disabled", true);
      /*  var sPar = eSyaParams.GetJSONValue();*/
        var obj = {
            //ServiceTypeID: ServiceTypeID,
            //ServiceGroupID: ServiceGroupID,
            ServiceClassId: ServiceClassID,
            ServiceId: ServiceID,
            ServiceFor: $("#cboServicesFor").val(),
            ServiceDesc: $("#txtServiceDesc").val(),
            ServiceShortDesc: $("#txtServiceShortDesc").val(),
            InternalServiceCode: $("#txtInternalServiceCode").val(),
            Gender: $("#cboGender").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
           /* l_ServiceParameter: sPar*/
        }
        $.ajax({
            url: getBaseURL() + '/ServiceCodes/AddOrUpdateServiceCode',
            type: 'POST',
            datatype: 'json',
            data: {
                obj
            },
            success: function (response) {
                if (response.Status == true) {
                    if (ServiceID == 0) {
                        fnAlert("s", "EMS_01_00", response.StatusCode, response.Message);
                        $("#txtServiceDesc").val('');
                        $("#txtServiceShortDesc").val('');
                        $("#txtInternalServiceCode").val('');
                        $("#cboGender").val('A');
                        $('#cboGender').selectpicker('refresh');
                        $("#cboServicesFor").val('0');
                        $('#cboServicesFor').selectpicker('refresh');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        ServiceID = "0";
                  

                    }
                    else {
                        fnAlert("s", "EMS_01_00", response.StatusCode, response.Message);
                    }
                    $("#ServiceCodeTree").jstree("destroy");
                    fnLoadServiceCodeTree();

                }
                else {
                    fnAlert("e", "EMS_01_00", response.StatusCode, response.Message);
                }
                $("#btnSMAdd").attr("disabled", false);
            },
            error: function (error) {
                fnAlert("e", "EMS_01_00", error.StatusCode, error.statusText);
                $("#btnSMAdd").attr("disabled", false);
            }
        });
    }
}
function fnExpandAll() {
    $("#ServiceCodeTree").jstree('open_all');
}
function fnCollapseAll() {
    $("#ServiceCodeTree").jstree('close_all');
    $("#dvServiceCode").hide();
}

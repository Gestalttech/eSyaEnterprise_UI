var ServiceID = "0";
var prevSelectedID = '';
var Editable = false;
$(document).ready(function () {
    fnLoadServiceBusinessLocationTree();
});
function fnLoadServiceBusinessLocationTree() {
    $.ajax({
        url: getBaseURL() + '/ServiceCodes/GetServiceCodes',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#jstServiceBusinessLocationTree").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstServiceBusinessLocationTree");
            $(window).on('resize', function () {
                fnTreeSize("#jstServiceBusinessLocationTree");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

    $("#jstServiceBusinessLocationTree").on('loaded.jstree', function () {
        $("#jstServiceBusinessLocationTree").jstree()._open_to(prevSelectedID);
        $('#jstServiceBusinessLocationTree').jstree().select_node(prevSelectedID);
       
    });

    $('#jstServiceBusinessLocationTree').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvServiceBusinessLink").hide();

                var parentNode = $("#jstServiceBusinessLocationTree").jstree(true).get_parent(data.node.id);

                if (parentNode == "#" || parentNode.startsWith('T') || parentNode == "SM") {
                    $("#dvServiceBusinessLink").hide();
                }
                else if (parentNode.startsWith('G') || parentNode.startsWith('C')) {

                    if (data.node.id.startsWith('C')) {
                        $("#dvServiceBusinessLink").hide();
                    }
                    else {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" title='+localization.View +' style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#555555"aria-hidden="true"></i></span>')
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" title='+localization.Edit +' style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#555555"aria-hidden="true"></i></span>')
                        $('#View').on('click', function () {
                            if (_userFormRole.IsView === false) {
                                $('#dvServiceBusinessLink').hide();
                                fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
                                return;
                            }
                            Editable = false;
                            ServiceID = data.node.id;
                            $("#txtServiceDesc").val(data.node.text);
                            $("#pnlAddServiceBusinessLink .mdl-card__title-text").text(localization.ViewServiceBusinessLinkServiceWise);
                            fnLoadServiceBusinessLinkGrid(ServiceID, Editable);
                            $("#btnSave").hide();
                           
                            $("#divParameterTable").css('display', 'none');
                        });

                        $('#Edit').on('click', function () {
                            if (_userFormRole.IsEdit === false) {
                                $('#dvServiceBusinessLink').hide();
                                fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
                                return;
                            }
                            Editable = true;
                            ServiceID = data.node.id;
                            $("#txtServiceDesc").val(data.node.text);
                            $("#pnlAddServiceBusinessLink .mdl-card__title-text").text(localization.EditServiceBusinessLinkServiceWise);
                            fnLoadServiceBusinessLinkGrid(ServiceID, Editable);
                            $("#btnSave").show();
                            $("#divParameterTable").css('display', 'none');

                        });


                    }
                }
            }
        }
    });

    $('#jstServiceBusinessLocationTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstServiceBusinessLocationTree').jstree().deselect_node(closingNode.children);
    });
}

function fnLoadServiceBusinessLinkGrid(ServiceID, Editable) {
    var disabled = false; var lastSel = '';
    if (Editable === false) {
        disabled = true;
    }
    $("#jqgServiceBusinessLink").jqGrid('GridUnload');
    $("#jqgServiceBusinessLink").jqGrid({
        url: getBaseURL() + '/ServiceCodes/GetServiceBusinessLocations?ServiceId=' + ServiceID,
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ServiceID, localization.BusinessKey, localization.BusinessLocation, localization.Active],
        colModel: [
            { name: "ServiceId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "BusinessKey", width: 10, editable: false, align: 'left', hidden: true },
            { name: "LocationDescription", width: 120, editable: false, align: 'left', edittype: 'text' },
            { name: "ActiveStatus", editable: Editable, width: 60, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } }
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to View",
        pager: "#jqpServiceBusinessLink",
        viewrecords: false,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: false,
        //editurl: 'url',
        scrollOffset: 0,
        cellsubmit: 'clientArray',
        caption: localization.ServiceBusinessLink,
        onSelectRow: function (rowid, status, e) {
            $("#divParameterTable").css('display', 'block');
            fnFillServiceParams(event);
        },
        ondblClickRow: function (rowid) {
           
        },
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgServiceBusinessLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            fnJqgridSmallScreen("jqgServiceBusinessLink");
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-btable,.ui-jqgrid-htable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
            $("#dvServiceBusinessLink").show();
        }
    }).jqGrid('navGrid', '#jqpServiceBusinessLink', { add: false, edit: false, search: false, del: false, refresh: false });
    if (Editable === true) {
        $("#btnSave").show();
    }
    else {
        $("#btnSave").hide();
    }
    $("#jqgServiceBusinessLink tr").on('click',function () {
        
    });
}
function fnUpdateServiceBusinessLink() {

    if (IsStringNullorEmpty(servId) || servId === "0") {
        fnAlert("w", "EMS_03_00", "UI0303", errorMsg.selectBusinessLoc_E6);
        return;
    }
    if (IsStringNullorEmpty(businessloc) || businessloc === "0") {
        fnAlert("w", "EMS_03_00", "UI0303", errorMsg.selectBusinessLoc_E6);
        return;
    }
    var serviceParams = eSyaParams.GetJSONValue();

    $("#btnSave").attr("disabled", true);
    objmap = {
        BusinessKey: businessloc,
        ServiceId: servId,
        l_ServiceParameter: serviceParams

    };
    $.ajax({
        url: getBaseURL() + '/ServiceCodes/UpdateServiceBusinessLocations',
        type: 'POST',
        datatype: 'json',
        data: {
            obj: objmap
        },
        success: function (response) {
            if (response.Status == true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnCollapseAll();
                fnCollapseServiceParameter();
                fnExpandAll();
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
var servId = "0";
var businessloc = "0";
function fnFillServiceParams(e) {
    var rowid = $("#jqgServiceBusinessLink").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgServiceBusinessLink').jqGrid('getRowData', rowid);
    servId = rowData.ServiceId;
    businessloc = rowData.BusinessKey;
    $.ajax({
        url: getBaseURL() + '/ServiceCodes/GetServiceBusinessLocationParameters?serviceId=' + rowData.ServiceId + '&businessKey=' + rowData.BusinessKey,
        
        success: function (result) {
            if (result != null) {
                eSyaParams.ClearValue();
                eSyaParams.SetJSONValue(result.l_ServiceParameter);
            }
            else {
                eSyaParams.ClearValue();
            }
        }
    })
}
function fnExpandAll() {
    $("#jstServiceBusinessLocationTree").jstree('open_all');
}

function fnCollapseAll() {
    fnClearFields();
    $("#jstServiceBusinessLocationTree").jstree('close_all');
    $("#dvServiceBusinessLink").hide();
    $("#divParameterTable").css('display', 'none');
}
function fnCollapseServiceParameter() {
    fnClearFields();
    $("#dvServiceBusinessLink").hide();
    $("#divParameterTable").css('display', 'none');
    fnLoadServiceBusinessLocationTree();
}
function fnClearFields() {
    eSyaParams.ClearValue();
    $("#txtServiceDesc").val('');
     servId = "0";
     businessloc = "0";
}

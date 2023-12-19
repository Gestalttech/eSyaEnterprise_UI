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
            $("#ServiceBusinessLocationTree").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#ServiceBusinessLocationTree");
            $(window).on('resize', function () {
                fnTreeSize("#ServiceBusinessLocationTree");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

    $("#ServiceBusinessLocationTree").on('loaded.jstree', function () {
        $("#ServiceBusinessLocationTree").jstree()._open_to(prevSelectedID);
        $('#ServiceBusinessLocationTree').jstree().select_node(prevSelectedID);
    });

    $('#ServiceBusinessLocationTree').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvServiceBusinessLink").hide();

                var parentNode = $("#ServiceBusinessLocationTree").jstree(true).get_parent(data.node.id);

                if (parentNode == "#" || parentNode.startsWith('T') || parentNode == "SM") {
                    $("#dvServiceBusinessLink").hide();
                }
                else if (parentNode.startsWith('G') || parentNode.startsWith('C')) {

                    if (data.node.id.startsWith('C')) {
                        $("#dvServiceBusinessLink").hide();
                    }
                    else {
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
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
                            $("#btnSMAdd").hide();
                            $("#dvServiceBusinessLink").show();

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
                            $("#btnSMAdd").hide();
                            $("#dvServiceBusinessLink").show();


                        });


                    }
                }
            }
        }
    });

    $('#ServiceBusinessLocationTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#ServiceBusinessLocationTree').jstree().deselect_node(closingNode.children);
    });
}

function fnLoadServiceBusinessLinkGrid(ServiceID, Editable) {
    var disabled = false;
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
        colNames: ["Service ID", "Business Key", "BusinessLocation", "Active"],
        colModel: [
            { name: "ServiceId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "BusinessKey", width: 10, editable: false, align: 'left', hidden: true },
            { name: "LocationDescription", width: 220, editable: false, align: 'left', edittype: 'text' },
            { name: "ActiveStatus", editable: Editable, width: 220, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } }
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpServiceBusinessLink",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',
        scrollOffset: 0,
        cellsubmit: 'clientArray',
        caption: 'Service Business Link',
        onSelectRow: function (id) {
            if (id) { $('#jqgServiceBusinessLink').jqGrid('editRow', id, true); }
        },
        ondblClickRow: function (rowid) {
        },
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgServiceBusinessLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            fnJqgridSmallScreen("jqgServiceBusinessLink");
        }
    }).jqGrid('navGrid', '#jqpServiceBusinessLink', { add: false, edit: false, search: false, del: false, refresh: false });
    if (Editable === true) {
        $("#btnSave").show();
    }
    else {
        $("#btnSave").hide();
    }

}
function fnUpdateServiceBusinessLink() {
    var ServiceBusinessLink = $('#jqgServiceBusinessLink').jqGrid("getRowData");
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
    $("#ServiceBusinessLocationTree").jstree('open_all');
}
function fnCollapseAll() {
    $("#ServiceBusinessLocationTree").jstree('close_all');
    $("#dvServiceBusinessLink").hide();
}

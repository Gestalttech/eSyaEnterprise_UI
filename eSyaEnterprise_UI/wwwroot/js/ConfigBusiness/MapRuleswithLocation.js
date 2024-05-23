var RuleID = "0";
var ProcessID = "0";
var prevSelectedID = '';
var _IsEditClicked = '';
var _IsViewClicked = '';
$(document).ready(function () {
    fnLoadServiceBusinessLocationTree();
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSaveRulestolocation").attr("disabled", _userFormRole.IsInsert === false);
});

function fnLoadServiceBusinessLocationTree() {
    $.ajax({
        url: getBaseURL() + '/ApplicationRules/GetProcessRulesMapwithLocation',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (result) {
            $("#jstMapRuleswithLocation").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstMapRuleswithLocation");
            $(window).on('resize', function () {
                fnTreeSize("#jstMapRuleswithLocation");
            })

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

    $("#jstMapRuleswithLocation").on('loaded.jstree', function () {
        $("#jstMapRuleswithLocation").jstree()._open_to(prevSelectedID);
        $('#jstMapRuleswithLocation').jstree().select_node(prevSelectedID);
    });
    $('#jstMapRuleswithLocation').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvMapRuleWithLocation").hide();

                var parentNode = $("#jstMapRuleswithLocation").jstree(true).get_parent(data.node.id);

                // If Parent node is selected
                if (parentNode == "#") {
                    $("#dvMapRuleWithLocation").hide();
                }
                // If Type node is selected
                else if (parentNode == "SG") {
                    // $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')


                    RuleID = "0";
                    ProcessID = "0";


                }
                // If Child node is selected
                else {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#dvMapRuleWithLocation').hide();
                            fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        $("#pnlAddMapRuleWithLocation .mdl-card__title-text").text(localization.ViewMapRuleWithLocation);
                        $("#btnSaveRulestolocation").hide();

                        RuleID = data.node.id.split("-")[1];
                        ProcessID = data.node.parent;

                        fnFillGridMappedRuleswithLocation(ProcessID, RuleID);
                        $("#dvMapRuleWithLocation").css('display', 'block');
                        _IsViewClicked = 1; _IsEditClicked = 0;

                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvMapRuleWithLocation').hide();
                            fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $("#pnlAddMapRuleWithLocation .mdl-card__title-text").text(localization.EditMapRuleWithLocation);
                        $("#btnSaveRulestolocation").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnSaveRulestolocation").show();
                        RuleID = data.node.id.split("-")[1];
                        ProcessID = data.node.parent;

                        fnFillGridMappedRuleswithLocation(ProcessID, RuleID);
                        $("#dvMapRuleWithLocation").css('display', 'block');
                        _IsViewClicked = 0; _IsEditClicked = 1;

                    });

                }
            }
        }
    });

    $('#jstMapRuleswithLocation').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstMapRuleswithLocation').jstree().deselect_node(closingNode.children);
    });

}

function fnSaveRuleswithLocations() {

    if (ProcessID == "0" || ProcessID == null || ProcessID == undefined) {
        fnAlert("w", "ECB_05_00", "UI0072", errorMsg.ProcessId_E4);
        return;
    }
    if (RuleID == "0" || RuleID == null || RuleID == undefined) {
        fnAlert("w", "ECB_05_00", "UI0075", errorMsg.RuleID_E15);
        return;
    }

    $("#jqgMapRuleswithLocation").jqGrid('editCell', 0, 0, false);

    $("#btnSaveRulestolocation").attr("disabled", true);
    var obj = [];
    var gvT = $('#jqgMapRuleswithLocation').jqGrid('getRowData');

    for (var i = 0; i < gvT.length; ++i) {

        var objlink = {
            BusinessKey: gvT[i]['BusinessKey'],
            RuleId: RuleID,
            ProcessId: ProcessID,
            ActiveStatus: gvT[i]['ActiveStatus']
        }
        obj.push(objlink);

    }
    $.ajax({
        url: getBaseURL() + '/ApplicationRules/InsertOrUpdateProcessRulesMapwithLocation',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        async: false,
        success: function (response) {
            if (response.Status == true) {

                fnAlert("s", "", response.StatusCode, response.Message);
                $("#jstMapRuleswithLocation").jstree("destroy");
                fnLoadServiceBusinessLocationTree();
                $("#dvMapRuleWithLocation").hide();
                $("#btnSaveRulestolocation").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveRulestolocation").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveRulestolocation").attr("disabled", false);
        }
    });

}
function fnExpandAll() {
    $("#jstMapRuleswithLocation").jstree('open_all');
}
function fnCollapseAll() {
    $("#jstMapRuleswithLocation").jstree('close_all');
    $('#dvMapRuleWithLocation').hide();
}

function fnFillGridMappedRuleswithLocation(ProcessID, RuleID) {

    $("#jqgMapRuleswithLocation").jqGrid('GridUnload');
    $("#jqgMapRuleswithLocation").jqGrid({
        url: getBaseURL() + '/ApplicationRules/GetProcessRulesMappedwithLocationByID?processID=' + ProcessID + "&ruleID=" + RuleID,
        datatype: 'json',
        mtype: 'GET',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["", localization.LocationDescription, localization.ActiveStatus],
        colModel: [

            { name: "BusinessKey", width: 180, align: 'left', editable: false, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "LocationDescription", width: 250, align: 'left', editable: false, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ActiveStatus", width: 80, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
        ],
        pager: "#jqpMapRuleswithLocation",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: false,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        caption: localization.MapRuleswithLocation,
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgMapRuleswithLocation");
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');

        },
        rowattr: function (data) {
            if (_IsViewClicked == 1) {
                if ((data.ActiveStatus == false) || (data.ActiveStatus == true)) {
                    return { "class": "ui-state-disabled" };
                }
            }
        },
        onSelectRow: function (id) {
            if (id) { $('#jqgMapRuleswithLocation').jqGrid('editRow', id, true); }
        },

    }).jqGrid('navGrid', '#jqpMapRuleswithLocation', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' });
    fnAddGridSerialNoHeading();
}

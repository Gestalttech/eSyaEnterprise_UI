$(function () {
    fnLoadFormsTree();
});
var prevSelectedID = "";
function fnLoadFormsTree() {

    $.ajax({
        url: getBaseURL() + '',
        type: 'Post',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            /*uncomment the next line which is commented and remove the code till the comment word ended as 'ends'*/
            //$("#jstManageSMSLocation").jstree({ core: { data: result, multiple: false } });
                $("#jstManageSMSLocation").jstree({
                core: {
                    
                        'data' : [
                            { "id": "ajson2", "parent": "#", "text": "Root node 2" },
                            { "id": "ajson3", "parent": "ajson2", "text": "Child 1" },
                            { "id": "ajson4", "parent": "ajson2", "text": "Child 2" },
                            ],
                 multiple: false
                }
            });
            // Remove Till here -- ends


            fnTreeSize("#jstManageSMSLocation");
            $(window).on('resize', function () {
                fnTreeSize("#jstManageSMSLocation");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

    $("#jstManageSMSLocation").on('loaded.jstree', function () {
        $("#jstManageSMSLocation").jstree()._open_to(prevSelectedID);
        $('#jstManageSMSLocation').jstree().select_node(prevSelectedID);
    });

    $('#jstManageSMSLocation').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                var parentNode = $("#jstManageSMSLocation").jstree(true).get_parent(data.node.id);

                if (parentNode == "FM") {

                    $("#lblSelectedFormName").text(data.node.text);
                    FormID = data.node.id;
                    fnGridLoadSMSLocationWise(FormID);
                    $("#pnlLinkedSMS").css('display', 'block');
                }
                else {
                    $("#pnlLinkedSMS").css('display', 'none');
                }

            }
        }
    });
    $('#jstManageSMSLocation').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstManageSMSLocation').jstree().deselect_node(closingNode.children);
    });
}
function fnGridLoadSMSLocationWise(_FormID) {
    $("#jqgSMSLocationWise").jqGrid('GridUnload');
    $("#jqgSMSLocationWise").jqGrid({
        url: '',
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.SMSID, localization.SMSDescription, localization.IsVariable, localization.TriggeringEvent, localization.TriggeringEvent, localization.SMSStatement, localization.Active],
        colModel: [
            { name: "Smsid", width: 70, editable: true, align: 'left' },
            { name: "Smsdescription", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "IsVariable", width: 45, editable: true, align: 'center', hidden: false, resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "Tevent", width: 70, align: 'center', resizable: false, editoption: { 'text-align': 'left', maxlength: 25 }, hidden: true },
            { name: "TEventDesc", width: 70, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 250 } },
            { name: "Smsstatement", width: 150, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 250 } },
            { name: "ActiveStatus", editable: true, width: 48, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
            ],
        pager: "#jqpSMSLocationWise",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0, caption: localization.SMSLocationWise,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen("jqgSMSLocationWise");

        },

    }).jqGrid('navGrid', '#jqpSMSLocationWise', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpSMSLocationWise', {
        caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshGridSMSLocationWise
    })
    fnAddGridSerialNoHeading();
    $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
}

 
function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
function fnRefreshGridSMSLocationWise() {
    $("#jqgSMSLocationWise").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnExpandAllSMSLocWise() {
    $("#jstManageSMSLocation").jstree('open_all');
    fnTreeSize("#jstManageSMSLocation");
}

function fnCollapseAllSMSLocWise() {
    $("#jstManageSMSLocation").jstree('close_all');
}


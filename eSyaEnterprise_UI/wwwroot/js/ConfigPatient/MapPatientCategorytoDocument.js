var NodeID;
var prevSelectedID;
function fnBusinessKey_OnChange() {
    var _businesskey = $("#cboBusinessKey").val();
    var _patienttype = $("#cboPatientTypes").val();
    $("#pnlMapPatientCategoryDocument").hide();
    if (_businesskey == 0 || _patienttype == 0) {
        $("#jstMapPatientCategoryDocument").jstree('destroy').empty();
    }
    else {
        $("#jstMapPatientCategoryDocument").jstree('destroy').empty();
        fnLoadPatientCategoryTree();
    }
}
function fnPatientType_OnChange() {
    var _businesskey = $("#cboBusinessKey").val();
    var _patienttype = $("#cboPatientTypes").val();
    $("#pnlMapPatientCategoryDocument").hide();
    if (_businesskey == 0 || _patienttype == 0) {
        $("#jstMapPatientCategoryDocument").jstree('destroy').empty();

    }
    else {
        $("#jstMapPatientCategoryDocument").jstree('destroy').empty();
        fnLoadPatientCategoryTree();
    }
}

function fnLoadPatientCategoryTree() {
    $.ajax({
        url: getBaseURL() + '/ConfigPatient/Document/GetPatientCategoriesforTreeViewbyPatientType?PatientTypeId=' + $("#cboPatientTypes").val(),
        success: function (result) {
            fnGetPatientCategory_Success(result);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function fnGetPatientCategory_Success(dataArray) {

    $("#jstMapPatientCategoryDocument").jstree({
        "state": { "checkbox_disabled": true },
        "checkbox": {
            "keep_selected_style": false
        },
        core: { 'data': dataArray, 'check_callback': true, 'multiple': true }

    });

    $("#jstMapPatientCategoryDocument").on('loaded.jstree', function () {
        $("#jstMapPatientCategoryDocument").jstree('open_all');
        $("#jstMapPatientCategoryDocument").jstree()._open_to(prevSelectedID);
        $('#jstMapPatientCategoryDocument').jstree().select_node(prevSelectedID);

    });

    $('#jstMapPatientCategoryDocument').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                if (data.node.id == "0") {

                    $("#pnlMapPatientCategoryDocument").hide();
                }
                else {


                    $('#Add').remove();

                    $("#pnlMapPatientCategoryDocument").hide();

                    if (data.node.parent == "#") {
                        $('#pnlMapPatientCategoryDocument').hide();
                    }
                    else if (data.node.id.startsWith("FM")) {

                        NodeID = 0;
                        NodeID = data.node.id.substring(2).split("_")[1];
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#Add').on('click', function () {
                            if (_userFormRole.IsInsert === false) {
                                fnAlert("w", "EPM_03_00", "UIC01", errorMsg.addauth_E1);
                                return;
                            }
                            $('#pnlMapPatientCategoryDocument').hide();

                            fnGridLoadPatientCategoryDocument(NodeID);

                            $("#pnlMapPatientCategoryDocument").show();
                            $(".mdl-card__title-text").text(localization.AddPatientCategory);
                            $("#btnAddMapPatientCategoryDocument").show();
                            $("#btnAddMapPatientCategoryDocument").html('<i class="fa fa-save"></i> ' + localization.Save);


                        });
                    }
                    else {

                        $("#pnlMapPatientCategoryDocument").hide();
                    }
                }
            }
        }
    });

    $('#jstMapPatientCategoryDocument').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstMapPatientCategoryDocument').jstree().deselect_node(closingNode.children);
    });
    fnTreeSize("#jstMapPatientCategoryDocument");
};

function fnGridLoadPatientCategoryDocument(nodeID) {

    $("#jqgPatientCategoryDocument").GridUnload();

    $("#jqgPatientCategoryDocument").jqGrid({
        url: getBaseURL() + '/ConfigPatient/Document/GetPatientTypeCategoryDocumentInfo?businesskey=' + $("#cboBusinessKey").val() + '&PatientTypeId=' + $("#cboPatientTypes").val() + '&PatientCategoryId=' + nodeID,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.DocumentID, localization.DocumentDesc, localization.Active],
        colModel: [
            { name: "PatientCatgDocId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "PatientCatgoryDocumentDesc", width: 500, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ActiveStatus", editable: true, width: 100, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
        ],
        pager: "#jqpPatientCategoryDocument",
        rowNum: 10000,
        pgtext: null,
        pgbuttons:null,
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
        caption: localization.MapPatientCategoryDocument,
        loadComplete: function (data) {

            if (data == null) {
                $("#pnlMapPatientCategoryDocument").hide();
                fnAlert("w", "EPM_03_00", "UI0310", errorMsg.NoDoc_E14);
            }
            fnJqgridSmallScreen("jqgPatientCategoryDocument");
        },
        loadBeforeSend: function () {
            $("[id*='_edit']").css('text-align', 'center');
        },
        onSelectRow: function (rowid, status, e) {
        },
    }).jqGrid('navGrid', '#jqpPatientCategoryDocument', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpPatientCategoryDocument', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPatientCategoryDocument
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgPatientCategoryDocument"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnSavePatientTypeCategoryDocumentLink() {

    if (fnValidateDocumentLink() === false) {
        return;
    }
    $("#jqgPatientCategoryDocument").jqGrid('editCell', 0, 0, false).attr("value");

    $("#btnAddMapPatientCategoryDocument").attr('disabled', true);


    var obj = [];
    var gvT = $('#jqgPatientCategoryDocument').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {

        var _spec = {
            BusinessKey: $("#cboBusinessKey").val(),
            PatientTypeId: $("#cboPatientTypes").val(),
            PatientCategoryId: NodeID,
            PatientCatgDocId: gvT[i]['PatientCatgDocId'],
            PatientCatgoryDocumentDesc: gvT[i]['PatientCatgoryDocumentDesc'],
            ActiveStatus: gvT[i]['ActiveStatus']
        };
        obj.push(_spec);

    }

    $.ajax({
        url: getBaseURL() + '/ConfigPatient/Document/InsertOrUpdatePatientCategoryDocumentLink',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $('#pnlMapPatientCategoryDocument').hide();
                $("#btnAddMapPatientCategoryDocument").attr('disabled', false);
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnAddMapPatientCategoryDocument").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnAddMapPatientCategoryDocument").attr('disabled', false);
        }
    });
}

function fnValidateDocumentLink() {

    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $("#cboBusinessKey").val() == "0" || $("#cboBusinessKey").val() == 0) {
        fnAlert("w", "EPM_03_00", "UI0064", errorMsg.BusinessLocation_E11);
        return false;
    }

    if (IsStringNullorEmpty($("#cboPatientTypes").val()) || $("#cboPatientTypes").val() == "0" || $("#cboPatientTypes").val() == 0) {
        fnAlert("w", "EPM_03_00", "UI0274", errorMsg.PatientType_E12);
        return false;
    }
    if (IsStringNullorEmpty(NodeID) || NodeID == "0" || NodeID == 0) {
        fnAlert("w", "EPM_03_00", "UI0275", errorMsg.PatientCategory_E13);
        return false;
    }
}
function fnExpandAll() {
    $('#jstMapPatientCategoryDocument').jstree('open_all');
}

function fnCollapseAll() {
    $("#pnlMapPatientCategoryDocument").hide();
    $('#jstMapPatientCategoryDocument').jstree('close_all');
}

function fnGridRefreshPatientCategoryDocument() {
    $("#jqgPatientCategoryDocument").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}


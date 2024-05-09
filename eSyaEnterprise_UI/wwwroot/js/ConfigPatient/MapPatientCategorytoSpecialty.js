var NodeID;
var prevSelectedID;
function fnBusinessKey_OnChange() {
    var _businesskey = $("#cboBusinessKey").val();
    var _patienttype = $("#cboPatientTypes").val();
    $("#pnlMapPatientCategorySpecialty").hide();
    if (_businesskey == 0 || _patienttype == 0) {
        $("#jstMapPatientCategorySpecialty").jstree('destroy').empty();
    }
    else {
        $("#jstMapPatientCategorySpecialty").jstree('destroy').empty();
        fnLoadPatientCategoryTree();
    }
}
function fnPatientType_OnChange() {
    var _businesskey = $("#cboBusinessKey").val();
    var _patienttype = $("#cboPatientTypes").val();
    $("#pnlMapPatientCategorySpecialty").hide();
    if (_businesskey == 0 || _patienttype == 0) {
        $("#jstMapPatientCategorySpecialty").jstree('destroy').empty();
        
    }
    else {
        $("#jstMapPatientCategorySpecialty").jstree('destroy').empty();
        fnLoadPatientCategoryTree();
    }
}

function fnLoadPatientCategoryTree() {
    $.ajax({
        url: getBaseURL() + '/ConfigPatient/Specialty/GetPatientCategoriesforTreeViewbyPatientType?PatientTypeId=' + $("#cboPatientTypes").val(),
        success: function (result) {
            fnGetPatientCategory_Success(result);
         },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function fnGetPatientCategory_Success(dataArray) {
  
    $("#jstMapPatientCategorySpecialty").jstree({
        "state": { "checkbox_disabled": true },
        "checkbox": {
            "keep_selected_style": false
        },
        core: { 'data': dataArray, 'check_callback': true, 'multiple': true }

    });

    $("#jstMapPatientCategorySpecialty").on('loaded.jstree', function () {
        $("#jstMapPatientCategorySpecialty").jstree('open_all');
        $("#jstMapPatientCategorySpecialty").jstree()._open_to(prevSelectedID);
        $('#jstMapPatientCategorySpecialty').jstree().select_node(prevSelectedID);

    });

    $('#jstMapPatientCategorySpecialty').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                if (data.node.id == "0") {
                     
                    $("#pnlMapPatientCategorySpecialty").hide();
                }
                else {

                    
                    $('#Add').remove();

                    $("#pnlMapPatientCategorySpecialty").hide();

                    if (data.node.parent == "#") {
                        $('#pnlMapPatientCategorySpecialty').hide();
                    }
                    else if (data.node.id.startsWith("FM")) {

                        NodeID = 0;
                        NodeID = data.node.id.substring(2).split("_")[1];
                        $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                        $('#Add').on('click', function () {
                            if (_userFormRole.IsInsert === false) {
                                fnAlert("w", "EPM_04_00", "UIC01", errorMsg.addauth_E1);
                                return;
                            }
                            $('#pnlMapPatientCategorySpecialty').hide();
                             
                            fnGridLoadPatientCategorySpecialty(NodeID);

                            $("#pnlMapPatientCategorySpecialty").show();
                            $(".mdl-card__title-text").text(localization.AddPatientCategory);
                            $("#btnAddMapPatientCategorySpecialty").show();
                            $("#btnAddMapPatientCategorySpecialty").html('<i class="fa fa-save"></i> ' + localization.Save);


                        });
                    }
                    else {
                         
                        $("#pnlMapPatientCategorySpecialty").hide();
                    }
                }
            }
        }
    });

    $('#jstMapPatientCategorySpecialty').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstMapPatientCategorySpecialty').jstree().deselect_node(closingNode.children);
    });
    fnTreeSize("#jstMapPatientCategorySpecialty");
};

function fnGridLoadPatientCategorySpecialty(nodeID) {

    $("#jqgPatientCategorySpecialty").GridUnload();

    $("#jqgPatientCategorySpecialty").jqGrid({
        url: getBaseURL() + '/ConfigPatient/Specialty/GetPatientTypeCategorySpecialtyInfo?businesskey=' + $("#cboBusinessKey").val() + '&PatientTypeId=' + $("#cboPatientTypes").val() + '&PatientCategoryId=' + nodeID,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.SpecialtyId, localization.SpecialtyDesc, localization.Active],
        colModel: [
            { name: "SpecialtyId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "SpecialtyDesc", width: 500, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ActiveStatus", editable: true, width: 100, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
         ],
        pager: "#jqpPatientCategorySpecialty",
        rowNum: 10000,
        pgtext: null,
        pgbuttons: null,
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
        caption: localization.MapPatientCategorySpecialty,
        loadComplete: function (data) {
            
            if (data == null) {
                $("#pnlMapPatientCategorySpecialty").hide();
                fnAlert("w", "EPM_04_00", "UI0309", errorMsg.RestrictedSpecialty_E6);
            } 
            fnJqgridSmallScreen("jqgPatientCategorySpecialty");
        },
        loadBeforeSend: function () {
            $("[id*='_edit']").css('text-align', 'center');
        },
        onSelectRow: function (rowid, status, e) {
        },
    }).jqGrid('navGrid', '#jqpPatientCategorySpecialty', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpPatientCategorySpecialty', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPatientCategorySpecialty
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgPatientCategorySpecialty"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnSavePatientTypeCategorySpecialtyLink() {

    if (fnValidateSpecialtyLink() === false) {
        return;
    }
    $("#jqgPatientCategorySpecialty").jqGrid('editCell', 0, 0, false).attr("value");

    $("#btnAddMapPatientCategorySpecialty").attr('disabled', true);
   
   
    var obj = [];
    var gvT = $('#jqgPatientCategorySpecialty').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {

        var _spec = {
            BusinessKey: $("#cboBusinessKey").val(),
            PatientTypeId: $("#cboPatientTypes").val(),
            PatientCategoryId: NodeID,
            SpecialtyId: gvT[i]['SpecialtyId'],
            SpecialtyDesc: gvT[i]['SpecialtyDesc'],
            ActiveStatus: gvT[i]['ActiveStatus']
        };
        obj.push(_spec);

    }

    $.ajax({
        url: getBaseURL() + '/ConfigPatient/Specialty/InsertOrUpdatePatientCategorySpecialtyLink',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $('#pnlMapPatientCategorySpecialty').hide();
                $("#btnAddMapPatientCategorySpecialty").attr('disabled', false);
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnAddMapPatientCategorySpecialty").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnAddMapPatientCategorySpecialty").attr('disabled', false);
        }
    });
}

function fnValidateSpecialtyLink() {

    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $("#cboBusinessKey").val() == "0" || $("#cboBusinessKey").val()==0) {
        fnAlert("w", "EPM_04_00", "UI0064",errorMsg.BusinessLocation_E11);
        return false;
    }

    if (IsStringNullorEmpty($("#cboPatientTypes").val()) || $("#cboPatientTypes").val() == "0" || $("#cboPatientTypes").val() == 0) {
        fnAlert("w", "EPM_04_00", "UI0274", errorMsg.PatientType_E12);
        return false;
    }
    if (IsStringNullorEmpty(NodeID) || NodeID == "0" || NodeID == 0) {
        fnAlert("w", "EPM_04_00", "UI0275", errorMsg.PatientCategory_E13);
        return false;
    }
}
function fnExpandAll() {
    $('#jstMapPatientCategorySpecialty').jstree('open_all');
}

function fnCollapseAll() {
    $("#pnlMapPatientCategorySpecialty").hide();
    $('#jstMapPatientCategorySpecialty').jstree('close_all');
}

function fnGridRefreshPatientCategorySpecialty() {
    $("#jqgPatientCategorySpecialty").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
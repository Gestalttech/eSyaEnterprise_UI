var dcnamePrefix = "";
var _dcnamePrefix = "";
var _compositionId = "0";
var prevSelectedID = '';
var drugBrandPrefix = '';
var ItemCategoryID = "0";


$(document).ready(function () {
    $(".dot").click(function () {
        $('.filter-div').empty();
        $('.dot').removeClass('active');
        drugBrandPrefix = $(this).text();
       
        $("#divAlphabets").hide(100);
        $(this).addClass('active');
        $("#divSearch").show(500);
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        var numbers = "0123456789".split("");
        // From Single char to double char 
        if (drugBrandPrefix == "0-9") {
            $.each(numbers, function (letter) {
                $('.filter-div').addClass("animated fadeIn").append($('<span class="filter-chars">' + numbers[letter] + '</span>'));
            });
        }
        else if (drugBrandPrefix == "All") {
            $.each(alphabet, function (letter) {
                $('.filter-div').addClass("animated fadeIn").append($('<span class="filter-chars">' + alphabet[letter] + '</span>'));
            });
        }
        else {
            $.each(alphabet, function (letter) {
                $('.filter-div').addClass("animated fadeIn").append($('<span class="filter-chars">' + drugBrandPrefix + alphabet[letter].toLowerCase() + '</span>'));
            });
        }
        //Two Character alphabets Selection
        $(".filter-chars").click(function () {
            $(".filter-chars").removeClass('active');
            drugBrandPrefix = $(this).text();
           _dcnamePrefix = drugBrandPrefix;
            $("#divGridSection").css('display', 'block');
             fnGetComposition(_dcnamePrefix);
             $(this).addClass('active');
        });
        //Going Back to the A to Z Selection
        $("#lblBackToAlphabets").click(function () {
            $("#divSearch").hide(500);
            $('.filter-div').empty();
            $("#divAlphabets").show(500);
            $('.filter-char').removeClass('active');
            $("#divDrugBrandsForm").css("display", "none");
            $("#divGrid").show(500);
        })

    });
  
  $.contextMenu({
        selector: ".btn-actions",
        trigger: 'left',
        items: {
            edit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDrugFormulation(event, 'edit') } },
            view: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDrugFormulation(event, 'view') } }
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + "</span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + "</span>");
});

$("#jstFormulation").on('loaded.jstree', function () {
    $("#jstFormulation").jstree('open_all');
    fnTreeSize("#jstFormulation");
});



function fnGetComposition(_dcnamePrefix) {
    $("#divTreeSection").show(500);
    $("#jstFormulation").jstree();

    $("#jstFormulation").jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/Formulation/GetCompositionForTree?prefix=' + _dcnamePrefix,
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#jstFormulation").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstFormulation");
            $(window).on('resize', function () {
                fnTreeSize("#jstFormulation");
            })
        },
        error: function (error) {
            alert(error.statusText)
        }
    });

    $("#jstFormulation").on('loaded.jstree', function () {
        $("#jstFormulation").jstree()._open_to(prevSelectedID);
        $('#jstFormulation').jstree().select_node(prevSelectedID);
    });
    $('#jstFormulation').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                var parentNode = data.node.parent;
                // If Main node is selected
                if (parentNode == "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsAdd === false) {
                            $('#dvFormulation').css('display', 'none');
                            fnAlert("w", "EPH_06_00", "UIC03", errorMsg.addauth_E1);
                            return;
                        }

                        fnClearDrugFormulation();

                        eSyaParamsType.ClearValue("tblTreeParam");

                        fnEnableControl(false);
                        $("#btnSaveDrugFormulation").show();
                        $("#btnCancelDrugFormulation").show();
                        $('#dvFormulation').css('display', 'block');
                        $("#pnlAddFormulation .mdl-card__title-text").text(localization.AddFormulation);
                    });
                }
                else if (parentNode == "C") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#dvFormulation').css('display', 'none');
                            fnAlert("w", "EPH_06_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }

                        $('#dvFormulation').css('display', 'block');
                        $("#pnlAddFormulation .mdl-card__title-text").text(localization.ViewFormulation);
                        $('#btnICAdd').hide();
                        //ItemCategoryID = data.node.id;
                        $("input").prop("disabled", true);
                        $("#chkActiveStatus").prop("disabled", true);
                        fnClearDrugFormulation();
                        fnGridLoadDrugFormulation(data.node.id);
                        fnEnableControl(true);
                       

                        $("#btnSaveDrugFormulation").hide();
                        $("#btnCancelDrugFormulation").show();
                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvFormulation').css('display', 'none');
                            fnAlert("w", "EPH_06_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $('#dvFormulation').css('display', 'block');
                        $("#pnlAddFormulation .mdl-card__title-text").text(localization.EditFormulation);
                        $('#btnICAdd').html('<i class="fa fa-sync"></i>' + localization.Update);
                        $('#btnICAdd').show();
                        //ItemCategoryID = data.node.id;
                        $("input").prop("disabled", false);
                        $("#chkActiveStatus").prop("disabled", false);

                        fnClearDrugFormulation();
                        fnGridLoadDrugFormulation(data.node.id);
                        fnEnableControl(false);
                        $("#btnSaveDrugFormulation").show();
                        $("#btnCancelDrugFormulation").show();

                    });
                }
            }
        }
    });
}



function fnGetComposition(_dcnamePrefix) {
    $('#jstFormulation').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/Formulation/GetCompositionForTree?prefix=' + _dcnamePrefix,
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#jstFormulation').jstree({
                "state": { "checkbox_disabled": true },
               
                "plugins": ["checkbox"],
                "checkbox": {
                    "keep_selected_style": false
                },
                core: { 'data': result, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
            });
            fnProcessLoading(false);
            $("#divUserActionsforTree").css('display', 'block');
            $("#jstFormulation").on('loaded.jstree', function () {
                $("#jstFormulation").jstree('open_all');
                fnTreeSize("#jstFormulation");
            });

            $(window).on('resize', function () {
                fnTreeSize("#jstFormulation");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}


function fnGridLoadDrugFormulation() {

    $("#jqgDrugFormulation").jqGrid('GridUnload');
    $("#jqgDrugFormulation").jqGrid({
       // url: getBaseURL() + '/Formulation/GetFormulationByPrefix',
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.CompositionId, localization.FormulationId, localization.FormulationDesc, localization.DrugForm, localization.DrugFormDesc, localization.Volume, localization.MethodOfAdministration, localization.MethodOfAdministrationDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "CompositionId", width: 35, editable: true, align: 'left', hidden: true },
            { name: "FormulationId", width: 35, editable: true, align: 'left', hidden: true },
            { name: "FormulationDesc", width: 70, editable: true, align: 'left', hidden: false },
            { name: "DrugForm", width: 45, editable: true, align: 'left', hidden: true },
            { name: "DrugFormDesc", width: 45, editable: true, align: 'left', hidden: true },
            { name: "Volume", width: 45, editable: true, align: 'left', hidden: false },
            { name: "MethodOfAdministration", width: 45, editable: true, align: 'left', hidden: true },
            { name: "MethodOfAdministrationDesc", width: 45, editable: true, align: 'left', hidden: true },
            { name: "ActiveStatus", editable: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'Action', search: false, align: 'left', width: 45, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    var i = options.rowId;
                    return '<button class="mr-1 btn btn-outline btn-actions" id="btnDrugActions' + i + '"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpDrugFormulation",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
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
        scrollOffset: 0,
        caption: localization.DrugFormulation,
        loadComplete: function (data) {
            SetGridControlByAction();
        },
    }).
        jqGrid('navGrid', '#jqpDrugFormulation', { add: false, edit: false, search: true, searchtext: 'Search', del: false, refresh: false }, {}, {}, {}, {
            closeOnEscape: true,
            caption: "Search...",
            multipleSearch: true,
            Find: "Find",
            Reset: "Reset",
            odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }],
        }).jqGrid('navButtonAdd', '#jqpDrugFormulation', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddFormulation
        }).
        jqGrid('navButtonAdd', '#jqpDrugFormulation', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshFormulation
        });

    fnAddGridSerialNoHeading();
}
function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
   if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
function fnGridAddFormulation() {
    $("#PopupDrugFormulation").modal('show');
    eSyaParamsType.ClearValue("tblPopupParam");
    fnEnableControl(false);
    fnClearDrugFormulation();
    $("#btnSaveDrugFormulation").show();
    $("#btnCancelDrugFormulation").show();
 }
function fnEditDrugFormulation(e, actiontype) {

    fnClearDrugFormulation();

    var rowid = $("#jqgDrugFormulation").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDrugFormulation').jqGrid('getRowData', rowid);



    $("#btnSaveDrugFormulation").attr('disabled', false);
    $("#btnSaveDrugFormulation").show();
    $("#btnCancelDrugFormulation").show();
   
    fnGetDrugFormulationByIdforGrid(rowData.FormulationId);

    if (actiontype.trim() == "edit") {
      
        $('#PopupDrugFormulation').modal('show');

        $("#btnSaveDrugFormulation").html(localization.Update);

        fnEnableControl(false);


    }
    if (actiontype.trim() == "view") {
        $('#PopupDrugFormulation').modal('show');
        $("#btnSaveDrugFormulation").hide();
        fnEnableControl(true);
    }
}

function fnGetDrugFormulationByIdforGrid(compId) {
    $.ajax({
        url: getBaseURL() + '/Formulation/GetFormulationInfo',
        data: {
            composId: compId
        },
        success: function (result) {

            $('#txtFormulationId').val(result.FormulationId);
            $("#txtDrugFormulationDescription_p").val(result.DrugCompDesc);

            if (result.IsCombination == "true" || result.IsCombination == true) {
                $("#chkIsCombination_p").parent().addClass("is-checked");
            }
            else { $("#chkIsCombination_p").parent().removeClass("is-checked"); }

            $("#cboDrugClass_p").val(result.DrugClass).selectpicker('refresh');
            $("#cboTherapueticClass_p").val(result.TherapueticClass).selectpicker('refresh');
            $("#cboPharmacyGroup_p").val(result.PharmacyGroup).selectpicker('refresh');
            if (result.ActiveStatus == "true" || result.ActiveStatus == true) {
                $("#chkActiveStatus_p").parent().addClass("is-checked");
            }
            else { $("#chkActiveStatus_p").parent().removeClass("is-checked"); }

            eSyaParamsType.ClearValue("tblPopupParam");

            eSyaParamsType.SetJSONValue(result.l_composionparams, "tblPopupParam");

        }
    });

}

function fnGetDrugFormulationByIdforTreeview(compId) {
    $.ajax({
        url: getBaseURL() + '/Formulation/GetFormulationInfo',
        data: {
            composId: compId
        },
        success: function (result) {

            $('#txtFormulationId').val(result.FormulationId);
            $("#txtDrugFormulationDescription").val(result.DrugCompDesc);

            if (result.IsCombination == "true" || result.IsCombination == true) {
                $("#chkIsCombination").parent().addClass("is-checked");
            }
            else { $("#chkIsCombination").parent().removeClass("is-checked"); }

            $("#cboDrugClass").val(result.DrugClass).selectpicker('refresh');
            $("#cboTherapueticClass").val(result.TherapueticClass).selectpicker('refresh');
            $("#cboPharmacyGroup").val(result.PharmacyGroup).selectpicker('refresh');
            if (result.ActiveStatus == "true" || result.ActiveStatus == true) {
                $("#chkActiveStatus").parent().addClass("is-checked");
            }
            else { $("#chkActiveStatus").parent().removeClass("is-checked"); }
            eSyaParamsType.ClearValue("tblTreeParam");
            eSyaParamsType.SetJSONValue(result.l_composionparams, "tblTreeParam");
        }
    });

}
function fnEnableControl(val) {
    $("input,textarea").attr('readonly', val);
    $("select").next().attr('disabled', val);

}

function fnSaveDrugFormulation(_source) {

    if (fnValidateDrugCompositionTreeview() === false) {
        return;
    }
    else {
        $("#btnSaveDrugFormulation").attr('disabled', true);
        var genricId = $("#txtCompositionId").val();
        var cPar = eSyaParamsType.GetJSONValue("", "tblTreeParam");
        var drugFormulation;
        if (genricId === null || genricId === "") {
            drugFormulation = {
                CompositionId: 0,
                FormulationId: 0,
                FormulationDesc: ,
                DrugForm: $("#cboDrugForm").val(),
                Volume: $("#txtVolume").val(),
                MethodOfAdministration: $("#cboMethodOfAdministration").val(),
                DrugFormDesc: ,
                MethodOfAdministrationDesc: $("#txtMethodOfAdministrationDesc").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
                l_composionparams: cPar
            };
        }
        else {
            drugFormulation = {
                CompositionId: 0,
                FormulationId: 0,
                FormulationDesc: ,
                DrugForm: $("#cboDrugForm").val(),
                Volume: $("#txtVolume").val(),
                MethodOfAdministration: $("#cboMethodOfAdministration").val(),
                DrugFormDesc: ,
                MethodOfAdministrationDesc: $("#txtMethodOfAdministrationDesc").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
                l_composionparams: cPar
            };
        }


        $.ajax({
            url: getBaseURL() + '/Composition/InsertOrUpdateComposition',
            type: 'POST',
            datatype: 'json',
            data: { obj: drugFormulation },
            success: function (response) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);

                    $("#btnSaveDrugFormulation").attr('disabled', false);

                    fnClearDrugFormulation();
                    fnCancelDrugFormulation();
                    $("#jsTreeFormulation").jstree("destroy");
                    fnBackToGrid();
                    fnGetComposition();
                    fnCancelDrugCompositionPopup();
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                    $("#btnSaveDrugFormulation").attr('disabled', false);

                }

            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnSaveDrugFormulation").attr("disabled", false);
            }
        });
    }
}

function fnValidateDrugCompositionTreeview() {

    
    if ($("#cboDrugForm").val() === "0" || $("#cboDrugForm").val() === "") {
        fnAlert("w", "EPH_06_00", "UI0283", errorMsg.DrugClass_E6);
        return false;
    }
    if ($("#cboMethodOfAdministration").val() === "0" || $("#cboMethodOfAdministration").val() === "") {
        fnAlert("w", "EPH_06_00", "UI0312", errorMsg.MethodOfAdministration_E7);
        return false;
    }
    if (IsStringNullorEmpty($("#txtVolume").val())) {
        fnAlert("w", "EPH_06_00", "UI0313", errorMsg.Volume_E8);
        return false;
    }
  
}


function fnClearDrugFormulation() {

    $('#cboDrugForm').val("0").selectpicker('refresh');
    $('#cboMethodOfAdministration').val("0").selectpicker('refresh');
    $('#txtVolume').val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveDrugFormulation").html(localization.Save);
    $("#btnSaveDrugFormulation").attr("disabled", false);
    $("#btnSaveDrugFormulation").show();
    $("#btnCancelDrugFormulation").show();
    $('#txtCompositionId').val('');
    eSyaParamsType.ClearValue("tblTreeParam");
}

function fnGridRefreshFormulation() {
    $("#jqgDrugFormulation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnBackToGrid() {
    $('#PopupDrugFormulation').modal('hide');
}


function fnCancelDrugCompositionPopup() {
    $("#PopupDrugFormulation").modal('hide');
}
function fnCancelDrugComposition() {
    $("#dvFormulation").css('display', 'none');
}
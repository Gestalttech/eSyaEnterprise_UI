var dcnamePrefix = "";
var _dcnamePrefix = "";
var _compositionId = "0";
var prevSelectedID = '';
var drugBrandPrefix = '';
var ItemCategoryID = "0";

var _GridView = document.getElementById("rdGridView");
var _TreeView = document.getElementById("rdTreeView");
function fnGettheTypeofView() {

    if (_GridView.checked == true) {
        $(".dot,#lblTreeView").removeClass('active');
        $("#lblGridView").addClass('active');
        $("#divAlphabets").show(500);
        $("#divSearch,#divTreeSection,#dvComposition").hide(500);
        eSyaParamsType.ClearValue("tblPopupParam");
    }
    if (_TreeView.checked == true) {
        $(".dot,#lblGridView").removeClass('active');
        $("#lblTreeView").addClass('active');
        $("#divAlphabets").show(500);
        $("#divSearch").hide(500);
        $("#divGridSection").css('display', 'none');
        eSyaParamsType.ClearValue("tblTreeParam");
    }
}
$(document).ready(function () {

    $(".dot").click(function () {
        $('.filter-div').empty();
        $('.dot').removeClass('active');
        drugBrandPrefix = $(this).text();
        // fnGridLoadDrugCompositions(dcnamePrefix);
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
            //fnGridDrugBrands(drugBrandPrefix);
            _dcnamePrefix = drugBrandPrefix;
            if (_GridView.checked == true) {
                $("#divGridSection").css('display', 'block');
                fnGridLoadDrugCompositions(_dcnamePrefix);

            }
            if (_TreeView.checked == true) {
                fnTreeComposition(_dcnamePrefix);
            }




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
        // define which elements trigger this menu
        selector: ".btn-actions",
        trigger: 'left',
        // define the elements of the menu
        items: {
            edit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDrugComposition(event, 'edit') } },
            view: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDrugComposition(event, 'view') } }
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + "</span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + "</span>");

    //fnLoadDrugCharacteristics();
});


function fnGridLoadDrugCompositions(dcnamePrefix) {

    $("#jqgDrugCompositions").jqGrid('GridUnload');
    $("#jqgDrugCompositions").jqGrid({
        url: getBaseURL() + '/Composition/GetCompositionByPrefix?prefix=' + dcnamePrefix,
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.CompositionId, localization.IsCombination, localization.DrugCompositionDescription, "", localization.DrugClass, "", localization.TheraupaticCode, "", localization.PharmacyGroup, localization.Active, localization.Actions],
        colModel: [
            { name: "CompositionId", width: 35, editable: true, align: 'left', hidden: true },
            { name: "IsCombination", editable: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "DrugCompDesc", width: 70, editable: true, align: 'left', hidden: false },
            { name: "DrugClass", width: 45, editable: true, align: 'left', hidden: true },
            { name: "DrugClassDesc", width: 45, editable: true, align: 'left', hidden: false },
            { name: "TherapueticClass", width: 45, editable: true, align: 'left', hidden: true },
            { name: "TherapueticClassDesc", width: 45, editable: true, align: 'left', hidden: false },
            { name: "PharmacyGroup", width: 45, editable: true, align: 'left', hidden: true },
            { name: "PharmacyGroupDesc", width: 45, editable: true, align: 'left', hidden: false },
            { name: "ActiveStatus", editable: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'Action', search: false, align: 'left', width: 45, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    var i = options.rowId;
                    return '<button class="mr-1 btn btn-outline btn-actions" id="btnDrugActions' + i + '"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpDrugCompositions",
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
        caption: localization.DrugCompositions,
        loadComplete: function (data) {
            SetGridControlByAction();
        },
    }).
        jqGrid('navGrid', '#jqpDrugCompositions', { add: false, edit: false, search: true, searchtext: 'Search', del: false, refresh: false }, {}, {}, {}, {
            closeOnEscape: true,
            caption: "Search...",
            multipleSearch: true,
            Find: "Find",
            Reset: "Reset",
            odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }],
        }).jqGrid('navButtonAdd', '#jqpDrugCompositions', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddCompositions
        }).
        jqGrid('navButtonAdd', '#jqpDrugCompositions', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshCompositions
        });

    fnAddGridSerialNoHeading();
}
function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
function fnGridAddCompositions() {
    $("#PopupComposition").modal('show');
    eSyaParamsType.ClearValue("tblPopupParam");
    fnEnableControl(false);
    fnClearDrugComposition();
    $("#btnSaveDrugComposition_p").show();
    $("#btnCancelDrugComposition_p").show();
    $("#btnSaveDrugComposition_t").hide();
    $("#btnCancelDrugComposition_t").hide();
}
function fnEditDrugComposition(e, actiontype) {

    fnClearDrugComposition();

    var rowid = $("#jqgDrugCompositions").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDrugCompositions').jqGrid('getRowData', rowid);

   

    $("#btnSaveDrugComposition_p").attr('disabled', false);
    $("#btnSaveDrugComposition_p").show();
    $("#btnCancelDrugComposition_p").show();
    $("#btnSaveDrugComposition_t").hide();
    $("#btnCancelDrugComposition_t").hide();
    fnGetDrugCompositionByIdforGrid(rowData.CompositionId);

    if (actiontype.trim() == "edit") {
        //$("#divGridDrugCompositions").hide();
        //$("#divDrugCompositionsForm").css('display', 'block');
        $('#PopupComposition').modal('show');

        $("#btnSaveDrugComposition_p").html(localization.Update);

        fnEnableControl(false);
        
        
    }
    if (actiontype.trim() == "view") {
        //$("#divGridDrugCompositions").hide();
        //$("#divDrugCompositionsForm").css('display', 'block');
        $('#PopupComposition').modal('show');
        $("#btnSaveDrugComposition_p").hide();
        fnEnableControl(true);
    }
}

function fnGetDrugCompositionByIdforGrid(compId) {
    $.ajax({
        url: getBaseURL() + '/Composition/GetCompositionInfo',
        data: {
            composId: compId
        },
        success: function (result) {
           
            $('#txtCompositionId_p').val(result.CompositionId);
            $("#txtDrugCompositionDescription_p").val(result.DrugCompDesc);

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
           
            eSyaParamsType.SetJSONValue(result.l_composionparams,"tblPopupParam");

        }
    });

}

function fnGetDrugCompositionByIdforTreeview(compId) {
    $.ajax({
        url: getBaseURL() + '/Composition/GetCompositionInfo',
        data: {
            composId: compId
        },
        success: function (result) {
         
            $('#txtCompositionId').val(result.CompositionId);
            $("#txtDrugCompositionDescription").val(result.DrugCompDesc);

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

function fnSaveDrugComposition(_source) {
  
    if (_source == "Grid") {

        if (validateDrugComposition() === false) {
            return;
        }

        $("#btnSaveDrugComposition_p").attr('disabled', true);
        var genricId = $("#txtCompositionId_p").val();
        var cPar = eSyaParamsType.GetJSONValue("","tblPopupParam");
        var drugComposition;
        if (genricId === null || genricId === "") {
            drugComposition = {
                CompositionId: 0,
                IsCombination: $("#chkIsCombination_p").parent().hasClass("is-checked"),
                DrugCompDesc: $("#txtDrugCompositionDescription_p").val(),
                DrugClass: $("#cboDrugClass_p").val(),
                TherapueticClass: $("#cboTherapueticClass_p").val(),
                PharmacyGroup: $("#cboPharmacyGroup_p").val(),
                ActiveStatus: $("#chkActiveStatus_p").parent().hasClass("is-checked"),
                l_composionparams: cPar
            };
        }
        else {
            drugComposition = {
                CompositionId: $("#txtCompositionId_p").val(),
                IsCombination: $("#chkIsCombination_p").parent().hasClass("is-checked"),
                DrugCompDesc: $("#txtDrugCompositionDescription_p").val(),
                DrugClass: $("#cboDrugClass_p").val(),
                TherapueticClass: $("#cboTherapueticClass_p").val(),
                PharmacyGroup: $("#cboPharmacyGroup_p").val(),
                ActiveStatus: $("#chkActiveStatus_p").parent().hasClass("is-checked"),
                l_composionparams: cPar
            };
        }
    }
    else if (_source == "Tree") {

        if (validateDrugCompositionTreeview() === false) {
            return;
        }

        $("#btnSaveDrugComposition_t").attr('disabled', true);
        var genricId = $("#txtCompositionId").val();
        var cPar = eSyaParamsType.GetJSONValue("","tblTreeParam");
        var drugComposition;
        if (genricId === null || genricId === "") {
            drugComposition = {
                CompositionId: 0,
                IsCombination: $("#chkIsCombination").parent().hasClass("is-checked"),
                DrugCompDesc: $("#txtDrugCompositionDescription").val(),
                DrugClass: $("#cboDrugClass").val(),
                TherapueticClass: $("#cboTherapueticClass").val(),
                PharmacyGroup: $("#cboPharmacyGroup").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
                l_composionparams: cPar
            };
        }
        else {
            drugComposition = {
                CompositionId: $("#txtCompositionId").val(),
                IsCombination: $("#chkIsCombination").parent().hasClass("is-checked"),
                DrugCompDesc: $("#txtDrugCompositionDescription").val(),
                DrugClass: $("#cboDrugClass").val(),
                TherapueticClass: $("#cboTherapueticClass").val(),
                PharmacyGroup: $("#cboPharmacyGroup").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
                l_composionparams: cPar
            };
        }
    }
    else {
        return;
    }
    $.ajax({
        url: getBaseURL() + '/Composition/InsertOrUpdateComposition',
        type: 'POST',
        datatype: 'json',
        data: { obj: drugComposition },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
               
                $("#btnSaveDrugComposition_p").attr('disabled', false);
                $("#btnSaveDrugComposition_t").attr('disabled', false);
                fnClearDrugComposition();
                fnCancelDrugComposition();

                if (_source == "Tree") {
                    $("#jsTreeComposition").jstree("destroy");
                    fnBackToGrid();
                    fnTreeComposition();
                }
                else
                {
                    fnCancelDrugCompositionPopup();
                    fnGridRefreshCompositions();
                }
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveDrugComposition_p").attr('disabled', false);
                $("#btnSaveDrugComposition_t").attr('disabled', false);
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveDrugComposition_p").attr("disabled", false);
            $("#btnSaveDrugComposition_t").attr('disabled', false);
        }
    });
}

function validateDrugComposition() {

    if (IsStringNullorEmpty($("#txtDrugCompositionDescription_p").val())) {
        fnAlert("w", "EPH_03_00", "UI0282", errorMsg.DrugCompositionDescription_E5);
        $('#txtDrugCompositionDescription_p').focus();
        return false;
    }
    if ($("#cboDrugClass_p").val() === "0" || $("#cboDrugClass_p").val() === "") {
        fnAlert("w", "EPH_03_00", "UI0283", errorMsg.DrugClass_E6);
        return false;
    }
    if ($("#cboTherapueticClass_p").val() === "0" || $("#cboTherapueticClass_p").val() === "") {
        fnAlert("w", "EPH_03_00", "UI0284", errorMsg.TherapueticClass_E7);
        return false;
    }

    if ($("#cboPharmacyGroup_p").val() === "0" || $("#cboPharmacyGroup_p").val() === "") {
        fnAlert("w", "EPH_03_00", "UI0284", errorMsg.PharmacyGroup_E9);
        return false;
    }

}
function validateDrugCompositionTreeview() {

    if (IsStringNullorEmpty($("#txtDrugCompositionDescription").val())) {
        fnAlert("w", "EPH_03_00", "UI0282", errorMsg.DrugCompositionDescription_E5);
        $('#txtDrugCompositionDescription').focus();
        return false;
    }
    if ($("#cboDrugClass").val() === "0" || $("#cboDrugClass").val() === "") {
        fnAlert("w", "EPH_03_00", "UI0283", errorMsg.DrugClass_E6);
        return false;
    }
    if ($("#cboTherapueticClass").val() === "0" || $("#cboTherapueticClass").val() === "") {
        fnAlert("w", "EPH_03_00", "UI0284", errorMsg.TherapueticClass_E7);
        return false;
    }

    if ($("#cboPharmacyGroup").val() === "0" || $("#cboPharmacyGroup").val() === "") {
        fnAlert("w", "EPH_03_00", "UI0284", errorMsg.PharmacyGroup_E9);
        return false;
    }

}


function fnClearDrugComposition() {
    $('#txtCompositionId_p').val('');
    $("#chkIsCombination_p").parent().removeClass("is-checked");
    $('#txtDrugCompositionDescription_p').val('');
    $('#cboDrugClass_p').val("0").selectpicker('refresh');
    $('#cboTherapueticClass_p').val("0").selectpicker('refresh');
    $('#cboPharmacyGroup_p').val("0").selectpicker('refresh');
    $("#chkActiveStatus_p").parent().addClass("is-checked");
    $("#btnSaveDrugComposition_p").html(localization.Save);
    $("#btnSaveDrugComposition_p").attr("disabled", false);
    $("#btnSaveDrugComposition_p").show();
    $("#btnCancelDrugComposition_p").show(); 
   

    $('#txtCompositionId').val('');
    $("#chkIsCombination").parent().removeClass("is-checked");
    $('#txtDrugCompositionDescription').val('');
    $('#cboDrugClass').val("0").selectpicker('refresh');
    $('#cboTherapueticClass').val("0").selectpicker('refresh');
    $('#cboPharmacyGroup').val("0").selectpicker('refresh');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveDrugComposition_t").html(localization.Save);
    $("#btnSaveDrugComposition_t").attr("disabled", false);
    $("#btnSaveDrugComposition_t").show();
    $("#btnCancelDrugComposition_t").show();
    
    eSyaParamsType.ClearValue("tblPopupParam");
    eSyaParamsType.ClearValue("tblTreeParam");
}

function fnGridRefreshCompositions() {
    $("#jqgDrugCompositions").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnBackToGrid() {
    $('#PopupComposition').modal('hide');
}


function fnTreeComposition(_dcnamePrefix) {
    $("#divTreeSection").show(500);
    $("#jstComposition").jstree();

    $("#jstComposition").jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/Composition/GetCompositionForTree?prefix=' + _dcnamePrefix,
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#jstComposition").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstComposition");
            $(window).on('resize', function () {
                fnTreeSize("#jstComposition");
            })
        },
        error: function (error) {
            alert(error.statusText)
        }
    });

    $("#jstComposition").on('loaded.jstree', function () {
        $("#jstComposition").jstree()._open_to(prevSelectedID);
        $('#jstComposition').jstree().select_node(prevSelectedID);
    });



    $('#jstComposition').on('changed.jstree', function (e, data) {
        $("#divTreeSection").css('display', 'block');
    });
    $('#jstComposition').on("changed.jstree", function (e, data) {
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
                            $('#dvComposition').css('display', 'none');
                            fnAlert("w", "EPH_03_00", "UIC03", errorMsg.addauth_E1);
                            return;
                        }

                        fnClearDrugComposition();

                        eSyaParamsType.ClearValue("tblTreeParam");

                        fnEnableControl(false);
                        $("#btnSaveDrugComposition_p").hide();
                        $("#btnCancelDrugComposition_p").hide();
                        $("#btnSaveDrugComposition_t").show();
                        $("#btnCancelDrugComposition_t").show();

                        $('#dvComposition').css('display', 'block');
                        $("#pnlAddComposition .mdl-card__title-text").text(localization.AddComposition);
                    });
                }
                else if (parentNode == "C") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#dvComposition').css('display', 'none');
                            fnAlert("w", "EPH_03_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }

                        $('#dvComposition').css('display', 'block');
                        $("#pnlAddComposition .mdl-card__title-text").text(localization.ViewComposition);
                        $('#btnICAdd').hide();
                        //ItemCategoryID = data.node.id;
                        $("input").prop("disabled", true);
                        $("#chkActiveStatus").prop("disabled", true);
                        fnClearDrugComposition();
                        fnGetDrugCompositionByIdforTreeview(data.node.id);
                        fnEnableControl(true);
                        $("#btnSaveDrugComposition_p").hide();
                        $("#btnCancelDrugComposition_p").hide();
                        $("#btnSaveDrugComposition_t").hide();
                        $("#btnCancelDrugComposition_t").show();
                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvComposition').css('display', 'none');
                            fnAlert("w", "EPH_03_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $('#dvComposition').css('display', 'block');
                        $("#pnlAddComposition .mdl-card__title-text").text(localization.EditComposition);
                        $('#btnICAdd').html('<i class="fa fa-sync"></i>' + localization.Update);
                        $('#btnICAdd').show();
                        //ItemCategoryID = data.node.id;
                        $("input").prop("disabled", false);
                        $("#chkActiveStatus").prop("disabled", false);
                       
                        fnClearDrugComposition();
                        fnGetDrugCompositionByIdforTreeview(data.node.id);
                        fnEnableControl(false);
                        $("#btnSaveDrugComposition_p").hide();
                        $("#btnCancelDrugComposition_p").hide();
                        $("#btnSaveDrugComposition_t").show();
                        $("#btnCancelDrugComposition_t").show();

                    });
                }
            }
        }
    });
}

function fnCancelDrugCompositionPopup() {
    $("#PopupComposition").modal('hide');
}
function fnCancelDrugComposition() {
    $("#dvComposition").css('display', 'none');
}
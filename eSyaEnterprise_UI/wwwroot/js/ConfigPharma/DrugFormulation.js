
var dcnamePrefix = "";
var _dcnamePrefix = "";
var _compositionId = "0";
var prevSelectedID = '';
var drugBrandPrefix = '';
//var ItemCategoryID = "0";


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
            $('#dvFormulation').css('display', 'none');
        });
        //Going Back to the A to Z Selection
        $("#lblBackToAlphabets").click(function () {
            $("#divSearch").hide(500);
            $('.filter-div').empty();
            $("#divAlphabets").show(500);
            $('.filter-char').removeClass('active');
            $("#divDrugBrandsForm").css("display", "none");
            $("#divGrid").show(500);
            $('#dvFormulation').css('display', 'none');
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
   
    $("#jstFormulation").jstree();

    $("#jstFormulation").jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/Formulation/GetActiveCompositionforTreeview?prefix=' + _dcnamePrefix,
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
                    $("#C_anchor").click(function () {
                        $('#dvFormulation').css('display', 'none');
                    })
                    _compositionId = 0;
                }
                else if (parentNode == "C") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')


                    $('#Add').on('click', function () {
                        if (_userFormRole.IsAdd === false) {
                            $('#dvFormulation').css('display', 'none');
                            fnAlert("w", "EPH_06_00", "UIC03", errorMsg.addauth_E1);
                            return;
                        }

                        else {
                            eSyaParams.ClearValue();
                            _compositionId = data.node.id;
                            fnGridLoadDrugFormulation(data.node.id);
                            fnEnableControl(false);
                            $("#btnSaveDrugFormulation").show();
                            $("#btnCancelDrugFormulation").show();
                            $('#dvFormulation').css('display', 'block');
                            $("#pnlAddFormulation .mdl-card__title-text").text(localization.DrugFormulation);
                        }
                    });

                }
            }
        }
    });
}


 

function fnGridLoadDrugFormulation(composId) {

    $("#jqgDrugFormulation").jqGrid('GridUnload');
    $("#jqgDrugFormulation").jqGrid({
        url: getBaseURL() + '/Formulation/GetDrugFormulationInfobyCompositionID?composId=' + composId,
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.CompositionId, localization.FormulationId, localization.FormulationDesc, localization.DrugForm, localization.DrugFormDesc, localization.Volume, localization.MethodOfAdministration, localization.MethodOfAdministrationDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "CompositionId", width: 35, editable: true, align: 'left', hidden: true },
            { name: "FormulationId", width: 35, editable: true, align: 'left', hidden: true },
            { name: "FormulationDesc", width: 170, editable: true, align: 'left', hidden: false },
            { name: "DrugForm", width: 65, editable: true, align: 'left', hidden: true },
            { name: "DrugFormDesc", width: 100, editable: true, align: 'left', hidden: false },
            { name: "Volume", width: 85, editable: true, align: 'left', hidden: false },
            { name: "MethodOfAdministration", width: 65, editable: true, align: 'left', hidden: true },
            { name: "MethodOfAdministrationDesc", width: 75, editable: true, align: 'left', hidden: true },
            { name: "ActiveStatus", editable: true, width: 80, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'Action', search: false, align: 'left', width:80, sortable: false, resizable: false,
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
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', '100%');
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
    eSyaParams.ClearValue();
    fnEnableControl(false);
    fnClearDrugFormulation();
    $("#btnSaveDrugFormulation").show();
    $("#btnCancelDrugFormulation").show();
 }
function fnEditDrugFormulation(e, actiontype) {

    fnClearDrugFormulation();

    var rowid = $("#jqgDrugFormulation").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDrugFormulation').jqGrid('getRowData', rowid);

    $("#txtFormulationId").val(rowData.FormulationId);
    $("#txtFormulationDesc").val(rowData.FormulationDesc);
    $("#txtVolume").val(rowData.Volume);

    if (rowData.ActiveStatus == "true" || rowData.ActiveStatus == true)
    {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else
    {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $('#cboDrugForms').val(rowData.DrugForm).selectpicker('refresh');
    $('#cboMethodOfAdministration').val(rowData.MethodOfAdministration).selectpicker('refresh');

    $("#btnSaveDrugFormulation").attr('disabled', false);
    $("#btnSaveDrugFormulation").show();
    $("#btnCancelDrugFormulation").show();
   
    fnGetDrugFormulationByIdforGrid();

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
        url: getBaseURL() + '/Formulation/GetDrugFormulationParamsbyFormulationID?composId=' + _compositionId + '&formulationId=' + $("#txtFormulationId").val(),
        mtype: 'Get',
        datatype: 'json',
        success: function (result) {
            eSyaParams.ClearValue();
            eSyaParams.SetJSONValue(result.lst_formulationparams);

        }
    });

}

function fnEnableControl(val) {
    $("input,textarea").attr('readonly', val);
    $("select").next().attr('disabled', val);

}

function fnSaveDrugFormulation() {
  
    if (fnValidateDrugFormulation() === false) {
        return;
    }
    else {
        $("#btnSaveDrugFormulation").attr('disabled', true);
        var formulationId = $("#txtFormulationId").val();
        var cPar = eSyaParams.GetJSONValue();
        var drugFormulation;
        if (formulationId === null || formulationId === "") {
            drugFormulation = {
                CompositionId: _compositionId,
                FormulationId: 0,
                FormulationDesc: $("#txtFormulationDesc").val(),
                DrugForm: $("#cboDrugForms").val(),
                Volume: $("#txtVolume").val(),
                MethodOfAdministration: $("#cboMethodOfAdministration").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
                lst_formulationparams: cPar
            };
        }
        else {
            drugFormulation = {
                CompositionId: _compositionId,
                FormulationId: $("#txtFormulationId").val(),
                FormulationDesc: $("#txtFormulationDesc").val(),
                DrugForm: $("#cboDrugForms").val(),
                Volume: $("#txtVolume").val(),
                MethodOfAdministration: $("#cboMethodOfAdministration").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
                lst_formulationparams: cPar
            };
        }


        $.ajax({
            url: getBaseURL() + '/Formulation/InsertOrUpdateDrugFormulation',
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
                    fnGridRefreshFormulation();
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

function fnValidateDrugFormulation() {
    
    if (_compositionId === "0" || _compositionId === "" || _compositionId === 0) {
        fnAlert("w", "EPH_06_00", "UI0283", "Please select Composition from Tree View to add Formulation");
        return false;
    }
    if (IsStringNullorEmpty($("#txtFormulationDesc").val())) {
        fnAlert("w", "EPH_06_00", "UI0313", "Please Enter Formulation Description");
        return false;
    }
    if ($("#cboDrugForms").val() === "0" || $("#cboDrugForms").val() === "") {
        fnAlert("w", "EPH_06_00", "UI0283", "Please Select Drug Form");
        return false;
    }
    if ($("#cboMethodOfAdministration").val() === "0" || $("#cboMethodOfAdministration").val() === "") {
        fnAlert("w", "EPH_06_00", "UI0312", errorMsg.MethodOfAdministration_E7);
        return false;
    }
    //if (IsStringNullorEmpty($("#txtVolume").val())) {
    //    fnAlert("w", "EPH_06_00", "UI0313", errorMsg.Volume_E8);
    //    return false;
    //}
  
}


function fnClearDrugFormulation() {

    $('#cboDrugForms').val("0").selectpicker('refresh');
    $('#cboMethodOfAdministration').val("0").selectpicker('refresh');
    $('#txtVolume').val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveDrugFormulation").html(localization.Save);
    $("#btnSaveDrugFormulation").attr("disabled", false);
    $("#btnSaveDrugFormulation").show();
    $("#btnCancelDrugFormulation").show();
    $('#txtFormulationId').val('');
    $('#txtFormulationDesc').val(''); 
    eSyaParams.ClearValue();
}

function fnGridRefreshFormulation() {
    $("#jqgDrugFormulation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnBackToGrid() {
    $('#PopupDrugFormulation').modal('hide');
}


function fnCancelDrugFormulation() {
    $("#PopupDrugFormulation").modal('hide');
}
function fnCancelDrugComposition() {
    $("#dvFormulation").css('display', 'none');
}

function fnExpandAll() {
    $("#jstFormulation").jstree('open_all');
    fnTreeSize("#jstFormulation");
}

function fnCollapseAll() {
    $("#jstFormulation").jstree('close_all');
}
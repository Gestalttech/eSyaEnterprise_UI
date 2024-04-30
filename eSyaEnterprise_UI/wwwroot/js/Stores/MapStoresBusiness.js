var storeID;
var prevSelectedID;

$(document).ready(function () {
    fnFormaction();
});
function fnBusinessKey_onChange() {

    fnFormaction();
    fnTreeSize();
}


function fnFormaction() {
    $('#btnAddStoreBusinessLink').show();
    BusinessKey = $("#cboBusinessLocation").val();
    $.ajax({
        url: getBaseURL() + '/Stores/GetStoreList?BusinessKey=' + BusinessKey,
        success: function (result) {
            fnGetUserMenuList_Success(result, BusinessKey);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

}

function fnGetUserMenuList_Success(dataArray, BusinessKey) {
    $('#jstStoreBusinessLink').jstree('destroy');
    $("#jstStoreBusinessLink").jstree({
        core: { 'data': dataArray, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
        "plugins": ["search"],

        "search": {
            "case_sensitive": false,
            "show_only_matches": true,
            "show_only_matches_children": true
        }
    });

    $("#jstStoreBusinessLink").on('loaded.jstree', function () {
        $("#jstStoreBusinessLink").jstree('open_all');
        $("#jstStoreBusinessLink").jstree()._open_to(prevSelectedID);
        $('#jstStoreBusinessLink').jstree().select_node(prevSelectedID);

    });

    $('#jstStoreBusinessLink').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                if (data.node.id == "0") {
                    fnClearFields();
                    $("#pnlMainMenu").hide();
                }
                else {

                    $('#View').remove();
                    $('#Edit').remove();
                    $('#Add').remove();

                    $("#pnlMainMenu").hide();

                    if (data.node.parent == "#") {
                        fnClearFields();
                        $("#pnlMainMenu").hide();
                    }
                    else if (data.node.id.startsWith("ST")) {

                        if ($("#cboBusinessLocation").val() <= 0 || $("#cboBusinessLocation").val() === "") {
                            fnAlert("w", "ECS_04_00", "UI0064", "Please select Location");
                            return;
                        }
                        storeID = 0;
                        storeID = data.node.id.substring(2).split("_")[1];

                        if (data.node.id.substring(2).split("_")[0] == "F") {
                            $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                        }
                        else {
                            $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                            $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')

                        }

                        $('#Add').on('click', function () {
                            if (_userFormRole.IsInsert === false) {
                                $('#pnlMainMenu').hide();
                                fnAlert("w", "ECS_04_00", "UIC01",errorMsg.addauth_E1);
                                return;
                            }

                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.AddStoreBusinessLink);
                            fnClearFields();
                            $('#txtStoreCode').val(storeID);
                            $('#txtStoreDescription').val(data.node.text);
                            $("#chkActiveStatus").parent().addClass("is-checked");

                            $("#btnAddStoreBusinessLink").show();
                            $("input,textarea").attr('readonly', true);
                            $("input[type=checkbox]").attr('disabled', false);
                            $("#btnAddStoreBusinessLink").html('<i class="fa fa-save"></i> ' + localization.Save);
                            $("#chkActiveStatus").attr('disabled', true);
                            //$("#btnAddStoreBusinessLink").attr("disabled", _userFormRole.IsInsert === false);
                            // fnLoadStoreBusinessLinkGrid();

                            $("#cboStoreClass").val("0").selectpicker('refresh');
                            $("#cboStoreClass").next().attr('disabled', false).selectpicker('refresh');
                            fnLoadPortfolioStoreBusinessLinkGrid();
                            fnEnableActivecheckboxs();
                        });

                        $('#View').on('click', function () {

                            if (_userFormRole.IsView === false) {
                                $('#pnlMainMenu').hide();
                                fnAlert("w", "ECS_04_00", "UIC03", errorMsg.vieweauth_E3);
                                return;
                            }

                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.ViewStoreBusinessLink);
                            $('#txtStoreCode').val(storeID);
                            $('#txtStoreDescription').val(data.node.text);
                            //fnLoadStoreBusinessLinkGrid();
                            fnfnLoadStoreBusinessLink();
                            fnLoadPortfolioStoreBusinessLinkGrid();
                            $('.lblFormName').text(data.node.text);

                            $("#btnAddStoreBusinessLink").hide();
                            $("input,textarea").attr('readonly', true);
                            $("input[type=checkbox]").attr('disabled', true);
                            $("#chkActiveStatus").attr('disabled', true);
                            fnDisableActivecheckboxs();
                        });

                        $('#Edit').on('click', function () {

                            if (_userFormRole.IsEdit === false) {
                                $('#pnlMainMenu').hide();
                                fnAlert("w", "ECS_04_00", "UIC02", errorMsg.editauth_E2);
                                return;
                            }

                            $("#pnlMainMenu").show();
                            $(".mdl-card__title-text").text(localization.EditStoreBusinessLink);
                            $('#txtStoreCode').val(storeID);
                            $('#txtStoreDescription').val(data.node.text);

                            /* fnLoadStoreBusinessLinkGrid();*/
                            fnfnLoadStoreBusinessLink();
                            fnLoadPortfolioStoreBusinessLinkGrid();
                            $('.lblFormName').text(data.node.text);

                            $("#btnAddStoreBusinessLink").show();
                            $("input,textarea").attr('readonly', true);
                            $("input[type=checkbox]").attr('disabled', false);
                            $("#chkActiveStatus").attr('disabled', true);
                            $("#btnAddStoreBusinessLink").html('<i class="fa fa-sync"></i> ' + localization.Update);
                            fnEnableActivecheckboxs();
                            //$("#btnAddStoreBusinessLink").attr("disabled", _userFormRole.IsEdit === false);
                        });


                        //if (data.node.id.substring(2).split("_")[0] == "F") {
                        //    $("#pnlMainMenu").show();
                        //    $(".mdl-card__title-text").text("Add Store Business Link");
                        //    fnClearFields();
                        //    $('#txtStoreCode').val(storeID);
                        //    $('#txtStoreDescription').val(data.node.text);
                        //    $("#btnAddStoreBusinessLink").html('<i class="fa fa-plus"></i> Add');
                        //    $("#chkActiveStatus").parent().addClass("is-checked");
                        //    $("#btnAddStoreBusinessLink").attr("disabled", _userFormRole.IsInsert === false);
                        //}
                        //else {
                        //    $("#pnlMainMenu").show();
                        //    $(".mdl-card__title-text").text("Edit Store Business Link");
                        //    $('#txtStoreCode').val(storeID);
                        //    $('#txtStoreDescription').val(data.node.text);
                        //    $("input,textarea").attr('readonly', true);
                        //    fnLoadStoreBusinessLinkGrid();
                        //    $('.lblFormName').text(data.node.text);
                        //    $("#btnAddStoreBusinessLink").html('<i class="fa fa-sync"></i> Update');
                        //    $("#btnAddStoreBusinessLink").attr("disabled", _userFormRole.IsEdit === false);
                        //}
                    }
                    else {
                        fnClearFields();
                        $("#pnlMainMenu").hide();
                    }
                }
            }
        }
    });

    $('#jstStoreBusinessLink').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstStoreBusinessLink').jstree().deselect_node(closingNode.children);
    });

};
function fnSaveStoreBusinessLink() {

    if (validationStoreBusinessLink() === false) {
        return;
    }
    $("#jqgPortfolioLink").jqGrid('editCell', 0, 0, false).attr("value");
    $("#btnAddStoreBusinessLink").attr('disabled', true);

    var $grid = $("#jqgPortfolioLink");
    var _storelinks = [];
    var ids = jQuery("#jqgPortfolioLink").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgPortfolioLink').jqGrid('getRowData', rowId);

        
            _storelinks.push({
                BusinessKey: $("#cboBusinessLocation").val(),
                StoreCode: $("#txtStoreCode").val(),
                StoreClass: $("#cboStoreClass").val(),
                PortfolioId: rowData.PortfolioId,
                ActiveStatus: rowData.ActiveStatus
            });
        
    }
    var _objlink = {
        BusinessKey: $("#cboBusinessLocation").val(),
        StoreCode: $("#txtStoreCode").val(),
        StoreClass: $("#cboStoreClass").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        lst_businessLink: _storelinks
    };

    $.ajax({
        url: getBaseURL() + '/Stores/InsertOrUpdateStoreBusinessLink',
        type: 'POST',
        datatype: 'json',
        data: { obj: _objlink },

        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnAddStoreBusinessLink").attr('disabled', false);
                location.reload();
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnAddStoreBusinessLink").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnAddStoreBusinessLink").attr('disabled', false);
        }
    });
}

function validationStoreBusinessLink() {

    if ($("#cboBusinessLocation").val() <= 0) {
        fnAlert("w", "ECS_04_00", "UI0064", errorMsg.SelectBusinessLocation_E4);
        return;
    }

    //if (IsStringNullorEmpty($("#txtStoreCode").val())) {
    //    fnAlert("w", "ECS_04_00", "UI0182", errorMsg.SelectStore_E7);
    //    return false;
    //}

    if (IsStringNullorEmpty($("#txtStoreDescription").val())) {
        fnAlert("w", "ECS_04_00", "UI0181", errorMsg.SelectDesc_E5);
        return false;
    }
    if (IsStringNullorEmpty($("#cboStoreClass").val()) || $("#cboStoreClass").val()=="0") {
        fnAlert("w", "ECS_04_00", "UI0302", errorMsg.StoreClass_E6);
        return false;
    }
}

function fnClearFields() {
    $('#txtStoreDescription').val("");
    $("#chkIsAccounting").parent().removeClass("is-checked");
    $("#chkIsConsumption").parent().removeClass("is-checked");
    $("#chkIsCustodian").parent().removeClass("is-checked");
    $("#chkIsPointofSales").parent().removeClass("is-checked");
    $("#chkActiveStatus").parent().removeClass("is-checked");
}

function fnExpandAll() {
    $('#jstStoreBusinessLink').jstree('open_all');
}

function fnCollapseAll() {
    $("#pnlMainMenu").hide();
    fnClearFields();
    $('#jstStoreBusinessLink').jstree('close_all');
}

function fnTreeSize() {
    $("#jstStoreBusinessLink").css({
        'height': $(window).innerHeight() - 211,
        'overflow': 'auto'
    });
}

//function fnLoadStoreBusinessLinkGrid() {

//    $("#jqgBusinessLink").GridUnload();

//    if ($("#txtStoreCode").val() != '' && $("#txtStoreCode").val() != undefined) {
//        $("#jqgBusinessLink").jqGrid(

//            {
//                url: getBaseURL() + "/Stores/GetStoreBusinessLinkInfo?BusinessKey=" + $("#cboBusinessLocation").val() + "&StoreCode=" + $("#txtStoreCode").val(),
//                datatype: 'json',
//                mtype: 'POST',
//                contentType: 'application/json; charset=utf-8',
//                ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
//                colNames: ["StoreClass", " Store Class Description", "Active"],
//                colModel: [
//                    { name: "StoreClass", width: 70, editable: true, align: 'left', hidden: true },
//                    { name: 'StoreClassDescription', index: 'StoreClassDescription', width: 270, resizable: false },
//                    {
//                        name: 'ActiveStatus', index: 'ActiveStatus', width: 70, resizable: false, align: 'center',
//                        formatter: "checkbox", formatoptions: { disabled: false },
//                        edittype: "checkbox", editoptions: { value: "true:false" }
//                    },
//                ],
//                rowNum: 10,
//                rowList: [10, 20, 50, 100],
//                rownumWidth: 55,
//                loadonce: true,
//                pager: "#jqpBusinessLink",
//                viewrecords: true,
//                gridview: true,
//                rownumbers: true,
//                height: 'auto',
//                width: 'auto',
//                autowidth: true,
//                shrinkToFit: true,
//                forceFit: true,
//                scroll: false, scrollOffset: 0,
//                caption: localization.BusinessLink,
//                onSelectRow: function (rowid) {
//                    //BusinessKey = $("#jqgBusinessLink").jqGrid('getCell', rowid, 'BusinessKey');

//                },
//                loadComplete: function (data) {
//                    $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
//                    $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
//                },
//            })

//            .jqGrid('navGrid', '#jqpBusinessLink', { add: false, edit: false, search: false, del: false, refresh: false })
//            .jqGrid('navButtonAdd', '#jqpBusinessLink', {
//                caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshBusinessLinkGrid
//            });
//        fnAddGridSerialNoHeading();
//    }
//}
function fnfnLoadStoreBusinessLink() {

    $.ajax({
        type: 'POST',
        url: getBaseURL() + "/Stores/GetStoreBusinessLinkInfo?BusinessKey=" + $("#cboBusinessLocation").val() + "&StoreCode=" + $("#txtStoreCode").val(),
        success: function (result) {
            if (result !== null) {
                
                $('#cboStoreClass').val(result.StoreClass);
                $('#cboStoreClass').selectpicker('refresh');
                if (result.ActiveStatus == 1) {
                    $("#chkActiveStatus").parent().addClass("is-checked");
                }
                else { $('#chkActiveStatus').parent().removeClass("is-checked"); }


                //$("#cboStoreClass").next().attr('disabled', false).selectpicker('refresh');
                //$('#cboStoreClass').val(response.StoreClass).selectpicker('refresh');
                $("#cboStoreClass").next().attr('disabled', true).selectpicker('refresh');
            }
            else {
                $("#cboStoreClass").val("0").selectpicker('refresh');
                $("#cboStoreClass").next().attr('disabled', true).selectpicker('refresh');
            }
        },
        error: function (response) {
        }
    });
}

function fnLoadPortfolioStoreBusinessLinkGrid() {

    $("#jqgPortfolioLink").GridUnload();

    if ($("#txtStoreCode").val() != '' && $("#txtStoreCode").val() != undefined) {
        $("#jqgPortfolioLink").jqGrid(

            {
                url: getBaseURL() + "/Stores/GetPortfolioStoreBusinessLinkInfo?BusinessKey=" + $("#cboBusinessLocation").val() + "&StoreCode=" + $("#txtStoreCode").val(),
                datatype: 'json',
                mtype: 'POST',
                contentType: 'application/json; charset=utf-8',
                ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
                colNames: ["PortfolioId", " Portfolio Description", "Active"],
                colModel: [
                    { name: "PortfolioId", width: 70, editable: true, align: 'left', hidden: true },
                    { name: 'PortfolioDesc', index: 'StoreClassDescription', width: 270, resizable: false },
                    {
                        name: 'ActiveStatus', index: 'ActiveStatus', width: 70, resizable: false, align: 'center',
                        formatter: "checkbox", formatoptions: { disabled: false },
                        edittype: "checkbox", editoptions: { value: "true:false" }
                    },
                ],
                rowNum: 10,
                rowList: [10, 20, 50, 100],
                rownumWidth: 55,
                loadonce: true,
                pager: "#jqpPortfolioLink",
                viewrecords: true,
                gridview: true,
                rownumbers: true,
                height: 'auto',
                width: 'auto',
                autowidth: true,
                shrinkToFit: true,
                forceFit: true,
                scroll: false, scrollOffset: 0,
                caption: localization.BusinessLink,
                onSelectRow: function (rowid) {
                    //BusinessKey = $("#jqgBusinessLink").jqGrid('getCell', rowid, 'BusinessKey');

                },
                loadComplete: function (data) {
                    $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
                    $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
                },
            })

            .jqGrid('navGrid', '#jqpPortfolioLink', { add: false, edit: false, search: false, del: false, refresh: false })
            .jqGrid('navButtonAdd', '#jqpPortfolioLink', {
                caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshBusinessLinkGrid
            });
        fnAddGridSerialNoHeading();
    }
}


function fnDisableActivecheckboxs() {
    $("input[type=checkbox]").attr('disabled', true);
}
function fnEnableActivecheckboxs() {
    $("input[type=checkbox]").attr('disabled', false);
}

function fnRefreshBusinessLinkGrid() {
    $("#jqgBusinessLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')

}
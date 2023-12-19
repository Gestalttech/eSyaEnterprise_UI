var ItemCategoryID = "0";
var ItemSubCategoryID = "0";
var prevSelectedID = '';
$(document).ready(function () {
    fnLoadItemSubCategoryTree()
    $('#chkActiveStatusSub').parent().addClass("is-checked");
});

function fnLoadItemSubCategoryTree() {
    $.ajax({
        url: getBaseURL() + '/Grouping/LoadItemSubCategoryTree',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#ItemCategoryTree").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#ItemCategoryTree");
            $(window).on('resize', function () {
                fnTreeSize("#ItemGroupCategoryTree");
            })
        },
        error: function (error) {
            fnAlert("e", "ECS_06_00", error.StatusCode, error.statusText);
        }
    });
    $("#ItemCategoryTree").on('loaded.jstree', function () {
        $("#ItemCategoryTree").jstree()._open_to(prevSelectedID);
        $('#ItemCategoryTree').jstree().select_node(prevSelectedID);
    });
    $('#ItemCategoryTree').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvItemCategory").hide();
                $("#dvItemSubCategory").hide();


                var parentNode = $("#ItemCategoryTree").jstree(true).get_parent(data.node.id);

                // If Category node is selected
                if (parentNode == "ISC") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $("#dvItemCategory").hide();
                            $("#dvItemSubCategory").hide();
                            fnAlert("w", "ECS_06_00", "UIC01", errorMsg.addauth_E1);
                            return;
                        }
                        $("#txtItemSubCategoryDesc").prop("disabled", false);
                        $("#chkActiveStatusSub").prop("disabled", false);
                        $("#dvItemCategory").hide();
                        $("#dvItemSubCategory").show();
                        $("#pnlAddItemSubCategory .mdl-card__title-text").text(localization.AddItemSubCategory);
                        $("#txtItemSubCategoryDesc").val('');
                        $('#chkActiveStatusSub').parent().addClass("is-checked");
                        $("#btnISCAdd").html("<i class='fa fa-save'></i>" + localization.Save);
                        $("#btnISCAdd").show();
                        ItemCategoryID = data.node.id
                        ItemSubCategoryID = "0"
                    });
                }
                // If Sub Category node is selected
                else if (data.node.id.startsWith('S')) {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $("#dvItemCategory").hide();
                            $("#dvItemSubCategory").hide();
                            fnAlert("w", "ECS_06_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        $("#txtItemSubCategoryDesc").prop("disabled", true);
                        $("#chkActiveStatusSub").prop("disabled", true);
                        $("#dvItemCategory").hide();
                        $("#dvItemSubCategory").show();
                        $("#pnlAddItemSubCategory .mdl-card__title-text").text(localization.ViewItemSubCategory);
                        $("#btnISCAdd").hide();
                        ItemSubCategoryID = data.node.id;
                        ItemCategoryID = parentNode;
                        ItemSubCategoryID = ItemSubCategoryID.substring(1);
                        fnFillItemSubCateDetail(ItemSubCategoryID);
                    });


                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $("#dvItemCategory").hide();
                            $("#dvItemSubCategory").hide();
                            fnAlert("w", "ECS_06_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $("#txtItemSubCategoryDesc").prop("disabled", false);
                        $("#chkActiveStatusSub").prop("disabled", false);
                        $("#dvItemCategory").hide();
                        $("#dvItemSubCategory").show();
                        $("#pnlAddItemSubCategory .mdl-card__title-text").text(localization.EditItemSubCategory);
                        $("#btnISCAdd").html("<i class='fa fa-sync'></i>" + localization.Update);
                        $("#btnISCAdd").show();
                        ItemSubCategoryID = data.node.id;
                        ItemCategoryID = parentNode;
                        ItemSubCategoryID = ItemSubCategoryID.substring(1);
                        fnFillItemSubCateDetail(ItemSubCategoryID);
                    });
                }
            }
        }
    });
    $('#ItemCategoryTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#ItemCategoryTree').jstree().deselect_node(closingNode.children);
    });
}
function fnFillItemSubCateDetail(ItemSubCategoryID) {
    $.ajax({
        url: getBaseURL() + '/Grouping/GetItemSubCategoryByID',
        data: {
            ItemSubCategory: ItemSubCategoryID
        },
        success: function (result) {
            $("#txtItemSubCategoryDesc").val(result.ItemSubCategoryDesc);
            if (result.ActiveStatus == true)
                $('#chkActiveStatusSub').parent().addClass("is-checked");
            else
                $('#chkActiveStatusSub').parent().removeClass("is-checked");
        }
    });
}

function fnAddOrUpdateItemSubCategory() {
    var txtItemSubCategoryDesc = $("#txtItemSubCategoryDesc").val()
    if (txtItemSubCategoryDesc == "" || txtItemSubCategoryDesc == null || txtItemSubCategoryDesc == undefined) {
        fnAlert("w", "ECS_06_00", "UI0187", errorMsg.ItemSubCategory_E6);
        return false;
    }
    else if (ItemCategoryID == "0" || ItemCategoryID == null || ItemCategoryID == undefined) {
        fnAlert("w", "ECS_06_00", "UI0188", errorMsg.Category_E7);
        return false;
    }
    else {
        $("#btnISCAdd").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/Grouping/AddOrUpdateItemSubCategory',
            type: 'POST',
            datatype: 'json',
            data: {
                ItemCategory: ItemCategoryID,
                ItemSubCategory: ItemSubCategoryID,
                ItemSubCategoryDesc: $("#txtItemSubCategoryDesc").val(),
                ActiveStatus: $("#chkActiveStatusSub").parent().hasClass("is-checked"),
            },
            success: function (response) {
                if (response.Status == true) {
                    if (ItemSubCategoryID == "0") {
                        fnAlert("s", "ECS_06_00", response.StatusCode, response.Message);
                        $("#txtItemSubCategoryDesc").val('');
                        $('#chkActiveStatusSub').parent().addClass("is-checked");
                    }
                    else {
                        fnAlert("s", "ECS_06_00", response.StatusCode, response.Message);
                    }
                    $("#ItemCategoryTree").jstree("destroy");
                    fnLoadItemSubCategoryTree();
                }
                else {
                    fnAlert("e", "ECS_06_00", response.StatusCode, response.Message);
                }
                $("#btnISCAdd").attr("disabled", false);
            },
            error: function (error) {
                fnAlert("e", "ECS_06_00", error.StatusCode, error.statusText);
                $("#btnISCAdd").attr("disabled", false);
            }
        });
    }
}


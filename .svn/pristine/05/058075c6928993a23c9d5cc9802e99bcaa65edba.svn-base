var ItemCategoryID = "0";
var ItemSubCategoryID = "0";
var prevSelectedID = '';
$(document).ready(function () {
    fnLoadItemCategoryTree()
    $("#txtBudgetAmount").val('0');
    $("#txtCommittmentAmount").val('0');
    $('#chkActiveStatus').parent().addClass("is-checked");
});

function fnLoadItemCategoryTree() {
    $.ajax({
        url: getBaseURL() + '/Grouping/LoadItemCategoryTree',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#ItemCategoryTree").jstree({ core: { data: result, multiple: false } });
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
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
                // If Main node is selected
                if (parentNode == "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $("#dvItemCategory").hide();
                            $("#dvItemSubCategory").hide();
                            fnAlert("w", "ECS_05_00", "UIC01", errorMsg.addauth_E1);
                            return;
                        }
                        $("#pnlAddItemCategory .mdl-card__title-text").text(localization.AddItemCategory);
                        $("#txtItemCategoryDesc").val('');
                        $("#txtBudgetAmount").val('0');
                        $("#txtCommittmentAmount").val('0');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        $("#btnICAdd").html("<i class='fa fa-save'></i>" + localization.Save);
                        $('#btnICAdd').show();
                        $("#dvItemCategory").show();
                        $("#dvItemSubCategory").hide();
                        ItemCategoryID = "0";
                        $("#txtItemCategoryDesc").prop("disabled", false);
                        $("#txtBudgetAmount").prop("disabled", false);
                        $("#chkActiveStatus").prop("disabled", false);
                    });

                }


                // Category node is selected
                else if (parentNode == "IC") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>')
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $("#dvItemCategory").hide();
                            $("#dvItemSubCategory").hide();
                            fnAlert("w", "ECS_05_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }

                        $('#dvItemSubCategory').hide();
                        $('#dvItemCategory').show();
                        $("#pnlAddItemCategory .mdl-card__title-text").text(localization.ViewItemCategory);
                        $('#btnICAdd').hide();
                        ItemCategoryID = data.node.id;
                        $("#txtItemCategoryDesc").prop("disabled", true);
                        $("#txtBudgetAmount").prop("disabled", true);
                        $("#chkActiveStatus").prop("disabled", true);
                        fnFillItemCateDetail(ItemCategoryID);
                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvItemGroup').hide();
                            fnAlert("w", "ECS_05_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $('#dvItemSubCategory').hide();
                        $('#dvItemCategory').show();
                        $("#pnlAddItemCategory .mdl-card__title-text").text(localization.EditItemCategory);
                        $('#btnICAdd').html('<i class="fa fa-sync"></i>' + localization.Update);
                        $('#btnICAdd').show();
                        ItemCategoryID = data.node.id;
                        $("#txtItemCategoryDesc").prop("disabled", false);
                        $("#txtBudgetAmount").prop("disabled", false);
                        $("#chkActiveStatus").prop("disabled", false);
                        fnFillItemCateDetail(ItemCategoryID);
                    });
                }



            }
        }
    });
    $('#ItemCategoryTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#ItemCategoryTree').jstree().deselect_node(closingNode.children);
    });
    fnTreeSize("#divItemCategoryTree");
}

function fnFillItemCateDetail(ItemCategoryID) {
    $.ajax({
        url: getBaseURL() + '/Grouping/GetItemCategoryByID',
        data: {
            ItemCategory: ItemCategoryID
        },
        success: function (result) {
            $("#txtItemCategoryDesc").val(result.ItemCategoryDesc);
            $("#txtBudgetAmount").val(result.BudgetAmount);
            $("#txtCommittmentAmount").val(result.CommittmentAmount);
            if (result.ActiveStatus == true)
                $('#chkActiveStatus').parent().addClass("is-checked");
            else
                $('#chkActiveStatus').parent().removeClass("is-checked");
        }
    });
}
function fnAddOrUpdateItemCategory() {
    var txtItemCategoryDesc = $("#txtItemCategoryDesc").val()
    var txtBudgetAmount = $("#txtBudgetAmount").val()
    var txtCommittmentAmount = $("#txtCommittmentAmount").val()
    if (txtItemCategoryDesc == "" || txtItemCategoryDesc == null || txtItemCategoryDesc == undefined) {
        fnAlert("w", "ECS_05_00", "UI0184", errorMsg.ItemCategoryDesc_E6);
        return false;
    }
    else if (txtBudgetAmount == "" || txtBudgetAmount == null || txtBudgetAmount == undefined) {
        fnAlert("w", "ECS_05_00", "UI0185", errorMsg.BudgetAmount_E7);
        return false;
    }
    else if (txtCommittmentAmount == "" || txtCommittmentAmount == null || txtCommittmentAmount == undefined) {
        fnAlert("w", "ECS_05_00", "UI0186", errorMsg.Commitment_E8);
        return false;
    }
    else {
        $("#btnICAdd").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/Grouping/AddOrUpdateItemCategory',
            type: 'POST',
            datatype: 'json',
            data: {
                ItemCategory: ItemCategoryID,
                ItemCategoryDesc: $("#txtItemCategoryDesc").val(),
                BudgetAmount: $("#txtBudgetAmount").val(),
                CommittmentAmount: $("#txtCommittmentAmount").val(),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
            },
            success: function (response) {
                if (response.Status == true) {
                    if (ItemCategoryID == "0") {
                        fnAlert("s", "ECS_05_00", response.StatusCode, response.Message);
                        $("#txtItemCategoryDesc").val('');
                        $("#txtBudgetAmount").val('0');
                        $("#txtCommittmentAmount").val('0');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                    }
                    else {
                        fnAlert("s", "ECS_05_00", response.StatusCode, response.Message);
                    }

                    $("#ItemCategoryTree").jstree("destroy");
                    fnLoadItemCategoryTree();
                }
                else {
                    fnAlert("e", "ECS_05_00", response.StatusCode, response.Message);
                }
                $("#btnICAdd").attr("disabled", false);
            },
            error: function (error) {
                fnAlert("e", "ECS_05_00", error.StatusCode, error.statusText);
                $("#btnICAdd").attr("disabled", false);
            }
        });
    }
}



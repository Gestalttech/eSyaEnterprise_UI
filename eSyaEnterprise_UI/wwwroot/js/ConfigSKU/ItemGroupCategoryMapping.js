var flag = "0";
var prevSelectedID = '';
$(document).ready(function () {
    fnLoadItemGroupCategoryTree();
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnIGCAdd").attr("disabled", _userFormRole.IsInsert === false);
    $("#txtBudgetAmount").val('0');
    $("#txtCommittmentAmount").val('0');
});
function fnLoadItemGroupCategoryTree() {
    $.ajax({
        url: getBaseURL() + '/Grouping/LoadItemGroupCateSubCateTree',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#jstItemGroupCategoryTree").jstree({ core: { data: result, multiple: true } });
            fnTreeSize("#jstItemGroupCategoryTree");
            $(window).on('resize', function () {
                fnTreeSize("#jstItemGroupCategoryTree");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
    $("#jstItemGroupCategoryTree").on('loaded.jstree', function () {
        $("#jstItemGroupCategoryTree").jstree()._open_to(prevSelectedID);
        $('#jstItemGroupCategoryTree').jstree().select_node(prevSelectedID);
    });
    $('#jstItemGroupCategoryTree').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#dvItemGroupCate").hide();
                $("#chkActiveStatus").prop("disabled", false);

                var parentNode = $("#jstItemGroupCategoryTree").jstree(true).get_parent(data.node.id);
                // If Group node is selected
                if (parentNode == "#") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#555555"aria-hidden="true"></i></span>')
                    $('#Add').on('click', function () {
                        if (_userFormRole.IsInsert === false) {
                            $("#dvItemGroupCate").hide();
                            fnAlert("w", "ESK_04_00", "UIC01", errorMsg.addauth_E1);
                            return;
                        }
                        flag = "0";
                        $(".mdl-card__title-text").text(localization.AddItemGroupAndCategoryLink);
                        $("#cboitemgroup").val('0');
                        $("#cboitemgroup").prop("disabled", false);
                        $('#cboitemgroup').selectpicker('refresh');
                        $("#cboitemcategory").val('0');
                        $("#cboitemcategory").prop("disabled", false);
                        $('#cboitemcategory').selectpicker('refresh');
                        $("#cboitemsubcategory").empty();
                        $("#cboitemsubcategory").prop("disabled", false);
                        $('#cboitemsubcategory').selectpicker('refresh');
                        $("#cboitemsubcategory").append('<option value="0">' + localization.SelectItemSubCategory + '</option>');
                        $('#cboitemsubcategory').selectpicker('refresh');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        $("#txtBudgetAmount").val('0');
                        $("#txtCommittmentAmount").val('0');
                        $("#txtBudgetAmount").prop("disabled", false);
                        $("#btnIGCAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                        $("#btnIGCAdd").show();
                        $("#dvItemGroupCate").show();
                        $('#chkFAStatus').parent().removeClass("is-checked");

                    });
                }
                // If Link node is selected
                else if (parentNode.startsWith('C')) {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#555555"aria-hidden="true"></i></span>')
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#555555"aria-hidden="true"></i></span>')
                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#dvItemGroupCate').hide();
                            fnAlert("w", "ESK_04_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        $(".mdl-card__title-text").text(localization.ViewItemGroupAndCategoryLink);
                        $("#chkActiveStatus").prop("disabled", true);
                        $("#cboitemgroup").val($("#jstItemGroupCategoryTree").jstree(true).get_parent(parentNode).substring(1));
                        $("#cboitemgroup").prop("disabled", true);
                        $('#cboitemgroup').selectpicker('refresh');
                        $("#cboitemcategory").val(parentNode.substring(1 + $("#jstItemGroupCategoryTree").jstree(true).get_parent(parentNode).length));
                        $("#cboitemcategory").prop("disabled", true);
                        $('#cboitemcategory').selectpicker('refresh');
                        fnloadSubCategoryCbo();
                        $("#cboitemsubcategory").val(data.node.id.substring(1 + parentNode.length));
                        $("#cboitemsubcategory").prop("disabled", true);
                        $('#cboitemsubcategory').selectpicker('refresh');
                        fnGetMappingRecord();
                        $("#btnIGCAdd").hide();
                        $('#dvItemGroupCate').show();
                        $("#txtBudgetAmount").prop("disabled", true);


                    });
                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvItemGroupCate').hide();
                            fnAlert("w", "ESK_04_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        flag = "1";
                        $(".mdl-card__title-text").text(localization.EditItemGroupAndCategoryLink);
                        $("#chkActiveStatus").prop("disabled", false);
                        $("#cboitemgroup").val($("#jstItemGroupCategoryTree").jstree(true).get_parent(parentNode).substring(1));
                        $("#cboitemgroup").prop("disabled", true);
                        $('#cboitemgroup').selectpicker('refresh');
                        $("#cboitemcategory").val(parentNode.substring(1 + $("#jstItemGroupCategoryTree").jstree(true).get_parent(parentNode).length));
                        $("#cboitemcategory").prop("disabled", true);
                        $('#cboitemcategory').selectpicker('refresh');
                        fnloadSubCategoryCbo();
                        $("#cboitemsubcategory").val(data.node.id.substring(1 + parentNode.length));
                        $("#cboitemsubcategory").prop("disabled", true);
                        $('#cboitemsubcategory').selectpicker('refresh');
                        fnGetMappingRecord();
                        $("#btnIGCAdd").html("<i class='fa fa-sync'></i> " + localization.Update);
                        $("#btnIGCAdd").show();
                        
                        $('#dvItemGroupCate').show();
                        $("#txtBudgetAmount").prop("disabled", false);
                    });
                }
            }
        }
    });
    $('#jstItemGroupCategoryTree').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstItemGroupCategoryTree').jstree().deselect_node(closingNode.children);
    });
     
}
function fnloadSubCategoryCbo() {
    $("#cboitemsubcategory").empty();
    //$('#cboitemsubcategory').selectpicker('refresh');
    var ItemCategoryID = $("#cboitemcategory").val();
    $.ajax({
        url: getBaseURL() + '/Grouping/GetItemSubCategoryByCateID',
        async: false,
        data: {
            ItemCategory: ItemCategoryID
        },
        success: function (result) {
            //debugger;
            //$("#cboitemsubcategory").append('<option value="0">' + localization.SelectItemSubCategory + '</option>');
            //$('#cboitemsubcategory').selectpicker('refresh');
            //for (var i = 0; i < result.length; i++) {
            //    $("#cboitemsubcategory").append('<option value="' + result[i].ItemSubCategory + '"> ' + result[i].ItemSubCategoryDesc + ' </option>');
            //    $('#cboitemsubcategory').selectpicker('refresh');
            //}
            if (result != null) {
                //refresh each time
                $("#cboitemsubcategory").empty();

                $("#cboitemsubcategory").append($('<option value="0">' + localization.SelectItemSubCategory + '</option>'));
                for (var i = 0; i < result.length; i++) {

                    $("#cboitemsubcategory").append($("<option></option>").val(result[i].ItemSubCategory).html(result[i].ItemSubCategoryDesc));
                }
                $('#cboitemsubcategory').selectpicker('refresh');
            }
            else {
                $("#cboitemsubcategory").empty();
                $("#cboitemsubcategory").append($('<option value="0">' + localization.SelectItemSubCategory + '</option>'));
                $('#cboitemsubcategory').selectpicker('refresh');
            }
        }
    });

}
function fnItemGroupCateSubCateMapping() {
    var cboitemgroup = $("#cboitemgroup").val();
    var cboitemcategory = $("#cboitemcategory").val();
    var cboitemsubcategory = $("#cboitemsubcategory").val();
    var txtBudgetAmount = $("#txtBudgetAmount").val();
    var txtCommittmentAmount = $("#txtCommittmentAmount").val();
    if (cboitemgroup == "0" || cboitemgroup == null || cboitemgroup == undefined) {
        fnAlert("w", "ESK_04_00", "UI0189", errorMsg.SelectItem_E6);
        return false;
    }
    else if (cboitemcategory == "0" || cboitemcategory == null || cboitemcategory == undefined) {
        fnAlert("w", "ESK_04_00", "UI0190", errorMsg.ItemCategory_E7);
        return false;
    }
    else if (cboitemsubcategory == "0" || cboitemsubcategory == null || cboitemsubcategory == undefined) {
        fnAlert("w", "ESK_04_00", "UI0191", errorMsg.ItemSubCategory_E8);
        return false;
    }
    else if (txtBudgetAmount == "" || txtBudgetAmount == null || txtBudgetAmount == undefined) {
        fnAlert("w", "ESK_04_00", "UI0246", errorMsg.BudgetAmount_E9);
        return false;
    }
    else if (txtCommittmentAmount == "" || txtCommittmentAmount == null || txtCommittmentAmount == undefined) {
        fnAlert("w", "ESK_04_00", "UI0247", errorMsg.Commitment_E10);
        return false;
    }
    else {
        $("#btnIGCAdd").attr("disabled", true);
        $.ajax({
            url: getBaseURL() + '/Grouping/ItemGroupCateSubCateMapping',
            type: 'POST',
            datatype: 'json',
            data: {
                flag: flag,
                ItemGroupID: cboitemgroup,
                ItemCategory: cboitemcategory,
                ItemSubCategory: cboitemsubcategory,
                BudgetAmount: $("#txtBudgetAmount").val(),
                CommittmentAmount: $("#txtCommittmentAmount").val(),
                Fastatus: $("#chkFAStatus").parent().hasClass("is-checked"),
                ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            },
            success: function (response) {
                if (response.Status == true) {
                    if (flag == "1") {
                        fnAlert("s", "", response.StatusCode, response.Message);
                        $("#dvItemGroupCate").css('display', 'none');
                    }
                    else if (flag == "0") {
                        fnAlert("s", "", response.StatusCode, response.Message);
                        $("#dvItemGroupCate").css('display', 'none');
                        $("#cboitemgroup").val('0');
                        $('#cboitemgroup').selectpicker('refresh');
                        $("#cboitemcategory").val('0');
                        $('#cboitemcategory').selectpicker('refresh');
                        $("#cboitemsubcategory").html('<option value="0">' + localization.SelectItemSubCategory + '</option>');
                        $('#cboitemsubcategory').selectpicker('refresh');
                        $('#chkActiveStatus').parent().addClass("is-checked");
                        $("#txtBudgetAmount").val('0');
                        $("#txtCommittmentAmount").val('0');
                    }

                    $("#jstItemGroupCategoryTree").jstree("destroy");
                    fnLoadItemGroupCategoryTree();
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
                $("#btnIGCAdd").attr("disabled", false);
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnIGCAdd").attr("disabled", false);
            }
        });
    }
}
function fnGetMappingRecord() {
   
    $("#btnIGCAdd").attr("disabled", false);
    $.ajax({
        url: getBaseURL() + '/Grouping/GetMappingRecord',
        data: {
            ItemGroupID: $("#cboitemgroup").val(),
            ItemCategory: $("#cboitemcategory").val(),
            ItemSubCategory: $("#cboitemsubcategory").val()
        },
        success: function (result) {
            if (result != null) {
                flag = "1";
                $("#btnIGCAdd").html("<i class='fa fa-sync'></i> " + localization.Update);
                $("#btnIGCAdd").attr("disabled", _userFormRole.IsEdit === false);
                if (result.ActiveStatus == true)
                    $('#chkActiveStatus').parent().addClass("is-checked");
                else
                    $('#chkActiveStatus').parent().removeClass("is-checked");

                if (result.Fastatus == true)
                    $('#chkFAStatus').parent().addClass("is-checked");
                else
                    $('#chkFAStatus').parent().removeClass("is-checked");

                $("#txtBudgetAmount").val(result.BudgetAmount);
                $("#txtCommittmentAmount").val(result.CommittmentAmount);
            }
            else {
                flag = "0";
                $("#btnIGCAdd").html("<i class='fa fa-save'></i> " + localization.Save);
                $("#btnIGCAdd").attr("disabled", _userFormRole.IsInsert === false);
                $('#chkActiveStatus').parent().addClass("is-checked");
                $('#chkFAStatus').parent().removeClass("is-checked");
            }
        }
    });
}

function fnClosetheForm() {
    $("#dvItemGroupCate").css('display', 'none');
    $("#jstItemGroupCategoryTree").jstree("refresh");
}

function fnExpandAll() {
    $("#jstItemGroupCategoryTree").jstree('open_all');
    fnTreeSize("#jstItemGroupCategoryTree");
}

function fnCollapseAll() {
    $("#jstItemGroupCategoryTree").jstree('close_all'); $("#dvItemGroupCate").css('display', 'none');
}

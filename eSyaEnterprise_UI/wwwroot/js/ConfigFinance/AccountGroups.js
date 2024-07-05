var accountName = '';
$(document).ready(function () {
    var v_natureG = $("#cboNatureG");
    var v_add = $("#btnAdd");
    var v_group = $("#txtGroup");
    var v_del = $("#btnDel");
    var v_moveUp = $("#btnUp");
    var v_moveDown = $("#btnDown");
    var v_btnEditNode = $("#btnSaveAccountGroup");
    var v_txtdesc = $("#txtdesc");
    var v_accountTree = $("#jstAccountGroup");
    //var v_natureGA = $("#natureGA");

    var acc = {};
    var accUpdate = {};
    var treeObj = {};
    var accid = '';
    var prevClick = '';
    var presentParent = '';
    var groupIndex = '';
    var moveUp = false;
   // ajaxCallingTree();
    $("#bookTypeDiv").hide();
    $('#prca').change(fnBookType);
    v_add.on('click', toAdd);
     
    v_moveUp.on('click', toMove);
    v_moveDown.on('click', toMove);
    v_btnEditNode.on('click', toEdit);

    function ajaxCallingTree() {
        $.ajax({
            //url: getBaseURL() + '/AccountGroupDefine/AccountTreeRead',
            url: '',
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                treeObj = result;
                //console.log(treeObj);
                callingTree();

            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.Message);
            }
        });
    }

    function callingTree() {
        v_accountTree.jstree({ core: { data: treeObj, multiple: false } });

        v_accountTree.on('loaded.jstree', function () {
            console.log(prevClick);
            v_accountTree.jstree()._open_to(prevClick);
        });

        v_accountTree.on("changed.jstree", function (e, data) {
            console.log(data.node);
            if (data.node != undefined) {
                
                
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                prevClick = data.node.id;

                if (data.node.id == "s") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#Add').on('click', function () {
                        $(".mdl-card__title-text").text(localization.AddAccountGroup);
                        $("#btnSaveAccountGroup").html('<i class="fa fa-save"></i> ' + localization.Save);
                        $("#btnSaveAccountGroup").attr("disabled", _userFormRole.IsInsert === false);
                        $("#divAccountGroup").show();
                        $("#btnSaveAccountGroup").show();

                        $("#chkActiveStatus").parent().addClass("is-checked");
                        $("#chkActiveStatus").attr("disabled", true);

                        $("#chkIsIntegrateFA").attr("disabled", false);
                        $("#cboNatureG").attr("disabled", false);
                        $("#txtdesc").attr("disabled", false);
                        $("#txtBookTypeDescription").attr("disabled", false); 
                    });
                    v_natureG.prop('disabled', false).selectpicker('refresh');
                     
                    v_moveDown.prop('disabled', true);
                    v_moveUp.prop('disabled', true);
                     

                    accid = '';
                    accountName = '';
                }
                else {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>');

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#divAccountGroup').hide();
                            fnAlert("w", "EAC_03_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        $(".mdl-card__title-text").text(localization.EditAccountGroup);
                        $("#btnSaveAccountGroup").html('<i class="fa fa-save"></i> ' + localization.Save);
                        $("#btnSaveAccountGroup").attr("disabled", _userFormRole.IsEdit === false);
                        $("#divAccountGroup").show();
                        $("#btnSaveAccountGroup").show();

                        $("#chkActiveStatus").parent().addClass("is-checked");
                        $("#chkActiveStatus").attr("disabled", true);

                        $("#chkIsIntegrateFA").attr("disabled", false);
                        $("#cboNatureG").attr("disabled", false);
                        $("#txtdesc").attr("disabled", false);
                        $("#txtBookTypeDescription").attr("disabled", false); 
                    });

                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#divAccountGroup').hide();
                            fnAlert("w", "EAC_03_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        $(".mdl-card__title-text").text(localization.EditAccountGroup);
                       
                        $("#divAccountGroup").show();
                        $("#btnSaveAccountGroup").hide();

                        $("#chkActiveStatus").parent().addClass("is-checked");
                        $("#chkActiveStatus").attr("disabled", true);

                        $("#chkIsIntegrateFA").attr("disabled", true);
                        $("#cboNatureG").attr("disabled", true);
                        $("#txtdesc").attr("disabled", true);
                       
                    });
                    accountName = data.node.text;
                    accid = data.node.id,
                        getExtraData(accid);
                    
                    if ($("#prca").is(":checked")) {
                        $("#bookTypeDiv").show();
                    }
                    else {
                        $("#bookTypeDiv").hide();
                    }

                    v_moveDown.prop('disabled', false);
                    v_moveUp.prop('disabled', false);
                     
                    v_natureG.prop('disabled', true);
                    v_natureG.val(data.node.id.substring(0, 1));
                    v_natureG.selectpicker('refresh');
                    console.log(data.node.id.substring(0, 1));

                    groupIndex = data.node.original.GroupIndex;
                    presentParent = data.node.parent;
                    var presentChildren = v_accountTree.jstree().get_node(presentParent).children;
                    var getArray = new Array();

                    for (var i = 0; i < presentChildren.length; i++) {

                        getArray.push(v_accountTree.jstree().get_node(presentChildren[i]).original.GroupIndex);
                    }

                    if (data.node.original.GroupIndex == Math.max.apply(Math, getArray)) {

                        v_moveDown.prop('disabled', true);
                    }

                    if (data.node.original.GroupIndex == Math.min.apply(Math, getArray)) {

                        v_moveUp.prop('disabled', true);
                    }
                }
            }

        });
    }

    function toMove() {
        if ($(this)[0].id == "btnUp") {
            moveUp = true;
        }
        else {
            moveUp = false
        }

        $.ajax({
            // url: getBaseURL() + '/AccountGroupDefine/AccountGroupMoveUpDown',
            url: '',
            type: 'post',
            datattype: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                GroupCode: accid,
                ParentID: presentParent,
                GroupIndex: groupIndex,
                moveUp: moveUp
            }),
            success: function (response) {
                v_accountTree.jstree("destroy");
                ajaxCallingTree();
                commonAll();
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
            }
        });
    }

    function getExtraData(idVal) {
        console.log(idVal, "dsfasdf");
        $.ajax({
            //url: getBaseURL() + '/AccountGroupDefine/getExtraData',
            url: '',
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                idval: idVal
            }),
            success: function (result) {

                v_txtdesc.val(result.GroupDesc);
                $("#cboBookType").val(result.BookType).selectpicker('refresh');
                $("#prgl").prop("checked", result.PR_GeneralLedger);
                $("#prca").prop("checked", result.PR_ControlAccount).trigger('change');
                $("#jgl").prop("checked", result.J_GeneralLedger);
                $("#sca").prop("checked", result.S_ControlAccount);
                $("#sgl").prop("checked", result.S_GeneralLedger);
                $("#pca").prop("checked", result.P_ControlAccount);
                $("#pgl").prop("checked", result.P_GeneralLedger);
                $("#cnca").prop("checked", result.CN_ControlAccount);
                $("#cngl").prop("checked", result.CN_GeneralLedger);
                $("#dnca").prop("checked", result.DN_ControlAccount);
                $("#dngl").prop("checked", result.DN_GeneralLedger);

            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
            }
        });
    }

    function toEdit() {

        if (v_txtdesc.val() != '') {
            accUpdate = {
                GroupDesc: v_txtdesc.val(),
                GroupCode: accid,
                BookType: $("#cboBookType").val(),
                PR_GeneralLedger: $("#prgl").is(":checked"),
                PR_ControlAccount: $("#prca").is(":checked"),
                J_GeneralLedger: $("#jgl").is(":checked"),
                S_ControlAccount: $("#sca").is(":checked"),
                S_GeneralLedger: $("#sgl").is(":checked"),
                P_ControlAccount: $("#pca").is(":checked"),
                P_GeneralLedger: $("#pgl").is(":checked"),
                CN_ControlAccount: $("#cnca").is(":checked"),
                CN_GeneralLedger: $("#cngl").is(":checked"),
                DN_ControlAccount: $("#dnca").is(":checked"),
                DN_GeneralLedger: $("#dngl").is(":checked"),
            };

            $.ajax({
                // url: getBaseURL() + '/AccountGroupDefine/UpdateAccountGroup',
                url: '',
                type: 'post',
                datatype: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({
                    acc: accUpdate
                }),
                success: function (result) {
                    fnAlert("s", "", "", 'Updated ' + accountName + ' account group');
                    v_accountTree.jstree("destroy");
                    ajaxCallingTree();
                    commonAll();

                    v_natureG.prop('disabled', false).selectpicker('refresh');
                    
                    v_moveDown.prop('disabled', true);
                    v_moveUp.prop('disabled', true);
                    $("#divAccountGroup").hide();

                    accid = '';
                    accountName = '';
                },
                error: function (error) {
                    fnAlert("e", "", error.StatusCode, error.statusText);
                }
            });
        }
        else {
            v_txtdesc.attr('placeholder', "Cannot be empty").focus();
        }
    }

    function commonAll() {
        v_moveDown.prop('disabled', true);
        v_moveUp.prop('disabled', true);
    }
});

function fnToDelete() {
    var selectedNode = $('#jstAccountGroup').jstree().get_selected(true);
    selectedNode = selectedNode[0];

    if (selectedNode != undefined) {
        if (selectedNode.children.length > 0) {
            fnAlert("w","","","Please delete child nodes first.");
        }
        else {
            if (confirm('Do you want to delete ' + accountName + ' account group?')) {
                $.ajax({
                    url: getBaseURL() + '/AccountGroupDefine/AccountGroupDelete',
                    type: 'post',
                    datattype: 'json',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({
                        id: accid
                    }),
                    success: function (response) {
                        if (response == true) {
                            fnAlert("s", "", "", 'Deleted ' + accountName + ' account group');
                            v_accountTree.jstree("destroy");
                            ajaxCallingTree();

                            v_natureG.prop('disabled', false).selectpicker('refresh');
                            v_del.prop('disabled', true);
                            v_moveDown.prop('disabled', true);
                            v_moveUp.prop('disabled', true);
                            $("#divAccountGroup").hide();

                            accid = '';
                            accountName = '';
                        }
                        else {
                            fnAlert("e", "", response.StatusCode, response.statusText);
                        }
                    },
                    error: function (error) {
                        fnAlert("e", "", error.StatusCode, error.statusText); 
                    }
                });
            }
        }
    }
}
function open_All() {
    $("#jstAccountGroup").jstree('open_all');
}

function close_All() {
    $("#jstAccountGroup").jstree('close_all');
}

function fnBookType() {
    if ($("#prca").is(":checked")) {
        $("#bookTypeDiv").show();
        $('#sca,#pca,#cnca,#dnca').prop('checked', false).prop('disabled', true);
    }
    else {
        $("#bookTypeDiv").hide();
        $("#cboBookType").val('');
        $('#sca,#pca,#cnca,#dnca').prop('disabled', false);
    }
}

var accountName = '';
$(document).ready(function () {
    var v_natureG = $("#natureG");
    var v_add = $("#btnAdd");
    var v_group = $("#txtGroup");
    var v_del = $("#btnDel");
    var v_moveUp = $("#btnUp");
    var v_moveDown = $("#btnDown");
    var v_btnEditNode = $("#btnEditNode");
    var v_txtdesc = $("#txtdesc");
    var v_accountTree = $("#accountTree");
    //var v_natureGA = $("#natureGA");

    var acc = {};
    var accUpdate = {};
    var treeObj = {};
    var accid = '';
    var prevClick = '';
    var presentParent = '';
    var groupIndex = '';
    var moveUp = false;
    ajaxCallingTree();
    $("#bookTypeDiv").hide();
    $('#prca').change(fnBookType);
    v_add.on('click', toAdd);
    v_del.on('click', toDelete);
    v_moveUp.on('click', toMove);
    v_moveDown.on('click', toMove);
    v_btnEditNode.on('click', toEdit);

    function ajaxCallingTree() {
        $.ajax({
            // url: getBaseURL() + '/AccountGroupDefine/AccountTreeRead',
           url:'',
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                treeObj = result;
                //console.log(treeObj);
                callingTree();

            },
            error: function (error) {
                alertError(error.message)
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
                v_add.prop('disabled', false);
                v_del.prop('disabled', false);

                prevClick = data.node.id;

                if (data.node.id == "s") {
                    v_natureG.prop('disabled', false).selectpicker('refresh');
                    v_del.prop('disabled', true);
                    v_moveDown.prop('disabled', true);
                    v_moveUp.prop('disabled', true);
                    $("#DivSAGD").css({ 'visibility': 'hidden' });

                    accid = '';
                    accountName = '';
                }
                else {


                    accountName = data.node.text;
                    accid = data.node.id,
                        getExtraData(accid);
                    $("#DivSAGD").css({ 'visibility': 'visible' });
                    if ($("#prca").is(":checked")) {
                        $("#bookTypeDiv").show().css({ 'visibility': '' });
                    }
                    else {
                        $("#bookTypeDiv").hide();
                    }

                    v_moveDown.prop('disabled', false);
                    v_moveUp.prop('disabled', false);
                    v_del.prop('disabled', false);
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

    function toAdd() {
        if (v_group.val() != '' && v_natureG.val() != '') {

            if (accid == '') {
                acc.ParentID = v_natureG.val();
            }
            else {
                acc.ParentID = accid;
            }
            acc.GroupDesc = v_group.val();
            acc.NatureofGroup = v_natureG.val();

            $.ajax({
                //url: getBaseURL() + '/AccountGroupDefine/CreateAccountGroup',
                url:'',
                type: 'post',
                datattype: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({
                    acc: acc
                }),
                success: function () {
                    alertSuccess('Created group ' + acc.GroupDesc)
                    v_group.val('')
                    v_accountTree.jstree("destroy");
                    ajaxCallingTree();

                    v_natureG.prop('disabled', false).selectpicker('refresh');
                    v_del.prop('disabled', true);
                    v_moveDown.prop('disabled', true);
                    v_moveUp.prop('disabled', true);
                    $("#DivSAGD").css({ 'visibility': 'hidden' });

                    accid = '';
                    accountName = '';
                },
                error: function (err) {
                    alertError(err.message)
                }
            });
        }
        else {
            if (v_group.val() == '') {
                v_group.attr('placeholder', "Cannot be empty").focus();
            }
            else {
                alertError("Select Group");
            }
        }
    }

    function toDelete() {
        var selectedNode = $('#accountTree').jstree().get_selected(true);
        selectedNode = selectedNode[0];

        if (selectedNode != undefined) {
            if (selectedNode.children.length > 0) {
                alertError('Please delete child nodes first.')
            }
            else {
                if (confirm('Do you want to delete ' + accountName + ' account group?')) {
                    $.ajax({
                        //url: getBaseURL() + '/AccountGroupDefine/AccountGroupDelete',
                        url:'',
                        type: 'post',
                        datattype: 'json',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify({
                            id: accid
                        }),
                        success: function (response) {
                            if (response == true) {
                                alertSuccess('Deleted ' + accountName + ' account group')
                                v_accountTree.jstree("destroy");
                                ajaxCallingTree();

                                v_natureG.prop('disabled', false).selectpicker('refresh');
                                v_del.prop('disabled', true);
                                v_moveDown.prop('disabled', true);
                                v_moveUp.prop('disabled', true);
                                $("#DivSAGD").css({ 'visibility': 'hidden' });

                                accid = '';
                                accountName = '';
                            }
                            else {
                                alertError("Sub Group / Account group exists.");
                            }
                        },
                        error: function (err) {
                            alertError(err.message)
                        }
                    });
                }
            }
        }
    }

    function toMove() {
        if ($(this)[0].id == "btnUp") {
            moveUp = true;
        }
        else {
            moveUp = false
        }

        $.ajax({
            //url: getBaseURL() + '/AccountGroupDefine/AccountGroupMoveUpDown',
            url:'',
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
            error: function (err) {
                alertError(err.message)
            }
        });
    }

    function getExtraData(idVal) {
        console.log(idVal, "dsfasdf");
        $.ajax({
            url: getBaseURL() + '/AccountGroupDefine/getExtraData',
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                idval: idVal
            }),
            success: function (result) {

                v_txtdesc.val(result.GroupDesc);
                $("#bookType").val(result.BookType).selectpicker('refresh');
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
                alertError(error.message)
            }
        });
    }

    function toEdit() {

        if (v_txtdesc.val() != '') {
            accUpdate = {
                GroupDesc: v_txtdesc.val(),
                GroupCode: accid,
                BookType: $("#bookType").val(),
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
                //url: getBaseURL() + '/AccountGroupDefine/UpdateAccountGroup',
                url:'',
                type: 'post',
                datatype: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({
                    acc: accUpdate
                }),
                success: function (result) {
                    alertSuccess('Updated ' + accountName + ' account group')
                    v_accountTree.jstree("destroy");
                    ajaxCallingTree();
                    commonAll();

                    v_natureG.prop('disabled', false).selectpicker('refresh');
                    v_del.prop('disabled', true);
                    v_moveDown.prop('disabled', true);
                    v_moveUp.prop('disabled', true);
                    $("#DivSAGD").css({ 'visibility': 'hidden' });

                    accid = '';
                    accountName = '';
                },
                error: function (error) {
                    alertError(error.message)
                }
            });
        }
        else {
            v_txtdesc.attr('placeholder', "Cannot be empty").focus();
        }
    }

    function commonAll() {
        v_add.prop('disabled', true);
        v_del.prop('disabled', true);
        v_moveDown.prop('disabled', true);
        v_moveUp.prop('disabled', true);
    }
});

function open_All() {
    $("#accountTree").jstree('open_all');
}

function close_All() {
    $("#accountTree").jstree('close_all');
}

function fnBookType() {
    if ($("#prca").is(":checked")) {
        $("#bookTypeDiv").show().css({ 'visibility': '' });
        $('#sca,#pca,#cnca,#dnca').prop('checked', false).prop('disabled', true);
    }
    else {
        $("#bookTypeDiv").hide();
        $("#bookType").val('');
        $('#sca,#pca,#cnca,#dnca').prop('disabled', false);
    }
}

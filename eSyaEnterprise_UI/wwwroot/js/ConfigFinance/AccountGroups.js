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
    v_add.on('click', toAdd);
    v_del.on('click', toDelete);
    v_moveUp.on('click', toMove);
    v_moveDown.on('click', toMove);
    v_btnEditNode.on('click', toEdit);

    function ajaxCallingTree() {
        $.ajax({
            url: getBaseURL() + '/AccountGroup/GetAccountGroupsforTreeview',
           
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                treeObj = result;
                //console.log(treeObj);
                callingTree();

            },
            error: function (error) {
               /* alertError(error.message);*/
                fnAlert("e","","",error.message);
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
                acc.ParentId = v_natureG.val();
            }
            else {
                acc.ParentId = accid;
            }
            acc.GroupDesc = v_group.val();
            acc.NatureOfGroup = v_natureG.val();

            $.ajax({
                url: getBaseURL() + '/AccountGroup/InsertIntoAccountGroup',
                type: 'post',
                datatype: 'json',
                data: {
                    obj: acc
                  
                },
                success: function () {
                   // alertSuccess('Created group ' + acc.GroupDesc);
                    fnAlert("s", "", "", 'Created group ' + acc.GroupDesc);
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
                    //alertError(err.message);
                    fnAlert("e", "", "", error.message);
                }
            });
        }
        else {
            if (v_group.val() == '') {
                v_group.attr('placeholder', "Cannot be empty").focus();
            }
            else {
                //alertError("Select Group");
                fnAlert("e", "", "", "Please select a group");
            }
        }
    }

    function toDelete() {
        var selectedNode = $('#accountTree').jstree().get_selected(true);
        selectedNode = selectedNode[0];

        if (selectedNode != undefined) {
            if (selectedNode.children.length > 0) {
                //alertError('Please delete child nodes first.');
                fnAlert("e", "", "", 'Please delete child nodes first.');

            }
            else {
                if (confirm('Do you want to delete ' + accountName + ' account group?')) {
                    $.ajax({
                        url: getBaseURL() + '/AccountGroup/DeleteAccountGroup',
                      
                        type: 'GET',
                        datattype: 'json',
                        data: {
                            groupcode: accid
                        },
                        success: function (response) {
                            if (response.Status) {
                                //alertSuccess('Deleted ' + accountName + ' account group');
                                fnAlert("s", "", "", 'Deleted ' + accountName + ' account group');
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
                                //alertError("Sub Group / Account group exists.");
                                fnAlert("e", "", "", response.Message);
                            }
                        },
                        error: function (err) {
                            //alertError(err.message);
                            fnAlert("e", "", "", err.message);
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
            url: getBaseURL() + '/AccountGroup/AccountGroupMoveUpDown',
           
            type: 'GET',
            datattype: 'json',
            data: {
                GroupCode: accid,
                ParentId: presentParent,
                GroupIndex: groupIndex,
                moveUp: moveUp
            },
            success: function (response) {
                v_accountTree.jstree("destroy");
                ajaxCallingTree();
                commonAll();
            },
            error: function (err) {
                //alertError(err.message);
                fnAlert("e", "", "", error.message);
            }
        });
    }

    function getExtraData(idVal) {
       
        $.ajax({
            url: getBaseURL() + '/AccountGroup/GetAccountGroupsbyGroupCode',
            type: 'GET',
            datatype: 'json',
           
            data: {
                groupcode: idVal
            },
            success: function (result) {

                v_txtdesc.val(result.GroupDesc);
                $("#bookType").val(result.BookType).selectpicker('refresh');
                $("#prgl").prop("checked", result.PrGeneralLedger);
                $("#prca").prop("checked", result.PrControlAccount).trigger('change');
                $("#jgl").prop("checked", result.JGeneralLedger);
                $("#sca").prop("checked", result.SControlAccount);
                $("#sgl").prop("checked", result.SGeneralLedger);
                $("#pca").prop("checked", result.PControlAccount);
                $("#pgl").prop("checked", result.PGeneralLedger);
                $("#cnca").prop("checked", result.CnControlAccount);
                $("#cngl").prop("checked", result.CnGeneralLedger);
                $("#dnca").prop("checked", result.DnControlAccount);
                $("#dngl").prop("checked", result.DnGeneralLedger);
                $("#jca").prop("checked", result.JControlAccount);
                $("#iif").prop("checked", result.IsIntegrateFa);

            },
            error: function (error) {
                //alertError(error.message);
                fnAlert("e", "", "", error.message);
            }
        });
    }

    function toEdit() {
       
        if (v_txtdesc.val() != '') {
            accUpdate = {
                GroupDesc: v_txtdesc.val(),
                GroupCode: accid,
                BookType: $("#bookType").val(),
                PrGeneralLedger: $("#prgl").is(":checked"),
                PrControlAccount: $("#prca").is(":checked"),
                JGeneralLedger: $("#jgl").is(":checked"),
                JControlAccount: $("#jca").is(":checked"),
                SControlAccount: $("#sca").is(":checked"),
                SGeneralLedger: $("#sgl").is(":checked"),
                PControlAccount: $("#pca").is(":checked"),
                PGeneralLedger: $("#pgl").is(":checked"),
                CnControlAccount: $("#cnca").is(":checked"),
                CnGeneralLedger: $("#cngl").is(":checked"),
                DnControlAccount: $("#dnca").is(":checked"),
                DnGeneralLedger: $("#dngl").is(":checked"),
                IsIntegrateFa: $("#iif").is(":checked"),
            };

            $.ajax({
                url: getBaseURL() + '/AccountGroup/UpdateAccountGroup',
                type: 'post',
                datatype: 'json',
                data: {
                    obj: accUpdate
                },
                success: function (result) {
                    //alertSuccess('Updated ' + accountName + ' account group');
                    fnAlert("s", "", "", 'Updated ' + accountName + ' account group');
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
                    //alertError(error.message);
                    fnAlert("e", "", "", error.message);
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


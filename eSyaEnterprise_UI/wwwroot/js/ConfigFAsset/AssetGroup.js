
    var data = new Array();
    $(document).ready(function () {
        var newrowid;
    var newrowids;
    var grid = $("#jqgAssetGroup");
    fnLoadAssetGroupGrid();
    fnLoadAssetSubGroupGrid();

    function fnLoadAssetGroupGrid() {
        grid.jqGrid({
            url: getBaseURL() + "/AssetGroup/GetFixedAssetGroup",
            datatype: "json",
            contenttype: "application/json; charset-utf-8",
            mtype: 'GET',
            jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
            colNames: [localization.AssetGroup, localization.AssetGroupDesc, localization.Status],
            colModel: [
                {
                    name: "AssetGroup", editable: true, width: "80px", formatter: 'integer', editoptions: {
                        dataInit: function (element) {
                            $(element).keypress(function (e) {
                                if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                                    return false;
                                }
                            });
                        }
                    }
                },
                { name: "AssetGroupDesc", editable: true, width: "300px" },
                { name: "ActiveStatus", editable: true, width: "70px", edittype: "select", hidden: true, align: 'center', formatter: 'select', editoptions: { value: "true: Active;false: InActive" } }
            ],
            rowNum: 10,
            rownumWidth: '55',
            loadonce: true,
            rowList: [10, 20, 50, 100],
            pager: "#jqpAssetGroup",
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            height: 'auto',
            width: $(document).width() - 400,
            autowidth: true,
            loadonce: true,
            caption: localization.AssetGroup,
            onSelectRow: function (rowid) {
                subRowId = rowid;

                if (newrowid != undefined) {
                    $("#jqgAssetGroup #" + newrowid + ":first").css({ background: '' });
                }

                newrowid = rowid;
            },
            loadComplete: function (data) {

                $("#jqpAssetGroup .ui-pg-div:first").css({ 'border-left': "none" });

                $("#jqgAssetGroup .jqgrow").hover(function () {
                    if (!$(this).hasClass('ui-state-highlight')) {
                        $(this).css({ 'background': "rgb(139, 157, 239)", color: 'white' })
                    }
                }, function () {
                    if (!$(this).hasClass('ui-state-highlight')) {
                        $(this).css({ 'background': "", color: '' })
                    }

                });
                $("#jqgAssetGroup").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

            },
            subGrid: true,
            subGridRowExpanded: function (subId, rowId) {
                var selArray = new Array();
                var subRowId;
                function returnData() {

                    var proId = grid.getRowData(rowId).AssetGroup;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].AssetGroup == proId) {
                            selArray.push(data[i]);
                        }
                    }
                    return selArray;
                }
                var subData = {
                    page: 1,
                    rows: returnData(),
                    records: selArray.length,
                };
                var subGridTableId;
                var subGridDivId;
                var subGridWidth = grid.width() - 200;
                subGridTableId = subId + "_t";
                subGridIdGlobal = subGridTableId;
                subGridDivId = subId + "_d";
                $("#" + subId).html("<table id='" + subGridTableId + "'></table><div id='" + subGridDivId + "'></div>");
                $("#" + subGridTableId).jqGrid({

                    colNames: [localization.AssetSubGroupID, localization.AssetSubGroupDescription, localization.Status],
                    colModel: [
                        { name: "AssetSubGroup", hidden: false, width: "40", editable: true, align: 'right' },
                        { name: "AssetSubGroupDesc", editable: true, width: "150" },
                        { name: "ActiveStatus", editable: true, width: "50", align: 'center', edittype: "select", formatter: 'select', editoptions: { value: "true: Active;false: InActive" } }
                    ],
                    pager: "#" + subGridDivId,
                    rowNum: 20,
                    rowList: [20, 40],
                    viewrecords: true,
                    gridview: true,
                    rownumbers: true,
                    datatype: 'local',
                    height: 'auto',
                    width: subGridWidth,
                    caption: localization.subGrid,
                    onSelectRow: function (rowids) {
                        subRowId = rowids;

                        if (newrowids != undefined) {
                            $("#" + subGridTableId + " #" + newrowids).css({ background: '' });
                        }

                        $("#" + subGridTableId + " #" + rowids).css({ background: '#F9D953 url("images/ui-bg_flat_55_fbec88_40x100.png") 50% 50% repeat-x', color: '#000' });
                        newrowids = rowids;
                    },
                    loadComplete: function () {

                        setTimeout(function () {
                            $(".ui-pager-control tr").css('background', '#fff');
                            $("#jqgh_" + subGridTableId + "_AssetSubGroup").css({ 'text-align': 'right' });
                            $("#" + subGridDivId + " .ui-pg-div:first").css({ 'border-left': "none" });
                            $("#" + subGridTableId + " .jqgrow").hover(function () {
                                if (!$(this).hasClass('ui-state-highlight')) {
                                    $(this).css({ 'background': "rgb(139, 157, 239)", color: 'white' })
                                }
                            }, function () {
                                if (!$(this).hasClass('ui-state-highlight')) {
                                    $(this).css({ 'background': "", color: '' })
                                }

                            })
                        }, 100);

                    },

                }).jqGrid('navGrid', '#' + subGridDivId, { del: false, search: false, add: false, edit: false, refresh: false },
                    {
                        editCaption: localization.EditAssetGroup,
                        url: getBaseURL() + '/AssetGroup/InsertIntoFixedAssetGroup',

                        closeAfterEdit: true,
                        reloadAfterSubmit: true,
                        beforeShowForm: function (formid) {
                            $("#AssetSubGroup").prop("disabled", true);
                            $("#AssetSubGroupDesc,#AssetSubGroup").prop("disabled", true);
                            $("#AssetSubGroupDesc").width("300px");
                            $("#AssetSubGroupDesc,#AssetSubGroup").css('height', "auto");
                            $("td").html(function (i, html) {
                                return html.replace(/&nbsp;/g, '');
                            });
                            $("#editmodjqgAssetGroup_" + rowId + "_t").css({
                                'width': Math.round($("#" + subGridTableId).width() / 1.7) + "px",
                                'height': 'auto'
                            });
                            $("#FrmGrid_jqgAssetGroup_" + rowId + "_t").css({
                                'width': Math.round(grid.width() / 1.7) + "px",
                                'height': 'auto'
                            });
                        },
                        beforeSubmit: function (postdata, formid) {
                            debugger;
                            postdata.AssetGroup = grid.getRowData(rowId).AssetGroup;
                            postdata.AssetSubGroup = $("#" + subGridTableId).getRowData(subRowId).AssetSubGroup;
                            postdata.ActiveStatus = $("#" + subGridTableId).getRowData(subRowId).ActiveStatus;
                        },
                        afterSubmit: function (response, postdata) {
                            if (response.responseJSON.Status === true) {
                                fnAlert("s", "", response.StatusCode, response.responseJSON.Message);
                                fnLoadAssetSubGroupGrid();
                                setTimeout(function () {
                                    $("#jqgAssetGroup").collapseSubGridRow(rowId);
                                    $("#jqgAssetGroup").expandSubGridRow(rowId);
                                }, 1000);
                                return [true, '']
                            }
                            else {
                                return [false, response.responseJSON.Message]
                            }
                        }
                    });
                $("#" + subGridTableId)[0].addJSONData(subData);
            }

        }).jqGrid('navGrid', "#pgProcessRule", { del: false, search: false, add: false, edit: false, refreshtext: 'Reload' });
        }


       
    });

    function fnLoadAssetSubGroupGrid() {
        $.ajax({
            url: getBaseURL() + "/AssetGroup/GetFixedAssetSubGroup",
            type: 'post',
            datatype: 'json',
            async: false,
            success: function (result) {

                data = result;
                $("#jqgAssetGroup").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
            }
        });
    }


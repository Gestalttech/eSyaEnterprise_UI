
$(document).ready(function () {
    fnLoadCultureKeysGrid();
});

function fnLoadCultureKeysGrid() {

    var culture = $("#cboCulture").val();


    $("#jqgCulturekeys").GridUnload();

    if (!IsStringNullorEmpty(culture)) {

        $("#jqgCulturekeys").jqGrid({
            url: getBaseURL() + '/Culture/GetDistinictCultureKeys?Culture=' + culture,
            datatype: "json",
            contenttype: "application/json; charset-utf-8",
            mtype: 'POST',
            colNames: [localization.Key, localization.Value, localization.CultureValue],
            colModel: [
                { name: "Key", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
                { name: "Value", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
                { name: "CultureValue", width: 70, editable: true, align: 'left', edittype: 'text' }
            ],
            rowNum: 10000,
            rownumWidth: 55,
            pager: "#jqpCulturekeys",
            pgtext: null,
            caption: "Culture Keys",
            pgbuttons: null,
            viewrecords: false,
            gridview: true,
            rownumbers: true,
            height: 'auto',
            width: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: true,
            loadonce: true,
            cellEdit: true,
            editurl: 'url',
            cellsubmit: 'clientArray',
            onSelectRow: function (id) {
                if (id) { $('#jqgCulturekeys').jqGrid('editRow', id, true); }
            },
            ondblClickRow: function (rowid) {
            },
            loadComplete: function (data) {
                $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
                $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
                $("#jqgCulturekeys").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                SetGridControlByAction();
                fnAddGridSerialNoHeading(); fnJqgridSmallScreen("jqgCulturekeys");
            }
        }).jqGrid('navGrid', '#jqpCulturekeys', { add: false, edit: false, search: false, del: false, refresh: false });
    }
}

function fnSaveCultureKeys() {

    if (IsStringNullorEmpty($("#cboCulture").val())) {
        fnAlert("w", "ELE_05_00", "UI0089", errorMsg.Culture_E6);
        return;
    }

    var $grid = $("#jqgCulturekeys");
    var cul_keys = [];
    var ids = jQuery("#jqgCulturekeys").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgCulturekeys').jqGrid('getRowData', rowId);

        if (!IsStringNullorEmpty(rowData.CultureValue)) {
            cul_keys.push({
                Culture: $("#cboCulture").val(),
                Key: rowData.Key,
                CultureValue: rowData.CultureValue
                
            });
        }
    }

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Culture/InsertOrUpdateCultureKeys',
        type: 'POST',
        datatype: 'json',
        data: { obj: cul_keys },
        async: false,
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSave").attr("disabled", false);
                $("#jqgCulturekeys").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSave").attr("disabled", false);
            }
            $("#btnSave").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSave").attr("disabled", false);
        }
    });

}


$(document).on('focusout', '[role="gridcell"] *', function () {
    $("#jqgCulturekeys").jqGrid('editCell', 0, 0, false);
});

function SetGridControlByAction() {
    $("#btnSave").attr("disabled", false);
    if (_userFormRole.IsEdit === false) {
        $("#btnSave").attr("disabled", true);
    }
}


function fnExportToExcel() {
    var cultureval = $("#cboCulture :selected").text();
    var culture = $("#cboCulture").val()
    //JSONToCSVConvertor(JSON.stringify($('#jqgCulturekeys').jqGrid('getRowData')), cultureval, true);
    window.location.href = getBaseURL() + '/Culture/Export?cultureval=' + cultureval + '&culture=' + culture;

}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;


    var CSV = '';
    //Set Report title in first row or line

    //CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            //Now convert each value to string and comma-seprated
            if (index == "Key") {
                index = "Key";
            }
            if (index == "Value") {
                index = "Value";
            }
            if (index == "CultureValue") {
                index = "CultureValue";
            }


            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {


            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        fnAlert("w", "ELE_05_00", "UI0093", errorMsg.InvalidData_E10);
        return;
    }

    //Generate a file name
    var fileName = ReportTitle;

    //this will remove the blank-spaces from the title and replace it with an underscore
    //fileName = ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + CSV;

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    //this part will append the anchor tag and remove it after automatic click
    console.log(document.body);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

}

$('#btnImport').on('click', function () {
    var fileExtension = ['xls', 'xlsx'];
    var filename = $('#flnExcel').val();

    if (filename.length == 0) {
        fnAlert("w", "ELE_05_00", "UI0090", errorMsg.File_E7);
        return false;
    }
    else {
        var extension = filename.replace(/^.*\./, '');
        if ($.inArray(extension, fileExtension) == -1) {
            fnAlert("w", "ELE_05_00", "UI0091", errorMsg.ExcelFile_E8);
            return false;
        }
    }
    var filewithpath = filename.replace(/^.*[\\\/]/, '')
    var fname = filewithpath.substr(0, filewithpath.lastIndexOf('.'));
    var ddllanguage = $("#cboCulture :selected").text();
    if (ddllanguage !== fname) {
        fnAlert("w", "ELE_05_00", "UI0092", errorMsg.FileNameSelectedLanguage_E9);
        return false;
    }

    var fileUpload = $("#flnExcel").get(0);
    var files = fileUpload.files;
    //var files = e.target.files;
    var i, f;
    for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function (e) {
            var data = e.target.result;

            /* if binary string, read with type 'binary' */
            var result;
            var workbook = XLSX.read(data, { type: 'binary' });
            /* DO SOMETHING WITH workbook HERE */
            workbook.SheetNames.forEach(function (sheetName) {
                // var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

                if (roa.length > 0) {
                    result = roa;
                }
            });

            fnLoadExcelGrid(result);
        };
        reader.readAsBinaryString(f);
    }

});

function fnLoadExcelGrid(result) {
    $("#jqgCulturekeys").GridUnload();

    $("#jqgCulturekeys").jqGrid({
        //url: getBaseURL() + '/Culture/GetDistinictCultureKeys?Culture=' + culture,
        datatype: "local",
        //contenttype: "application/json; charset-utf-8",
        //mtype: 'POST',
        colNames: ["Key", "Value", "Culture Value"],
        colModel: [
            { name: "Key", width: 100, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
            { name: "Value", width: 100, editable: false, editoptions: { disabled: true }, align: 'left', edittype: 'text' },
            { name: "CultureValue", width: 100, editable: true, align: 'left', edittype: 'text' }
        ],
        rowNum: 1000,
        data: result,
        pager: "#jqpCulturekeys",
        pgtext: null,
        pgbuttons: null,
        viewrecords: false,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',
        cellsubmit: 'clientArray',
        onSelectRow: function (id) {
            if (id) { $('#jqgCulturekeys').jqGrid('editRow', id, true); }
        },
        ondblClickRow: function (rowid) {
        },
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgCulturekeys").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            SetGridControlByAction();
            fnAddGridSerialNoHeading(); fnJqgridSmallScreen("jqgCulturekeys");
        }
    }).jqGrid('navGrid', '#jqpCulturekeys', { add: false, edit: false, search: false, del: false, refresh: false });

}
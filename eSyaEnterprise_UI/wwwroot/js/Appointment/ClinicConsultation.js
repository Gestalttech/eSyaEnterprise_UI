$(document).ready(function () {
    $(".appointmentSidebar,.waitlist,.pullWaitlist").css({
        'height': $(window).innerHeight() - ($('section.header').outerHeight(true) + $('.banner').outerHeight(true)),
        'overflow': 'auto'
    });
     var todaydt = new Date();
    $("#txtAppointmentDate").datepicker({
        autoclose: true,
        dateFormat: _cnfDateFormat,
        minDate: todaydt,
        
    });
    $("#txtDateOfBirth").datepicker({
        autoclose: true,
        dateFormat: _cnfDateFormat,
        maxDate: todaydt,
        
    });
    $('#txtAppointmentDate').datepicker({
        dateFormat: _cnfDateFormat,

    });
    $('#txtDateOfBirth').datepicker({
        dateFormat: _cnfDateFormat,

    });
    $("#divDoctorList .headingText").click(function () {
        $("#divDoctorList").toggleClass('pullUp');
        $("#btnPullUp").find("svg").toggleClass('fa-chevron-up fa-chevron-down');
    })
    $(".doctorCol").css({
        'max-height': $(window).innerHeight() / 2.8,
        'overflow': 'auto'
    });
    $(".fc-view-container").css({

        'max-height': $(window).innerHeight() - 170,
        'overflow': 'auto'
    });
    $(".fc-timegrid-container").css({
        'overflow': 'hidden'
    });
    // fnCheckAllowLocationSelectioninCombo();
    // fnProcessLoading(true);
    //onFormLoad();
    fnInitializerCalendar();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnServiceDetails",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: "Edit", icon: "edit", callback: function (key, opt) { fnEditServiceDetails(event, 'edit') } },
            jqgView: { name: "View", icon: "view", callback: function (key, opt) { fnEditServiceDetails(event, 'view') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + "Edit" + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + "View" + " </span>");
});
$(window).resize(function () {
    $(".appointmentSidebar,.waitlist ,.pullWaitlist").css({
        'max-height': $(window).innerHeight() - 131,
        //'overflow': 'auto'
    });
});
function fnShowPopup() {
    $("#PopupAppointmentScheduler").modal('show');
}
$("#btnMove").click(function () {
    $(".appointmentSidebar").toggleClass('active');
    $(".appointmentSidebar .form-group").toggleClass('padright27');
    $("#calendar").parent().toggleClass('active');
});
function pullthewaitlist() {
    $(".waitlist").toggleClass('active');
    $(".calendarTimeline").toggleClass('slightright');

    //if()
}
$('#PopupAppointmentScheduler').on('show.bs.modal', function () {

    $(".modal-body").addClass('bg-lightgrey');
    fnGridServiceDetails();
});
$('#PopupPatientSearch').on('show.bs.modal', function () {

    $(".blur").addClass('active')
});
$('#PopupPatientSearch').on('hide.bs.modal', function () {

    $(".blur").removeClass('active')
});


var calendarEl = document.getElementById('calendar');
var calendar;
document.addEventListener('DOMContentLoaded', function () {
    var Calendar = FullCalendar.Calendar;
    var Draggable = FullCalendarInteraction.Draggable;

    /* initialize the external events */
    var containerEl = document.getElementById('external-events');
    new Draggable(containerEl, {
        itemSelector: '.fc-event',
        eventData: function (eventEl) {
            return {
                title: eventEl.innerText.trim(),
                duration: '00:15'
            }
        },
       
       
    });
});
function fnInitializerCalendar() {

    calendar = new FullCalendar.Calendar(calendarEl, {
        titleFormat: { // will produce something like "Tuesday, September 18, 2018"
            month: 'long',
            year: 'numeric',
            day: 'numeric',
        },
        plugins: ['interaction', 'dayGrid', 'timeGrid', 'list', 'timelineWeek'],
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,list,timeGridWeek,dayGridMonth'
        },
        themeSystem: 'bootstrap',
        defaultView: 'timeGridDay',
        eventContent: function (arg) {
            return { html: arg.event.title };
        },
        events: [
            {
                id: 1,
                title:'Mr.Arun Kumar',
                start: '2023-12-26 07:00:00',
                end: '2023-12-26 07:30:00'
            },
            {
                id: 2,
                title: 'Mr.Balamurugan',
                start: '2023-12-26 07:31:00',
                end: '2023-12-26 08:30:00'
            },
            {
                id: 3,
                title: 'Mr.Satheesh Kumar',
                start: '2023-12-26 09:00:00',
                end: '2023-12-26 09:30:00'
            },
            {
                id: 4,
                title: 'Mr.Manoj',
                start: '2023-12-26 10:31:00',
                end: '2023-12-26 11:15:00'
            }

        ],
             eventClick: function (calEvent, jsEvent, view) {
                $("#PopupAppointmentScheduler").modal('show');

        },
        selectable: true,
        selectHelper:true,
        select: function (start,end,allDays) {
            $("#PopupAppointmentScheduler").modal('show');
             var _datearr = [], _d='';
            _datearr = start.startStr.slice(0, 10).split('-');
            _d = _datearr[2] + '/' + _datearr[1] + '/'+ _datearr[0];
            },
         
    });

    calendar.render();
}

 
 

function fnLoadDoctorScheduleList() {
    var _cboSpecialty = $("#cboSpecialty").val();
   
    $('[id^="dvDoctor"]').css('display', 'none');
    $(".ph-item").height($(this).parent().height());


    var phload = '';
    for (i = 0; i <= 12; i++) {
        phload += `<div class="ph-col-12 mb-2"></div>`;
    }


    $(".ph-row").html(phload);
    switch (_cboSpecialty) {
        case 'g': {
            fnToggleSpecialty("GM"); break;
            }
        case 'a': {
            fnToggleSpecialty("AN"); break;
        }
            
        case 'c': {
            fnToggleSpecialty("CA");break;
        }
            
        case 'd':
            {
              fnToggleSpecialty("DE");break;
            }
           
        case 's': {
            fnToggleSpecialty("SU"); break;
        }
           
        case 'p': {
            fnToggleSpecialty("PA"); break;
        }
            
        default:
            $("#dvDoctorScheduleList").css('display', 'none'); break;
    }
    
   
  
}

function fnToggleSpecialty(id) {
    $(".ph-item").css('display', 'block');
    setTimeout(function () { $(".ph-item").css('display', 'none'); }, 500);
    setTimeout(function () { $("#dvDoctor" + id).css('display', 'block'); }, 501);
   
}
 

$("#btnCancelBusinessKey,.close").click(function () {
    $("#PopupAppointmentScheduler").modal('hide');
});

function fnGridServiceDetails() {
    $("#jqgServiceDetails").jqGrid({
        datatype: 'local',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ServiceID, localization.ServiceDescription, localization.Currency, localization.Amount,  localization.Active, localization.Actions],
        colModel: [
            { name: "ServiceID", width: 70, editable: true, align: 'left',hidden:true },
            { name: "Servicedescription", width: 250, editable: false, align: 'left', resizable: true },
            { name: "Currency", width: 105, editable: true, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "Amount", width: 100, align: 'center', resizable: false, editoption: { 'text-align': 'left', maxlength: 25 }, hidden: true },
            { name: "ActiveStatus", editable: true, width: 100, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 55, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnServiceDetails"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpServiceDetails",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
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
        scrollOffset: 0, caption: localization.ServiceDetails,
        loadComplete: function (data) {
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen("jqgServiceDetails");
        },

    }).jqGrid('navGrid', '#jqpServiceDetails', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpServiceDetails', {
        caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSMSinformation
    }).jqGrid('navButtonAdd', '#jqpServiceDetails', {
        caption: '<span class="fa fa-plus btn-pager"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddSMSInformation
    });
}

function fnGridRefreshSMSinformation() {

}

function fnAddSMSInformation() {

}
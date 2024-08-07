$(function () {
    $(".header").css('display', 'none');
})
const arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
var ThirtyNine = 1;
const convertToArabic = (number) => {
    return String(number).split('').map(char => arabicNumbers[Number(char)]).join('');
}
//var inArabic = convertToArabic(ThirtyNine);

$(function () {
    //fnDynamicHeight();
});

$(window).on('resize', function () {
    //fnDynamicHeight();
    fnDynamicHeight_new();
})
function fnDynamicHeight() {
    $(".rightDisplay").each(function () {
        var divCount = $(this).find('div').length;
        var dynamicHeight = ($(window).height() / divCount);
        var dynamicDivWidth = ($(".rightDisplay div").innerWidth() / 2);
        var winWidth = $(window).width();
        debugger;
        if (winWidth < 992) {
            if (divCount == 1) {
                $(".rightDisplay div").css('height', 50 + 'vh');
                $(".text-tokenNumber").css({ 'font-size': 5 + 'vh', 'line-height': 5 + 'vh', 'padding-top': 4 + 'vh' });
                $(".doctorName").css({ 'font-size': 7 + 'vh', 'line-height': 7 + 'vh', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': 3 + 'vh', 'line-height': 3 + 'vh' });

            }
            else if (divCount == 2 || divCount == 3) {
                //$(".rightDisplay div").css('height', dynamicHeight + 'px');
                //$(".text-tokenNumber").css({ 'font-size': (dynamicHeight * 0.40) + 'px', 'line-height': (dynamicHeight * 0.40) + 'px', 'padding-top': (dynamicHeight * 0.10) + 'px' });
                //$(".doctorName").css({ 'font-size': dynamicHeight / 7 + 'px', 'line-height': dynamicHeight / 7 + 'px', 'width': dynamicDivWidth - 10 });
                //$(".clinicNumber").css({ 'font-size': (dynamicHeight * 0.07) + 'px', 'line-height': (dynamicHeight * 0.07) + 'px' });
                $(".rightDisplay div").css('height', 50 / divCount + 'vh');
                $(".text-tokenNumber").css({ 'font-size': 50 / (divCount * 3) + 'vh', 'line-height': 50 / (divCount * 3) + 'vh' });
                $(".doctorName").css({ 'font-size': dynamicHeight / 3 + 'vh', 'line-height': dynamicHeight / 3 + 'vh', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': 2 + 'vh', 'line-height': 2 + 'vh', 'padding-top': 1 + 'vh' });
            }
            else {
                $(".rightDisplay div").css('height', dynamicHeight + 'px');
                $(".text-tokenNumber").css({ 'font-size': dynamicHeight * 0.34 + 'px', 'line-height': dynamicHeight * 0.34 + 'px', 'padding-top': dynamicHeight * 0.08 + 'px' });
                $(".doctorName").css({ 'font-size': dynamicHeight / 6 + 'px', 'line-height': dynamicHeight / 6 + 'px', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': dynamicHeight / (divCount * 2.5) + 'px', 'line-height': dynamicHeight / (divCount * 2.5) + 'px', 'padding-top': 1 + 'vh' });

            }
        }
        else {
            if (divCount == 1) {
                $(".rightDisplay div").css('height', dynamicHeight + 'px');
                $(".text-tokenNumber").css({ 'font-size': dynamicHeight / 45 + 'px', 'line-height': dynamicHeight / 45 + 'px', 'padding-top': dynamicHeight / 10 + 'px' });
                $(".doctorName").css({ 'font-size': dynamicHeight / 95 + 'px', 'line-height': dynamicHeight / 95 + '95', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': dynamicHeight * .025 + 'px', 'line-height': dynamicHeight * .025 + 'px' });

            }
            else if (divCount == 2 || divCount == 3) {
                //$(".rightDisplay div").css('height', dynamicHeight + 'px');
                //$(".text-tokenNumber").css({ 'font-size': (dynamicHeight * 0.60) + 'px', 'line-height': (dynamicHeight *0.60) + 'px', 'padding-top': (dynamicHeight * 0.10) + 'px' });
                //$(".doctorName").css({ 'font-size': dynamicHeight / 7 + 'px', 'line-height': dynamicHeight / 7 + 'px', 'width': dynamicDivWidth - 10 });
                //$(".clinicNumber").css({ 'font-size': (dynamicHeight * 0.125) + 'px', 'line-height': (dynamicHeight * 0.125) + 'px' });
                $(".rightDisplay div").css('height', dynamicHeight + 'px');
                $(".text-tokenNumber").css({ 'font-size': dynamicHeight / 10 + 'px', 'line-height': dynamicHeight / 10 + 'px' });
                $(".doctorName").css({ 'font-size': dynamicHeight / 7 + 'px', 'line-height': dynamicHeight / 7 + 'px', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': dynamicHeight / 20 + 'px', 'line-height': dynamicHeight / 20 + 'px' });

            }
            else {
                //$(".rightDisplay div").css('height', dynamicHeight + 'px');
                //$(".text-tokenNumber").css({'font-size': dynamicHeight / 7 + 'px', 'line-height': dynamicHeight / 7 + 'px' });
                //$(".doctorName").css({ 'font-size': dynamicHeight / (divCount * 1.25) + 'px', 'line-height': dynamicHeight / (divCount * 1.25) + 'px', 'width': dynamicDivWidth - 10 });
                //$(".clinicNumber").css({ 'font-size': dynamicHeight / 6 + 'px', 'line-height': dynamicHeight / 6 + 'px' });

                $(".rightDisplay div").css('height', dynamicHeight + 'px');
                $(".text-tokenNumber").css({ 'font-size': dynamicHeight / 7 + 'px', 'line-height': dynamicHeight / 7 + 'px' });
                $(".doctorName").css({ 'font-size': dynamicHeight / (divCount * 1.25) + 'px', 'line-height': dynamicHeight / (divCount * 1.25) + 'px', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': dynamicHeight * .07 + 'px', 'line-height': dynamicHeight * .07 + 'px' });
            }
        }

    });

}


function fnDynamicHeight_new() {
    $(".rightDisplay").each(function () {
        var secCount = $(this).find('section').length;
        var dynamicHeight = ($(window).height() / secCount);
        var dynamicDivWidth = ($(".rightDisplay section").innerWidth() / 2);
        var winWidth = $(window).width();
        $(".rightDisplay section").css('height', dynamicHeight + 'px');
        $(".divReceptioNo").css('height', dynamicHeight * 0.30);
    })
}

function getBaseURL() {
    var url = window.location.href.split('/');
    var baseUrl = url[0] + '//' + url[2] + '@Url.Content("~")';
    return baseUrl;
}

$(document).ready(function () {

    fnDisplayingToken();

    fnDisplayCallingToken();

});

var TokenList = [];

var lastCallingRoomNo = "";
var lastCallingToken = "";

function fnDisplayingToken() {

    $("[id^=lblTokenNumber_]").text("");
    lastCallingRoomNo = "";
    lastCallingToken = "";

    try {
        $.ajax({
            type: "GET",
            //url: getBaseURL() + '/DisplaySystem/GetTokenForReceptionDisplay',
            url: '',
            data: {
                businessKey: $('#hdBusinessKey').val(),
                arrayofRoomList: $('#hdRoomNumber').val()
            },
            cache: false,
            success: function (data) {

                $.each(data, function (key, value) {
                    //$("#lblTokenNumber_" + value.CallingRoomNumber).html("Dr. " + value.DoctorName + "<br/>" + value.QueueTokenKey.substr(value.QueueTokenKey.length - 2));
                    $("#lblTokenNumber_" + value.CallingRoomNumber).html("Dr. " + value.DoctorName + "<br/>" + "د/ " + value.DoctorName_ar + "<br/>" + value.QueueTokenKey.substr(value.QueueTokenKey.length - 2));
                    $("#lblRoomNo_ar_" + value.CallingRoomNumber).html(convertToArabic(value.CallingRoomNumber));
                    lastCallingRoomNo = value.CallingRoomNumber;
                    lastCallingToken = "Dr. " + value.DoctorName + "<br/>" + "د/ " + value.DoctorName_ar + "<br/>" + value.QueueTokenKey.substr(value.QueueTokenKey.length - 2);
                    //lastCallingToken = "Dr. " + value.DoctorName + "<br/>" + value.QueueTokenKey.substr(value.QueueTokenKey.length - 2);
                    //lastCallingRoomNo = value.CallingRoomNumber;
                    //lastCallingToken = value.QueueTokenKey;

                    TokenList.push({
                        CallingRoomNumber: value.CallingRoomNumber,
                        TokenCallingTime: value.TokenCallingTime,
                        QueueTokenKey: value.QueueTokenKey,
                        //DoctorName: value.DoctorName
                        DoctorName: value.DoctorName_ar
                    });

                });

                fnDisplayCallingToken();
            }
        });
    }
    catch (err) {
        console.error(err);
    }

    window.setTimeout(fnDisplayingToken, 5000);

}

var previousCallingToken = "";
var toKenCallingTime;
function fnDisplayCallingToken() {

    $("#lblCallingRoomNumber").html(lastCallingRoomNo);
    $("#lblCallingRoomNumber_ar").html(convertToArabic(lastCallingRoomNo));
    $("#lblCallingTokenNumberD").html(lastCallingToken);

    if (lastCallingToken !== previousCallingToken) {
        previousCallingToken = lastCallingToken
        beep(1500, 3, function () {
        });
    }

}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function blink_text() {
    $('.blink').fadeOut(3000);
    $('.blink').fadeIn(1000);
}
setInterval(blink_text, 3000);

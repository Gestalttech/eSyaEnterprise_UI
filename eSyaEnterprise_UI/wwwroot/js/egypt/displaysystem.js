$(function () {
    $(".header").css('display', 'none');
    
});
const arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
var ThirtyNine = 1;
const convertToArabic = (number) => {
    return String(number).split('').map(char => arabicNumbers[Number(char)]).join('');
}
//var inArabic = convertToArabic(ThirtyNine);

$(function () {
    fnDynamicHeight();
});

$(window).on('resize', function () {
    fnDynamicHeight();
    //fnDynamicHeight_new();
})
function fnDynamicHeight() {
    $(".rightDisplay").each(function () {
        var divCount = $(this).find('div').length;
        var dynamicHeight = ($(window).height() / divCount);
        var dynamicDivWidth = ($(".rightDisplay div").innerWidth() / 2);
        var winWidth = $(window).width();
       
        
            if (divCount == 1) {
                $(".rightDisplay div").css('height', dynamicHeight + 'px');
                $(".text-tokenNumber").css({ 'font-size': dynamicHeight / 3 + 'px', 'line-height': dynamicHeight / 3 + 'px', 'padding-top': dynamicHeight * 0.15 + 'px' });
                $(".doctorName").css({ 'font-size': dynamicHeight / 95 + 'px', 'line-height': dynamicHeight / 95 + '95', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': dynamicHeight * .025 + 'px', 'line-height': dynamicHeight * .025 + 'px' });

            }
            else if (divCount == 2 || divCount == 3) {
                $(".rightDisplay div").css('height', dynamicHeight + 'px');
                $(".text-tokenNumber").css({ 'font-size': dynamicHeight / 4 + 'px', 'line-height': dynamicHeight / 4 + 'px', 'padding-top': dynamicHeight * 0.15 + 'px' });
                $(".doctorName").css({ 'font-size': dynamicHeight / 7 + 'px', 'line-height': dynamicHeight / 7 + 'px', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': dynamicHeight * .08 + 'px', 'line-height': dynamicHeight * .08 + 'px' });

            }
            else {
                $(".rightDisplay div").css('height', dynamicHeight + 'px');
                $(".text-tokenNumber").css({ 'font-size': dynamicHeight / 3 + 'px', 'line-height': dynamicHeight / 3 + 'px', 'padding-top': dynamicHeight * 0.05 +'px'});
                $(".doctorName").css({ 'font-size': dynamicHeight / (divCount * 1.25) + 'px', 'line-height': dynamicHeight / (divCount * 1.25) + 'px', 'width': dynamicDivWidth - 10 });
                $(".clinicNumber").css({ 'font-size': dynamicHeight * .15 + 'px', 'line-height': dynamicHeight * .15 + 'px' });
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
            url: getBaseURL() + '/DisplaySystem/GetTokenForReceptionDisplay',
           
            data: {
                DisplayArea: $('#hdDisplayArea').val(), 
                arrayofRoomList: $('#hdRoomNumber').val()
            },
            cache: false,
            success: function (data) {

                $.each(data, function (key, value) {
                    //$("#lblTokenNumber_" + value.CallingRoomNumber).html("Dr. " + value.DoctorName + "<br/>" + value.QueueTokenKey.substr(value.QueueTokenKey.length - 2));
                    $("#lblTokenNumber_" + value.CallingRoomNumber).html( value.QueueTokenKey);
                    $("#lblRoomNo_ar_" + value.CallingRoomNumber).html(convertToArabic(value.CallingRoomNumber));
                    lastCallingRoomNo = value.CallingRoomNumber;
                    lastCallingToken =  value.QueueTokenKey;
                    //lastCallingToken = "Dr. " + value.DoctorName + "<br/>" + value.QueueTokenKey.substr(value.QueueTokenKey.length - 2);
                    //lastCallingRoomNo = value.CallingRoomNumber;
                    //lastCallingToken = value.QueueTokenKey;

                    TokenList.push({
                        CallingRoomNumber: value.CallingRoomNumber,
                        TokenCallingTime: value.TokenCallingTime,
                        QueueTokenKey: value.QueueTokenKey,
                        //DoctorName: value.DoctorName
                        //DoctorName: value.DoctorName_ar
                    });
                    $(".loungeNumber").text(value.TerminalID);
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


// TIMER

// Run Timer Control in Label
var myTimer;
function startTimer(duration, display) {

    if (myTimer !== null)
        clearInterval(myTimer);

    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        // get the number of seconds that have elapsed since
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 03:00 not 02:59 Restart
            //start = Date.now() + 1000;
            clearInterval(myTimer);
            return;
        }
    };
    // we don't want to wait a full second before the timer starts
    timer();
    myTimer = setInterval(timer, 1000);
}

// Voice of the Given text
function fnTextToSpeech(text) {
    //var msg = new SpeechSynthesisUtterance();
    //var voices = window.speechSynthesis.getVoices();
    //msg.voice = voices[2];
    //msg.voiceURI = "native";
    //msg.volume = 20;
    //msg.rate = .7;
    //msg.pitch = 5;
    //msg.text = text;
    //msg.onend = function (e) {
    //    //console.log('Finished in ' + event.elapsedTime + ' seconds.');
    //};
    //speechSynthesis.speak(msg);

    beep(1000, 2, function () {
    });
}


var beep = (function () {
    var ctxClass = window.audioContext || window.AudioContext || window.AudioContext || window.webkitAudioContext
    var ctx = new ctxClass();
    return function (duration, type, finishedCallback) {

        duration = +duration;

        // Only 0-4 are valid types.
        type = (type % 5) || 0;

        if (typeof finishedCallback != "function") {
            finishedCallback = function () { };
        }

        var osc = ctx.createOscillator();

        osc.type = type;
        //osc.type = "sine";

        osc.connect(ctx.destination);
        if (osc.noteOn) osc.noteOn(0);
        if (osc.start) osc.start();

        setTimeout(function () {
            if (osc.noteOff) osc.noteOff(0);
            if (osc.stop) osc.stop();
            finishedCallback();
        }, duration);

    };
})();

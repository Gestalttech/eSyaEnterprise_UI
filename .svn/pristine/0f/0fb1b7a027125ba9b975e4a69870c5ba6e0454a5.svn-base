
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
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[0];
    msg.voiceURI = "native";
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 0.8;
    msg.text = text;

    msg.onend = function (e) {
        //console.log('Finished in ' + event.elapsedTime + ' seconds.');
    };

    speechSynthesis.speak(msg);
}

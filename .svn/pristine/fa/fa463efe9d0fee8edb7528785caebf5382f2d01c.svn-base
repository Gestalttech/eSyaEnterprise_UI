

function IsStringNullorEmpty(value) {
    return typeof value === 'string' && !value.trim() || typeof value === 'undefined' || value === null || value === 0;
}

function IsValidateEmail(email) {
    var regex = /^([\w-\.]+\u0040([\w-]+\.)+[\w-]{2,4})?$/;
    if (!regex.test(email)) {
        return false;
    } else {
        return true;
    }
}

$('body').on('keypress', ':input[pattern]', function (ev) {
    var regex = new RegExp($(this).attr('pattern'));
    var newVal = $(this).val() + String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);

    if (regex.test(newVal)) {
        return true;
    } else {
        ev.preventDefault();
        return false;
    }
});

$('input[name="int"]').keyup(function (e) {
    if (/\D/g.test(this.value)) {
        // Filter non-digits from input value.
        this.value = this.value.replace(/\D/g, '');
    }
});

$('input[name="alpha"]').keypress(function (e) {
    var regex = new RegExp("^[a-zA-Z ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});

$('input[name="alphanumeric"]').keypress(function (e) {
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});

function fnShowLoadingDropdown(e) {
    e.empty();
    e.append($('<option></option>').html('Loading...'));
}


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
$(function (){ 
$('input[name="int"]').keyup(function (e) {
    if (/\D/g.test(this.value)) {
        // Filter non-digits from input value.
        this.value = this.value.replace(/\D/g, '');
    }
});
    $('.numberonly').keypress(function (e) {    
    
                var charCode = (e.which) ? e.which : event.keyCode    
    
                if (String.fromCharCode(charCode).match(/[^0-9]/g))    
    
                    return false;                        
    
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

    $('.decimal,.decimal_3').keydown(function (e) {
        //Get the occurence of decimal operator
        var match = $(this).val().match(/\./g);
        if (match != null) {
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
                (e.keyCode == 65 && e.ctrlKey === true) ||
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                 return;
            }  
            else if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && (e.keyCode == 190)) {
                e.preventDefault();
            }
        }
        else {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        }
    });
    //Allow Upto Two decimal places value only
    $('.decimal').keyup(function () {
        if ($(this).val().indexOf('.') != -1) {
            if ($(this).val().split(".")[1].length > 2) {
                if (isNaN(parseFloat(this.value))) return;
                this.value = parseFloat(this.value).toFixed(2);
            }
        }
    });
    $('.decimal_3').keyup(function () {
        if ($(this).val().indexOf('.') != -1) {
            if ($(this).val().split(".")[1].length > 2) {
                if (isNaN(parseFloat(this.value))) return;
                this.value = parseFloat(this.value).toFixed(3);
            }
        }
    });
})
function fnShowLoadingDropdown(e) {
    e.empty();
    e.append($('<option></option>').html('Loading...'));
}
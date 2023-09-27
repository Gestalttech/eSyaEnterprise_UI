/* ref: https://obfuscator.io/ */

//var _cnfDateFormat = 'dd/mm/yy';
//var _cnfjqgDateFormat = 'd/m/Y';
//var _cnfdecimalDigits = 2;
//var _cnfLocalCurrency = 'INR';
//var _cnfISDCode = '91';

$(".datepicker").datepicker({
    dateFormat: _cnfDateFormat
});

function fnGetDateFormat(strDate) {
    var dt = strDate.split("/");
    if (_cnfDateFormat.substr(0, 1) === "d")
        return new Date(dt[2], dt[1] - 1, dt[0]);
    else
        return new Date(dt[2], dt[0] - 1, dt[1]);
    //return new Date(moment(strDate, "DD/MM/YYYY"));
}

var currency_symbols = {
    'AED': 'د.إ',
    'AFN': '؋',
    'ALL': 'L',
    'AMD': '֏',
    'ANG': 'ƒ',
    'AOA': 'Kz',
    'ARS': '$',
    'AUD': '$',
    'AWG': 'ƒ',
    'AZN': '₼',
    'BAM': 'KM',
    'BBD': '$',
    'BDT': '৳',
    'BGN': 'лв',
    'BHD': '.د.ب',
    'BIF': 'FBu',
    'BMD': '$',
    'BND': '$',
    'BOB': '$b',
    'BRL': 'R$',
    'BSD': '$',
    'BTC': '฿',
    'BTN': 'Nu.',
    'BWP': 'P',
    'BYR': 'p.',
    'BZD': 'BZ$',
    'CAD': '$',
    'CDF': 'FC',
    'CHF': 'CHF',
    'CLP': '$',
    'CNY': '¥',
    'COP': '$',
    'CRC': '₡',
    'CUC': '$',
    'CUP': '₱',
    'CVE': '$',
    'CZK': 'Kč',
    'DJF': 'Fdj',
    'DKK': 'kr',
    'DOP': 'RD$',
    'DZD': 'دج',
    'EEK': 'kr',
    'EGP': 'EGP',
    'ERN': 'Nfk',
    'ETB': 'Br',
    'ETH': 'Ξ',
    'EUR': '€',
    'FJD': '$',
    'FKP': '£',
    'GBP': '£',
    'GEL': '₾',
    'GGP': '£',
    'GHC': '₵',
    'GHS': 'GH₵',
    'GIP': '£',
    'GMD': 'D',
    'GNF': 'FG',
    'GTQ': 'Q',
    'GYD': '$',
    'HKD': '$',
    'HNL': 'L',
    'HRK': 'kn',
    'HTG': 'G',
    'HUF': 'Ft',
    'IDR': 'Rp',
    'ILS': '₪',
    'IMP': '£',
    'INR': '₹',
    'IQD': 'ع.د',
    'IRR': '﷼',
    'ISK': 'kr',
    'JEP': '£',
    'JMD': 'J$',
    'JOD': 'JD',
    'JPY': '¥',
    'KES': 'KSh',
    'KGS': 'лв',
    'KHR': '៛',
    'KMF': 'CF',
    'KPW': '₩',
    'KRW': '₩',
    'KWD': 'KD',
    'KYD': '$',
    'KZT': 'лв',
    'LAK': '₭',
    'LBP': '£',
    'LKR': '₨',
    'LRD': '$',
    'LSL': 'M',
    'LTC': 'Ł',
    'LTL': 'Lt',
    'LVL': 'Ls',
    'LYD': 'LD',
    'MAD': 'MAD',
    'MDL': 'lei',
    'MGA': 'Ar',
    'MKD': 'ден',
    'MMK': 'K',
    'MNT': '₮',
    'MOP': 'MOP$',
    'MRO': 'UM',
    'MUR': '₨',
    'MVR': 'Rf',
    'MWK': 'MK',
    'MXN': '$',
    'MYR': 'RM',
    'MZN': 'MT',
    'NAD': 'N$',
    'NGN': '₦',
    'NIO': 'C$',
    'NOK': 'kr',
    'NPR': '₨',
    'NZD': '$',
    'OMR': '﷼',
    'PAB': 'B/.',
    'PEN': 'S/.',
    'PGK': 'K',
    'PHP': '₱',
    'PKR': '₨',
    'PLN': 'zł',
    'PYG': 'Gs',
    'QAR': '﷼',
    'RMB': '￥',
    'RON': 'lei',
    'RSD': 'Дин.',
    'RUB': '₽',
    'RWF': 'R₣',
    'SAR': '﷼',
    'SBD': '$',
    'SCR': '₨',
    'SDG': 'ج.س.',
    'SEK': 'kr',
    'SGD': '$',
    'SHP': '£',
    'SLL': 'Le',
    'SOS': 'S',
    'SRD': '$',
    'SSP': '£',
    'STD': 'Db',
    'SVC': '$',
    'SYP': '£',
    'SZL': 'E',
    'THB': '฿',
    'TJS': 'SM',
    'TMT': 'T',
    'TND': 'د.ت',
    'TOP': 'T$',
    'TRL': '₤',
    'TRY': '₺',
    'TTD': 'TT$',
    'TVD': '$',
    'TWD': 'NT$',
    'TZS': 'TSh',
    'UAH': '₴',
    'UGX': 'USh',
    'USD': '$',
    'UYU': '$U',
    'UZS': 'лв',
    'VEF': 'Bs',
    'VND': '₫',
    'VUV': 'VT',
    'WST': 'WS$',
    'XAF': 'FCFA',
    'XBT': 'Ƀ',
    'XCD': '$',
    'XOF': 'CFA',
    'XPF': '₣',
    'YER': '﷼',
    'ZAR': 'R',
    'ZWD': 'Z$'
};

$('.currencyFormat').inputmask("currency", {
    radixPoint: ".",
    groupSeparator: ",",
    digits: _cnfdecimalDigits,
    autoGroup: true,
    prefix: currency_symbols[_cnfLocalCurrency],
    rightAlign: true,
    clearMaskOnLostFocus: false,
    autoUnmask: true,
    allowMinus: false
});

$('.currencyFormatAllowMinus').inputmask("currency", {
    radixPoint: ".",
    groupSeparator: ",",
    digits: _cnfdecimalDigits,
    autoGroup: true,
    prefix: currency_symbols[_cnfLocalCurrency],
    rightAlign: true,
    clearMaskOnLostFocus: false,
    autoUnmask: true
});

$('.perctFormat').inputmask("decimal", {
    integerDigits: 3,
    digits: 0,
    max:100,
    allowMinus: false,
    autoGroup: true,
    suffix: " %",
    clearMaskOnLostFocus: false,
    autoUnmask: true
});

$('.perctFormatAllowMinus').inputmask("decimal", {
    integerDigits: 3,
    digits: 0,
    max: 100,
    min: -100,
    allowMinus: true,
    autoGroup: true,
    suffix: " %",
    clearMaskOnLostFocus: false,
    autoUnmask: true
});

$('.perctDecimalFormat').inputmask("decimal", {
    integerDigits: 4,
    digits: _cnfdecimalDigits,
    max: 100,
    allowMinus: false,
    autoGroup: true,
    suffix: " %",
    clearMaskOnLostFocus: false,
    autoUnmask: true
});

$('.perctDecimalFormatAllowMinus').inputmask("decimal", {
    integerDigits: 4,
    digits: _cnfdecimalDigits,
    max: 100,
    allowMinus: true,
    autoGroup: true,
    suffix: " %",
    clearMaskOnLostFocus: false,
    autoUnmask: true
});

$('.perctMaxFormat').inputmask("decimal", {
    integerDigits: 5,
    digits: _cnfdecimalDigits,
    max: 999,
    allowMinus: false,
    autoGroup: true,
    suffix: " %",
    clearMaskOnLostFocus: false,
    autoUnmask: true
});

$('.integerFormat').inputmask("integer", {
    integerDigits: 3,
    max: 999999999,
    allowMinus: false,
    autoGroup: true,
    clearMaskOnLostFocus: false,
    //oncleared: function () { self.Value(''); },
    autoUnmask: true
});

$('.integerFormatAllowMinus').inputmask("integer", {
    integerDigits: 3,
    max: 999999999,
    allowMinus: true,
    autoGroup: true,
    clearMaskOnLostFocus: false,
    autoUnmask: true
});

$('.decimalFormat').inputmask("decimal", {
    integerDigits: 12,
    digits: _cnfdecimalDigits,
    max: 999999999999,
    allowMinus: false,
    autoGroup: true,
    clearMaskOnLostFocus: false,
    autoUnmask: true
});

$('.decimalFormatAllowMinus').inputmask("decimal", {
    integerDigits: 12,
    digits: _cnfdecimalDigits,
    max: 999999999999,
    allowMinus: true,
    autoGroup: true,
    clearMaskOnLostFocus: false,
    autoUnmask: true
});

$(".email").inputmask({ alias: "email" });

function OnlyNumeric(e) {
    if ((e.which < 48 || e.which > 57)) {
        if (e.which === 8 || e.which === 46 || e.which === 0) {
            return true;
        }
        else {
            return false;
        }
    }
}

function OnlyDigits(e) {
    if ((e.which < 48 || e.which > 57)) {
        if (e.which === 8 || e.which === 0) {
            return true;
        }
        else {
            return false;
        }
    }
}

function OnlyChars(e) {
    if (e.which < 97 || e.which > 122) {
        if (e.which < 65 || e.which > 90) {
            if (e.which === 8 || e.which === 32 || e.which === 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}

function fnNoSpace(e) {
    if (e.which === 32) {
        return false;
    }
    else {
        return true;
    }
}

function IsValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
}

function fnFormatDateJsonToInput(dt) {
    var inputDate = new Date(dt);
    var dd = inputDate.getDate();
    var mm = inputDate.getMonth() + 1; //January is 0!
    var yyyy = inputDate.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    inputDate = yyyy + '-' + mm + '-' + dd;
    return inputDate;
}

function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}
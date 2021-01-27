$(function () {

    // Add special class to minimalize page elements when screen is less than 768px
    setBodySmall();

    if (getCookie('sidebar') === 'hide') {
        $("body").addClass("hide-sidebar");
    }

    // Handle minimalize sidebar menu
    $(document).on('click', '.hide-menu', function (event) {
        event.preventDefault();
        var date;
        if (!$("body").hasClass("hide-sidebar")) {
            date = new Date(new Date().getTime() + 86400 * 1000);
            document.cookie = "sidebar=hide; path=/; expires=" + date.toUTCString();
        } else {
            date = new Date(0);
            document.cookie = "sidebar=; path=/; expires=" + date.toUTCString();
        }
        if ($(window).width() < 769) {
            $("body").toggleClass("show-sidebar");
        } else {
            $("body").toggleClass("hide-sidebar");
        }
    });

    // Initialize iCheck plugin
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });

    // Function for collapse card
    $(document).on('click', '.showhide', function (event) {
        event.preventDefault();
        var card = $(this).closest('div.card');
        var icon = $(this).find('i:first');
        var body = card.find('div.card-body');
        var footer = card.find('div.card-footer');
        body.slideToggle(300);
        footer.slideToggle(200);

        // Toggle icon from up to down
        icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        card.toggleClass('').toggleClass('panel-collapse');
        setTimeout(function () {
            card.resize();
            card.find('[id^=map-]').resize();
        }, 50);
    });

    // Function for close card
    $('.closebox').on('click', function (event) {
        event.preventDefault();
        var card = $(this).closest('div.card');
        card.remove();
    });

    // Fullscreen for fullscreen card
    $('.fullscreen').on('click', function () {
        var card = $(this).closest('div.card');
        var icon = $(this).find('i:first');
        $('body').toggleClass('fullscreen-panel-mode');
        icon.toggleClass('fa-expand').toggleClass('fa-compress');
        card.toggleClass('fullscreen');
        setTimeout(function () {
            $(window).trigger('resize');
        }, 100);
    });

    // Open close right sidebar
    $('.right-sidebar-toggle').on('click', function () {
        $('#right-sidebar').toggleClass('sidebar-open');
    });

    // Function for small header
    $('.small-header-action').on('click', function (event) {
        event.preventDefault();
        var icon = $(this).find('i:first');
        var breadcrumb = $(this).parent().find('#hbreadcrumb');
        $(this).parent().parent().parent().toggleClass('small-header');
        breadcrumb.toggleClass('m-t-lg');
        icon.toggleClass('fa-arrow-up').toggleClass('fa-arrow-down');
    });

    // Set minimal height of #wrapper to fit the window
    setTimeout(function () {
        fixWrapperHeight();
    });

    // Initialize tooltips
    $('.tooltip-demo').tooltip({
        selector: "[data-toggle=tooltip]"
    });

    // Initialize popover
    $("[data-toggle=popover]").popover();

    // Move modal to body
    // Fix Bootstrap backdrop issu with animation.css
    $('.modal').appendTo("body");

    //region Track Chrome Extension (with 6 hours throttling)
    var millisecond = 1000;
    var chromeExtensionIdTtl = 6 * 3600 * millisecond;
    var now = new Date();
    var extItem = JSON.parse(localStorage.getItem('chromeExtension.id')) || {};
    var cacheAbsentOrExpired = !extItem.value || extItem.expiry <= now.getTime();

    if (cacheAbsentOrExpired) {
        extensionReady(function (extensionId) {
            if (extensionId) {
                $.post('/site/chrome-extension-installed')
                 .then(function (res) {
                    if (res === 'ok') {
                        localStorage.setItem('chromeExtension.id', JSON.stringify({
                            value: extensionId,
                            expiry: (new Date()).getTime() + chromeExtensionIdTtl
                        }));
                    }
                });
            }
        });
    }
    //endregion

});

$(function () {
    setTimeout(function () {
        $('.splash').css('display', 'none');
    }, 300);
});

$(window).on("resize click", function () {

    // Add special class to minimalize page elements when screen is less than 768px
    setBodySmall();

    // Waint until metsiMenu, collapse and other effect finish and set wrapper height
    setTimeout(function () {
        fixWrapperHeight();
    }, 300);
});

/**
 * Waiting until **data-helium10-main-tool-id** will be setted on **body** tag,
 * or Not.
 * @param {function(...[*]=)} callback
 */
function extensionReady(callback) {
    var extensionId = null;
    var tries = 0;
    var maxTries = 10;
    var intId = setInterval(function () {
        tries++;
        extensionId = $('body').attr('data-helium10-main-tool-id');
        if (extensionId || tries >= maxTries) {
            callback(extensionId);
            clearInterval(intId);
        }
    }, 100);
}

function fixWrapperHeight() {

    // Get and set current height
    var headerH = 80;
    var navigationH = $("#navigation").height();
    var contentH = $(".content").height();

    // Set new height when contnet height is less then navigation
    if (contentH < navigationH) {
        $("#wrapper").css("min-height", navigationH + 'px');

    }

    // Set new height when contnet height is less then navigation and navigation is less then window
    if (contentH < navigationH && navigationH < $(window).height()) {
        $("#wrapper").css("min-height", $(window).height() - headerH + 'px');
    }

    // Set new height when contnet is higher then navigation but less then window
    if (contentH > navigationH && contentH < $(window).height()) {
        $("#wrapper").css("min-height", $(window).height() - headerH + 'px');
    }
}


function setBodySmall() {
    if ($(this).width() < 769) {
        $('body').addClass('page-small');
    } else {
        $('body').removeClass('page-small').removeClass('show-sidebar');
    }
}

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function isValidDate(dateString)
{
    // First check for the pattern
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month === 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}

function isChrome() {
    // please note,
    // that IE11 now returns undefined again for window.chrome
    // and new Opera 30 outputs true for window.chrome
    // and new IE Edge outputs to true now for window.chrome
    // and if not iOS Chrome check
    // so use the below updated condition
    var isChromium = window.chrome,
        winNav = window.navigator,
        vendorName = winNav.vendor,
        isOpera = winNav.userAgent.indexOf("OPR") > -1,
        isIEedge = winNav.userAgent.indexOf("Edge") > -1,
        isIOSChrome = winNav.userAgent.match("CriOS");

    if(isIOSChrome){
       return true;
    } else if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." &&
        isOpera === false && isIEedge === false) {
       return true;
    } else {
       return false;
    }
}

// Add attribute to URL
function setAttr(prmName, val, url) {
    url = url || location.href;
    var res = '';
    var d = url.split("#")[0].split("?");
    var base = d[0];
    var query = d[1];
    if (query) {
        var params = query.split("&");
        for (var i = 0; i < params.length; i++) {
            var keyval = params[i].split("=");
            if (keyval[0] !== prmName && keyval[1]) {
                res += params[i] + '&';
            }
        }
    }
    if (val) {
        res += prmName + '=' + val;
    } else {
        res = res.substring(0, res.length - 1);
    }
    return attachAccountId(base + '?' + res);
}

function attachAccountId(url) {
    var re = new RegExp("([?&])accountId=.*?(&|$)", "i");
    return (url.match(re))
        ? url.replace(re, "$1accountId=" + accountId + '$2')
        : url + (url.indexOf('?') !== -1 ? "&" : "?") + "accountId=" + accountId;
}

// Handle response statuses and show appropriate message
function showErrorMessage(
    response,
    defaultMessage = 'An error occurred. We are sorry for the inconvenience. Please try again later.'
) {
    var message = response.status === 400
        ? 'An error occurred. Please refresh the page and try again.'
        : defaultMessage;
    swal('', message, 'error');
}

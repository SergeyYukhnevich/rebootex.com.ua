var Rebootex = function () {

    var handleLanguageChange = function () {

        var btn = $('.change-locale');
        btn.on('click', function () {
            var locale = $(this).data('locale');
            Rebootex.blockUI();
            $.get('/set', {
                "locale": locale
            }, function (data) {
                $('#wrapper').html(data.html);
                $('title').text(data.title);
                Rebootex.initAjax();
                Rebootex.unblockUI();
            });
        });

    };

    return {
        init: function () {
            handleLanguageChange();
            Rebootex.initToastr();
        },
        initAjax: function () {
            handleLanguageChange();
            Rebootex.initToastr();
        },
        blockUI: function() {
            $.blockUI({
                message: '<div class="page-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>',
                baseZ: 1000,
                css: {
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: '#000',
                    opacity: 0.3,
                    cursor: 'wait'
                }
            });
        },
        unblockUI: function() {
            setTimeout(function () {
                $.unblockUI();
            }, 2000);
        },
        initToastr: function () {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-top-center",
                "onclick": null,
                "showDuration": "1000",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
        }
    }

}();

jQuery(document).ready(function () {
    Rebootex.init();
});
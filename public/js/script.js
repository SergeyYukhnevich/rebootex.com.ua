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
        },
        initAjax: function () {
            handleLanguageChange();
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
        }
    }

}();

jQuery(document).ready(function () {
    Rebootex.init();
});
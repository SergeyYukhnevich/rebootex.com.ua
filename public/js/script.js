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
    var handleGetDoctorButtonClick = function () {
        var issueField = $('#get-doctor .contact-form .form-control[name="issue"]');
        $('#pricing .pricing-list > li > a').on('click', function () {
            var issue = $(this).data('issue');
            issueField.val(issue);
        });
    };
    var handleContactForm = function () {

        $('.contact-form-submit').on('click', function () {
            var form = $('.contact-form');
            var data = {};
            form.find('input, textarea').each(function () {
                data[this.name] = this.value;
            });
            $.post('/sendMail', data,  function (data) {
                if (data.type == 'error') {
                    toastr.warning(data.data.message, data.data.title);
                } else if (data.type == 'success') {
                    form.find('input, textarea').each(function () {
                        $(this).val('');
                    });
                    toastr.success(data.data.message, data.data.title);
                }
            }).error(function (data) {
                console.log(data);
            });
        });

    };
    var handleSmoothScroll = function () {
        $('.smooth-scroll').on('click', function () {
            var target = $(this).attr('href');
            console.log(target);
            $('html, body').animate({
                scrollTop: $(target).offset().top
            }, 1000);
            return false;
        });
    };

    return {
        init: function () {
            handleLanguageChange();
            handleGetDoctorButtonClick();
            handleContactForm();
            handleSmoothScroll();
        },
        initAjax: function () {
            handleLanguageChange();
            handleGetDoctorButtonClick();
            handleContactForm();
            handleSmoothScroll();
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
    Rebootex.initToastr();
});
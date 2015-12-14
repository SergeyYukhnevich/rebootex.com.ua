$('.contact-form-submit').on('click', function () {
    var form = $('.contact-form');
    var data = {};
    form.find('input, textarea').each(function () {
        data[this.name] = this.value;
    });
    $.post('/send', data,  function (data) {
        form.find('input, textarea').each(function () {
            $(this).val('');
        });
    });
});
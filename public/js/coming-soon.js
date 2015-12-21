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
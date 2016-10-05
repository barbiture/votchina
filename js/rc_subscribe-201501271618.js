function rc_submitSubscribe() {
	var form = '#subscribe';
	var fields = 'subscribe=1';

	jQuery(form + ' div.error').html('').removeClass('active');

	$(form + ' input#submit').hide();
	$(form + ' div.status').addClass('style_info').html('Производится проверка введенных данных...');

	$(form + ' input[id^="field-"], ' + form + ' textarea[id^="field-"]').each(function() {
		var ID = $(this).attr('name');

		fields += (fields.length > 0 ? '&' : '') + ID + '=' + $(this).val();
	});

	jQuery.ajax({
		url: '/events/subscribe/',
		type: 'POST',
		data: fields,
		async: false,
		cache: false,
		dataType: 'json',
		error: function(_XHR, _status, _error) {
		},
		success: function(_response, _status, _XHR) {
			if ('status' in _response) {
				switch (_response['status']) {
					case 'success':
						$(form + ' div.header, ' + form + ' tr.field').hide();

						$(form + ' input#submit').hide();
						$(form + ' div.status').addClass('style_info').html(_response['message']);
						break;

					case 'fail':
						if ('errors' in _response) {
							for (var _key in _response['errors']) {
								var e = jQuery(form + ' div.error.' + _key);

								e.html(_response['errors'][_key]).addClass('active');
							}

							$(form + ' div.status').html('').removeClass('style_info');
							$(form + ' input#submit').show();
						} else {
							$(form + ' div.header, ' + form + ' tr.field').hide();

							$(form + ' input#submit').hide();
							$(form + ' div.status').addClass('style_info').html(_response['message']);
						}
						break;
				}
			} else {
				$(form + ' div.header, ' + form + ' tr.field').hide();

				$(form + ' input#submit').hide();
				$(form + ' div.status').addClass('style_info').html('<strong>Ошибка:</strong> Результат AJAX-запроса не известен');
			}
		}
	});

	return false;
}

jQuery(document).ready(function() {
	$('a.subscribe-event').fancybox({
		width: 'auto',
		height: 'auto',
		padding: 10,
		autoScale: false,
		autoDimensions: true,
		scrolling: 'no',
		titleShow: false,
		centerOnScroll: true,
		onStart: function() {
			var $form = $('#subscribe');

			$form.find('div.error').removeClass('active').html('');

			$form.find('input[id^="field-"]').val('');

			var value = $('#subscribe-field-e-mail').val();
			if (value.toLowerCase() != 'введите ваш e-mail') {
				$form.find('#field-e-mail').val(value);
			}

			$form.find('div.header, tr.field').show();

			$form.find('div.status').removeClass('style_info').html('');
			$form.find('input#submit').show();

			$form.find('input[name="null"]').remove();
			$form.prepend('<input id="field-null" type="hidden" name="null" value="1" />');
		}
	});
});

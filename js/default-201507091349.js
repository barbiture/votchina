(function() {
	var files = [
		'/images/bg-submenu.png'
	];
	var images = [];

	for (var _index in files) {
		images[_index] = new Image();
		images[_index].src = files[_index];
	}
}) ();

function rc_getWindowSize() {
	var size = {
		'width': 0,
		'height': 0
	};

	if (typeof(window.innerWidth) == 'number') {
		//Non-IE
		size['width'] = window.innerWidth;
		size['height'] = window.innerHeight;
	} else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
		//IE 6+ in 'standards compliant mode'
		size['width'] = document.documentElement.clientWidth;
		size['height'] = document.documentElement.clientHeight;
	} else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
		//IE 4 compatible
		size['width'] = document.body.clientWidth;
		size['height'] = document.body.clientHeight;
	}

	return size;
}

// открытие окна
function rc_windowOpen(contentWindow) {
	var windowWidth  = $(window).width();
	var windowHeight = $(window).height();
	var curScrollTop = $(window).scrollTop();

	$('body').css({'width': windowWidth, 'height': windowHeight, 'overflow': 'hidden'});
	$(window).scrollTop(0);
	$('body > div:eq(0)').css({'top': -curScrollTop});
	$('body > div:eq(0)').data('scrollTop', curScrollTop);

	$('body').append('<div class="window"><div class="window-overlay"></div><div class="window-container">' + contentWindow + '<a href="#" class="window-close"></a></div></div>')
	rc_recalcWindow();

	$('.window-overlay').click(function() {
		rc_windowClose();
	});

	$('.window-close').click(function() {
		rc_windowClose();
		return false;
	});

	$('body').bind('keypress keydown', rc_keyDownBody);

	$('div.button-subscribe-wrapper, div.button-askquestion-wrapper').hide();
}

// функция обновления позиции окна
function rc_recalcWindow() {
	var windowWidth  = $(window).width();
	var windowHeight = $(window).height();

	if ($('.window-container').width() < windowWidth) {
		$('.window-container').css({'margin-left': -$('.window-container').width() / 2});
	} else {
		$('.window-container').css({'left': 0});
	}
	if ($('.window-container').height() < windowHeight) {
		$('.window-container').css({'margin-top': -$('.window-container').height() / 2});
	} else {
		$('.window-container').css({'top': 20});
		$('.window-overlay').css({'min-height': $('.window-container').height() + 40});
	}
}

// функция обновления -overlay при изменении размеров окна
function rc_recalcOverlay() {
	var windowWidth  = $(window).width();
	var windowHeight = $(window).height();

	if ($('.window-container').width() < windowWidth) {
		$('.window-container').css({'margin-left': -$('.window-container').width() / 2});
	} else {
		$('.window-container').css({'left': 0});
	}
	if ($('.window-container').height() < windowHeight) {
		$('.window-container').css({'margin-top': -$('.window-container').height() / 2});
	} else {
		$('.window-overlay').css({'min-height': $('.window-container').height() + 40});
	}
}

// обработка Esc после открытия окна
function rc_keyDownBody(e) {
	if (e.keyCode == 27) {
		rc_windowClose();
	}
}

// закрытие окна
function rc_windowClose() {
	$('body').unbind('keypress keydown', rc_keyDownBody);
	$('.window').remove();
	$('body > div:eq(0)').css({'top': 'auto'});
	$('body').css({'width': 'auto', 'height': '100%', 'overflow': 'auto'});
	var curScrollTop = $('body > div:eq(0)').data('scrollTop');
	$(window).scrollTop(curScrollTop);

	$('div.button-subscribe-wrapper, div.button-askquestion-wrapper').show();
}

function submitAskQuestion() {
	var $form = jQuery('#button-askquestion');
	var fields = '';

	$form.find('div.error').html('').removeClass('active');

	$form.find('input#submit').hide();
	$form.find('div.status').addClass('style_info').html('Производится проверка введенных данных...');

	$form.find('input[id^="field-"], textarea[id^="field-"]').each(function() {
		fields += (fields.length ? '&' : '') + $(this).attr('name') + '=' + $(this).val();
	});

	jQuery.ajax({
		url: '/admin/ajax.php?controller=myplugins&pluginid=12&action=askquestion&ajax',
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
						$form.find('div.header').hide();
						$form.find('tr.field').hide();

						$form.find('input#submit').hide();
						$form.find('div.status').addClass('style_info').html(_response['message']);
						break;

					case 'fail':
						if ('errors' in _response) {
							for (var _key in _response['errors']) {
								var $el = $form.find('div.error.field-' + _key);

								$el.html(_response['errors'][_key]).addClass('active');
							}

							$form.find('div.status').html('').removeClass('style_info');
							$form.find('input#submit').show();
						} else {
							$form.find('div.header').hide();
							$form.find('tr.field').hide();

							$form.find('input#submit').hide();
							$form.find('div.status').addClass('style_info').html(_response['message']);
						}
						break;
				}
			} else {
				$form.find('div.header').hide();
				$form.find('tr.field').hide();

				$form.find('input#submit').hide();
				$form.find('div.status').addClass('style_info').html('<strong>Ошибка:</strong> Результат AJAX-запроса не известен');
			}
		},
		complete: function(_event, _XHR, _options) {
		}
	});
}

function submitSubscribe() {
	var $form = jQuery('#button-subscribe');
	var fields = '';

	$form.find('div.error').html('').removeClass('active');

	$form.find('input#submit').hide();
	$form.find('div.status').addClass('style_info').html('Производится проверка введенных данных...');

	$form.find('input[id^="field-"], textarea[id^="field-"]').each(function() {
		fields += (fields.length ? '&' : '') + $(this).attr('name') + '=' + $(this).val();
	});

	jQuery.ajax({
		url: '/admin/ajax.php?controller=myplugins&pluginid=12&action=subscribe&ajax',
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
						$form.find('div.header').hide();
						$form.find('tr.field').hide();

						$form.find('input#submit').hide();
						$form.find('div.status').addClass('style_info').html(_response['message']);
						break;

					case 'fail':
						if ('errors' in _response) {
							for (var _key in _response['errors']) {
								var $el = $form.find('div.error.field-' + _key);

								$el.html(_response['errors'][_key]).addClass('active');
							}

							$form.find('div.status').html('').removeClass('style_info');
							$form.find('input#submit').show();
						} else {
							$form.find('div.header').hide();
							$form.find('tr.field').hide();

							$form.find('input#submit').hide();
							$form.find('div.status').addClass('style_info').html(_response['message']);
						}
						break;
				}
			} else {
				$form.find('div.header').hide();
				$form.find('tr.field').hide();

				$form.find('input#submit').hide();
				$form.find('div.status').addClass('style_info').html('<strong>Ошибка:</strong> Результат AJAX-запроса не известен');
			}
		},
		complete: function(_event, _XHR, _options) {
		}
	});
}

function submitRequestPrice() {
	var form = '#requestprice';
	var fields = '';

	jQuery(form + ' div.error').html('').removeClass('active');

	$(form + ' input#submit').hide();
	$(form + ' div.status').addClass('style_info').html('Производится проверка введенных данных...');

	$(form + ' input[id^="field-"], ' + form + ' textarea[id^="field-"]').each(function() {
		var ID = $(this).attr('name');

		fields += (fields.length > 0 ? '&' : '') + ID + '=' + $(this).val();
	});

	jQuery.ajax({
		url: '/admin/ajax.php?controller=myplugins&pluginid=12&action=requestprice&ajax',
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
						$(form + ' div.header, ' + form + ' div.description, ' + form + ' tr.field').hide();

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
							$(form + ' div.header, ' + form + ' div.description, ' + form + ' tr.field').hide();

							$(form + ' input#submit').hide();
							$(form + ' div.status').addClass('style_info').html(_response['message']);
						}
						break;
				}
			} else {
				$(form + ' div.header, ' + form + ' div.description, ' + form + ' tr.field').hide();

				$(form + ' input#submit').hide();
				$(form + ' div.status').addClass('style_info').html('<strong>Ошибка:</strong> Результат AJAX-запроса не известен');
			}
		}
	});
}

jQuery(document).ready(function() {
	$('td.submenu-toggle').each(function(_index) {
		var menu = $(this);
		var submenu = $(this).find('div.submenu');
		var flagRTL = submenu.hasClass('submenu-rtl');

		var position = menu.position();
		if (flagRTL) {
			submenu.css({
				'right': jQuery('div.footer div.menu').width() - position.left - menu.outerWidth(true) + 'px',
				'left': 'auto'
			});
		} else {
			submenu.css({
				'right': 'auto',
				'left': position.left + 'px'
			});
		}

		menu.on('mouseenter.submenu', function(_event) {
			$('td.submenu-toggle.selected').removeClass('selected');
			$(this).addClass('selected');

			$('div[id^="submenu-"]:visible').hide();

			submenu.toggle(0, function() {});
		});

		menu.on('mouseleave.submenu', function(_event) {
			$(this).removeClass('selected');

			submenu.hide();
		});
	});

	$('a[href$=".gif"], a[href$=".jpg"], a[href$=".JPG"], a[href$=".jpeg"], a[href$=".JPEG"], a[href$=".png"]').fancybox({
		transitionIn: 'elastic',
		transitionOut: 'elastic',
		speedIn: 350,
		speedOut: 200,
		cyclic: true,
		overlayShow: true,
		titlePosition: 'inside'
	});

	window.setTimeout(function() {
		jQuery('div.button-askquestion-wrapper').animate({
			'right': 0
		}, 1000);
	}, 2000);

	$('div.button-askquestion, .action-ask_question').fancybox({
		href: '#button-askquestion',
		width: 'auto',
		height: 'auto',
		padding: 10,
		autoScale: false,
		autoDimensions: true,
		scrolling: 'no',
		titleShow: false,
		centerOnScroll: true,
		onStart: function() {
			var $form = $('#button-askquestion');

			$form.find('input[id^="field-"], textarea[id^="field-"]').val('');

			$form.find('div.header').show();
			$form.find('tr.field').show();

			$form.find('div.error').removeClass('active').html('');

			$form.find('div.status').removeClass('style_info').html('');
			$form.find('input#submit').show();

			$form.find('input[name="null"]').remove();
			$form.prepend('<input id="field-null" type="hidden" name="null" value="1" />');

			ga('send', 'event', 'Контакты', 'Открытие онлайн формы');
			yaCounter12277678.reachGoal('contactsForm');
		}
	});

	window.setTimeout(function() {
		jQuery('div.button-subscribe-wrapper').animate({
			'right': 0
		}, 1000);
	}, 3000);

	$('div.button-subscribe').fancybox({
		href: '#button-subscribe',
		width: 'auto',
		height: 'auto',
		padding: 10,
		autoScale: false,
		autoDimensions: true,
		scrolling: 'no',
		titleShow: false,
		centerOnScroll: true,
		onStart: function() {
			var $form = $('#button-subscribe');

			$form.find('input[id^="field-"], textarea[id^="field-"]').val('');

			$form.find('div.header').show();
			$form.find('tr.field').show();

			$form.find('div.error').removeClass('active').html('');

			$form.find('div.status').removeClass('style_info').html('');
			$form.find('input#submit').show();

			$form.find('input[name="null"]').remove();
			$form.prepend('<input id="field-null" type="hidden" name="null" value="1" />');
		}
	});
});

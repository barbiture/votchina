(function($) {
	$(document).ready(function() {
		$('.toggle-home').click(function() {
			window.flag_blockTransitionScroll = true;

			var target = $(this).attr('href');
			$(target).show();
		});
		$('.home-modal .close').click(function() {
			window.flag_blockTransitionScroll = false;

			$('.home-modal').hide();
		});

		$('#owl--partners').owlCarousel({
			items: 4,
			itemsDesktop: [1250,3],
			itemsDesktopSmall: [1000,2],
			navigation: true,
			navigationText: false,
			pagination: false,
			paginationSpeed: 400,
			slideSpeed: 300
		});

		$('#owl--layouts-promo, .owl--layouts-regions-images').owlCarousel({
			navigation: true,
			navigationText: false,
			pagination: false,
			paginationSpeed: 400,
			singleItem: true,
			slideSpeed: 300
		});

		// Форма: Запрос обратного звонка
		$('body').on('submit', '.fancybox-wrap #step-1 form', function() {
			var $FORM = $(this);
			if ($FORM.hasClass('rc--processed')) {
				return false;
			}

			var formTitle = '?';
			if (typeof($FORM.data('title')) !== 'undefined') {
				formTitle = $FORM.data('title');
			}

//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'submit\');');
			if (typeof(ga) != 'undefined') {
				ga('send', 'event', 'form ' + formTitle, 'submit');
			}

			var $button = $FORM.find('[type="submit"]');
			var button_backup = $button.val();

			$FORM.addClass('rc--processed');
			$FORM.prepend('<input class="rc-field--null" type="hidden" name="null" value="1">');

			$button.val('Отправка...');

			$FORM.find('.new-adv-order-form-hint').remove();

			$FORM.ajaxSubmit({
				url: '/admin/ajax.php?controller=myplugins&pluginid=12&action=callback&ajax',
				type: 'POST',
				async: false,
				cache: false,
				dataType: 'json',
				error: function(_XHR, _status, _error) {
				},
				success: function(_response, _status, _XHR) {
					if ('errors' in _response) {
						for (var _key in _response['errors']) {
							var $block_ = $FORM.find('[name="' + _key + '"]').parent();

							var $hint = $block_.find('.new-adv-order-form-hint');
							if ($hint.length === 0) {
								$hint = $('<div class="new-adv-order-form-hint"></div>');
								$block_.append($hint);
							}
							$hint.html(_response['errors'][_key]);

//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'error\', \'' + _response['errors'][_key] + '\');');
							if (typeof(ga) != 'undefined') {
								ga('send', 'event', 'form ' + formTitle, 'error', _response['errors'][_key]);
							}
						}
					}

					if ('status' in _response && _response['status'] === 'success') {
						$('.fancybox-overlay, .fancybox-wrap .fancybox-close').off('click.analytics');
//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'success\');');
						if (typeof(ga) != 'undefined') {
							ga('send', 'event', 'form ' + formTitle, 'success');
						}
					}

					if ('message' in _response) {
						var $template = $('#form--message').clone();
						$template.find('.popup-message').html(_response['message']);

						$.fancybox($template, {
							closeEffect: 'none',
							openEffect: 'none',
							padding: 0,
							wrapCSS: 'popup-modal',
							afterLoad: function() {
								window.flag_blockTransitionScroll = true;
							},
							beforeClose: function() {
								window.flag_blockTransitionScroll = false;
							},
							beforeShow: function() {
								$('.fancybox-overlay').css({
									//'top': '100px',
									'background': 'rgba(41, 41, 41, 0.8)'
								});
							}
						});
					}
				},
				complete: function(_XHR, _status) {
					$FORM.find('.rc-field--null').remove();
					$FORM.removeClass('rc--processed');

					$button.val(button_backup);
				}
			});

			return false;
		});

		// Форма: Заявка на посещение
		$('body').on('submit', '.fancybox-wrap #step-2 form', function() {
			var $FORM = $(this);
			if ($FORM.hasClass('rc--processed')) {
				return false;
			}

			var formTitle = '?';
			if (typeof($FORM.data('title')) !== 'undefined') {
				formTitle = $FORM.data('title');
			}

//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'submit\');');
			if (typeof(ga) != 'undefined') {
				ga('send', 'event', 'form ' + formTitle, 'submit');
			}

			var $button = $FORM.find('[type="submit"]');
			var button_backup = $button.val();

			$FORM.addClass('rc--processed');
			$FORM.prepend('<input class="rc-field--null" type="hidden" name="null" value="1">');

			$button.val('Отправка...');

			$FORM.find('.new-adv-order-form-hint').remove();

			$FORM.ajaxSubmit({
				url: '/admin/ajax.php?controller=myplugins&pluginid=12&action=subscribe&ajax',
				type: 'POST',
				async: false,
				cache: false,
				dataType: 'json',
				error: function(_XHR, _status, _error) {
				},
				success: function(_response, _status, _XHR) {
					if ('errors' in _response) {
						for (var _key in _response['errors']) {
							var $block_ = $FORM.find('[name="' + _key + '"]').parent();

							var $hint = $block_.find('.new-adv-order-form-hint');
							if ($hint.length === 0) {
								$hint = $('<div class="new-adv-order-form-hint"></div>');
								$block_.append($hint);
							}
							$hint.html(_response['errors'][_key]);

//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'error\', \'' + _response['errors'][_key] + '\');');
							if (typeof(ga) != 'undefined') {
								ga('send', 'event', 'form ' + formTitle, 'error', _response['errors'][_key]);
							}
						}
					}

					if ('status' in _response && _response['status'] === 'success') {
						$('.fancybox-overlay, .fancybox-wrap .fancybox-close').off('click.analytics');
//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'success\');');
						if (typeof(ga) != 'undefined') {
							ga('send', 'event', 'form ' + formTitle, 'success');
						}
					}

					if ('message' in _response) {
						var $template = $('#form--message').clone();
						$template.find('.popup-message').html(_response['message']);

						$.fancybox($template, {
							closeEffect: 'none',
							openEffect: 'none',
							padding: 0,
							wrapCSS: 'popup-modal',
							afterLoad: function() {
								window.flag_blockTransitionScroll = true;
							},
							beforeClose: function() {
								window.flag_blockTransitionScroll = false;
							},
							beforeShow: function() {
								$('.fancybox-overlay').css({
									//'top': '100px',
									'background': 'rgba(41, 41, 41, 0.8)'
								});
							}
						});
					}
				},
				complete: function(_XHR, _status) {
					$FORM.find('.rc-field--null').remove();
					$FORM.removeClass('rc--processed');

					$button.val(button_backup);
				}
			});

			return false;
		});
	});
})(jQuery);

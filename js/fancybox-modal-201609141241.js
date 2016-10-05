(function($) {
	$(document).ready(function() {
		$('.fancybox-modal').fancybox({
			closeEffect: 'none',
			openEffect: 'none',
			margin: 0,
			padding: 0,
			wrapCSS: 'popup-modal',
			afterLoad: function(_obj) {
				window.flag_blockTransitionScroll = true;

				var $FORM = $(_obj['content']).find('form');
				if ($FORM.length) {
					$FORM[0].reset();
					$FORM.find('.new-adv-order-form-hint').remove();
				}

				switch (_obj['href']) {
					case '#calculate':
						$FORM.find('.new-adv-order-form-input--error').removeClass('new-adv-order-form-input--error');

						rc_calculator_update($FORM);

						$FORM.on('click', '.calc-banks > ul > li > label', function(_event) {
							rc_calculator_update($FORM, $(this).siblings('input'));
						});
						break;
				}
			},
			afterShow: function() {
				switch (this.href) {
					case '#form-5th-queue':
					case '#form-consultation':
					case '#form-download':
					case '#form-electricity':
					case '#form-problems':
					case '#form-question':
					case '#step-1':
					case '#step-2':
					case '#form-subscribe':
						var $FORM = $(this.content).find('form'),
							formTitle = '?';

						if ($FORM.length && typeof($FORM.data('title')) !== 'undefined') {
							formTitle = $FORM.data('title');
						}
//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'open\');');
						if (typeof(ga) != 'undefined') {
							ga('send', 'event', 'Контакты', 'Открытие онлайн формы');
							ga('send', 'event', 'form ' + formTitle, 'open');
						}

						$('.fancybox-overlay').on('click.analytics', function(_event) {
							if ($(_event.target).hasClass('fancybox-overlay')) {
//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'close\', \'mask\');');
								if (typeof(ga) != 'undefined') {
									ga('send', 'event', 'form ' + formTitle, 'close', 'mask');
								}
							}
						});

						$('.fancybox-wrap .fancybox-close').on('click.analytics', function(_event) {
							if ($(_event.target).hasClass('fancybox-close')) {
//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'close\', \'icon\');');
								if (typeof(ga) != 'undefined') {
									ga('send', 'event', 'form ' + formTitle, 'close', 'icon');
								}
							}
						});
						break;
				}
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

		$('body').on('click', '.fancybox-modal[href="#form-question"]', function(_event) {
			if (typeof(yaCounter12277678) != 'undefined') {
				yaCounter12277678.reachGoal('contactsForm');
			}
		});

		// Форма: задать вопрос
		$('body').on('submit', '.fancybox-wrap #form-question form', function() {
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
				url: '/admin/ajax.php?controller=myplugins&pluginid=12&action=askquestion&ajax',
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

		// Форма: подписаться на рассылку
		$('body').on('submit', '.fancybox-wrap #form-subscribe form, .form-subscribe form', function() {
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
				url: '/events/subscribe/',
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

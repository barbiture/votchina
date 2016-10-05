(function($) {
	$(document).ready(function() {
		$('body').on('click', '.js-board-order', function(_event) {
			_event.preventDefault();

			var $template = $('#form-board-order').clone();
			$template.find('.js-form-field--proposal_id').val($(this).data('id'));

			$.fancybox($template, {
				closeEffect: 'none',
				openEffect: 'none',
				margin: 0,
				padding: 0,
				wrapCSS: 'popup-modal',
				afterLoad: function() {
					window.flag_blockTransitionScroll = true;
				},
				afterShow: function() {
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
		});

		// Форма: Заказ предложения из "Жители могут"
		$('body').on('submit', '.fancybox-wrap #form-board-order form', function() {
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
				url: '/admin/ajax.php?controller=myplugins&pluginid=50&action=send-order&ajax',
				type: 'POST',
				async: false,
				cache: false,
				dataType: 'json',
				error: function(_XHR, _status, _error) {
				},
				success: function(_response, _status, _XHR) {
					if ('errors' in _response) {
						for (var _key in _response['errors']) {
							var $block_ = $FORM.find('[name="form[' + _key + ']"]').parent();

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

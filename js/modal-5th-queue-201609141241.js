(function($) {
	$(document).ready(function() {
		// Форма: Запрос на информирование о старте продаж участков 5-ой очереди
		$('body').on('submit', '.fancybox-wrap #form-5th-queue form', function() {
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
				url: '/admin/ajax.php?controller=myplugins&pluginid=12&action=5th-queue&ajax',
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

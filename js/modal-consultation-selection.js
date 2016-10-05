(function($) {
	$(document).ready(function() {
		// Форма: Подбор участка
		$('body').on('submit', '.fancybox-wrap #form-consultation-selection form', function() {
			var $FORM = $(this);
			if ($FORM.hasClass('rc--processed')) {
				return false;
			}

			var $button = $FORM.find('[type="submit"]');
			var button_backup = $button.val();

			$FORM.addClass('rc--processed');
			$FORM.prepend('<input class="rc-field--null" type="hidden" name="null" value="1">');

			$button.val('Отправка...');

			$FORM.find('.new-adv-order-form-hint').remove();

			$FORM.ajaxSubmit({
				url: '/admin/ajax.php?controller=myplugins&pluginid=12&action=consultation-selection&ajax',
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

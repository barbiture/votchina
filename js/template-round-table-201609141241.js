(function($) {
	$(document).ready(function() {
		$('body').on('click', '.chat-category-trigger', function(_event) {
			_event.preventDefault();

			var $A = $(this);
			var $wrapper = $A.parents('.chat-block:eq(0)');

			$('.chat-block.active').removeClass('active').css('background-image', '');
			$wrapper.addClass('active').css('background-image', 'url(' + $wrapper.data('backgroundImage') + ')');

			var $template = $('.template.chat-category-' + $A.data('id'));
			if ($template.length) {
				$('.col.col-content').html($template.html());
			}
		});
	});
})(jQuery);

(function($) {
	$(document).ready(function() {
		$('#owl--partners').owlCarousel({
			navigation: true,
			navigationText: false,
			pagination: false,
			paginationSpeed: 400,
			singleItem: true,
			slideSpeed: 300
		});

		$('body').on('click', '.partner-trigger', function(_event) {
			_event.preventDefault();

			var $A = $(this);
			var $wrapper = $A.parents('.event-item:eq(0)');

			$('.event-item.active').removeClass('active').css('background-image', '');
			$wrapper.addClass('active').css('background-image', 'url(' + $wrapper.data('backgroundImage') + ')');

			var $template = $('.template.partner-' + $A.data('id'));
			if ($template.length) {
				$('.col.partner-content > .popup-body').html($template.html());
			}
		});
	});
})(jQuery);
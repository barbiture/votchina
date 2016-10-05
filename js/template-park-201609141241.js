(function($) {
	$(document).ready(function() {
		$('body').on('click', '.infrastructure-trigger', function(_event) {
			_event.preventDefault();

			var $A = $(this);
			var $wrapper = $A.parents('.str-item:eq(0)');

			$('.str-item.active').removeClass('active').css('background-image', '');
			$wrapper.addClass('active').css('background-image', 'url(' + $wrapper.data('backgroundImage') + ')');

			var $template = $('.template.infrastructure-' + $A.data('id'));
			if ($template.length) {
				$('.col.event-content').html($template.html());

				$('.col.event-content .owl--park-images').owlCarousel({
					autoPlay: 3000,
					navigation: false,
					navigationText: false,
					pagination: false,
					paginationSpeed: 400,
					singleItem: true,
					slideSpeed: 300
				});
			}
		});

		$('.col.event-content .owl--park-images').owlCarousel({
			autoPlay: 3000,
			navigation: false,
			navigationText: false,
			pagination: false,
			paginationSpeed: 400,
			singleItem: true,
			slideSpeed: 300
		});
	});
})(jQuery);

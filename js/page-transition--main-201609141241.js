(function($) {
	var linkLocation = '/';

	function redirectPage() {
		window.location = linkLocation;
	}

	$(document).ready(function() {
		$('body').css('display', 'none').fadeIn(0);

		$('a.transition-scroll').click(function(_event) {
			_event.preventDefault();

			var $el = $(this);
			if (/*!$el.hasClass('') && */$el.attr('href') !== '#') {
				linkLocation = $el.attr('href');
				$('body').fadeOut(0, redirectPage);
			}
		});
	});
})(jQuery);

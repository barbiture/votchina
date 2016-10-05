(function($) {
	var linkLocation = '/';

	function redirectPage() {
		window.location = linkLocation;
	}
/*
	window.onwheel = function(_event) {
		if (!window.flag_blockTransitionScroll && _event.deltaY > 0) {
			var $el = $('a.transition-scroll');
			if ($el.length && !$el.hasClass('transition-scroll--only-on-click')) {
				linkLocation = $el.attr('href');
				$('body').fadeOut(0, redirectPage);
			}
		}
	};

	$(window).on('touchstart', function(_event) {
		var start = _event.originalEvent.touches[0].pageY;

		$(this).on('touchmove', function(_event) {
			_event.preventDefault();
			_event.stopPropagation();

			if (!window.flag_blockTransitionScroll && (_event.originalEvent.touches[0].pageY - start) < -30) {
				var $el = $('a.transition-scroll');
				if ($el.length) {
					linkLocation = (typeof($el.data('url')) !== 'undefined' ? $el.data('url') : $el.attr('href'));
					$('body').fadeOut(0, redirectPage);
				}
			}
		}).one('touchend', function() {
			$(this).off('touchmove touchend');
		});
	});
*/
	$(document).ready(function() {
		$('body').css('display', 'none').fadeIn(0);

		$('a.transition-scroll').click(function(_event) {
			_event.preventDefault();

			var $el = $(this);
			if ($el.attr('href') !== '#') {
				linkLocation = $el.attr('href');
				$('body').fadeOut(0, redirectPage);
			}
		});
	});
})(jQuery);

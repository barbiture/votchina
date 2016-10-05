var flag_blockTransitionScroll = false;

(function($) {
	$(document).ready(function() {
		$('.s-trigger').click(function(_event) {
			$('.header .navbar').toggleClass('active');
			$('body').toggleClass('open');
		});

		$('.closed-menu').click(function(_event) {
			$('.header .navbar').removeClass('active');
			$('body').removeClass('open');
		})

		$('#fullpage').fullpage({
			anchors: [
				'home',
				'about',
				'services',
				'nature',
				'neighbors',
				'help',
				'last'
			],
			controlArrows: false,
			css3: false,
			fixedElements:'.header',
			menu: '#menu',
			scrollOverflow: false,
			verticalCentered: false,
			afterRender: function() {
				slideTimeout = setInterval(function() {
					$.fn.fullpage.moveSlideRight();
				}, 50000);
			},
			onLeave: function(_indexPrev, _index) {
				if (_index == 7/* && _indexPrev == (_index - 1)*/) {
					var $el = $('a.transition-scroll');
					if ($el.length) {
						$('body').fadeOut(0, function() {
							window.location = $el.attr('href');
						});
					}
				}
			}
		});

		$('#owl--about-1').owlCarousel({
			navigation: true,
			navigationText: false,
			pagination: false,
			paginationSpeed: 400,
			singleItem: true,
			slideSpeed: 300
		});
		$('#owl--about-2').owlCarousel({
			autoPlay: 3000,
			navigation: false,
			navigationText: false,
			pagination: true,
			paginationSpeed: 400,
			singleItem: true,
			slideSpeed: 300
		});
		$('#owl--services').owlCarousel({
			autoPlay: 3000,
			navigation: false,
			navigationText: false,
			pagination: true,
			paginationSpeed: 400,
			singleItem: true,
			slideSpeed: 300,
		});
		$('#owl--nature').owlCarousel({
			autoPlay: 3000,
			navigation: false,
			navigationText: false,
			pagination: true,
			paginationSpeed: 400,
			singleItem: true,
			slideSpeed: 300,
		});
		$('#owl--neighbors').owlCarousel({
			autoPlay: 3000,
			navigation: false,
			navigationText: false,
			pagination: true,
			paginationSpeed: 400,
			singleItem: true,
			slideSpeed: 300
		});
		$('#owl--help').owlCarousel({
			autoPlay: 3000,
			navigation: false,
			navigationText: false,
			pagination: true,
			paginationSpeed: 400,
			singleItem: true,
			slideSpeed: 300
		});

		$('body').on('mousedown touchstart', '.r-banner a', function(_event) {
			if (typeof(ga) != 'undefined') {
				ga('send', 'event', 'mainPageBannerClick', '259-Maslenitsa');
			}
			if (typeof(yaCounter12277678) != 'undefined') {
				yaCounter12277678.reachGoal('mainPageBannerClick', '259-Maslenitsa');
			}
		});
	});
})(jQuery);

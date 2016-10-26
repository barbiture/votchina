var flag_blockTransitionScroll = false;

(function($) {
	$(document).ready(function() {
		$('#fullpage').fullpage({
			scrollOverflow: false,
			verticalCentered: false,
			fixedElements:'.header',
			css3: false
		});

		$('.s-trigger').click(function(_event) {
			$('.header .navbar').toggleClass('active');
			$('body').toggleClass('open');
		});

		$('.closed-menu').click(function(_event) {
			$('.header .navbar').removeClass('active');
			$('body').removeClass('open');
		})

		// открытие окон "преимущества"
		$('.fancybox').fancybox({
			autoCenter: false,
			closeEffect: 'none',
			height: '100%',
			margin: 0,
			nextEffect: 'none',
			openEffect: 'none',
			padding: 0,
			prevEffect: 'none',
			width: '100%',
			wrapCSS: 'full-modal',
			afterLoad: function() {
				window.flag_blockTransitionScroll = true;
			},
			beforeClose: function() {
				window.flag_blockTransitionScroll = false;
			}
		});

		// открытие полноэкранных фото страница "дома"
		$('.fancybox-photo').fancybox({
			closeEffect: 'none',
			openEffect: 'none',
			padding: 0,
			wrapCSS: 'photo-modal',
			afterLoad: function() {
				window.flag_blockTransitionScroll = true;
			},
			beforeClose: function() {
				window.flag_blockTransitionScroll = false;
			},
			beforeShow: function() {
				$('.fancybox-overlay').css('background', 'rgba(51, 61, 21, 0.8)');
			}
		});

		// открытие видео "Дом мечты"
		$('.various').fancybox({
			autoSize: false,
			closeClick: false,
			closeEffect: 'none',
			fitToView: false,
			height: '70%',
			maxHeight: 600,
			maxWidth: 850,
			openEffect: 'none',
			padding: 0,
			width: '70%',
			wrapCSS: 'photo-modal',
			afterLoad: function() {
				window.flag_blockTransitionScroll = true;
			},
			beforeClose: function() {
				window.flag_blockTransitionScroll = false;
			},
			beforeShow: function() {
				$('.fancybox-overlay').css({
					'top': '100px',
					'background': 'rgba(41, 41, 41, 0.8)'
				});
			}
		});

		// открытие ссылок "Подробнее..."
		$('.toggle-more').click(function(_event) {
			window.flag_blockTransitionScroll = true;

			var target = $(this).attr('href');
			$(target).show();
		});
		$('.more-modal .close').click(function(_event) {
			window.flag_blockTransitionScroll = false;

			$('.more-modal').hide();
		});
	});
})(jQuery);

(function($) {
	var rc_preload_files = [
		'/images/loading38.gif'
	];
	var rc_preload_images = [];
	for (var _index in rc_preload_files) {
		rc_preload_images.push(new Image());
		rc_preload_images[(rc_preload_images.length - 1)].src = rc_preload_files[_index];
	}

	var $button = $('.photo-section .load-more');

	$('.photo-section .gallery a[rel="fancybox"]').fancybox({
		closeEffect: 'none',
		loop: false,
		margin: 0,
		openEffect: 'none',
		padding: 0,
		wrapCSS: 'photo-full',
		afterLoad: function() {
			window.flag_blockTransitionScroll = true;
		},
		beforeClose: function() {
			window.flag_blockTransitionScroll = false;
		},
		beforeShow: function() {
			$('.fancybox-overlay').css({
				'top': '100px',
				'left': '289px',
				'background': 'rgba(51, 61, 21, 0.8)'
			});

			if (parseInt($.fancybox.current.index, 10) === (parseInt(window.rc_gallery_offset, 10) - 1)) {
				$.fancybox.showLoading();

				if ($button.is(':visible')) {
					$button.trigger('click');
				}
			}
		}
	});

	$('.fancybox--video').fancybox({
		autoSize: false,
		closeClick: false,
		closeEffect: 'none',
		fitToView: false,
		height: '70%',
		loop: false,
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
				'left': '289px',
				'background': 'rgba(51, 61, 21, 0.8)'
			});
		}
	});

	switch (window.rc_gallery_type) {
		case 'images':
			var $container = $('.photo-section .gallery');
			var $images = $container.find('a > img').hide();
			var images_count = $images.length;
			var counter = 0;

			$images.each(function() {
				var $image = $(this);

				$('<img/>').load(function() {
					++counter;

					if (counter === images_count) {
						$images.show();
						$container.montage({
							fillLastRow: true,
							fixedHeight: 185,
							margin: 2,
							maxWidth: 370,
							minWidth: 138
						});

						$button.show().on('click', function(_event) {
							_event.preventDefault();

							var $el = $(this)

							if ($el.hasClass('loading')) {
								return false;
							}

							$el.addClass('loading');

							$.ajax({
								url: '/admin/ajax.php?controller=myplugins&pluginid=7&action=images%2Fget',
								type: 'POST',
								async: false,
								cache: false,
								data: 'category_id=' + window.rc_gallery_id + '&offset=' + window.rc_gallery_offset + '&page=' + window.rc_gallery_page,
								dataType: 'json',
								error: function(_XHR, _status, _error) {
									$el.removeClass('loading');
								},
								success: function(_response, _status, _XHR) {
									if (_response && 'status' in _response) {
										switch (_response['status']) {
											case 'success':
												var rc_gallery_offset_backup = window.rc_gallery_offset;
												window.rc_gallery_offset = parseInt(_response['offset'], 10);
												if (window.rc_gallery_offset === 0) {
													$button.hide();
												}

												window.rc_gallery_page = parseInt(_response['page'], 10);

												var $images = $(_response['images']);
												$images.imagesLoaded(function() {
													$container.montage('replace_wrappers_html', $images, $container.find('.gallery-page-' + window.rc_gallery_page));

													$el.removeClass('loading');
												});
												break;

											case 'fail':
												$button.hide();

												$el.removeClass('loading');
												break;
										}
									} else {
										$el.removeClass('loading');
									}
								},
								complete: function(_event, _XHR, _options) {
									$.fancybox.hideLoading();
								}
							});
						});
					}
				}).attr('src', $image.attr('src'));
			});
			break;

		case 'videos':
			var $container = $('.photo-section .gallery');

			$button.show().on('click', function(_event) {
				_event.preventDefault();

				var $el = $(this)

				if ($el.hasClass('loading')) {
					return false;
				}

				$el.addClass('loading');

				$.ajax({
					url: '/admin/ajax.php?controller=myplugins&pluginid=7&action=videos%2Fget',
					type: 'POST',
					async: false,
					cache: false,
					data: 'category_id=' + window.rc_gallery_id + '&offset=' + window.rc_gallery_offset,
					dataType: 'json',
					error: function(_XHR, _status, _error) {
						$el.removeClass('loading');
					},
					success: function(_response, _status, _XHR) {
						if (_response && 'status' in _response) {
							switch (_response['status']) {
								case 'success':
									var rc_gallery_offset_backup = window.rc_gallery_offset;
									window.rc_gallery_offset = parseInt(_response['offset'], 10);
									if (window.rc_gallery_offset === 0) {
										$button.hide();
									}

									$container.append(_response['videos']);
									break;

								case 'fail':
									$button.hide();
									break;
							}
						}
					},
					complete: function(_event, _XHR, _options) {
						$el.removeClass('loading');
					}
				});
			});
			break;
	}

	$(document).ready(function() {
		$('#owl--gallery-categories').owlCarousel({
			navigation : true,
			navigationText: false,
			pagination: false,
			slideSpeed : 300,
			paginationSpeed : 400,
			singleItem : true
		});
	});
})(jQuery);

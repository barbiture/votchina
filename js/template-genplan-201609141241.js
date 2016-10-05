(function($) {
	var settings = {
		'original': {
			'width': 2438,
			'height': 1740
		},
		'current': {
			'width': 0,
			'height': 0
		},
		'previous': {
			'width': 0,
			'height': 0
		},

		'offset': {
			'top': 0,
			'left': 0
		},

		'mouse': {
			'x': 0,
			'y': 0
		}
	};

	var flagLoading = true;

	var rc_preload_files = [
		'/images/genplan_page-v1.png',
		'/images/genplan_page-v2.png',
		'/images/genplan_page-v3.png',
		'/images/genplan_page-v4.png'
	];
	var rc_preload_images = [];
	for (var _index in rc_preload_files) {
		rc_preload_images.push(new Image());
		rc_preload_images[(rc_preload_images.length - 1)].src = rc_preload_files[_index];
	}

	function getWorkspace() {
		return {
			top: $('.genplan-wrapper').offset()['top'],
			left: $('.genplan-wrapper').offset()['left'],

			width: $('.genplan-wrapper').width(),
			height: $('.genplan-wrapper').height()
		};
	}

	function calculateImage(_multiplier) {
		if (typeof(_multiplier) === 'undefined') {
			_multiplier = 0.57;
		}
		var workspace = getWorkspace();

		if (Math.round(settings['original']['width'] * _multiplier) < workspace['width'] || Math.round(settings['original']['height'] * _multiplier) < workspace['height']) {
			_multiplier = (workspace['height'] / settings['original']['height']) + 0.05;
		}

		settings['current']['width'] = Math.round(settings['original']['width'] * _multiplier);
		settings['current']['height'] = Math.round(settings['original']['height'] * _multiplier);

		changeImage($('.genplan-image'), settings['current']['width'], settings['current']['height'], workspace['left'] + Math.round((workspace['width'] - settings['current']['width']) / 2), workspace['top'] + Math.round((workspace['height'] - settings['current']['height']) / 2));

		settings['previous']['width'] = settings['current']['width'];
		settings['previous']['height'] = settings['current']['height'];
	}

	function changeImage(_$image, _width, _height, _offsetX, _offsetY) {
		var workspace = getWorkspace();
		var containment = {
			x1: 0,
			y1: 0,
			x2: workspace['left'],
			y2: workspace['top']
		};

		if (workspace['width'] < settings['current']['width']) {
			containment['x1'] = containment['x2'] - (settings['current']['width'] - workspace['width']);
		} else {
			containment['x1'] = containment['x2'] + Math.round((workspace['width'] - settings['current']['width']) / 2);
			containment['x2'] = containment['x1'];
		}
		if (workspace['height'] < settings['current']['height']) {
			containment['y1'] = containment['y2'] - (settings['current']['height'] - workspace['height']);
		} else {
			containment['y1'] = containment['y2'] + Math.round((workspace['height'] - settings['current']['height']) / 2);
			containment['y2'] = containment['y1'];
		}

		if (_offsetX < containment['x1'] || _offsetX > containment['x2']) {
			_offsetX = containment['x1'] + Math.round((containment['x2'] - containment['x1']) / 2);
		}
		if (_offsetY < containment['y1'] || _offsetY > containment['y2']) {
			_offsetY = containment['y1'] + Math.round((containment['y2'] - containment['y1']) / 2);
		}

		_$image.css({
			'top': _offsetY + 'px',
			'left': _offsetX + 'px',
			'width': _width + 'px',
			'height': _height + 'px'
		});

		var multiplier = (_width / settings['original']['width']);

		$('.genplan-map area').each(function() {
			var $el = $(this),
				data_coords = $el.data('coords');

			if (typeof(data_coords) !== 'undefined') {
				switch ($el.attr('shape')) {
					case 'circle':
					case 'poly':
					case 'rect':
						var coords = [];
						for (var _index in data_coords) {
							coords.push(Math.round(parseInt(data_coords[_index], 10) * multiplier));
						}
						$el.attr('coords', coords.join(','));
						break;
				}
			}
		});

		_$image.draggable('option', 'containment', [containment['x1'], containment['y1'], containment['x2'], containment['y2']]);
	}

	function processMouseWheel(_event, _delta) {
		var multiplier = 1.25;

		settings['offset'] = $('.genplan-image').position();
		settings['mouse'] = {
			x: (_event['pageX'] - settings['offset']['left']),
			y: (_event['pageY'] - settings['offset']['top'])
		};

		var workspace = getWorkspace();

		var temp = 0;
		if (_delta < 0) {
			multiplier = (1 / multiplier);
		}
		temp = Math.round(settings['current']['height'] * multiplier);
		if (temp > settings['original']['height']) {
			multiplier = (settings['original']['height'] / settings['current']['height']);

			temp = settings['original']['height'];
		} else if (temp < workspace['height']) {
			multiplier = (workspace['height'] / settings['current']['height']);

			temp = workspace['height'];
		}

		settings['mouse']['x'] = Math.round(settings['mouse']['x'] * multiplier);
		settings['mouse']['y'] = Math.round(settings['mouse']['y'] * multiplier);

		settings['current']['height'] = temp;
		settings['current']['width'] = Math.round((settings['current']['height'] * settings['original']['width']) / settings['original']['height']);

		if (settings['current']['width'] == settings['previous']['width'] && settings['current']['height'] == settings['previous']['height']) {
			return false;
		}

		settings['offset']['left'] = Math.round((workspace['width'] - settings['current']['width']) / 2);
		if (settings['current']['width'] > workspace['width']) {
			settings['offset']['left'] = (_event['pageX'] - settings['mouse']['x']);
		}
		settings['offset']['top'] = Math.round((workspace['height'] - settings['current']['height']) / 2);
		if (settings['current']['height'] > workspace['height']) {
			settings['offset']['top'] = (_event['pageY'] - settings['mouse']['y']);
		}

		changeImage($('.genplan-image'), settings['current']['width'], settings['current']['height'], settings['offset']['left'], settings['offset']['top']);

		settings['previous']['width'] = settings['current']['width'];
		settings['previous']['height'] = settings['current']['height'];
	}

	function processZoom(_delta) {
		var workspace = getWorkspace();
		var event = {
			pageX: Math.round(workspace['width'] / 2),
			pageY: Math.round(workspace['height'] / 2)
		};

		processMouseWheel(event, _delta);
	}

	$(window).resize(function() {
		calculateImage();
	});

	$(document).ready(function() {
		$('.s-closeB').click(function(_event) {
			$('.plan-modal').hide();

			return false;
		});

		$('.best-toggle').click(function(_event) {
			_event.preventDefault();

			$.fancybox.close(true);
			$('.best-modal').show();
		});
		$('.best-modal .pref-bg, .best-modal .close').click(function(_event) {
			_event.preventDefault();

			$('.best-modal').hide();
		})

		$('.plan-toggle').click(function(_event) {
			_event.preventDefault();

			$('.plan-modal').show();
		});

		$('.genplan-image').draggable({
			scroll: false
		});

		$('body').on('click', '.genplan-wrapper .s-zoomOut', function(_event) {
			processZoom(+1);

			return false;
		});
		$('body').on('click', '.genplan-wrapper .s-zoomIn', function(_event) {
			processZoom(-1);

			return false;
		});

		$('body').on('click', '.land-item-wrap', function(_event) {
			_event.preventDefault();

			var $A = $(this),
				settings_ = $A.data('settings');

			if (typeof(settings_) !== 'undefined') {
				var src_ = $('.genplan-image').attr('src').replace(/^([^\.]+?)(-v\d+?)?(\..+?)$/i, '$1-v' + settings_['id'] + '$3');
				$('.genplan-image').attr('src', src_);

				$('.best-modal').hide();
			}
		});

		calculateImage();

		$('.genplan-map area').hover(function() {
			$('.genplan-image').css({'cursor': 'pointer'});
		}, function() {
			$('.genplan-image').css({'cursor': 'move'});
		});

		$('.genplan-map area:not(.no-fancybox)').regionbox({
			ajax: {
				type: 'POST',
				async: false,
				cache: false
			},
			autoSize: true,
			closeEffect: 'none',
			helpers: {
				title: null
			},
			href: '/admin/ajax.php?controller=myplugins&pluginid=10&section=poi&action=getpoi&ajax',
			loop: false,
			nextEffect: 'none',
			openEffect: 'none',
			padding: 0,
			prevEffect: 'none',
			type: 'ajax',
			wrapCSS: 'popup-modal',
			beforeLoad: function() {
				this.ajax.data = 'id=' + $(this.element[0]).data('id');
			},
			beforeShow: function() {
				$('.regionbox-overlay').css({
					//'top': '100px',
					'background': 'rgba(41, 41, 41, 0.8)'
				});

				if (typeof(ga) != 'undefined') {
					ga('send', 'event', 'genplanAreaClick', $(this.element[0]).attr('title'));
				}
				if (typeof(yaCounter12277678) != 'undefined') {
					yaCounter12277678.reachGoal('genplanAreaClick', $(this.element[0]).attr('title'));
				}
			},
			afterShow: function() {
				$('.regionbox-wrap .regionbox-nav.regionbox-prev').attr('title', 'Предыдущий').html('<span></span>Предыдущий');
				$('.regionbox-wrap .regionbox-nav.regionbox-next').attr('title', 'Следующий').html('<span></span>Следующий');
			}
		});
	});
})(jQuery);

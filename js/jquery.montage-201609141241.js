/**
 * jQuery rc_Montage plugin {by Fuego}
 *
 * Copyright 2014, Fuego
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: Fri Aug 1 2014
 */

/*
 * INE: javascript String.trim();
 */
if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

(function($){
	"use strict";

	var defaults = {
		//alternateHeight: false,
		//alternateHeightRange: {
		//	max: 300,
		//	min: 100
		//},
		fillLastColumn: true,
		fillLastRow: false,
		fixedHeight: 150,
		//liquid: true,
		margin: 1,
		//maxHeight: 250,
		maxWidth: 300,
		//minHeight: 20,
		//minSize: false,
		minWidth: 113,
		selectors: {
			wrapper: '> a.wrapper',
			item: '> img'
		}
	},
	instance = null,
	methods = {
		_init: function(_options) {
			var width = [];

			instance.options = $.extend(true, {}, (instance.options === null ? defaults : instance.options), _options);

			//instance.options.alternateHeightRange.max = parseInt(instance.options.alternateHeightRange.max, 10);
			//instance.options.alternateHeightRange.min = parseInt(instance.options.alternateHeightRange.min, 10);
			instance.options.fixedHeight = (instance.options.fixedHeight !== null ? parseInt(instance.options.fixedHeight, 10) : instance.options.fixedHeight);
			instance.options.margin = parseInt(instance.options.margin, 10);
			//instance.options.maxHeight = parseInt(instance.options.maxHeight, 10);
			width.push(parseInt(instance.options.maxWidth, 10));
			//instance.options.minHeight = parseInt(instance.options.minHeight, 10);
			width.push(parseInt(instance.options.minWidth, 10));
			instance.options.maxWidth = Math.max.apply(null, width);
			instance.options.minWidth = Math.min.apply(null, width);
			instance.options.selectors.item.trim();
			instance.options.selectors.wrapper.trim();

			instance.cache.selectors.item = instance.options.selectors.item.replace(/^\>(.*?)$/, '$1').trim();
			instance.cache.selectors.wrapper = instance.options.selectors.wrapper.replace(/^\>(.*?)$/, '$1').trim();

			methods._rebuild.apply(null, [true]);
		},
		update: function() {
			if (instance.flags.ready && !instance.flags.in_progress && instance.container.width() !== instance.cache.containerWidth) {
				methods._rebuild.apply(null, []);
			}
		},
		rebuild: function() {
			methods._rebuild.apply(null, [true]);
		},
		append: function($_images) {
			instance.flags.in_progress = true;
			instance.container.data('rc_montage', instance);

			var _scrollTop = $(window).scrollTop();

			var $wrapper = instance.container.find(instance.options.selectors.wrapper + ':last');

			if ($wrapper.length === 1) {
				var position = $wrapper.position();
				instance.cache.containerSpace = instance.cache.containerWidth - position.left;

				$wrapper.after($_images);
			} else {
				instance.cache.containerSpace = instance.cache.containerWidth;

				instance.container.append($_images);
			}

			instance.cache.imagePrevious = null;

			var index_offset = instance.cache.imagesCount;

			if ($wrapper.length === 1) {
				var $wrapper_prev = $wrapper.prev(instance.cache.selectors.wrapper);
				var $images = ($wrapper_prev.length === 1 ? $wrapper_prev.nextAll().find(instance.options.selectors.item) : instance.container.find(instance.options.selectors.wrapper + ' ' + instance.options.selectors.item));

				index_offset--;
			} else {
				var $images = instance.container.find(instance.options.selectors.wrapper + ' ' + instance.options.selectors.item);
			}

			instance.cache.images = instance.container.find(instance.options.selectors.wrapper + ' ' + instance.options.selectors.item);
			instance.cache.imagesCount = instance.cache.images.length;

			$images.each(function(_index) {
				methods._insertImage.apply(null, [$(this), _index + index_offset]);
			});

			$(window).scrollTop(_scrollTop);

			if (!instance.flags.ready) {
				instance.flags.ready = true;

				setInterval(methods.update, 250);
			}
			instance.flags.in_progress = false;

			instance.container.data('rc_montage', instance);
		},
		replace_wrappers_html: function($_images, $_wrappers) {
			if ($_wrappers.length !== $($_images).find(instance.options.selectors.item).length) {
				return false;
			}

			instance.flags.in_progress = true;
			instance.container.data('rc_montage', instance);

			var _scrollTop = $(window).scrollTop();

			var $wrapper = instance.container.find(instance.options.selectors.wrapper + ':last');

			var $images = $($_images).find(instance.options.selectors.item);

			if ($wrapper.length === 1) {
				var position = $wrapper.position();
				instance.cache.containerSpace = instance.cache.containerWidth - position.left;

				$_wrappers.each(function(_index, $_wrapper) {
					$($_wrapper).html($($images[_index])).removeClass().addClass('wrapper');
				});
			} else {
				instance.cache.containerSpace = instance.cache.containerWidth;

				$_wrappers.each(function(_index, $_wrapper) {
					$($_wrapper).html($($images[_index])).removeClass().addClass('wrapper');
				});
			}

			instance.cache.imagePrevious = null;

			var index_offset = instance.cache.imagesCount;

			if ($wrapper.length === 1) {
				var $wrapper_prev = $wrapper.prev(instance.cache.selectors.wrapper);
				$images = ($wrapper_prev.length === 1 ? $wrapper_prev.nextAll().find(instance.options.selectors.item) : instance.container.find(instance.options.selectors.wrapper + ' ' + instance.options.selectors.item));

				index_offset--;
			} else {
				$images = instance.container.find(instance.options.selectors.wrapper + ' ' + instance.options.selectors.item);
			}

			instance.cache.images = instance.container.find(instance.options.selectors.wrapper + ' ' + instance.options.selectors.item);
			instance.cache.imagesCount = instance.cache.images.length;

			$images.each(function(_index) {
				methods._insertImage.apply(null, [$(this), _index + index_offset]);
			});

			$(window).scrollTop(_scrollTop);

			if (!instance.flags.ready) {
				instance.flags.ready = true;

				setInterval(methods.update, 250);
			}
			instance.flags.in_progress = false;

			instance.container.data('rc_montage', instance);
		},
		_rebuild: function(_flagForce) {
			if ($.type(_flagForce) === 'undefined') {
				_flagForce = false;
			}

			instance.flags.in_progress = true;
			instance.container.data('rc_montage', instance);

			var _scrollTop = $(window).scrollTop();

			instance.cache.containerSpace = instance.container.width();
			instance.cache.containerWidth = instance.container.width();
			instance.cache.imagePrevious = null;

			if (_flagForce) {
				instance.cache.images = instance.container.find(instance.options.selectors.wrapper + ' ' + instance.options.selectors.item);
				instance.cache.imagesCount = instance.cache.images.length;
			}

			instance.cache.images.each(function(_index) {
				methods._insertImage.apply(null, [$(this), _index]);
			});

			$(window).scrollTop(_scrollTop);

			if (!instance.flags.ready) {
				instance.flags.ready = true;

				setInterval(methods.update, 250);
			}
			instance.flags.in_progress = false;

			instance.container.data('rc_montage', instance);
		},
		_insertImage: function($_image, _index, _flagMainStream) {
			if ($.type(_flagMainStream) === 'undefined') {
				_flagMainStream = true;
			}

			var $wrapper = $_image.parents(instance.cache.selectors.wrapper + ':eq(0)'),
				imageWidth = methods._calculateImageWidth.apply(null, [$_image, instance.options.fixedHeight]),
				containerSpace_image = instance.cache.containerSpace - (instance.options.margin * 2),
				flagLast = (_index === (instance.cache.imagesCount - 1));

			$wrapper.css({
				margin: 0,
				padding: 0,
				width: 'auto',
				height: 'auto'
			}).removeClass('montage-wrapper');
			$_image.css({
				top: 0,
				left: 0,
				width: 'auto',
				height: 'auto'
			}).removeClass('montage-item');

			if (imageWidth < instance.options.minWidth) {
				imageWidth = instance.options.minWidth;
			} else if (imageWidth > instance.options.maxWidth) {
				imageWidth = instance.options.maxWidth;
			}

			if (imageWidth <= containerSpace_image) {
				instance.cache.containerSpace -= methods._stretchImage.apply(null, [$wrapper, $_image, {width: (flagLast && instance.options.fillLastRow ? containerSpace_image : imageWidth), height: instance.options.fixedHeight}]);
			} else {
				if (containerSpace_image > instance.options.minWidth && containerSpace_image < instance.options.maxWidth) {
					instance.cache.containerSpace -= methods._stretchImage.apply(null, [$wrapper, $_image, {width: containerSpace_image, height: instance.options.fixedHeight}]);
				} else {
					if (instance.cache.imagePrevious === null) {
						instance.cache.containerSpace -= methods._stretchImage.apply(null, [$wrapper, $_image, {width: containerSpace_image, height: instance.options.fixedHeight}]);
					} else {
						if (instance.options.fillLastColumn) {
							methods._resizeImage.apply(null, [instance.cache.imagePrevious.parents(instance.cache.selectors.wrapper + ':eq(0)'), instance.cache.imagePrevious]);
						}

						instance.cache.containerSpace = instance.cache.containerWidth;
						containerSpace_image = instance.cache.containerSpace - (instance.options.margin * 2);

						if (flagLast && instance.options.fillLastRow) {
							instance.cache.containerSpace -= methods._stretchImage.apply(null, [$wrapper, $_image, {width: containerSpace_image, height: instance.options.fixedHeight}]);
						} else {
							methods._insertImage.apply(null, [$_image, _index, false]);
						}
					}
				}
			}

			if (instance.cache.containerSpace <= 0) {
				instance.cache.containerSpace = instance.cache.containerWidth;
			}

			if (_flagMainStream) {
				instance.cache.imagePrevious = $_image;
			}
		},
		_getImageWidth: function($_image) {
			var width = $_image.data('montage-width');

			if ($.type(width) === 'undefined') {
				width = $_image.width();

				if (width === 0) {
					return 0;
				} else {
					$_image.data('montage-width', width);
				}
			}

			return width;
		},
		_getImageHeight: function($_image) {
			var height = $_image.data('montage-height');

			if ($.type(height) === 'undefined') {
				height = $_image.height();

				if (height === 0) {
					return 0;
				} else {
					$_image.data('montage-height', height);
				}
			}

			return height;
		},
		_calculateImageWidth: function($_image, _height) {
			var width = $_image.data('montage-width');

			if ($.type(width) === 'undefined') {
				width = $_image.width();

				if (width === 0) {
					return 0;
				} else {
					$_image.data('montage-width', width);
				}
			}

			var height = $_image.data('montage-height');

			if ($.type(height) === 'undefined') {
				height = $_image.height();

				$_image.data('montage-height', height);
			}

			return Math.round(_height * width / height, 0);
		},
		_stretchImage: function($_wrapper, $_image, _crop) {
			_crop = _crop || {width: 0, height: 0};

			var width = methods._getImageWidth.apply(null, [$_image]),
				height = methods._getImageHeight.apply(null, [$_image]),
				scale = Math.max((_crop.width / width), (_crop.height / height));

			$_wrapper.css({
				margin: (_crop.width === 0 ? 0 : instance.options.margin) + 'px',
				padding: 0,
				width: _crop.width + 'px',
				height: _crop.height + 'px'
			}).addClass('montage-wrapper');
			$_image.css({
				display: 'block',
				top: Math.round((_crop.height - height * scale) / 2, 0) + 'px',
				left: Math.round((_crop.width - width * scale) / 2, 0) + 'px',
				width: Math.round(width * scale, 0) + 'px',
				height: Math.round(height * scale, 0) + 'px'
			}).addClass('montage-item');

			return $_wrapper.outerWidth(true);
		},
		_resizeImage: function($_wrapper, $_image) {
			var crop = {width: $_wrapper.outerWidth(true) + instance.cache.containerSpace - (instance.options.margin * 2), height: instance.options.fixedHeight};

			$_wrapper.css({
				margin: 0,
				padding: 0,
				width: 'auto',
				height: 'auto'
			});
			$_image.css({
				top: 0,
				left: 0,
				width: 'auto',
				height: 'auto'
			});

			var width = methods._getImageWidth.apply(null, [$_image]),
				height = methods._getImageHeight.apply(null, [$_image]),
				scale = Math.max((crop.width / width), (crop.height / height));

			$_wrapper.css({
				margin: (crop.width === 0 ? 0 : instance.options.margin) + 'px',
				padding: 0,
				width: crop.width + 'px',
				height: crop.height + 'px'
			}).addClass('montage-wrapper');
			$_image.css({
				display: 'block',
				top: Math.round((crop.height - height * scale) / 2, 0) + 'px',
				left: Math.round((crop.width - width * scale) / 2, 0) + 'px',
				width: Math.round(width * scale, 0) + 'px',
				height: Math.round(height * scale, 0) + 'px'
			}).addClass('montage-item');

			return $_wrapper.outerWidth(true);
		}
	};

	$.fn.montage = function(_method, $_images, $_wrappers) {
		this.each(function() {
			instance = $(this).data('rc_montage');

			if ($.type(instance) === 'undefined') {
				instance = {
					cache: {
						containerSpace: 0,
						containerWidth: 0,
						imagePrevious: null,
						images: {},
						imagesCount: 0,
						selectors: {
							wrapper: '',
							item: ''
						}
					},
					container: $(this),
					flags: {
						ready: false,
						in_progress: false
					},
					options: null
				};
			}

			if ($.type(_method) === 'string' && _method.charAt(0) !== '_' && methods[_method]) {
				switch (_method) {
					case 'append':
						return methods[_method].apply(this, [$_images]);
						break;

					case 'replace_wrappers_html':
						return methods[_method].apply(this, [$_images, $_wrappers]);
						break;

					default:
						return methods[_method].apply(this, Array.prototype.slice.call(arguments, 1));
				}
			} else if ($.type(_method) === 'object' || !_method) {
				return methods._init.apply(this, [_method]);
			} else {
				$.error('[jQuery.rc_montage] Method \'' + _method + '\' not exists');
			}
		});
	};
})(jQuery);
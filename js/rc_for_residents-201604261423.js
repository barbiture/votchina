jQuery.getScript('/js/rc_for_residents--data.js');

(function($) {
	$(document).ready(function() {
		$('body').on('keyup', '.window .input-text input', function(_event) {
			_event.preventDefault();

			var $input = $(this);

			var $TR = $input.parents('tr:eq(0)');
			var $container = $TR.parents('div.new-adv-service:eq(0)');
			var form_id = $container.data('form_id');

			if (typeof($input.data('sub_id')) === 'undefined') {
				var service = rc_for_residents[form_id][$input.data('id')];
			} else {
				var service = rc_for_residents[form_id][$input.data('id')]['sub'][$input.data('sub_id')];
			}

			if ($input.val().length) {
				var value = parseFloat($input.val());
			} else {
				var value = 1;
			}

			if ('count-min' in service && value < service['count-min']) {
				value = service['count-min'];
			}
			if ('count-max' in service && value > service['count-max']) {
				value = service['count-max'];
			}

			if (typeof($input.data('sub_id')) === 'undefined') {
				rc_for_residents[form_id][$input.data('id')]['count'] = value;
			} else {
				rc_for_residents[form_id][$input.data('id')]['sub'][$input.data('sub_id')]['count'] = value;
			}

			var price = '';
			if ('price' in service) {
				if (typeof(service['price']) === 'array') {
					_value = (value / service['count-step']) * service['price'][0];
					price (service['price'][0] > 0 ? '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.' : '<span>бесплатно</span>');
				} else if (typeof(service['price']) === 'string') {
					price = '<span>' + service['price'] + '</span>';
				} else {
					if (service['price'] > 0) {
						_value = (value / service['count-step']) * service['price'];
						price = '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
					} else {
						price = '<span>бесплатно</span>';
					}
				}
			} else {
				if ('price-min' in service) {
					if ('price-max' in service) {
						_value_min = (value / service['count-step']) * service['price-min'];
						_value_max = (value / service['count-step']) * service['price-max'];
						price = '<span>' + rc_number_format(_value_min.toFixed(2)) + '</span>&thinsp;&minus;&thinsp;<span>' + rc_number_format(_value_max.toFixed(2)) + '</span> руб.';
					} else {
						_value = (value / service['count-step']) * service['price-min'];
						price = '<span>от ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
					}
				} else {
					if ('price-max' in service) {
						_value = (value / service['count-step']) * service['price-max'];
						price = '<span>до ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
					} else {
						price = '&nbsp;';
					}
				}
			}
			$TR.find('td:last-child').html(price);

			rc_recalculateSum(form_id, $container);
		});

		$('body').on('blur', '.window .input-text input', function(_event) {
			_event.preventDefault();

			var $input = $(this);

			var $container = $input.parents('div.new-adv-service:eq(0)');
			var form_id = $container.data('form_id');

			if (typeof($input.data('sub_id')) === 'undefined') {
				$input.val(rc_for_residents[form_id][$input.data('id')]['count']);
			} else {
				$input.val(rc_for_residents[form_id][$input.data('id')]['sub'][$input.data('sub_id')]['count']);
			}
		});

		// Выбрать услугу | Цена
		$('body').on('click', '.for_residents-services, .for_residents-prices, .for_residents-order', function(_event) {
			_event.preventDefault();

			if ($(this).hasClass('for_residents-services')) {
				var form_id = 'services';
			} else if ($(this).hasClass('for_residents-prices') || $(this).hasClass('for_residents-order')) {
				var form_id = 'prices';
			}

			var content = '';
			var checked = false;

			for (var _index in rc_for_residents[form_id]) {
				var service = rc_for_residents[form_id][_index];

				if ('sub' in service) {
					content += '<tr class="sub-title">';

					// 1st+2nd+3rd
					content += '<td colspan="4" class="new-adv-service-subtitle">';
					content += service['label'];
					content += '</td>';

					// 4th
					content += '<td class="new-adv-service-col-3" style="padding-top: 32px;">';
					content += ('qTip' in service ? '<span class="qtip-description" data-content="' + service['qTip'] + '"></span>' : '&nbsp;');
					content += '</td>';

					// 5th
					content += '<td class="new-adv-service-col-5">&nbsp;</td>';

					// 6th
					content += '<td class="new-adv-service-col-4">&nbsp;</td>';

					var flag = true;
					for (var _subindex in service['sub']) {
						var subservice = service['sub'][_subindex];

						content += '<tr class="sub">';

						if (!checked && subservice['checked']) {
							checked = true;
						}

						// 1st
						content += '<td class="new-adv-service-col-1"' + (flag ? ' style="border-top: 0 none; "' : '') + '>&nbsp;</td>';

						// 2nd
						content += '<td class="new-adv-service-col-1" style="' + (flag ? 'border-top: 0 none; ' : '') + 'padding-left: 30px; padding-right: 9px;"><div class="new-adv-checkbox' + (subservice['enabled'] ? '' : ' disabled') + (subservice['checked'] ? ' checked' : '') + '" data-id="' + _index + '" data-sub_id="' + _subindex + '"></div></td>';

						// 3rd
						content += '<td class="new-adv-service-col-2"' + (flag ? ' style="border-top: 0 none; "' : '') + '>';
						content += subservice['label'];
						content += '</td>';

						// 3rd:photo
						content += '<td class="new-adv-service-col-photo"' + (flag ? ' style="border-top: 0 none; "' : '') + '>';
						content += ('photo' in subservice ? '<img src="/images/price-list/' + subservice['photo'] + '" alt="" width="67" height="67" />' : '&nbsp;');
						content += '</td>';

						// 4th
						content += '<td class="new-adv-service-col-3"' + (flag ? ' style="border-top: 0 none; "' : '') + '>';
						if ('qTip' in subservice) {
							content += '<span class="qtip-description" data-content="' + subservice['qTip'] + '"></span>';
						}
						content += '</td>';

						// 5th
						content += '<td class="new-adv-service-col-5"' + (flag ? ' style="border-top: 0 none; "' : '') + '>';
						if ('count-max' in subservice) {
							content += '<select id="select-' + _index + '-' + _subindex + '"'+ (subservice['enabled'] ? '' : ' disabled="disabled"') + ' onchange="rc_updateSelect(this);" data-id="' + _index + '" data-sub_id="' + _subindex + '">';
							for (var _value = subservice['count-min']; _value <= subservice['count-max'];) {
								content += '<option value="' + _value + '"' + (subservice['count'] === _value ? ' selected="selected"' : '') + '>' + _value + '</option>';

								_value += subservice['count-step'];
								_value = parseFloat(_value.toFixed(3));
							}
							content += '</select><span class="unit">' + subservice['unit'] + '</span>';
						} else {
							if ('count' in subservice) {
								content += '<div class="input-text"><input type="text" value="' + subservice['count'] + '"'+ (subservice['enabled'] ? '' : ' disabled="disabled"') + ' data-id="' + _index + '" data-sub_id="' + _subindex + '" /></div><span class="unit">' + subservice['unit'] + '</span>'
							}
						}
						content += '</td>';

						// 6th
						content += '<td class="new-adv-service-col-4"' + (flag ? ' style="border-top: 0 none; "' : '') + '>';
						if ('price' in subservice) {
							if (typeof(subservice['price']) === 'array') {
								_value = (subservice['count'] / subservice['count-step']) * subservice['price'][0];
								content += (subservice['price'][0] > 0 ? '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.' : '<span>бесплатно</span>');
							} else if (typeof(subservice['price']) === 'string') {
								content += '<span>' + subservice['price'] + '</span>';
							} else {
								if (subservice['price'] > 0) {
									_value = (subservice['count'] / subservice['count-step']) * subservice['price'];
									content += '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
								} else {
									content += '<span>бесплатно</span>';
								}
							}
						} else {
							if ('price-min' in subservice) {
								if ('price-max' in subservice) {
									_value_min = (subservice['count'] / subservice['count-step']) * subservice['price-min'];
									_value_max = (subservice['count'] / subservice['count-step']) * subservice['price-max'];
									content += '<span>' + rc_number_format(_value_min.toFixed(2)) + '</span>&thinsp;&minus;&thinsp;<span>' + rc_number_format(_value_max.toFixed(2)) + '</span> руб.';
								} else {
									_value = (subservice['count'] / subservice['count-step']) * subservice['price-min'];
									content += '<span>от ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
								}
							} else {
								if ('price-max' in subservice) {
									_value = (subservice['count'] / subservice['count-step']) * subservice['price-max'];
									content += '<span>до ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
								} else {
									content += '&nbsp;';
								}
							}
						}
						content += '</td>';

						content += '</tr>';

						flag = false;
					}

					content += '</tr>';
				} else {
					content += '<tr>';

					if (!checked && service['checked']) {
						checked = true;
					}

					// 1st
					content += '<td class="new-adv-service-col-1"><div class="new-adv-checkbox' + (service['enabled'] ? '' : ' disabled') + (service['checked'] ? ' checked' : '') + '" data-id="' + _index + '"></div></td>';

					// 2nd+3rd+3rd:photo
					content += '<td colspan="3" class="new-adv-service-col-2" style="font-weight: bold;">';
					content += service['label'];
					content += '</td>';

					// 4th
					content += '<td class="new-adv-service-col-3">';
					if ('qTip' in service) {
						content += '<span class="qtip-description" data-content="' + service['qTip'] + '"></span>';
					}
					content += '</td>';

					// 5th
					content += '<td class="new-adv-service-col-5"' + (flag ? ' style="border-top: 0 none; "' : '') + '>';
					if ('count-max' in service) {
						content += '<select id="select-' + _index + '"'+ (service['enabled'] ? '' : ' disabled="disabled"') + ' onchange="rc_updateSelect(this);" data-id="' + _index + '">';
						for (var _value = service['count-min']; _value <= service['count-max'];) {
							content += '<option value="' + _value + '"' + (service['count'] === _value ? ' selected="selected"' : '') + '>' + _value + '</option>';

							_value += service['count-step'];
							_value = parseFloat(_value.toFixed(3));
						}
						content += '</select><span class="unit">' + service['unit'] + '</span>';
					} else {
						if ('count' in service) {
							content += '<div class="input-text"><input type="text" value="' + service['count'] + '"'+ (service['enabled'] ? '' : ' disabled="disabled"') + ' data-id="' + _index + '" /></div><span class="unit">' + service['unit'] + '</span>'
						}
					}
					content += '</td>';

					// 6th
					content += '<td class="new-adv-service-col-4">';
					if ('price' in service) {
						if (typeof(service['price']) === 'array') {
							_value = (service['count'] / service['count-step']) * service['price'][0];
							content += (service['price'][0] > 0 ? '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.' : '<span>бесплатно</span>');
						} else if (typeof(service['price']) === 'string') {
							content += '<span>' + service['price'] + '</span>';
						} else {
							if (service['price'] > 0) {
								_value = service['price'];
								content += '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
							} else {
								content += '<span>бесплатно</span>';
							}
						}
					} else {
						if ('price-min' in service) {
							if ('price-max' in service) {
								_value_min = (service['count'] / service['count-step']) * service['price-min'];
								_value_max = (service['count'] / service['count-step']) * service['price-max'];
								content += '<span>' + rc_number_format(_value_min.toFixed(2)) + '</span>&thinsp;&minus;&thinsp;<span>' + rc_number_format(_value_max.toFixed(2)) + '</span> руб.';
							} else {
								_value = (service['count'] / service['count-step']) * service['price-min'];
								content += '<span>от ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
							}
						} else {
							if ('price-max' in service) {
								_value = (service['count'] / service['count-step']) * service['price-max'];
								content += '<span>до ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
							} else {
								content += '&nbsp;';
							}
						}
					}
					content += '</td>';

					content += '</tr>';
				}
			}

			switch (form_id) {
				case 'services':
					content = '<div class="new-adv-service" data-form_id="' + form_id + '"><a class="window-close window-close-service" href="#">закрыть</a><div class="new-adv-service-title new-adv-service-title--footnote"><span>Выбрать услугу</span></div><table>' + content + '</table><div class="new-adv-service-summ"><span>Всего:</span> <div><strong>0</strong> руб.</div></div><div class="new-adv-service-submit"><div style="position: absolute; top: 90px; left: 0; line-height: 53px;"><img src="/images/ic_file_xls.gif" alt="" style="margin-right: 7px; vertical-align: middle;" /><a href="/data/Prajs-na-uslugi-servisnoj-sluzhby-i-podklyuchenie-k-setyam-DNP.xlsx" style="color: #A38900; line-height: 26px;">Скачать прайс-лист на&nbsp;услуги сервисной службы и&nbsp;подключение к&nbsp;сетям ДНП</a></div><input' + (checked ? '' : ' class="disabled"') + ' type="button" value="Отправить заявку" /></div><div class="new-adv-service-footnote">Стоимость услуг и&nbsp;материалов на&nbsp;этом сайте указана ориентировочно. Окончательная стоимость определяется сметой.</div></div>';
					break;

				case 'prices':
					content = '<div class="new-adv-service" data-form_id="' + form_id + '"><a class="window-close window-close-service" href="#">закрыть</a><div class="new-adv-service-title" style="position: relative;">Выбрать продукты</div><table>' + content + '</table><div class="new-adv-service-summ"><span>Всего:</span> <div><strong>0</strong> руб.</div></div><div class="new-adv-service-submit"><input' + (checked ? '' : ' class="disabled"') + ' type="button" value="Отправить заявку" /></div></div>';
					break;
			}

			if ($('.window').length) {
				rc_windowClose();
			}

			rc_windowOpen(content);
/*
			// пример сообщения об ошибке
			$('.new-adv-service-col-2:contains("мёд")').parent().find('.input-text').addClass('error').append('<label class="error">Можно заказать до 20 л. меда за раз. Пчелы не успевают.</label>');
*/
			$('.window').addClass('new-adv-window');

			var $container = $('.window > .window-container > .new-adv-service');
			rc_recalculateSum($container.data('form_id'), $container);

			cuSel({
				changedEl: '.window select',
				visRows: 5,
				scrollArrows: true,
				jScrollPane_borderTop: 1,
				jScrollPane_borderBottom: 1
			});

			$('.window .qtip-description').each(function() {
				var $el = $(this);

				$el.qtip({
					content: {
						text: $el.data('content')
					},
					hide: {
						fixed: true
					},
					position: {
						my: 'top right',
						at: 'bottom left'
					},
					show: {
						solo: true
					},
					style: {
						classes: 'qtip-light-votchina',
						width: 500
					}
				});
			});
		});

		$('body').on('click', '.window .new-adv-checkbox, .fancybox-inner .new-adv-checkbox', function(_event) {
			_event.preventDefault();

			var $el = $(this);

			if ($el.hasClass('disabled')) {
				return false;
			}

			var $container = $el.parents('div.new-adv-service:eq(0)');
			var form_id = $container.data('form_id');

			$el.toggleClass('checked');
			var $INPUT = $el.find('> input[type="checkbox"]');
			if ($INPUT.length) {
				if ($el.hasClass('checked')) {
					$INPUT.prop('checked', true).attr('checked', 'checked');
				} else {
					$INPUT.prop('checked', false).removeAttr('checked');
				}
			}

			if (typeof(form_id) !== 'undefined' && form_id in rc_for_residents) {
				if (typeof($el.data('sub_id')) === 'undefined') {
					rc_for_residents[form_id][$el.data('id')]['checked'] = $el.hasClass('checked');
				} else {
					rc_for_residents[form_id][$el.data('id')]['sub'][$el.data('sub_id')]['checked'] = $el.hasClass('checked');
				}

				if ($('.window .new-adv-checkbox.checked, .fancybox-inner .new-adv-checkbox.checked').length) {
					$('.window .new-adv-service-submit input').removeClass('disabled');
				} else {
					$('.window .new-adv-service-submit input').addClass('disabled');
				}

				rc_recalculateSum(form_id, $container);
			}
		});

		$('body').on('click', '.window .toggle-three-column', function(_event) {
			_event.preventDefault();

			var $el = $(this);
			var windowContainer = $el.parents('.window-container:eq(0)');

			windowContainer.toggleClass('three-column').css({
				'top': '50%',
				'left': '50%',
				'margin-top': '0',
				'margin-left': '0'
			});

			rc_recalcWindow();
		});

		// Выбрать услугу | Цену -> Отправить заявку
		$('body').on('click', '.window .new-adv-service .new-adv-service-submit input', function(_event) {
			_event.preventDefault();

			var $el = $(this);
			var $container = $el.parents('div.new-adv-service:eq(0)');
			var form_id = $container.data('form_id');

			if ($el.hasClass('disabled')) {
				return false;
			}

			var sum = rc_recalculateSum(form_id, $container, true);
			var content = '';
			var list = {};

			content += '<table class="order-list">';

			for (var _index in rc_for_residents[form_id]) {
				var service = rc_for_residents[form_id][_index];

				if ('sub' in service) {
					var flagTitle = false;

					for (var _subindex in service['sub']) {
						var subservice = service['sub'][_subindex];

						if (!subservice['checked']) {
							continue;
						}

						if (!flagTitle) {
							content += '<tr><td colspan="4" class="label">' + service['label'] + '</td></tr>';

							list[_index] = {
								'label': service['label'],
								'sub': {}
							};

							flagTitle = true;
						}

						content += '<tr class="sub">';

						content += '<td class="label">' + subservice['label'] + '</td>';

						list[_index]['sub'][_subindex] = {
							'label': subservice['label']
						};

						content += '<td class="count">';
						if ('count' in subservice) {
							content += '<span>' + subservice['count'] + '</span>';

							list[_index]['sub'][_subindex]['count-step'] = subservice['count-step'];
							list[_index]['sub'][_subindex]['count'] = subservice['count'];

							if ('unit' in subservice) {
								content += ' ' + subservice['unit'];

								list[_index]['sub'][_subindex]['unit'] = subservice['unit'];
							}
						} else {
							content += '&nbsp;';
						}
						content += '</td>';

						content += '<td class="eq">';
						if ('count' in subservice) {
							content += '=';
						} else {
							content += '&nbsp;';
						}
						content += '</td>';

						content += '<td class="price">';
						if ('price' in subservice) {
							if (typeof(subservice['price']) === 'array') {
								_value = (subservice['count'] / subservice['count-step']) * subservice['price'][0];
								content += (subservice['price'][0] > 0 ? '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.' : '<span>бесплатно</span>');

								list[_index]['sub'][_subindex]['price'] = subservice['price'][0];
							} else if (typeof(subservice['price']) === 'string') {
								content += '<span>' + subservice['price'] + '</span>';

								list[_index]['sub'][_subindex]['price'] = subservice['price'];
							} else {
								if (subservice['price'] > 0) {
									_value = (subservice['count'] / subservice['count-step']) * subservice['price'];
									content += '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
								} else {
									content += '<span>бесплатно</span>';
								}

								list[_index]['sub'][_subindex]['price'] = subservice['price'];
							}
						} else {
							if ('price-min' in subservice) {
								list[_index]['sub'][_subindex]['price-min'] = subservice['price-min'];

								if ('price-max' in subservice) {
									_value_min = (subservice['count'] / subservice['count-step']) * subservice['price-min'];
									_value_max = (subservice['count'] / subservice['count-step']) * subservice['price-max'];
									content += '<span>' + rc_number_format(_value_min.toFixed(2)) + '</span>&thinsp;&minus;&thinsp;<span>' + rc_number_format(_value_max.toFixed(2)) + '</span> руб.';

									list[_index]['sub'][_subindex]['price-max'] = subservice['price-max'];
								} else {
									_value = (subservice['count'] / subservice['count-step']) * subservice['price-min'];
									content += '<span>от ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
								}
							} else {
								_value = (subservice['count'] / subservice['count-step']) * subservice['price-max'];
								content += '<span>до ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';

								list[_index]['sub'][_subindex]['price-max'] = subservice['price-max'];
							}
						}
						content += '</td>';

						content += '</tr>';
					}
				} else {
					if (!service['checked']) {
						continue;
					}

					content += '<tr>';

					content += '<td class="label">' + service['label'] + '</div>';

					list[_index] = {
						'label': service['label']
					};

					content += '<td class="count">';
					if ('count' in service) {
						content += '<span>' + service['count'] + '</span>';

						list[_index]['count-step'] = service['count-step'];
						list[_index]['count'] = service['count'];

						if ('unit' in service) {
							content += ' ' + service['unit'];

							list[_index]['unit'] = service['unit'];
						}
					} else {
						content += '&nbsp;';
					}
					content += '</td>';

					content += '<td class="eq">';
					if ('count' in service) {
						content += '=';
					}
					content += '</td>';

					content += '<td class="price">';
					if ('price' in service) {
						if (typeof(service['price']) === 'array') {
							_value = (service['count'] / service['count-step']) * service['price'][0];
							content += (service['price'][0] > 0 ? '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.' : '<span>бесплатно</span>');

							list[_index]['price'] = service['price'][0];
						} else if (typeof(service['price']) === 'string') {
							content += '<span>' + service['price'] + '</span>';

							list[_index]['price'] = service['price'];
						} else {
							if (service['price'] > 0) {
								_value = (service['count'] / service['count-step']) * service['price'];
								content += '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
							} else {
								content += '<span>бесплатно</span>';
							}

							list[_index]['price'] = service['price'];
						}
					} else {
						if ('price-min' in service) {
							list[_index]['price-min'] = service['price-min'];

							if ('price-max' in service) {
								_value_min = (service['count'] / service['count-step']) * service['price-min'];
								_value_max = (service['count'] / service['count-step']) * service['price-max'];
								content += '<span>' + rc_number_format(_value_min.toFixed(2)) + '</span>&thinsp;&minus;&thinsp;<span>' + rc_number_format(_value_max.toFixed(2)) + '</span> руб.';

								list[_index]['price-max'] = service['price-max'];
							} else {
								_value = (service['count'] / service['count-step']) * service['price-min'];
								content += '<span>от ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
							}
						} else {
							_value = (service['count'] / service['count-step']) * service['price-max'];
							content += '<span>до ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';

							list[_index]['price-max'] = service['price-max'];
						}

						content += ' руб.';
					}
					content += '</td>';

					content += '</tr>';
				}
			}

			content += '<tr class="sum"><td colspan="4"><div class="order-list-sum"><span>Всего:</span> <div><strong>' + sum + '</strong> руб.</div></div><div class="new-adv-service-submit"><a href="#" class="new-adv-link">Назад</a></div></td></tr>';

			content += '</table>';

			content = '<div class="new-adv-order-content"><a class="window-close window-close-service" href="#">закрыть</a><div class="new-adv-order-services" data-form_id="' + form_id + '"><div class="new-adv-order-title">Ваш заказ</div><div class="new-adv-services-list"><div class="new-adv-services-list-wrap"><div class="new-adv-services-list-inner">' + content + '</div></div></div></div><div class="new-adv-order-form"><div class="new-adv-order-title">Ваши контакты</div><form action="/for_residents/send/" method="POST" data-id="services"><input type="hidden" name="form[form_id]" value="' + form_id + '" /><input type="hidden" name="form[json]" value="' + encodeURIComponent(JSON.stringify(list)) + '" /><div class="new-adv-order-form-column"><div class="new-adv-order-form-row"><div class="new-adv-order-form-label">Ф.И.О.</div><div class="new-adv-order-form-input"><input type="text" name="form[name]" value="" /></div></div><div class="new-adv-order-form-row"><div class="new-adv-order-form-label">Телефон</div><div class="new-adv-order-form-input"><input type="text" name="form[phone]" value="" /></div></div><div class="new-adv-order-form-row"><div class="new-adv-order-form-label">Почта</div><div class="new-adv-order-form-input"><input type="text" name="form[e-mail]" value="" /></div></div><div class="new-adv-order-form-row"><div class="new-adv-order-form-label">Комментарий</div><div class="new-adv-order-form-input"><textarea name="form[comment]" rows="5" cols="10"></textarea></div></div>';

			if (form_id == 'prices') {
				content += '<div class="new-adv-order-form-row"><div class="new-adv-order-form-label"></div><div class="new-adv-order-form-input" style="position: relative; color: #444;"><div class="new-adv-checkbox toggle-three-column" style="float:left; margin:3px 10px 0 0;"><input type="checkbox" name="form[delivery]" value="1" /></div><div style="font-size:17px">Нужна доставка</div></div></div><div class="new-adv-order-form-column by-three-column"><div class="new-adv-order-form-row"><div class="new-adv-order-form-label" style="line-height: 1em; padding-top: 9px;">Адрес<br />доставки</div><div class="new-adv-order-form-input"><input type="text" name="form[address-delivery]" value="" /></div></div><div class="new-adv-order-form-row"><div class="new-adv-order-form-label" style="line-height: 1em; padding-top: 9px;">Дата<br />доставки</div><div class="new-adv-order-form-input"><input type="text" name="form[date-delivery]" value="" /></div></div><div class="new-adv-order-form-row"><div class="new-adv-order-form-label" style="line-height: 1em; padding-top: 9px;">Удобное<br />время</div><div class="new-adv-order-form-input"><input type="text" name="form[time-delivery]" value="" /></div></div></div>';
			}

			content += '<div class="new-adv-service-submit"><input type="submit" value="Отправить" /></div></div></form></div></div>';

			if ($('.window').length) {
				rc_windowClose();
			}

			rc_windowOpen(content);
			$('.window').addClass('new-adv-order');

			$('body').on('click', '.window a.new-adv-link', function(_event) {
				_event.preventDefault();

				$('.for_residents-' + $(this).parents('.new-adv-order-services:eq(0)').data('form_id')).click();
			});
		});

		$('body').on('submit', '.window .new-adv-order-content form', function() {
			var $form = $(this);
			var form_id = $form.data('id');

			var message = 'В ходе операции возникли ошибки';

			$form.find('.error').removeClass('error');
			$form.prepend('<input type="hidden" name="form[null]" value="1" />');

			$form.ajaxSubmit({
				type: 'POST',
				async: false,
				cache: false,
				dataType: 'json',
				error: function(_XHR, _status, _error) {
				},
				success: function(_response, _status, _XHR) {
					if (_response && 'status' in _response) {
						switch (_response['status']) {
							case 'success':
								if ('message' in _response) {
									message = _response['message'];

									if (typeof(form_id) !== 'undefined') {
										for (var _index in rc_for_residents[form_id]) {
											var service = rc_for_residents[form_id][_index];

											if ('sub' in service) {
												for (var _subindex in service['sub']) {
													var subservice = service['sub'][_subindex];

													if ('checked' in subservice) {
														rc_for_residents[form_id][_index]['sub'][_subindex]['checked'] = false;
													}
												}
											} else {
												if ('checked' in service) {
													rc_for_residents[form_id][_index]['checked'] = false;
												}
											}
										}
									}
								}
								break;

							default:
								if ('errors' in _response) {
									for (var _key in _response['errors']) {
										$form.find('input[name="form[' + _key + ']"], textarea[name="form[' + _key + ']"]').addClass('error');

										if ($form.hasClass('form-application-electricity') && _key === 'agree') {
											$form.find('input[name="form[' + _key + ']"], textarea[name="form[' + _key + ']"]').parents('.new-adv-order-form-input:eq(0)').addClass('error');
										}

										if ($form.hasClass('form__application--communications') && (_key === 'electricity' || _key === 'gas' || _key === 'internet')) {
											$form.find('input[name="form[' + _key + ']"], textarea[name="form[' + _key + ']"]').parents('.new-adv-order-form-input:eq(0)').addClass('error');
										}
									}

									message = '';
								}
								break;
						}
					}
				},
				complete: function(_event, _XHR, _options) {
					$form.find('input[name="form[null]"]').remove();

					if (message.length) {
						if ($('.window').length) {
							rc_windowClose();
						}

						rc_windowOpen('<div class="window-message">' + message + '</div>');
					}
				}
			});

			return false;
		});

		$('body').on('click', '.for_residents-consultation', function(_event) {
			_event.preventDefault();

			content = '<div class="new-adv-form new-adv-order-content"><div class="new-adv-order-title">Заказать консультацию</div><form action="/for_residents/send/" method="POST"><input type="hidden" name="form[form_id]" value="consultation" /><div class="new-adv-order-form-row"><div class="new-adv-order-form-label">Ф.И.О.</div><div class="new-adv-order-form-input"><input type="text" name="form[name]" value="" /></div></div><div class="new-adv-order-form-row"><div class="new-adv-order-form-label">Телефон</div><div class="new-adv-order-form-input"><input type="text" name="form[phone]" value="" /></div></div><div class="new-adv-order-form-row"><div class="new-adv-order-form-label">Почта</div><div class="new-adv-order-form-input"><input type="text" name="form[e-mail]" value="" /></div></div><div class="new-adv-order-form-row"><div class="new-adv-order-form-label">Вопросы</div><div class="new-adv-order-form-input"><textarea name="form[questions]" rows="5" cols="10"></textarea></div></div><div class="new-adv-service-submit"><input type="submit" value="Отправить" /></div></form></div>';

			if ($('.window').length) {
				rc_windowClose();
			}

			rc_windowOpen(content);
			$('.window').addClass('new-adv-order');
		});

		$('body').on('click', '.for_residents-problems', function(_event) {
			_event.preventDefault();

			content = '<div class="new-adv-form new-adv-order-content"><div class="new-adv-order-title">Сообщить о проблеме</div><form action="/for_residents/send/" method="POST"><input type="hidden" name="form[form_id]" value="problems" /><div class="new-adv-order-form-row"><div class="new-adv-order-form-label">Ф.И.О.</div><div class="new-adv-order-form-input"><input type="text" name="form[name]" value="" /></div></div><div class="new-adv-order-form-row"><div class="new-adv-order-form-label">Телефон</div><div class="new-adv-order-form-input"><input type="text" name="form[phone]" value="" /></div></div><div class="new-adv-order-form-row"><div class="new-adv-order-form-label">Почта</div><div class="new-adv-order-form-input"><input type="text" name="form[e-mail]" value="" /></div></div><div class="new-adv-order-form-row"><div class="new-adv-order-form-label">Проблемы</div><div class="new-adv-order-form-input"><textarea name="form[problems]" rows="5" cols="10"></textarea></div></div><div class="new-adv-service-submit"><input type="submit" value="Отправить" /></div></form></div>';

			if ($('.window').length) {
				rc_windowClose();
			}

			rc_windowOpen(content);
			$('.window').addClass('new-adv-order');
		});

		$('body').on('click', '.for_residents-delivery', function(_event) {
			_event.preventDefault();

			content = '<div class="new-deliv-form new-adv-order-content"><a class="window-close window-close-service" href="#">закрыть</a><div class="new-adv-order-title">Доставка</div><p>Делая заказ продуктов с эко-фермы, Вы можете быть уверены, что:</p><ul class="nobullets"><li><div class="num">1</div>Мы производим небольшой и качественный ассортимент только для своих! Все продукты строго местного происхождения, это позволяет им дольше сохранять пищевую ценность и полезные свойства. Они просто не успевают портиться!</li><li><div class="num">2</div>Овощи, ягоды, фрукты, зелень, грибы всегда свежие, так как собираются непосредственно «под заказ»</li><li><div class="num">3</div>Вкус наших фермерских продуктов настоящий, насыщенный, так как при выращивании мы не используем добавки для ускорения роста и химических удобрений. Фермеры применяют только натуральные органические удобрения, поэтому продукты чистые и безопасны для здоровья.</li><li><div class="num">4</div>При самом производстве, фермеры осознанно отказались от добавок, консервантов, глутаматов, подсластителей, загустителей и прочих имитаций вкуса для долгого хранения.</li></ul><p>Эко-ферма «Вотчина» — гарантия натуральных и экологически чистых продуктов, выращенных на плодородных землях Владимирского Ополья.</p><p>Вы получаете натуральные и свежие продукты прямо к столу!</p><div class="deliv-table">	<table><tr><td>На участок, в поселке Вотчина Country Club</td><td>бесплатно</td><td><a href="#" class="btn-order for_residents-prices">ЗАКАЗАТЬ</a></td></tr><tr><td>Москва</td><td>500 рублей</td><td><a href="#" class="btn-order for_residents-prices">ЗАКАЗАТЬ</a></td></tr><tr><td>Заказ по Москве от 5 000 рублей</td><td>бесплатно</td><td><a href="#" class="btn-order for_residents-prices">ЗАКАЗАТЬ</a></td></tr><tr><td>Групповой заказ от 10 000 рублей</td><td>бесплатно</td><td><a href="#" class="btn-order for_residents-prices">ЗАКАЗАТЬ</a></td></tr><tr><td>Московская область</td><td>по согласованию</td><td><a href="#" class="btn-order for_residents-prices">ЗАКАЗАТЬ</a></td></tr><tr><td>Другой город</td><td>по согласованию</td><td><a href="#" class="btn-order for_residents-prices">ЗАКАЗАТЬ</a></td></tr></table></div></div>';

			if ($('.window').length) {
				rc_windowClose();
			}

			rc_windowOpen(content);
			$('.window').addClass('new-adv-order');
		});

		$('body').on('click', '.action-form-application-electricity', function(_event) {
			_event.preventDefault();

			content = '<div class="new-adv-form new-adv-order-content"><div class="new-adv-order-title">Заявка на подключение к электросетям ДНП &laquo;Семь ключей&raquo;</div><form class="form-application-electricity" action="/for_residents/send/" method="POST"><input type="hidden" name="form[form_id]" value="application-electricity" /><div class="new-adv-order-form-row"><div class="new-adv-order-form-label">Ф.И.О.</div><div class="new-adv-order-form-input"><input type="text" name="form[name]" value="" /></div></div><div class="new-adv-order-form-row"><div class="new-adv-order-form-label">Телефон</div><div class="new-adv-order-form-input"><input type="text" name="form[phone]" value="" /></div></div><div class="new-adv-order-form-row"><div class="new-adv-order-form-label">Почта</div><div class="new-adv-order-form-input"><input type="text" name="form[e-mail]" value="" /></div></div><div class="new-adv-order-form-row"><div class="new-adv-order-form-label" style="line-height: 15px;">Номер участка</div><div class="new-adv-order-form-input"><input type="text" name="form[region]" value="" /></div></div><div class="new-adv-order-form-row"><div class="new-adv-order-form-label"></div><div class="new-adv-order-form-input" style="position: relative;"><div class="new-adv-checkbox" style="position: absolute; top: 8px; left: -21px;"><input type="checkbox" name="form[agree]" value="1" /></div>Прошу Вас подключить мой участок к электросетям ДНП &laquo;Семь ключей&raquo;</div></div><div class="new-adv-service-submit"><input type="submit" value="Отправить" /></div></form></div>';

			if ($('.window').length) {
				rc_windowClose();
			}

			rc_windowOpen(content);
			$('.window').addClass('new-adv-order');
		});

		if (window.location.search !== '') {
			var match = window.location.search.match(/[\&\?]form\:(prices|services)(\&|\=|$)/);
			if (match) {
				$('.for_residents-' + match[1]).trigger('click');
			}
		}
	});

	$(window).load(function() {
		var curHeight = 0;

		$('.new-adv-item-text').each(function() {
			if (curHeight < $(this).height()) {
				curHeight = $(this).height();
			}
		});
		$('.new-adv-item-text').css({'min-height': curHeight});
	});
})(jQuery);

function rc_number_format(_float, _thousands_sep) {
	if (typeof(_thousands_sep) === 'undefined') {
		_thousands_sep = ' ';
	}

	var sign = (parseFloat(_float) < .0 ? '-' : '');

	var base = Math.floor(Math.abs(parseFloat(_float)));
	var mantissa = Math.abs(_float).toString().substr(base.toString().length);

	_float = base.toString();

	var result = '';

	while (_float.length) {
		result = _float.substr(-3) + (result.length ? _thousands_sep : '') + result;

		_float = _float.slice(0, -3);
	}

	return sign + result + mantissa;
}

function rc_recalculateSum(_form_id, $_container, _flagReturn) {
	if (typeof(_flagReturn) === 'undefined') {
		_flagReturn = false;
	}

	var collector = {
		'price': 0,
		'price-min': 0,
		'price-max': 0,
		'from': false,
		'to': false,
		'range': false
	};

	$('.window .new-adv-checkbox.checked, .fancybox-inner .new-adv-checkbox.checked').not('.disabled').each(function() {
		var $checkbox = $(this);

		if (typeof($checkbox.data('sub_id')) === 'undefined') {
			var service = rc_for_residents[_form_id][$checkbox.data('id')];
		} else {
			var service = rc_for_residents[_form_id][$checkbox.data('id')]['sub'][$checkbox.data('sub_id')];
		}

		if ('price' in service) {
			if (typeof(service['price']) === 'number' && service['price'] > 0) {
				collector['price'] += (service['count'] / service['count-step']) * service['price'];
			}
		} else {
			var flagPriceMin = ('price-min' in service && typeof(service['price-min']) === 'number' && service['price-min'] > 0);
			var flagPriceMax = ('price-max' in service && typeof(service['price-max']) === 'number' && service['price-max'] > 0);

			if (flagPriceMin && flagPriceMax) {
				collector['price-min'] += (service['count'] / service['count-step']) * service['price-min'];
				collector['price-max'] += (service['count'] / service['count-step']) * service['price-max'];
				collector['range'] = true;
			} else {
				if (flagPriceMin) {
					collector['price-min'] += (service['count'] / service['count-step']) * service['price-min'];
					collector['from'] = true;
				}
				if (flagPriceMax) {
					collector['price-max'] += (service['count'] / service['count-step']) * service['price-max'];
					collector['to'] = true;
				}
			}
		}
	});

	var result = '';
	if (collector['range']) {
		_value_min = collector['price-min'] + collector['price'];
		_value_max = collector['price-max'] + collector['price'];
		result = rc_number_format(_value_min.toFixed(2)) + '&thinsp;&minus;&thinsp;' + rc_number_format(_value_max.toFixed(2));

		if (collector['from']) {
			result = 'от ' + result;
		} else if (collector['to']) {
			result = 'до ' + result;
		}
	} else if (collector['from']) {
		_value = collector['price-min'] + collector['price'];
		result = 'от ' + rc_number_format(_value.toFixed(2));
	} else if (collector['to']) {
		_value = collector['price-max'] + collector['price'];
		result = 'до ' + rc_number_format(_value.toFixed(2));
	} else {
		_value = collector['price'];
		result = rc_number_format(_value.toFixed(2));
	}

	if (_flagReturn) {
		return result;
	}

	$_container.find('.new-adv-service-summ strong').html(result);
}

function rc_updateSelect(_input) {
	var $input = $(_input);

	var $TR = $input.parents('tr:eq(0)');
	var $container = $TR.parents('div.new-adv-service:eq(0)');
	var form_id = $container.data('form_id');

	var array = $input.attr('id').match(/^select-(\d+?)(-(\d+?))?$/);

	switch (array.length) {
		case 4:
			var sub_id = array[3];

		case 2:
			var id = array[1];
			break;
	}

	if (typeof(sub_id) === 'undefined') {
		var service = rc_for_residents[form_id][id];
	} else {
		var service = rc_for_residents[form_id][id]['sub'][sub_id];
	}

	if ($input.val().length) {
		var value = parseFloat($input.val());
	} else {
		var value = 1;
	}

	if ('count-min' in service && value < service['count-min']) {
		value = service['count-min'];
	}
	if ('count-max' in service && value > service['count-max']) {
		value = service['count-max'];
	}

	$input.val(value);

	if (typeof(sub_id) === 'undefined') {
		rc_for_residents[form_id][id]['count'] = value;
	} else {
		rc_for_residents[form_id][id]['sub'][sub_id]['count'] = value;
	}

	var price = '';
	if ('price' in service) {
		if (typeof(service['price']) === 'array') {
			_value = (value / service['count-step']) * service['price'][0];
			price (service['price'][0] > 0 ? '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.' : '<span>бесплатно</span>');
		} else if (typeof(service['price']) === 'string') {
			price = '<span>' + service['price'] + '</span>';
		} else {
			if (service['price'] > 0) {
				_value = (value / service['count-step']) * service['price'];
				price = '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
			} else {
				price = '<span>бесплатно</span>';
			}
		}
	} else {
		if ('price-min' in service) {
			if ('price-max' in service) {
				_value_min = (value / service['count-step']) * service['price-min'];
				_value_max = (value / service['count-step']) * service['price-max'];
				price = '<span>' + rc_number_format(_value_min.toFixed(2)) + '</span>&thinsp;&minus;&thinsp;<span>' + rc_number_format(_value_max.toFixed(2)) + '</span> руб.';
			} else {
				_value = (value / service['count-step']) * service['price-min'];
				price = '<span>от ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
			}
		} else {
			if ('price-max' in service) {
				_value = (value / service['count-step']) * service['price-max'];
				price = '<span>до ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
			} else {
				price = '&nbsp;';
			}
		}
	}
	$TR.find('td:last-child').html(price);

	rc_recalculateSum(form_id, $container);
}

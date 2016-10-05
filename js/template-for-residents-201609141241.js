jQuery.getScript('/js/template-for-residents--data.js');

(function($) {
	function buildPriceList(_formId) {
		var content = '';
		var checked = false;

		for (var _index in window.rc_for_residents[_formId]) {
			var service = window.rc_for_residents[_formId][_index];

			if ('sub' in service) {
				content += '<tr class="sub-title">';

				// 1st+2nd+3rd
				content += '<td colspan="3" class="new-adv-service-subtitle">';
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

					content += '<tr class="sub' + (subservice['enabled'] ? '' : ' sub--disabled') + '">';

					if (!checked && subservice['checked']) {
						checked = true;
					}

					// 1st
					content += '<td class="new-adv-service-col-1"><input type="checkbox" id="' + _formId + '-' + _index + '-' + _subindex + '"' + (subservice['enabled'] ? '' : ' disabled="disabled"') + (subservice['checked'] ? ' checked="checked"' : '') + ' data-id="' + _index + '" data-sub_id="' + _subindex + '"><label for="' + _formId + '-' + _index + '-' + _subindex + '" class="checkbox"></label></td>';

					// 2nd
					content += '<td class="new-adv-service-col-2">';
					content += subservice['label'];
					content += '</td>';

					// 3rd:photo
					content += '<td class="new-adv-service-col-3">';
					content += ('photo' in subservice ? '<div class="product-img"><img src="/images/price-list/' + subservice['photo'] + '" alt="" width="67" height="67"></div>' : '&nbsp;');
					content += '</td>';

					// 4th:qTip
					content += '<td class="new-adv-service-col-3">';
					if ('qTip' in subservice) {
						content += '<span class="qtip-description" data-content="' + subservice['qTip'] + '"></span>';
					}
					content += '</td>';

					// 5th:count
					content += '<td class="new-adv-service-col-5">';
					if ('count-max' in subservice) {
						content += '<div class="input-text select-styled"><select'+ (subservice['enabled'] ? '' : ' disabled="disabled"') + ' data-id="' + _index + '" data-sub_id="' + _subindex + '">';
						for (var _value = subservice['count-min']; _value <= subservice['count-max'];) {
							content += '<option value="' + _value + '"' + (subservice['count'] === _value ? ' selected="selected"' : '') + '>' + _value + '</option>';

							_value += subservice['count-step'];
							_value = parseFloat(_value.toFixed(3));
						}
						content += '</select></div><span class="unit">' + subservice['unit'] + '</span>';
					} else {
						if ('count' in subservice) {
							content += '<div class="input-text"><input type="text" value="' + subservice['count'] + '"'+ (subservice['enabled'] ? '' : ' disabled="disabled"') + ' data-id="' + _index + '" data-sub_id="' + _subindex + '"><span class="down"><span class="s-sum-down"></span></span><span class="up"><span class="s-sum-up"></span></span></div><span class="unit">' + subservice['unit'] + '</span>'
						}
					}
					content += '</td>';

					// 6th:cost
					content += '<td class="new-adv-service-col-4">';
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
				content += '<td class="new-adv-service-col-1"><input type="checkbox" id="' + _formId + '-' + _index + '"' + (service['enabled'] ? '' : ' disabled="disabled"') + (service['checked'] ? ' checked="checked"' : '') + ' data-id="' + _index + '"><label for="' + _formId + '-' + _index + '" class="checkbox"></label></td>';

				// 2nd+3rd:photo
				content += '<td colspan="2" class="new-adv-service-col-2">';
				content += service['label'];
				content += '</td>';

				// 4th:qTip
				content += '<td class="new-adv-service-col-3">';
				if ('qTip' in service) {
					content += '<span class="qtip-description" data-content="' + service['qTip'] + '"></span>';
				}
				content += '</td>';

				// 5th:count
				content += '<td class="new-adv-service-col-5"' + (flag ? ' style="border-top: 0 none; "' : '') + '>';
				if ('count-max' in service) {
					content += '<div class="input-text select-styled"><select'+ (service['enabled'] ? '' : ' disabled="disabled"') + ' data-id="' + _index + '">';
					for (var _value = service['count-min']; _value <= service['count-max'];) {
						content += '<option value="' + _value + '"' + (service['count'] === _value ? ' selected="selected"' : '') + '>' + _value + '</option>';

						_value += service['count-step'];
						_value = parseFloat(_value.toFixed(3));
					}
					content += '</select></div><span class="unit">' + service['unit'] + '</span>';
				} else {
					if ('count' in service) {
						content += '<div class="input-text"><input type="text" value="' + service['count'] + '"'+ (service['enabled'] ? '' : ' disabled="disabled"') + ' data-id="' + _index + '"><span class="down"><span class="s-sum-down"></span></span><span class="up"><span class="s-sum-up"></span></span></div><span class="unit">' + service['unit'] + '</span>'
					}
				}
				content += '</td>';

				// 6th:cost
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

		content = '<table><tbody>' + content + '</tbody></table><div class="total">Всего: <span>0</span> руб.</div>';

		return {
			'content': content,
			'checked': checked
		};
	}

	function buildBasket(_formId) {
		var content = '';
		var data = {};

		var collector = {
			'price': 0,
			'price-min': 0,
			'price-max': 0,
			'from': false,
			'to': false,
			'range': false
		};

		content += '<table class="order-list"><tbody>';

		for (var _index in window.rc_for_residents[_formId]) {
			var service = window.rc_for_residents[_formId][_index];

			if ('sub' in service) {
				var flagTitle = false;

				for (var _subindex in service['sub']) {
					var subservice = service['sub'][_subindex];

					if (!subservice['checked']) {
						continue;
					}

					if (!flagTitle) {
						content += '<tr><td colspan="4" class="label">' + service['label'] + '</td></tr>';

						data[_index] = {
							'label': service['label'],
							'sub': {}
						};

						flagTitle = true;
					}

					content += '<tr class="sub">';

					content += '<td class="label">' + subservice['label'] + '</td>';

					data[_index]['sub'][_subindex] = {
						'label': subservice['label']
					};

					content += '<td class="count">';
					if ('count' in subservice) {
						content += '<span>' + subservice['count'] + '</span>';

						data[_index]['sub'][_subindex]['count-step'] = subservice['count-step'];
						data[_index]['sub'][_subindex]['count'] = subservice['count'];

						if ('unit' in subservice) {
							content += ' ' + subservice['unit'];

							data[_index]['sub'][_subindex]['unit'] = subservice['unit'];
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

							data[_index]['sub'][_subindex]['price'] = subservice['price'][0];
						} else if (typeof(subservice['price']) === 'string') {
							content += '<span>' + subservice['price'] + '</span>';

							data[_index]['sub'][_subindex]['price'] = subservice['price'];
						} else {
							if (subservice['price'] > 0) {
								_value = (subservice['count'] / subservice['count-step']) * subservice['price'];
								content += '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
							} else {
								content += '<span>бесплатно</span>';
							}

							data[_index]['sub'][_subindex]['price'] = subservice['price'];
						}
					} else {
						if ('price-min' in subservice) {
							data[_index]['sub'][_subindex]['price-min'] = subservice['price-min'];

							if ('price-max' in subservice) {
								_value_min = (subservice['count'] / subservice['count-step']) * subservice['price-min'];
								_value_max = (subservice['count'] / subservice['count-step']) * subservice['price-max'];
								content += '<span>' + rc_number_format(_value_min.toFixed(2)) + '</span>&thinsp;&minus;&thinsp;<span>' + rc_number_format(_value_max.toFixed(2)) + '</span> руб.';

								data[_index]['sub'][_subindex]['price-max'] = subservice['price-max'];
							} else {
								_value = (subservice['count'] / subservice['count-step']) * subservice['price-min'];
								content += '<span>от ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
							}
						} else {
							_value = (subservice['count'] / subservice['count-step']) * subservice['price-max'];
							content += '<span>до ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';

							data[_index]['sub'][_subindex]['price-max'] = subservice['price-max'];
						}
					}
					content += '</td>';

					content += '</tr>';

					if ('price' in subservice) {
						if (typeof(subservice['price']) === 'number' && subservice['price'] > 0) {
							collector['price'] += (subservice['count'] / subservice['count-step']) * subservice['price'];
						}
					} else {
						var flagPriceMin = ('price-min' in subservice && typeof(subservice['price-min']) === 'number' && subservice['price-min'] > 0);
						var flagPriceMax = ('price-max' in subservice && typeof(subservice['price-max']) === 'number' && subservice['price-max'] > 0);

						if (flagPriceMin && flagPriceMax) {
							collector['price-min'] += (subservice['count'] / subservice['count-step']) * subservice['price-min'];
							collector['price-max'] += (subservice['count'] / subservice['count-step']) * subservice['price-max'];
							collector['range'] = true;
						} else {
							if (flagPriceMin) {
								collector['price-min'] += (subservice['count'] / subservice['count-step']) * subservice['price-min'];
								collector['from'] = true;
							}
							if (flagPriceMax) {
								collector['price-max'] += (subservice['count'] / subservice['count-step']) * subservice['price-max'];
								collector['to'] = true;
							}
						}
					}
				}
			} else {
				if (!service['checked']) {
					continue;
				}

				content += '<tr>';

				content += '<td class="label">' + service['label'] + '</div>';

				data[_index] = {
					'label': service['label']
				};

				content += '<td class="count">';
				if ('count' in service) {
					content += '<span>' + service['count'] + '</span>';

					data[_index]['count-step'] = service['count-step'];
					data[_index]['count'] = service['count'];

					if ('unit' in service) {
						content += ' ' + service['unit'];

						data[_index]['unit'] = service['unit'];
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

						data[_index]['price'] = service['price'][0];
					} else if (typeof(service['price']) === 'string') {
						content += '<span>' + service['price'] + '</span>';

						data[_index]['price'] = service['price'];
					} else {
						if (service['price'] > 0) {
							_value = (service['count'] / service['count-step']) * service['price'];
							content += '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
						} else {
							content += '<span>бесплатно</span>';
						}

						data[_index]['price'] = service['price'];
					}
				} else {
					if ('price-min' in service) {
						data[_index]['price-min'] = service['price-min'];

						if ('price-max' in service) {
							_value_min = (service['count'] / service['count-step']) * service['price-min'];
							_value_max = (service['count'] / service['count-step']) * service['price-max'];
							content += '<span>' + rc_number_format(_value_min.toFixed(2)) + '</span>&thinsp;&minus;&thinsp;<span>' + rc_number_format(_value_max.toFixed(2)) + '</span> руб.';

							data[_index]['price-max'] = service['price-max'];
						} else {
							_value = (service['count'] / service['count-step']) * service['price-min'];
							content += '<span>от ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
						}
					} else {
						_value = (service['count'] / service['count-step']) * service['price-max'];
						content += '<span>до ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';

						data[_index]['price-max'] = service['price-max'];
					}

					content += ' руб.';
				}
				content += '</td>';

				content += '</tr>';

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
			}
		}

		var sum = '';
		if (collector['range']) {
			_value_min = collector['price-min'] + collector['price'];
			_value_max = collector['price-max'] + collector['price'];
			sum = rc_number_format(_value_min.toFixed(2)) + '&thinsp;&minus;&thinsp;' + rc_number_format(_value_max.toFixed(2));

			if (collector['from']) {
				sum = 'от ' + sum;
			} else if (collector['to']) {
				sum = 'до ' + sum;
			}
		} else if (collector['from']) {
			_value = collector['price-min'] + collector['price'];
			sum = 'от ' + rc_number_format(_value.toFixed(2));
		} else if (collector['to']) {
			_value = collector['price-max'] + collector['price'];
			sum = 'до ' + rc_number_format(_value.toFixed(2));
		} else {
			_value = collector['price'];
			sum = rc_number_format(_value.toFixed(2));
		}

		content += '<tr class="sum"><td colspan="4"><div class="order-list-sum"><span>Всего:</span> <div><strong>' + sum + '</strong> руб.</div></div><div class="new-adv-service-submit"><a href="#modal-' + _formId + '" class="btn-small active fancybox-modal--for-residents"><span>Назад</span></a></div></td></tr></tbody></table>';

		return {
			'content': content,
			'data': data
		};
	}

	function recalculatePriceList(_formId, _$container, _flagReturn) {
		if (typeof(_flagReturn) === 'undefined') {
			_flagReturn = false;
		}
		var checked = false;

		var collector = {
			'price': 0,
			'price-min': 0,
			'price-max': 0,
			'from': false,
			'to': false,
			'range': false
		};

		_$container.find('input:checked').not(':disabled').each(function() {
			checked = true;

			var $checkbox = $(this);

			if (typeof($checkbox.data('sub_id')) === 'undefined') {
				var service = window.rc_for_residents[_formId][$checkbox.data('id')];
			} else {
				var service = window.rc_for_residents[_formId][$checkbox.data('id')]['sub'][$checkbox.data('sub_id')];
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

		_$container.find('.total span').html(result);

		if (checked) {
			_$container.parent().find('a[href="#modal-' + _formId + '-order"]').removeClass('fancybox-modal--disabled');
		} else {
			_$container.parent().find('a[href="#modal-' + _formId + '-order"]').addClass('fancybox-modal--disabled');
		}
	}

	function validateINPUT(_$INPUT, _formId, _service) {
		var value = ('count-min' in _service ? _service['count-min'] : 1);
		if (_$INPUT.val().length) {
			value = parseFloat(_$INPUT.val());
		}

		if ('count-min' in _service && value < _service['count-min']) {
			value = _service['count-min'];
		}
		if ('count-max' in _service && value > _service['count-max']) {
			value = _service['count-max'];
		}

		if (typeof(_$INPUT.data('sub_id')) === 'undefined') {
			window.rc_for_residents[_formId][_$INPUT.data('id')]['count'] = value;
		} else {
			window.rc_for_residents[_formId][_$INPUT.data('id')]['sub'][_$INPUT.data('sub_id')]['count'] = value;
		}

		_$INPUT.val(value);

		var price = '';
		if ('price' in _service) {
			if (typeof(_service['price']) === 'array') {
				_value = (value / _service['count-step']) * _service['price'][0];
				price = (_service['price'][0] > 0 ? '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.' : '<span>бесплатно</span>');
			} else if (typeof(_service['price']) === 'string') {
				price = '<span>' + _service['price'] + '</span>';
			} else {
				if (_service['price'] > 0) {
					_value = (value / _service['count-step']) * _service['price'];
					price = '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
				} else {
					price = '<span>бесплатно</span>';
				}
			}
		} else {
			if ('price-min' in _service) {
				if ('price-max' in _service) {
					_value_min = (value / _service['count-step']) * _service['price-min'];
					_value_max = (value / _service['count-step']) * _service['price-max'];
					price = '<span>' + rc_number_format(_value_min.toFixed(2)) + '</span>&thinsp;&minus;&thinsp;<span>' + rc_number_format(_value_max.toFixed(2)) + '</span> руб.';
				} else {
					_value = (value / _service['count-step']) * _service['price-min'];
					price = '<span>от ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
				}
			} else {
				if ('price-max' in _service) {
					_value = (value / _service['count-step']) * _service['price-max'];
					price = '<span>до ' + rc_number_format(_value.toFixed(2)) + '</span> руб.';
				} else {
					price = '&nbsp;';
				}
			}
		}

		var $TR = _$INPUT.parents('tr:eq(0)');
		$TR.find('td:last-child').html(price);
	}

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

	$(document).ready(function() {
		$('.fancybox-modal--for-residents').fancybox({
			closeEffect: 'none',
			openEffect: 'none',
			padding: 0,
			wrapCSS: 'popup-modal',
			afterLoad: function(_obj) {
				window.flag_blockTransitionScroll = true;

				switch (_obj['href']) {
					case '#modal-prices-order':
					case '#modal-services-order':
						var formId = _obj['href'].match(/^#modal-(.+?)-order$/i)[1];

						var $FORM = $(_obj['content']).find('form');
						if ($FORM.length) {
							$FORM[0].reset();
							$FORM.find('.new-adv-order-form-hint').remove();
						}

						var $popupBody = $(_obj['content']).find('.popup-body');

						var basket = buildBasket(formId);
						$popupBody.data('form_id', formId).find('.new-adv-services-list-inner').html(basket['content']);

						$popupBody.find('form').prepend('<input type="hidden" name="form[json]" value="' + encodeURIComponent(JSON.stringify(basket['data'])) + '"/>');
						$popupBody.find('form').prepend('<input type="hidden" name="form[form_id]" value="' + formId + '"/>');
						break;

					case '#modal-prices':
					case '#modal-services':
						var formId = _obj['href'].match(/^#modal-(.+?)$/i)[1];

						var $popupBody = $(_obj['content']).find('.popup-body');

						var priceList = buildPriceList(formId);
						if (priceList['checked']) {
							$popupBody.parent().find('a[href="#modal-' + formId + '-order"]').removeClass('fancybox-modal--disabled');
						}
						$popupBody.data('form_id', formId).html(priceList['content']);
						recalculatePriceList(formId, $popupBody);
						break;
				}
			},
			afterShow: function() {
				switch (this.href) {
					case '#modal-prices-order':
					case '#modal-services-order':
						var $FORM = $(this.content).find('form'),
							formTitle = '?';

						if ($FORM.length && typeof($FORM.data('title')) !== 'undefined') {
							formTitle = $FORM.data('title');
						}

//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'open\');');
						if (typeof(ga) != 'undefined') {
							ga('send', 'event', 'Контакты', 'Открытие онлайн формы');
							ga('send', 'event', 'form ' + formTitle, 'open');
						}

						$('.fancybox-overlay').on('click.analytics', function(_event) {
							if ($(_event.target).hasClass('fancybox-overlay')) {
//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'close\', \'mask\');');
								if (typeof(ga) != 'undefined') {
									ga('send', 'event', 'form ' + formTitle, 'close', 'mask');
								}
							}
						});

						$('.fancybox-wrap .fancybox-close').on('click.analytics', function(_event) {
							if ($(_event.target).hasClass('fancybox-close')) {
//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'close\', \'icon\');');
								if (typeof(ga) != 'undefined') {
									ga('send', 'event', 'form ' + formTitle, 'close', 'icon');
								}
							}
						});
						break;
				}
			},
			beforeClose: function() {
				window.flag_blockTransitionScroll = false;
			},
			beforeShow: function() {
				$('.fancybox-overlay').css({
					//'top': '100px',
					'background': 'rgba(41, 41, 41, 0.8)'
				});
			}
		});

		$('body').on('click', '.fancybox-modal--for-residents.fancybox-modal--disabled', function(_event) {
			_event.preventDefault();
			_event.stopImmediatePropagation();
		});

		$('body').on('change', '.fancybox-wrap #modal-prices input[type="checkbox"], .fancybox-wrap #modal-services input[type="checkbox"]', function(_event) {
			var $checkbox = $(this);

			var $container = $checkbox.parents('.popup-body:eq(0)');
			var formId = $container.data('form_id');

			if (typeof($checkbox.data('sub_id')) === 'undefined') {
				window.rc_for_residents[formId][$checkbox.data('id')]['checked'] = $checkbox.prop('checked');
			} else {
				window.rc_for_residents[formId][$checkbox.data('id')]['sub'][$checkbox.data('sub_id')]['checked'] = $checkbox.prop('checked');
			}

			recalculatePriceList(formId, $container);
		});

		$('body').on('click', '.fancybox-wrap #modal-prices .input-text .down, .fancybox-wrap #modal-services .input-text .down', function(_event) {
			_event.preventDefault();

			var $INPUT = $(this).siblings('input:eq(0)');

			var $container = $INPUT.parents('.popup-body:eq(0)');
			var formId = $container.data('form_id');

			if (typeof($INPUT.data('sub_id')) === 'undefined') {
				var service = window.rc_for_residents[formId][$INPUT.data('id')];
			} else {
				var service = window.rc_for_residents[formId][$INPUT.data('id')]['sub'][$INPUT.data('sub_id')];
			}

			var value = ('count-min' in service ? service['count-min'] : 1);
			if ($INPUT.val().length) {
				value = parseFloat($INPUT.val());
			}
			value -= service['count-step'];

			$INPUT.val(value);

			validateINPUT($INPUT, formId, service);

			recalculatePriceList(formId, $container);
		});

		$('body').on('click', '.fancybox-wrap #modal-prices .input-text .up, .fancybox-wrap #modal-services .input-text .up', function(_event) {
			_event.preventDefault();

			var $INPUT = $(this).siblings('input:eq(0)');

			var $container = $INPUT.parents('.popup-body:eq(0)');
			var formId = $container.data('form_id');

			if (typeof($INPUT.data('sub_id')) === 'undefined') {
				var service = window.rc_for_residents[formId][$INPUT.data('id')];
			} else {
				var service = window.rc_for_residents[formId][$INPUT.data('id')]['sub'][$INPUT.data('sub_id')];
			}

			var value = ('count-min' in service ? service['count-min'] : 1);
			if ($INPUT.val().length) {
				value = parseFloat($INPUT.val());
			}
			value += service['count-step'];

			$INPUT.val(value);

			validateINPUT($INPUT, formId, service);

			recalculatePriceList(formId, $container);
		});

		$('body').on('keyup', '.fancybox-wrap #modal-prices .input-text input, .fancybox-wrap #modal-services .input-text input', function(_event) {
			_event.preventDefault();

			var $INPUT = $(this);

			var $container = $INPUT.parents('.popup-body:eq(0)');
			var formId = $container.data('form_id');

			if (typeof($INPUT.data('sub_id')) === 'undefined') {
				var service = window.rc_for_residents[formId][$INPUT.data('id')];
			} else {
				var service = window.rc_for_residents[formId][$INPUT.data('id')]['sub'][$INPUT.data('sub_id')];
			}

			validateINPUT($INPUT, formId, service);

			recalculatePriceList(formId, $container);
		});
/*
		$('body').on('blur', '.fancybox-wrap #modal-prices .input-text input, .fancybox-wrap #modal-services .input-text input', function(_event) {
			var $INPUT = $(this);

			var $container = $INPUT.parents('.popup-body:eq(0)');
			var formId = $container.data('form_id');

			if (typeof($INPUT.data('sub_id')) === 'undefined') {
				$INPUT.val(rc_for_residents[formId][$INPUT.data('id')]['count']);
			} else {
				$INPUT.val(rc_for_residents[formId][$INPUT.data('id')]['sub'][$INPUT.data('sub_id')]['count']);
			}
		});
*/
		$('body').on('change', '.fancybox-wrap #modal-prices select, .fancybox-wrap #modal-services select', function(_event) {
			var $SELECT = $(this);

			var $TR = $SELECT.parents('tr:eq(0)');
			var $container = $TR.parents('.popup-body:eq(0)');
			var formId = $container.data('form_id');

			if (typeof($SELECT.data('sub_id')) === 'undefined') {
				var service = window.rc_for_residents[formId][$SELECT.data('id')];
			} else {
				var service = window.rc_for_residents[formId][$SELECT.data('id')]['sub'][$SELECT.data('sub_id')];
			}

			var value = ('count-min' in service ? service['count-min'] : 1);
			if ($SELECT.val().length) {
				value = parseFloat($SELECT.val());
			}

			if ('count-min' in service && value < service['count-min']) {
				value = service['count-min'];
			}
			if ('count-max' in service && value > service['count-max']) {
				value = service['count-max'];
			}

			$SELECT.val(value);

			if (typeof($SELECT.data('sub_id')) === 'undefined') {
				window.rc_for_residents[formId][$SELECT.data('id')]['count'] = value;
			} else {
				window.rc_for_residents[formId][$SELECT.data('id')]['sub'][$SELECT.data('sub_id')]['count'] = value;
			}

			var price = '';
			if ('price' in service) {
				if (typeof(service['price']) === 'array') {
					_value = (value / service['count-step']) * service['price'][0];
					price = (service['price'][0] > 0 ? '<span>' + rc_number_format(_value.toFixed(2)) + '</span> руб.' : '<span>бесплатно</span>');
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

			recalculatePriceList(formId, $container);
		});

		// Форма: Консультация | Проблемы
		$('body').on('submit', '.fancybox-wrap #form-consultation form, .fancybox-wrap #form-problems form', function() {
			var $FORM = $(this);
			if ($FORM.hasClass('rc--processed')) {
				return false;
			}

			var formTitle = '?';
			if (typeof($FORM.data('title')) !== 'undefined') {
				formTitle = $FORM.data('title');
			}

//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'submit\');');
			if (typeof(ga) != 'undefined') {
				ga('send', 'event', 'form ' + formTitle, 'submit');
			}

			var $button = $FORM.find('[type="submit"]');
			var button_backup = $button.val();

			$FORM.addClass('rc--processed');
			$FORM.prepend('<input class="rc-field--null" type="hidden" name="form[null]" value="1">');

			$button.val('Отправка...');

			$FORM.find('.new-adv-order-form-hint').remove();

			$FORM.ajaxSubmit({
				url: '/for_residents/send/',
				type: 'POST',
				async: false,
				cache: false,
				dataType: 'json',
				error: function(_XHR, _status, _error) {
				},
				success: function(_response, _status, _XHR) {
					if ('errors' in _response) {
						for (var _key in _response['errors']) {
							var $block_ = $FORM.find('[name="form[' + _key + ']"]').parent();

							var $hint = $block_.find('.new-adv-order-form-hint');
							if ($hint.length === 0) {
								$hint = $('<div class="new-adv-order-form-hint"></div>');
								$block_.append($hint);
							}
							$hint.html(_response['errors'][_key]);

//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'error\', \'' + _response['errors'][_key] + '\');');
							if (typeof(ga) != 'undefined') {
								ga('send', 'event', 'form ' + formTitle, 'error', _response['errors'][_key]);
							}
						}
					}

					if ('status' in _response && _response['status'] === 'success') {
						$('.fancybox-overlay, .fancybox-wrap .fancybox-close').off('click.analytics');
//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'success\');');
						if (typeof(ga) != 'undefined') {
							ga('send', 'event', 'form ' + formTitle, 'success');
						}
					}

					if ('message' in _response) {
						var $template = $('#form--message').clone();
						$template.find('.popup-message').html(_response['message']);

						$.fancybox($template, {
							closeEffect: 'none',
							openEffect: 'none',
							padding: 0,
							wrapCSS: 'popup-modal',
							afterLoad: function() {
								window.flag_blockTransitionScroll = true;
							},
							beforeClose: function() {
								window.flag_blockTransitionScroll = false;
							},
							beforeShow: function() {
								$('.fancybox-overlay').css({
									//'top': '100px',
									'background': 'rgba(41, 41, 41, 0.8)'
								});
							}
						});
					}
				},
				complete: function(_XHR, _status) {
					$FORM.find('.rc-field--null').remove();
					$FORM.removeClass('rc--processed');

					$button.val(button_backup);
				}
			});

			return false;
		});

		// Форма: Оформление заказа экопродуктов/услуг
		$('body').on('submit', '.fancybox-wrap #modal-prices-order form, .fancybox-wrap #modal-services-order form', function() {
			var $FORM = $(this);
			if ($FORM.hasClass('rc--processed')) {
				return false;
			}

			var formTitle = '?';
			if (typeof($FORM.data('title')) !== 'undefined') {
				formTitle = $FORM.data('title');
			}

//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'submit\');');
			if (typeof(ga) != 'undefined') {
				ga('send', 'event', 'form ' + formTitle, 'submit');
			}

			var $button = $FORM.find('[type="submit"]');
			var button_backup = $button.val();

			$FORM.addClass('rc--processed');
			$FORM.prepend('<input class="rc-field--null" type="hidden" name="form[null]" value="1">');

			$button.val('Отправка...');

			$FORM.find('.new-adv-order-form-hint').remove();

			$FORM.ajaxSubmit({
				url: '/for_residents/send/',
				type: 'POST',
				async: false,
				cache: false,
				dataType: 'json',
				error: function(_XHR, _status, _error) {
				},
				success: function(_response, _status, _XHR) {
					if ('errors' in _response) {
						for (var _key in _response['errors']) {
							var $block_ = $FORM.find('[name="form[' + _key + ']"]').parent();

							var $hint = $block_.find('.new-adv-order-form-hint');
							if ($hint.length === 0) {
								$hint = $('<div class="new-adv-order-form-hint"></div>');
								$block_.append($hint);
							}
							$hint.html(_response['errors'][_key]);

//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'error\', \'' + _response['errors'][_key] + '\');');
							if (typeof(ga) != 'undefined') {
								ga('send', 'event', 'form ' + formTitle, 'error', _response['errors'][_key]);
							}
						}
					}

					if ('status' in _response && _response['status'] === 'success') {
						$('.fancybox-overlay, .fancybox-wrap .fancybox-close').off('click.analytics');
//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'success\');');
						if (typeof(ga) != 'undefined') {
							ga('send', 'event', 'form ' + formTitle, 'success');
						}
					}

					if ('message' in _response) {
						var $template = $('#form--message').clone();
						$template.find('.popup-message').html(_response['message']);

						$.fancybox($template, {
							closeEffect: 'none',
							openEffect: 'none',
							padding: 0,
							wrapCSS: 'popup-modal',
							afterLoad: function() {
								window.flag_blockTransitionScroll = true;
							},
							beforeClose: function() {
								window.flag_blockTransitionScroll = false;
							},
							beforeShow: function() {
								$('.fancybox-overlay').css({
									//'top': '100px',
									'background': 'rgba(41, 41, 41, 0.8)'
								});
							}
						});
					}
				},
				complete: function(_XHR, _status) {
					$FORM.find('.rc-field--null').remove();
					$FORM.removeClass('rc--processed');

					$button.val(button_backup);
				}
			});

			return false;
		});

		// Форма: Заявка на подключение к электросетям ДНП «Семь ключей»
		$('body').on('submit', '.fancybox-wrap #form-electricity form', function() {
			var $FORM = $(this);
			if ($FORM.hasClass('rc--processed')) {
				return false;
			}

			var formTitle = '?';
			if (typeof($FORM.data('title')) !== 'undefined') {
				formTitle = $FORM.data('title');
			}

//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'submit\');');
			if (typeof(ga) != 'undefined') {
				ga('send', 'event', 'form ' + formTitle, 'submit');
			}

			var $button = $FORM.find('[type="submit"]');
			var button_backup = $button.val();

			$FORM.addClass('rc--processed');
			$FORM.prepend('<input class="rc-field--null" type="hidden" name="form[null]" value="1">');

			$button.val('Отправка...');

			$FORM.find('.new-adv-order-form-hint').remove();
			$FORM.find('.checkbox--error').removeClass('checkbox--error');

			$FORM.ajaxSubmit({
				url: '/for_residents/send/',
				type: 'POST',
				async: false,
				cache: false,
				dataType: 'json',
				error: function(_XHR, _status, _error) {
				},
				success: function(_response, _status, _XHR) {
					if ('errors' in _response) {
						for (var _key in _response['errors']) {
							switch (_key) {
								case 'agree':
									var $block_ = $FORM.find('[name="form[' + _key + ']"]').siblings('label:eq(0)');

									$block_.addClass('checkbox--error');

//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'error\', \'Необходимо дать согласие на подключение\');');
									if (typeof(ga) != 'undefined') {
										ga('send', 'event', 'form ' + formTitle, 'error', 'Необходимо дать согласие на подключение');
									}
									break;

								default:
									var $block_ = $FORM.find('[name="form[' + _key + ']"]').parent();

									var $hint = $block_.find('.new-adv-order-form-hint');
									if ($hint.length === 0) {
										$hint = $('<div class="new-adv-order-form-hint"></div>');
										$block_.append($hint);
									}
									$hint.html(_response['errors'][_key]);

//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'error\', \'' + _response['errors'][_key] + '\');');
									if (typeof(ga) != 'undefined') {
										ga('send', 'event', 'form ' + formTitle, 'error', _response['errors'][_key]);
									}
							}
						}
					}

					if ('status' in _response && _response['status'] === 'success') {
						$('.fancybox-overlay, .fancybox-wrap .fancybox-close').off('click.analytics');
//window.alert('ga(\'send\', \'event\', \'form ' + formTitle + '\', \'success\');');
						if (typeof(ga) != 'undefined') {
							ga('send', 'event', 'form ' + formTitle, 'success');
						}
					}

					if ('message' in _response) {
						var $template = $('#form--message').clone();
						$template.find('.popup-message').html(_response['message']);

						$.fancybox($template, {
							closeEffect: 'none',
							openEffect: 'none',
							padding: 0,
							wrapCSS: 'popup-modal',
							afterLoad: function() {
								window.flag_blockTransitionScroll = true;
							},
							beforeClose: function() {
								window.flag_blockTransitionScroll = false;
							},
							beforeShow: function() {
								$('.fancybox-overlay').css({
									//'top': '100px',
									'background': 'rgba(41, 41, 41, 0.8)'
								});
							}
						});
					}
				},
				complete: function(_XHR, _status) {
					$FORM.find('.rc-field--null').remove();
					$FORM.removeClass('rc--processed');

					$button.val(button_backup);
				}
			});

			return false;
		});
/*
		if (window.location.search !== '') {
			var match = window.location.search.match(/[\&\?]form\:(prices|services)(\&|\=|$)/);
			if (match) {
				$('.fancybox-modal--for-residents[href="#modal-' + match[1] + '"]:eq(0)').trigger('click');
			}
		}
*/
	});
})(jQuery);

function rc_calculator_update(_$FORM, _$el) {
	var json = (typeof(_$el) !== 'undefined' ? _$el.data('json') : _$FORM.find('.calc-banks > ul > li > input[checked]').data('json'));

	for (var id in json) {
		rc_calculator_update_field(id, json[id], _$FORM);
	}
}

function rc_calculator_update_field(_id, _data, _$FORM) {
	var $INPUT = _$FORM.find('input.field-' + _id);
	var value = parseFloat($INPUT.val());
	if (isNaN(value)) {
		value = 0.0;
	}
	var $label = $INPUT.parents('.new-adv-order-form-input:eq(0)').prev('.new-adv-order-form-label');
	if ('value' in _data) {
		$INPUT.val(_data['value']);
	} else if ('min' in _data) {
		if ('max' in _data) {
			if (value >= _data['min'] && value <= _data['max']) {
				$INPUT.val(value);
			} else {
				$INPUT.val(_data['min']);
			}
		} else {
			if (value >= _data['min']) {
				$INPUT.val(value);
			} else {
				$INPUT.val(_data['min']);
			}
		}
	}
	if ('hint' in _data) {
		var $hint = $label.find('> p');
		if ($hint.length == 0) {
			$hint = $('<p/>', {});
			$label.append($hint);
		}
		$hint.html(_data['hint']);
	} else {
		$label.find('> p').remove();
	}

	switch (_id) {
		case 'interest_rate':
			$INPUT.prop('disabled', false).removeAttr('disabled');
			if (_$FORM.find('.calc-banks > ul > li:last > input').prop('checked')) {
				if (isNaN(parseFloat($INPUT.val()))) {
					$INPUT.parent().addClass('new-adv-order-form-input--error');
				} else {
					$INPUT.parent().removeClass('new-adv-order-form-input--error')
				}

				$INPUT.focus();
			} else {
				$INPUT.parent().removeClass('new-adv-order-form-input--error');

				if ('value' in _data) {
					$INPUT.prop('disabled', true).attr('disabled', 'disabled');
				}
			}
			break;
	}
}

function rc_calculator_validate_field(_value, _data) {
	var result = true;

	if ('value' in _data) {
		if (_value != _data['value']) {
			result = false;
		}
	} else if ('min' in _data) {
		if ('max' in _data) {
			if (!(_value >= _data['min'] && _value <= _data['max'])) {
				result = false;
			}
		} else {
			if (_value < _data['min']) {
				result = false;
			}
		}
	} else if ('max' in _data) {
		if (_value > _data['max']) {
			result = false;
		}
	}

	return result;
}

function rc_float_format(_float, _thousands_sep) {
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

(function($) {
	$(document).ready(function() {
		$('body').on('submit', '.fancybox-wrap .popup-modal.calculate form', function(_event) {
			var $FORM = $(this);

			var json = $FORM.find('.calc-banks > ul > li input[checked]').data('json');

			var errors = false;

			var credit_sum = parseFloat($FORM.find('.field-credit_sum').val());
			if (isNaN(credit_sum)) {
				$FORM.find('.field-credit_sum').parent().addClass('new-adv-order-form-input--error');

				errors = true;
			} else {
				credit_sum = Math.abs(credit_sum);

				if (rc_calculator_validate_field(credit_sum, json['credit_sum'])) {
					$FORM.find('.field-credit_sum').val(credit_sum);
					$FORM.find('.field-credit_sum').parent().removeClass('new-adv-order-form-input--error');
				} else {
					$FORM.find('.field-credit_sum').parent().addClass('new-adv-order-form-input--error');

					errors = true;
				}
			}
			var interest_rate = parseFloat($FORM.find('.field-interest_rate').val());
			if (isNaN(interest_rate)) {
				$FORM.find('.field-interest_rate').parent().addClass('new-adv-order-form-input--error');

				errors = true;
			} else {
				interest_rate = Math.abs(interest_rate);

				if (rc_calculator_validate_field(interest_rate, json['interest_rate'])) {
					$FORM.find('.field-interest_rate').val(interest_rate);
					$FORM.find('.field-interest_rate').parent().removeClass('new-adv-order-form-input--error');

					interest_rate = (interest_rate / 1200);
				} else {
					$FORM.find('.field-interest_rate').parent().addClass('new-adv-order-form-input--error');

					errors = true;
				}
			}
			var credit_period = parseFloat($FORM.find('.field-credit_period').val());
			if (isNaN(credit_period)) {
				$FORM.find('.field-credit_period').parent().addClass('new-adv-order-form-input--error');

				errors = true;
			} else {
				credit_period = Math.abs(credit_period);

				if (rc_calculator_validate_field(credit_period, json['credit_period'])) {
					$FORM.find('.field-credit_period').val(credit_period);
					$FORM.find('.field-credit_period').parent().removeClass('new-adv-order-form-input--error');

					credit_period = Math.round(credit_period * 12);
				} else {
					$FORM.find('.field-credit_period').parent().addClass('new-adv-order-form-input--error');

					errors = true;
				}
			}
			var first_payment = parseFloat($FORM.find('.field-first_payment').val());
			if (isNaN(first_payment)) {
				$FORM.find('.field-first_payment').parent().addClass('new-adv-order-form-input--error');

				errors = true;
			} else {
				first_payment = Math.abs(first_payment);

				$FORM.find('.field-first_payment').val(first_payment);

				if (first_payment > credit_sum) {
					$FORM.find('.field-first_payment').parent().addClass('new-adv-order-form-input--error');

					errors = true;
				} else {
					$FORM.find('.field-first_payment').parent().removeClass('new-adv-order-form-input--error');
				}
			}
			var payment_type = parseInt($FORM.find('.field-payment_type:checked').val(), 10);
			if (isNaN(payment_type) || !isNaN(first_payment) && [1, 2].indexOf(payment_type) == -1) {
				$FORM.find('.field-payment_type').parent().addClass('new-adv-order-form-input--error');

				errors = true;
			} else {
				$FORM.find('.field-payment_type').parent().removeClass('new-adv-order-form-input--error');
			}

			if (errors) {
				return false;
			}

			credit_sum = credit_sum - first_payment;

			var result = {
				total: 0,
				overpay: 0,
				payments: [],
				overpays: []
			};

			switch (payment_type) {
				case 1:
					// Аннуитетные платежи
					var var_1 = interest_rate * Math.pow((1 + interest_rate), credit_period) / (Math.pow((1 + interest_rate), credit_period) - 1);
					var credit_period_backup = credit_period;

					var var_2 = credit_sum * var_1;
					var credit_sum_backup = credit_sum;

					while (credit_period) {
						result['payments'].push(+var_2.toFixed(2));
						result['overpays'].push(+(credit_sum_backup * interest_rate).toFixed(2));

						credit_sum_backup -= (var_2 - credit_sum_backup * interest_rate).toFixed(2);
						credit_period--;
					}

					result['total'] = (var_2 * credit_period_backup).toFixed(2);
					result['overpay'] = (result['total'] - credit_sum).toFixed(2);

					$FORM.find('.field-payment').val(rc_float_format(var_2.toFixed(2)));
					$FORM.find('.field-overpay').val(rc_float_format(result['overpay']));
					break;

				case 2:
					// Дифференцированные платежи
					while (credit_period) {
						var length = result['payments']['length'];
						var var_2 = credit_sum / credit_period;
						var overpay = credit_sum * interest_rate;

						result['overpay'] += overpay;
						result['payments'].push(+(var_2 + overpay).toFixed(2));
						result['overpays'].push(+overpay.toFixed(2));
						result['total'] += result['payments'][length];

						credit_period--;
						credit_sum -= var_2;
					}

					result['total'] = result['total'].toFixed(2);
					result['overpay'] = result['overpay'].toFixed(2);

					$FORM.find('.field-payment').val(rc_float_format(result['payments'][0]) + ' ... ' + rc_float_format(result['payments'][(result['payments'].length - 1)]));
					$FORM.find('.field-overpay').val(rc_float_format(result['overpay']));
					break;
			}

			return false;
		});
	});
})(jQuery);

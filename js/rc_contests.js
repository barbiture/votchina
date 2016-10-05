(function($) {
	$(document).ready(function() {
		$('.konkurs-filter-cur span').click(function() {
			var curBlock = $(this).parent();
			if (curBlock.hasClass('konkurs-filter-cur-active')) {
				curBlock.removeClass('konkurs-filter-cur-active');
			} else {
				$('.konkurs-filter-cur-active').removeClass('konkurs-filter-cur-active');
				curBlock.addClass('konkurs-filter-cur-active');
			}
		});

		$(document).click(function(e) {
			if ($(e.target).parents().filter('.konkurs-filter-cur').length == 0) {
				$('.konkurs-filter-cur-active').removeClass('konkurs-filter-cur-active');
			}
		});

		cuSel({
			changedEl: 'select',
			visRows: 5,
			scrollArrows: true,
			jScrollPane_borderTop: 1,
			jScrollPane_borderBottom: 1
		});

		$('.konkurs-form-radio span input:checked').parent().addClass('checked');
		$('.konkurs-form-radio').click(function() {
			var curName = $(this).find('span input').attr('name');
			$('.konkurs-form-radio span input[name="' + curName + '"]').parent().removeClass('checked');
			$(this).find('span').addClass('checked');
			$(this).find('span input').prop('checked', true).trigger('change');
		});

		$('.konkurs-form-checkbox span input:checked').parent().addClass('checked');
		$('.konkurs-form-checkbox').click(function() {
			var elINPUT = $(this).find('span input');
			var flagChecked = false;
			if (elINPUT.parent().hasClass('checked')) {
				flagChecked = true;
			}
			elINPUT.parent().toggleClass('checked');
			elINPUT.prop('checked', (flagChecked ? false : true)).trigger('change');
		});
	});
})(jQuery);

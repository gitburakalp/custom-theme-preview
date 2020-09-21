var lang = $('html').attr('lang');

$('.btn--black').each(function () {
  var hasSpan = $(this).find('span').length != 0;
  var text = $(this).text().trim();

  !hasSpan ? $(this).text('').append(`<span>${text}</span>`) : '';
});

$('.form-control-block.minus-plus').each(function () {
  var $this = $(this);

  $this.find('[class*=minus],[class*=plus]').on('click', function () {
    var $input = $this.parent().find('input');
    var isChild = $input.attr('id').includes('Child');
    var isMinus = $(this).attr('class').includes('minus');

    var maxVal = $input.data('max');
    var minVal = isChild ? 0 : 1;
    var inputValue = parseInt($input.val());

    if (isMinus) {
      if (inputValue > minVal && inputValue <= maxVal) $input.val(inputValue - 1).change();
    } else if (inputValue < maxVal) $input.val(inputValue + 1).change();

    $input.removeClass('text-anim');

    setTimeout(() => {
      $input.addClass('text-anim');
    }, 0);

    if (isChild) {
      inputValue = parseInt($input.val());
      var arr = ['', 1, 2, 3];
      var $childHidden = $('[child-hidden]');

      for (i in (inputValue <= 0 ? $childHidden.addClass('d-none') : $childHidden.removeClass('d-none'), arr)) {
        if (i > 0) {
          let a = $childHidden.find(`.row > *:nth-child(${arr[i]})`);
          i <= inputValue && i > 0 ? a.removeClass('d-none') : a.addClass('d-none');
        }
      }
    }
  });
});

$("[data-prop*='datepicker']").each(function () {
  var $this = $(this);
  var isBooking = $this.hasClass('mode-booking');
  var isSingle = $this.data('prop') == 'datepicker--single';
  var container = isBooking ? '.dates' : $this.parent();

  var config = {
    separator: '-',
    container: container,
    startOfWeek: lang != 'en' ? 'monday' : 'sunday',
    format: lang != 'en' ? 'DD.MM.YYYY' : 'MM.DD.YYYY',
    language: lang,
    singleMonth: true,
    singleDate: isSingle,
    showShortcuts: false,
    showTopbar: false,
    startDate: moment(),
    selectForward: true,
    customArrowPrevSymbol: '<i class="fal fa-angle-left"></i>',
    customArrowNextSymbol: '<i class="fal fa-angle-right"></i>',
    setValue: function (s) {
      if (!$(this).attr('readonly') || !$(this).is(':disabled')) {
        var selectedDates = s.split('-');

        $(this).val(selectedDates[0].trim());
        !isSingle ? $('#inpCheckoutDate').val(selectedDates[1].trim()) : '';
      }
    },
  };

  $(this).dateRangePicker(config);
});

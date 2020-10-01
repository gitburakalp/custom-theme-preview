var lang = $('html').attr('lang');
var bookForm = document.getElementById('mainBookingForm');

$('.readonly').on('keydown paste', function (e) {
  e.preventDefault();
});

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
  var ww = $(window).outerWidth();
  var $this = $(this);
  var isBooking = $this.hasClass('mode-booking');
  var container = isBooking ? '.dates' : $this.parent();

  var config = {
    separator: '-',
    container: container,
    startOfWeek: lang != 'en' ? 'monday' : 'sunday',
    format: lang != 'en' ? 'DD.MM.YYYY' : 'MM.DD.YYYY',
    language: lang,
    stickyMonths: true,
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
        $(this).next() != undefined ? $(this).next().val(selectedDates[0].trim()) : '';
        $('#inpCheckoutDate').val(selectedDates[1].trim());
        $('#inpCheckoutDate').next() != undefined ? $('#inpCheckoutDate').next().val(selectedDates[1].trim()) : '';
      }
    },
  };

  $(this).dateRangePicker(config);
});

// $('#mainBookingForm')
//   .find('button[type=submit]')
//   .on('click', function (e) {
//     e.preventDefault();
//     e.stopPropagation();

//     if (bookForm.checkValidity() === false) {
//       bookForm.classList.add('has-error');
//     } else {
//       $(bookForm).submit();
//     }
//   });

/* Book Form Submit */
$(document).on('submit', '#mainBookingForm', function (event) {
  event.preventDefault();

  let form = $(this);

  let language = $('html').attr('lang');
  let checkin = form.find('#inpCheckinDate').val();
  let checkout = form.find('#inpCheckoutDate').val();
  // let hotelId = form.find('#inpHotelId').val();
  let hotelId = 3;
  let roomId = '';
  let adult = form.find('#inpAdultCount').val();
  let children = form.find('#inpChildCount').val();
  let childAge1 = form.find('#selectChild1').val();
  let childAge2 = form.find('#selectChild2').val();
  let childAge3 = form.find('#selectChild3').val();
  let promotionCode = form.find('#inpPromotionCode').val();

  if (lang == 'en') {
    var cinArr = checkin.split('.');
    var coutArr = checkout.split('.');
    checkin = `${cinArr[1]}.${cinArr[0]}.${cinArr[2]}`;
    checkout = `${coutArr[1]}.${coutArr[0]}.${coutArr[2]}`;
  }

  var url = '/' + language + '/book-search?hid=' + hotelId + '&rid=' + roomId + '&cin=' + checkin + '&cout=' + checkout + '&adt=' + adult + '&chd=' + children + '&c1=' + childAge1 + '&c2=' + childAge2 + '&c3=' + childAge3 + '&pc=' + promotionCode;

  window.open(url, '_blank');

  return false;
});

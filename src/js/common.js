var lang = $('html').attr('lang');
var bookForm = document.getElementById('mainBookingForm');
var isLocal = window.location.href.includes('localhost');

var staticUrl = isLocal ? 'http://web.otelbits.com' : '';

$('.readonly').on('keydown paste', function (e) {
  e.preventDefault();
});

$(document).on('focus', 'input.readonly', function () {
  this.blur();

  var ww = $(window).outerWidth();

  if (ww < 768) {
    $(this)
      .closest('.offset-block')
      .animate(
        {
          scrollTop: $(this).offset().top,
        },
        1000,
      );
  }
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
        var ww = $(window).outerWidth();

        $(this).val(selectedDates[0].trim());
        $(this).next() != undefined ? $(this).next().val(selectedDates[0].trim()) : '';
        $('#inpCheckoutDate').val(selectedDates[1].trim());
        $('#inpCheckoutDate').next() != undefined ? $('#inpCheckoutDate').next().val(selectedDates[1].trim()) : '';

        var isOffsetBlockDatepicker = $(this).closest('.offset-block').length != 0;

        if (isOffsetBlockDatepicker && ww < 768) {
          $(this)
            .closest('.offset-block')
            .animate(
              {
                scrollTop: $(this).closest('.offset-block').find('button[type=submit]').offset().top,
              },
              1000,
            );
        }
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

document.addEventListener('DOMContentLoaded', function () {
  fillCountryCodes('#selectPhoneCode');
});

function fillCountryCodes(elem) {
  var $elem = $(elem),
    currentLang = lang;

  $.ajax({
    type: 'get',
    url: staticUrl + '/admin/public/countrycodes',
    contentType: 'application/json',
    dataType: 'json',
    success: function (response) {
      $.each(response, function (key, value) {
        var optionValues = [];
        $.each(response, function () {
          if ($.inArray(this.value, optionValues) > -1) {
            $(this).remove();
          } else {
            optionValues.push(this.value);
          }
        });

        $elem.append('<option value=' + value.phoneCode + '>' + value.phoneCode + '</option>');

        $elem.html(
          $elem.find('option').sort(function (x, y) {
            return $(x).text() > $(y).text() ? 1 : -1;
          }),
        );

        selectDefaultPhone(currentLang, elem);
      });
    },
    failure: function (response) {},
  });
}

function selectDefaultPhone(e, t) {
  switch ((e = e.toLowerCase())) {
    case 'tr':
      $(t).val('+90');
      break;
    case 'en':
      $(t).val('+44');
      break;
    case 'de':
      $(t).val('+49');
      break;
    case 'ru':
      $(t).val('+7');
  }
}

function isValidEmailAddress(emailAddress) {
  var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(emailAddress);
}

function isNull(e) {
  return e === null || e === undefined || e === '' || e === '' || e === ' ' || e === ' ';
}

function convertDate(str) {
  var parts = str.split('/');
  if (parts.length == 3) {
    var dmyDate = parts[1] + '/' + parts[0] + '/' + parts[2];
    return dmyDate;
  } else return '';
}

function simpleValidate(group) {
  if (group == undefined) {
    group = '';
  }

  var noErrors = true;
  var inputs = $('[data-simplevalidation]');

  inputs.each(function () {
    var $this = $(this);
    var inputValid = simpleValidateInput($this, group);
    if (!inputValid) {
      noErrors = false;
    }
  });

  if (!noErrors) {
    var ww = $(window).width();

    if (ww <= 767 && $('[data-simplevalidation="' + group + '"]').is('.modal-popup-wrapper')) {
      $('[data-simplevalidation="' + group + '"].modal-popup-wrapper .modal-popup-details').animate({
        scrollTop: $('[data-simplevalidation="' + group + '"]').offset().top - $('.input-validation-error').first().offset().top + 28,
      });
      //console.log("mobile and popup");
    } else {
      $('[data-simplevalidation="' + group + '"]').animate(
        {
          scrollTop: $('.input-validation-error ').first().offset().top,
        },
        500,
      );
      //console.log("desktop");
    }
  }

  return noErrors;
}

function simpleValidateInput(inp, group) {
  var itemLength = 0,
    itemGroup = '',
    min = 0,
    max = 500,
    required = false,
    errorOwner = '',
    checkDataTag = '',
    isEmail = false,
    isCheckbox = false,
    isDate = false,
    isNumeric = false,
    skipOnStars = false,
    dateFormat = 'dd/MM/yyyy',
    repeatControlFor = '',
    isAddress = false;

  var validationKeys = inp.data('simplevalidation').split(',');
  $.each(validationKeys, function (x, keyValue) {
    if (keyValue.indexOf('min') > -1) {
      min = keyValue.replace('min:', '') * 1;
    } else if (keyValue.indexOf('max') > -1) {
      max = keyValue.replace('max:', '') * 1;
    } else if (keyValue.indexOf('itemGroup') > -1) {
      itemGroup = keyValue.replace('itemGroup:', '');
    } else if (keyValue.indexOf('repeatControlFor') > -1) {
      repeatControlFor = keyValue.replace('repeatControlFor:', '');
    } else if (keyValue.indexOf('required') > -1) {
      required = true;
    } else if (keyValue.indexOf('isEmail') > -1) {
      isEmail = true;
    } else if (keyValue.indexOf('isCheckbox') > -1) {
      isCheckbox = true;
    } else if (keyValue.indexOf('isDate') > -1) {
      isDate = true;
    } else if (keyValue.indexOf('isNumeric') > -1) {
      isNumeric = true;
    } else if (keyValue.indexOf('errorOwner') > -1) {
      errorOwner = keyValue.replace('errorOwner:', '');
    } else if (keyValue.indexOf('checkDataTag') > -1) {
      checkDataTag = keyValue.replace('checkDataTag:', '');
    } else if (keyValue.indexOf('skipOnStars') > -1) {
      skipOnStars = true;
    } else if (keyValue.indexOf('isAddress') > -1) {
      isAddress = true;
    }
  });

  if (group != itemGroup || inp.val() == undefined) {
    return true;
  }

  var noInputError = true;
  itemLength = inp.val().trim().length;
  if (skipOnStars && inp.val().indexOf('*') > 0) {
    return true;
  }

  if (required && inp.is('select') && (inp.val() == '0' || inp.val() == '') && inp.is(':visible')) {
    noInputError = false;
  } else if (checkDataTag !== '' && inp.data(checkDataTag) == undefined) {
    noInputError = false;
  } else if (isCheckbox && required && inp.prop('checked') === false && inp.is(':visible')) {
    noInputError = false;
  } else if (isDate && inp.is(':visible') && new Date(convertDate(inp.val())) == 'Invalid Date') {
    console.log('date format error');
    noInputError = false;
  } else if (!isNull(inp.val()) && isNumeric && $.isNumeric(inp.val()) == false) {
    noInputError = false;
  } else if (itemLength > 0 && itemLength < min) {
    noInputError = false;
  } else if (itemLength > max) {
    noInputError = false;
  } else if (required && itemLength == 0) {
    noInputError = false;
  } else if (isEmail && itemLength != 0 && !isValidEmailAddress(inp.val().trim())) {
    noInputError = false;
  } else if (repeatControlFor != '' && itemGroup != '' && inp.val() != $('#' + repeatControlFor + '[data-simplevalidation*="itemGroup:' + itemGroup + '"]').val()) {
    noInputError = false;
  }

  if (inp.data('input-validation-error') != undefined || inp.data('input-validation-error') != null || inp.data('input-validation-error') != '') {
    if (inp.data('input-validation-error')) noInputError = false;
  }

  if (inp.hasClass('hasBinder') === false) {
    inp.addClass('hasBinder');
    inp.on('keyup paste blur change cut', function () {
      simpleValidateInput($(this), group);
    });
  }

  if (noInputError) {
    if (errorOwner !== '') {
      inp.closest('.' + errorOwner).removeClass('input-validation-error');
    } else {
      inp.removeClass('input-validation-error');
    }
  } else {
    if (errorOwner !== '') {
      inp.closest('.' + errorOwner).addClass('input-validation-error');
    } else {
      inp.addClass('input-validation-error');
    }
  }

  return noInputError;
}

function postToCrm() {
  var formData = {
    HotelCode: $('#inpTenantCode').length != 0 ? $('#inpTenantCode').val() : '',
    Country: $('[id*=selectPhoneCode] option:selected').val(),
    NameSurname: $('#inpNameSurname').val(),
    Email: $('[id*=inpEmail]').val(),
    PhoneCountryCode: $('[id*=selectPhoneCode] option:selected').val(),
    Phone: $('[id*=inpPhoneNumber]').val(),
    RequestReason: $('#requestReason option:selected').val(),
    CallDateHour: $('#callDateHour option:selected').text(),
    Description: $('#txtNotes').val(),
  };

  $.ajax({
    type: 'POST',
    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
    url: 'https://api.akkahotels.com/crm/savecallrequest',
    // dataType: "json",
    data: formData,
    crossDomain: true,
    success: function (response) {
      sendToZohoForm();
      clearCallYouForm();
      $('#letUsCallYouModal').modal('hide');
      $('#resultModal .modal-body > *').removeClass('active');
      $('#resultModal .modal-body .success').addClass('active');
      $('#resultModal').modal('show');
    },
    error: function (response) {
      $('#letUsCallYouModal').modal('hide');
      $('#resultModal .modal-body > *').removeClass('active');
      $('#resultModal .modal-body .error').addClass('active');
      $('#resultModal').modal('show');
    },
    timeout: 6e4,
  });
}

function clearCallYouForm() {
  $('#inpNameSurname').val('');
  $('[id*=inpPhoneNumber]').val('');
  $('[id*=inpEmail]').val('');
  $('#requestReason').val('0').attr('selected');
  $('#callDateHour').val('1').attr('selected');
  $('#txtNotes').val('');
  checkModernInput();
}

$('#letUsCallYouModal #submitButton').on('click', function () {
  var isValid = simpleValidate('callYouModal');
  var $thisModal = $('#letUsCallYouModal');

  if (isValid) postToCrm();
  else {
    var $firstErrorElem = $thisModal.find('.input-validation-error').eq(0);

    $thisModal.animate(
      {
        scrollTop: $firstErrorElem.offset().top,
      },
      1000,
    );

    $firstErrorElem.focus();
  }
});

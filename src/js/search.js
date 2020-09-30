var isHandheld = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var pageY;
var windowHeight;
var isMobile = $(window).outerWidth() < 768;

var $parallaxImages;

function commonScrollEvents() {
  if (pageY > 200) $('header').addClass('scrolled');
  else $('header').removeClass('scrolled');

  $('main > section').each(function () {
    var $section = $(this);
    var $body = $('body');
    var thisOT = $(this).position().top;
    var thisOH = $(this).outerHeight();

    if (thisOT <= pageY + 300 && thisOT + thisOH - 200 > pageY) {
      $section.addClass('is-active');

      if ($section.data('body-bg') != undefined) {
        $body.attr('style', 'background-color:' + $section.data('body-bg'));
        $body.addClass('no-effect-header');
      }
    } else {
      $section.removeClass('is-active');

      if ($section.data('body-bg') != undefined) {
        $body.removeAttr('style');
        $body.removeClass('no-effect-header');
      }
    }
  });
}

$('.search').each(function () {
  var $this = $(this);
  $parallaxImages = $this.find('.parallax-images');

  $('.menu-trigger-button').on('click', function () {
    $('.header-menu-block').addClass('is-shown');
  });

  $('.header-menu-block').on('click', function (e) {
    var target = $(e.target);

    if (target.closest('.header-menu').length == 0) {
      $('.header-menu-block').removeClass('is-shown');
    }
  });

  $('[res-trigger] p').on('click', function () {
    var $closest = $(this).closest('.reservation-summary');

    $closest.toggleClass('is-shown');
  });

  $(window).on({
    load: () => {
      scrollEvents();
    },
    scroll: () => {
      scrollEvents();
    },
  });
});

function scrollEvents() {
  pageY = window.pageYOffset;
  windowHeight = window.innerHeight;

  commonScrollEvents();
  initParallaxImages();
}

function initParallaxImages() {
  $parallaxImages.each(function () {
    var $this = $(this);
    var $thisSection = $this.closest('section');

    if (!isHandheld && $thisSection.hasClass('is-active')) {
      var transformVal = 'translateY(' + pageY / 2 + 'px)';

      $this.attr('style', `transform:${transformVal}`);
    }
  });
}

$('.popover-trigger').on('click', function () {
  $(this).siblings().toggleClass('is-shown');
});

$('.popovers').each(function () {
  var cssClass = 'is-shown';

  $('#inpAdultCount,#inpChildCount').change(function () {
    var $this = $(this);
    var relItem = $this.data('related-item');

    $(relItem).text($this.val().trim());
  });

  $(this)
    .find('.close-btn')
    .on('click', function () {
      $('.popovers').removeClass(cssClass);
    });

  $('body').on('click', function (e) {
    var isPopovers = $(e.target).closest('.popovers').length != 0 || $(e.target).closest('.popover-trigger').length != 0;

    if (!isPopovers) {
      $('.popovers').removeClass(cssClass);
    }
  });
});

$('.search-widget').each(function () {
  $(this)
    .find('.search-info')
    .on('click', function () {
      $(this).parent().addClass('is-shown');
    });

  $(this)
    .find('.minimize-search')
    .on('click', function () {
      $(this).closest('.search-widget-block').removeClass('is-shown');
    });
});

// $('.rooms-block').each(function () {
//   var $roomItem = $(this).find('.rooms-item')[0].outerHTML;

//   for (let i = 0; i < 10; i++) {
//     $(this).append($roomItem);
//   }
// });

$('.rooms-block.v3').each(function () {
  var $roomItem = $(this).find('.rooms-item')[0].outerHTML;

  for (let i = 0; i < 5; i++) {
    $(this).append($roomItem);
  }
});

$('.rate-wrapper--expandable .trigger-row .btn').on('click', function () {
  var cssClass = 'is-expanded';
  var $rwe = $(this).closest('.rate-wrapper--expandable');
  var isThisElem = $rwe.hasClass(cssClass);

  $(this).closest('.rooms-block.v3').find('*').removeClass(cssClass);

  isThisElem ? $rwe.removeClass(cssClass) : $rwe.addClass(cssClass);
});

function getConfigRoomsSlider(thisSlider) {
  var $this = thisSlider;

  return {
    slidesPerView: 1,
    spaceBetween: 15,
    loop: true,
    containerModifierClass: 'rooms-image-slider--',
    wrapperClass: 'rooms-image-wrapper',
    slideClass: 'rooms-image-slide',
    slideActiveClass: 'rooms-image-slide--active',
    slideNextClass: 'rooms-image-slide--next',
    slidePrevClass: 'rooms-image-slide--prev',
    navigation: {
      nextEl: $this.find('.next')[0],
      prevEl: $this.find('.prev')[0],
    },
  };
}

var sliders = [];

$('.rooms-image-slider:not(.modal-slider)').each(function (idx) {
  var $this = $(this);
  var config = getConfigRoomsSlider($this);

  sliders[idx] = new Swiper($this[0], config);
});

$('.transfer-fields-box').each(function () {
  var oldRadio = '';
  var selected = [];
  var $this = $(this);

  $(this)
    .find('input[type="radio"]')
    .change(function () {
      selected = [];

      $this.find("input[type='radio']").each(function () {
        selected.push($(this).prop('checked'));
      });

      if (selected.includes(true)) {
        $(this).closest('.transfer-section').addClass('is-selected');
      } else {
        $(this).closest('.transfer-section').removeClass('is-selected');
      }
    });
});

$('#inpFillFieldOfAllGuests').change(function () {
  $(this).siblings('.search-blocks--hidden').slideToggle(500);
});

//$('.main-search .btn--green,.reservation-summary .btn--green').on('click', function () {
//  var next = $('.main-search > *.is-shown').next().attr('class');

//  $('.search-steps > *').removeClass('active');
//  $(`.search-steps > *[data-rel="${next}"]`).addClass('active');

//  $('.main-search > *').removeClass('is-shown');
//  $(`.main-search > .${next}`).addClass('is-shown');

//  $('html,body').animate(
//    {
//      scrollTop: $('.main-search > .main-search_transfers').offset().top - 200,
//    },
//    1500,
//  );
//});

$('.checkout-tabs > li').on('click', function () {
  var thisTab = $(this).data('rel');
  $('.checkout-tabs > li').removeClass('active');

  $('.checkout-tabs-content > *').removeClass('is-shown');
  $('.checkout-tabs-content > ' + thisTab).addClass('is-shown');
  $(this).addClass('active');
});

document.addEventListener('DOMContentLoaded', function () {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('scroll', function () {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

  if (isMobile) {
    var headerHeight = $('header').outerHeight();
    var resTriggerHeight = $('[res-trigger]').outerHeight();
    document.documentElement.style.setProperty('--hh', `${headerHeight}px`);
    document.documentElement.style.setProperty('--rth', `${resTriggerHeight}px`);
  }
});

$("[data-toggle='popover']").popover();

/* Guest Page Scripts */

$('#inpBillingDetails').on('change', function (e) {
  e.preventDefault();
  $('.billing-details').toggleClass('d-none');
});

$('#inpHoneymoon').on('change', function () {
  $('.honeymoonTrigger').next().toggleClass('d-none');
});

$('#roomDetailsModal').on('show.bs.modal', function (e) {
  var $this = $(this);
  var $relatedTarget = $(e.relatedTarget);
  var type = $relatedTarget.data('modal-type');
  var roomid = $relatedTarget.data('roomid');
  var searchid = $relatedTarget.data('searchid');

  function getRoomDetails() {
    var url = '/' + currentLang + '/book-getRoomDetails?searchid=' + searchid + '&roomid=' + roomid;

    var $title = $this.find('[data-item-id="roomTitle"]');
    var $description = $this.find('[data-item-id="roomDescription"]');
    var $roomImageSlider = $this.find('[data-item-id="roomImageSlider"]');

    var config = getConfigRoomsSlider($roomImageSlider);

    if ($roomImageSlider[0].swiper != undefined) {
      $roomImageSlider[0].swiper.destroy();
      $roomImageSlider.find('.rooms-image-wrapper').empty();
    }

    $.get(url, res => {
      var titleValue = res.title;
      var descriptionValue = res.longDescription;
      var photos = res.gallery.photos;

      $title.html(titleValue);
      $description.html(descriptionValue);

      $.each(photos, (idx, e) => {
        var sliderSlides = `<div class="rooms-image-slide"><figure class="img"><img src="${e.url}" alt="" /></figure></div>`;

        $roomImageSlider.find('.rooms-image-wrapper').append(sliderSlides);
      });

      var slider = new Swiper($roomImageSlider[0], config);
    });
  }

  function getDailyRates() {}

  if (type == 'room-details') {
    getRoomDetails();
  } else {
    getDailyRates();
  }
});

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

$('.copyIcon').each(function () {
  $(this).on('click', function () {
    var $this = $(this);
    var val = $this.parent().find('span').text().trim();
    var $copySuccessfulText = $this.next();

    copyToClipboard(val);

    setTimeout(function () {
      $copySuccessfulText.fadeIn(250);
    }, 150);

    setTimeout(function () {
      $copySuccessfulText.fadeOut(250);
    }, 2500);
  });
});

$('#inpLoyaltyCard').on('keypress change', function () {
  var $this = $(this);
  var count = $this.val().replace(/ /g, '').length + 1;

  if (count <= 16) {
    $this.val(function (idx, value) {
      return value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
    });
  } else return false;
});

$('.hotel-select-block').each(function () {
  var $triggerElem = $(this).find('[data-trigger]');
  var $inpSelectedHotel = $(this).find('#inpSelectedHotel');

  $triggerElem.text($(this).find('.hotel-select-item input[type=radio]:checked').next().text());
  $inpSelectedHotel.val($(this).find('.hotel-select-item input[type=radio]:checked').val());

  $triggerElem.on('click', function () {
    var el = $(this).data('trigger');

    $(el).toggleClass('is-shown');
  });

  $(this)
    .find('.hotel-select-item input[type=radio]')
    .on('change', function () {
      $triggerElem.text($(this).next().text());
      $inpSelectedHotel.val($(this).attr('value'));
    });

  $('html,body').on('click', function (e) {
    var $target = $(e.target);

    if ($target.closest('.hotel-select-block').length == 0) {
      $('.hotel-select--hidden').removeClass('is-shown');
    }
  });
});

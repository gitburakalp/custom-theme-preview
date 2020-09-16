var isHandheld = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var pageY;
var windowHeight;

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

    $('.header-menu-block').removeClass('is-shown');
  });

  $('[res-trigger]').on('click', function () {
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

$('#roomDetailsModal').on('shown.bs.modal', function () {
  var $this = $(this).find('.rooms-image-slider');
  var config = getConfigRoomsSlider($this);

  var slider = new Swiper($this[0], config);
});

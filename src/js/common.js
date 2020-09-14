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

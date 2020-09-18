var scroller = document.querySelector('#scroller');
let active = false;

var scrollbar;
var scrollType;
var pageY;
var isMobile = $(window).outerWidth() < 768;
var windowHeight = $(window).height();
var mobileSliders = [];
var isHandheld = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var tl;
var lang = $('html').attr('lang');

function initVerticalScroll() {
  if (navigator.userAgent.toLowerCase().indexOf('firefox') == -1 && !isMobile) {
    scrollbar = Scrollbar.init(document.querySelector('#body'), { damping: 0.1, delegateTo: document });

    scrollbar.addListener(function () {
      pageY = scrollbar.offset.y;
      commonScrollEvents();
    });

    scrollbar.setPosition(0, 0);
    scrollbar.track.xAxis.element.remove();

    ScrollTrigger.scrollerProxy('body', {
      scrollTop(value) {
        if (arguments.length) {
          scrollbar.scrollTop = value;
        }
        return scrollbar.scrollTop;
      },
    });

    scrollbar.addListener(ScrollTrigger.update);

    window.onload = function () {};
  } else {
    scrollType = 'native';

    $('#body').css({
      overflow: 'visible',
      'will-change': 'transform',
    });

    $('#scroller').css({
      'will-change': 'transform',
      'overflow-x': 'hidden',
    });

    $(window).scroll(function () {
      pageY = window.pageYOffset;
      commonScrollEvents();
    });
  }
}

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

  $('.parallax-image').each(function () {
    var $thisSection = $(this).closest('section');

    if (!isHandheld && $thisSection.hasClass('is-active')) {
      var $this = $(this);
      var transformVal = 'translate3d(0,' + pageY / 2 + 'px, 0)';

      $this.attr('style', `transform:${transformVal}`);
    }
  });

  $('[data-parallax="true"]').each(function () {
    var $el = $(this).closest('section');
    sectionTop = $el.position().top;
    thisH = $el.outerHeight();

    if (pageY > sectionTop - windowHeight && pageY < sectionTop + thisH) {
      var $this = $(this);
      var speed = $(this).data('speed');

      var val = -(pageY * speed) / 100;
      var transformVal;

      transformVal = `translateY(${val}px)`;
      $this.attr('style', `transform:${transformVal}`);
    }
  });

  parallaxTextsInit();
}

function parallaxTextsInit() {
  var sectionTop;

  $('.parallax-elems').each(function () {
    var $el = $(this).closest('section');
    sectionTop = $el.position().top;
    thisH = $el.outerHeight();

    if (pageY > sectionTop - windowHeight && pageY < sectionTop + thisH) {
      $('[parallax-elem]').each(function (idx, e) {
        var $this = $(this);

        var val = -($(window).outerWidth() / 15) + (pageY - (sectionTop - $el.outerHeight() / 1.3)) / 5.2;
        var transformVal;

        transformVal = `translateY(${val}px)`;
        $this.attr('style', `transform:${transformVal}`);
      });
    }
  });
}

function initTextAnim() {
  $('[parallax-text]').each(function () {
    var $this = $(this);
    var thisVal = $this.text().trim();
    var arr = thisVal.split('');
    $this.text('');

    arr.forEach(e => {
      $this.append(`<span parallax-elem>${e}</span>`);
    });
  });

  $('[text-anim]').each(function (idx) {
    var thisHtml = $(this)[0].outerHTML;
    $(`<span class="text-anim-span">${thisHtml}</span>`).insertBefore($(this));

    $(this).remove();
  });
}

function imageAnimsInit() {
  $('[data-anim-type]').each(function () {
    $(this).append("<div class='img-cover'></div>");
  });
}

function initMobileSwipers() {
  $('.mobile-sliders').each(function () {
    var $this = $(this);

    $this.addClass('slider-container');
    $this.find('> *').addClass('slider-wrapper');
    $this.find('> * > *').addClass('slider-slide');

    var config = {
      slidesPerView: 1.1,
      spaceBetween: 15,
      centeredSlides: true,
      loop: true,
      containerModifierClass: 'slider-container--',
      wrapperClass: 'slider-wrapper',
      slideClass: 'slider-slide',
      slideActiveClass: 'slider-slide--active',
      slideNextClass: 'slider-slide--next',
      slidePrevClass: 'slider-slide--prev',
    };

    var slider = new Swiper($this[0], config);

    mobileSliders.push(slider);
  });
}

function initSliders() {
  var $sliders = $('[data-prop*="slider"]');

  $sliders.each(function () {
    var $this = $(this);
    var isVerticalSlider = $this.data('prop') == 'slider--vertical';
    var allowTouch = $this.attr('allowtouchmove') != undefined ? $this.attr('allowtouchmove') == 'true' : true;

    $this.addClass('slider-container');
    $this.find('> *').addClass('slider-wrapper');
    $this.find('> * > *').addClass('slider-slide');
    $this.append("<div class='slider-controls'><i class='fal fa-angle-up prev'></i><i class='fal fa-angle-down next'></i></div>");

    if (isVerticalSlider) {
      let vsh = $this.find('.slider-slide:nth-child(1)').outerHeight();
      document.documentElement.style.setProperty('--vsh', `calc(${vsh}px + 10rem)`);

      $(window).on('resize oriantedChanged', function () {
        vsh = $this.find('.slider-slide:nth-child(1)').outerHeight();
        document.documentElement.style.setProperty('--vsh', `calc(${vsh}px + 10rem)`);
      });
    }

    var config = {
      slidesPerView: 1,
      spaceBetween: 15,
      allowTouchMove: allowTouch,
      direction: isVerticalSlider ? 'vertical' : 'horizontal',
      containerModifierClass: 'slider-container--',
      wrapperClass: 'slider-wrapper',
      slideClass: 'slider-slide',
      slideActiveClass: 'slider-slide--active',
      slideNextClass: 'slider-slide--next',
      slidePrevClass: 'slider-slide--prev',
      navigation: {
        nextEl: $this.find('.slider-controls .next')[0],
        prevEl: $this.find('.slider-controls .prev')[0],
      },
      on: {
        transitionStart: function (evt) {
          var $el = $(evt.$el.closest('.content-box').prev().find('figure'));

          $el.removeClass(`img-anim--${$el.data('anim-type')}`);

          setTimeout(function () {
            $el.addClass(`img-anim--${$el.data('anim-type')}`);
          }, 100);

          setTimeout(() => {
            var activeRelatedImageSource = $el.closest('section').find('[class*=slide--active]').data('related-image');
            $el.find('img').attr('src', activeRelatedImageSource);
          }, 500);
        },
      },
    };

    var slider = new Swiper($this[0], config);
  });
}

const lazyLoad = function () {
  var lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));

  if (active === false) {
    setTimeout(function () {
      lazyImages.forEach(function (lazyImage) {
        if (lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0 && getComputedStyle(lazyImage).display !== 'none') {
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove('lazy');

          lazyImages = lazyImages.filter(function (image) {
            return image !== lazyImage;
          });

          if (lazyImages.length === 0) {
            document.removeEventListener('scroll', lazyLoad);
            scrollbar != undefined ? scrollbar.addListener(lazyLoad) : '';
            window.removeEventListener('resize', lazyLoad);
            window.removeEventListener('orientationchange', lazyLoad);
          }
        }
      });

      active = false;
    }, 200);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  let vh = window.innerHeight * 0.01;
  var pageY = window.pageYOffset;

  var windowHeight = window.innerHeight;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  initTextAnim();
  imageAnimsInit();
  initVerticalScroll();
  initSliders();

  $(window).on('load', lazyLoad);
  document.addEventListener('scroll', lazyLoad);
  scrollbar != undefined ? scrollbar.addListener(lazyLoad) : '';
  window.addEventListener('resize', lazyLoad);
  window.addEventListener('orientationchange', lazyLoad);

  if (isMobile) initMobileSwipers();
});

gsap.to('.parallax-rectangle', {
  yPercent: -15,
  scrollTrigger: {
    trigger: '.parallax',
    scrub: true,
  },
});

gsap.to('.gsap-parallax-texts', {
  yPercent: 15,
  scrollTrigger: {
    trigger: '.parallax',
    scrub: true,
  },
});

$('[id*=selectChild]').each(function () {
  for (let i = 1; i < 13; i++) {
    $(this).append(`<option value="${i}">${i}</option>`);
  }
});

$('[data-toggle]').on('click', function () {
  var isOffsetMenu = $(this).data('toggle') == 'offset-block';
  var target = $(this).data('target');

  if (isOffsetMenu) {
    $(target).addClass('is-shown');
  }
});

$('.offset-block').each(function () {
  var $this = $(this);
  var $htmlBody = $('html,body');
  var cssClass = 'is-shown';

  $this.append('<i class="fal fa-times" data-dismiss=".offset-block"></i>');

  $('[data-dismiss]').on('click', function () {
    var target = $(this).attr('data-dismiss');

    $(target).removeClass(cssClass);
    $htmlBody.removeClass('overflow-hidden');
  });
});

$(window).on({
  load: initOffsetMenuWidth,
  resize: initOffsetMenuWidth,
  orientedChanged: initOffsetMenuWidth,
});

function initOffsetMenuWidth() {
  $('.offset-menu').each(function () {
    var thisWidth = $(this).outerWidth();
    document.documentElement.style.setProperty('--omw', `${thisWidth}px`);
  });
}

$('.scroll-down').each(function () {
  var $el = $(this).find('a');

  $el.on('click', function () {
    var nextElemPos = $(this).closest('section').next().offset().top;

    scrollbar != undefined ? scrollbar.scrollTo(0, nextElemPos, 2000) : $('html,body').animate({ scrollTop: nextElemPos }, 2000);
  });
});

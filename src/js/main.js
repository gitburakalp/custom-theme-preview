var myScroll;
var scrollType;
var pageY;
var isMobile = $(window).outerWidth() < 1024;
var windowHeight = $(window).height();
var mobileSliders = [];
var isHandheld = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function initVerticalScroll() {
  if (navigator.userAgent.toLowerCase().indexOf('firefox') == -1 && !isMobile) {
    scrollType = 'iScroll';

    myScroll = new IScroll('#body', {
      mouseWheel: true,
      scrollbars: true,
      probeType: 2,
      disablePointer: true,
      scrollY: true,
      scrollX: false,
      useTransition: true,
      interactiveScrollbars: true,
    });

    myScroll.on('scroll', function () {
      pageY = -myScroll.y;
      commonScrollEvents();
    });
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
      // $section.removeClass('is-active');

      if ($section.data('body-bg') != undefined) {
        $body.removeAttr('style');
        $body.removeClass('no-effect-header');
      }
    }
  });

  $('.parallax-image').each(function () {
    var $this = $(this);
    var thisH = $this.outerHeight();
    var thisParentTop = $this.closest('section').position().top;

    var transformVal = 'translate3d(0,' + (-thisH - (thisParentTop - windowHeight - pageY)) / 2 + 'px, 0)';

    $this.attr('style', `transform:${transformVal}`);
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
  $('[data-anim-type="ltr"]').each(function () {
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

    var slider = new Swiper('.slider-container', config);

    mobileSliders.push(slider);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  let vh = window.innerHeight * 0.01;
  var pageY = window.pageYOffset;
  var windowHeight = window.innerHeight;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  initTextAnim();
  imageAnimsInit();
  initVerticalScroll();

  if (isMobile) {
    initMobileSwipers();
  }

  $('.menu-trigger-button').on('click', function () {
    $(this).parent().toggleClass('is-active');
  });
});

// gsap.to('.parallax-rectangle', {
//   yPercent: 50,
//   scrollTrigger: {
//     trigger: '.parallax',
//     scrub: true,
//   },
// });

// gsap.to('.gsap-parallax-texts', {
//   yPercent: -50,
//   scrollTrigger: {
//     trigger: '.parallax',
//     scrub: true,
//   },
// });

// gsap.to('.prx', {
//   yPercent: 20,
//   scrollTrigger: {
//     trigger: '.main-block.main-block--filtered',
//     scrub: true,
//     start: 100,
//   },
// });

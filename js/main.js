/*  ---------------------------------------------------
    Template Name: Dreams
    Description: Dreams wedding template
    Author: Colorib
    Author URI: https://colorlib.com/
    Version: 1.0
    Created: Colorib
---------------------------------------------------------  */

'use strict';

(function ($) {

    /*------------------
        Initialize Mobile Menu State
    --------------------*/
    $(document).ready(function() {
        // Ensure mobile menu is hidden on page load
        $('#mobile-social').hide();
        $('.slicknav_btn').removeClass('slicknav_open');
    });

    // Also handle browser back/forward button
    $(window).on('pageshow', function(event) {
        if (event.originalEvent.persisted) {
            $('#mobile-social').hide();
            $('.slicknav_btn').removeClass('slicknav_open');
        }
    });

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");

        // Ensure mobile menu is hidden after page load
        $('#mobile-social').hide();
        $('.slicknav_btn').removeClass('slicknav_open');

        /*------------------
            Portfolio filter
        --------------------*/
        $('.portfolio__filter li').on('click', function () {
            $('.portfolio__filter li').removeClass('active');
            $(this).addClass('active');
        });
        if ($('.portfolio__gallery').length > 0) {
            var containerEl = document.querySelector('.portfolio__gallery');
            var mixer = mixitup(containerEl);
        }
        
    });

    /*------------------
        Back to top
    --------------------*/ 

    var btn = $('#button');

    $(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
        btn.addClass('show');
    } else {
        btn.removeClass('show');
    }
    });

    btn.on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop:0}, '300');
    });


    /*------------------
        Background Set
    --------------------*/
    
    $('.set-bg').each(function () {
        var elementTop = $(this).offset().top;
        var windowBottom = $(document).scrollTop() + $(document).height();
      // Check if the element is in the viewport
      if (elementTop < windowBottom) {
            var bg = $(this).data('setbg');
            $(this).removeClass('lazy-background');
            $(this).css('background-image', 'url(' + bg + ')'); 
        }    
    });

    //Masonary
    $('.work__gallery').masonry({
        itemSelector: '.work__item',
        columnWidth: '.grid-sizer',
        gutter: 10
    });

    /*------------------
		Navigation
	--------------------*/
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });

    /*------------------
        Mobile Menu Toggle for Custom Menu
    --------------------*/
    // Toggle mobile-social visibility when hamburger is clicked
    // Use setTimeout to ensure slicknav button is created
    setTimeout(function() {
        console.log('SlickNav button exists:', $('.slicknav_btn').length);
        
        $(document).on('click', '.slicknav_btn', function(e) {
            console.log('Hamburger clicked!'); // Debug
            e.preventDefault();
            e.stopPropagation();
            $('#mobile-social').slideToggle(300);
            $(this).toggleClass('slicknav_open');
        });
        
        // Also try direct binding as backup
        $('.slicknav_btn').off('click').on('click', function(e) {
            console.log('Direct click handler!');
            e.preventDefault();
            e.stopPropagation();
            $('#mobile-social').slideToggle(300);
            $(this).toggleClass('slicknav_open');
        });
    }, 100);

    /*------------------
        Mobile Menu - Auto Close on Outside Click
    --------------------*/
    // Close mobile menu when clicking/tapping outside
    $(document).on('click touchstart', function(e) {
        var mobileMenu = $('.slicknav_menu');
        var mobileMenuWrap = $('#mobile-menu-wrap');
        var mobileSocial = $('#mobile-social');
        
        // Check if menu is open
        if (mobileMenu.hasClass('slicknav_open')) {
            // If click is outside menu, close it
            if (!mobileMenu.is(e.target) && 
                mobileMenu.has(e.target).length === 0 &&
                !mobileMenuWrap.is(e.target) && 
                mobileMenuWrap.has(e.target).length === 0 &&
                !mobileSocial.is(e.target) && 
                mobileSocial.has(e.target).length === 0) {
                $('.slicknav_btn').click(); // Toggle menu closed
            }
        }
    });

    // Prevent menu from closing when clicking inside it
    $('.slicknav_menu, #mobile-menu-wrap, #mobile-social').on('click touchstart', function(e) {
        e.stopPropagation();
    });

    /*------------------
        Mobile Menu - Close on Navigation Link Click
    --------------------*/
    // Close mobile menu when clicking navigation links
    $('#mobile-social .mobile-nav-links a').on('click', function() {
        $('#mobile-social').slideUp(300);
        $('.slicknav_btn').removeClass('slicknav_open');
    });

    /*------------------
        Mobile Menu - Auto Close on Resize
    --------------------*/
    // Close mobile menu when resizing above mobile breakpoint
    $(window).on('resize', function() {
        if ($(window).width() > 991) {
            $('#mobile-social').hide();
            $('.slicknav_btn').removeClass('slicknav_open');
        }
    });

    /*------------------
		Hero Slider
	--------------------*/
    $('.hero__slider').owlCarousel({
        loop: true,
        dots: true,
        mouseDrag: false,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        items: 1,
        margin: 0,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
    });

    var dot = $('.hero__slider .owl-dot');
    dot.each(function () {
        var index = $(this).index() + 1;
        if (index < 10) {
            $(this).html('0').append(index);
        } else {
            $(this).html(index);
        }
    });

    /*------------------
        Testimonial Slider
    --------------------*/
    $(".testimonial__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 3,
        dots: true,
        dotsEach: 2,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {
            992: {
                items: 3
            },
            768: {
                items: 2
            },
            320: {
                items: 1
            }
        }
    });

    /*------------------
        Latest Slider
    --------------------*/
    $(".latest__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 3,
        dots: true,
        dotsEach: 2,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {
            992: {
                items: 3
            },
            768: {
                items: 2
            },
            320: {
                items: 1
            }
        }
    });

    /*------------------
        Logo Slider
    --------------------*/
    $(".logo__carousel").owlCarousel({
        loop: true,
        margin: 100,
        items: 6,
        dots: false,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {
            992: {
                items: 5
            },
            768: {
                items: 4
            },
            480: {
                items: 3
            },
            320: {
                items: 2
            }
        }
    });

    /*------------------
        Video Popup
    --------------------*/
    $('.video-popup').magnificPopup({
        type: 'iframe'
    });

    /*------------------
        Counter
    --------------------*/
    $('.counter_num').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 4000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

	/*---------------------
 		Lazy Load
   -----------------------*/
	const lazyDivs = $("div[data-setbg]");

	  if ("IntersectionObserver" in window) {
	    let observer = new IntersectionObserver(function (entries, obs) {
	      entries.forEach(function (entry) {
	        if (entry.isIntersecting) {
	          let $div = $(entry.target);
	          $div.css("background-image", "url(" + $div.data("setbg") + ")");
	          obs.unobserve(entry.target);
	        }
	      });
	    });
	
	    lazyDivs.each(function () {
	      observer.observe(this);
	    });
	  } else {
	    // Fallback for old browsers: just load all backgrounds
	    lazyDivs.each(function () {
	      let $div = $(this);
	      $div.css("background-image", "url(" + $div.data("setbg") + ")");
	    });
	  }

})(jQuery);

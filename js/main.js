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

        // Handle hash navigation with offset
        if (window.location.hash) {
            // First scroll to top
            $('html, body').scrollTop(0);
            
            setTimeout(function() {
                var hash = window.location.hash;
                var target = $(hash);
                if (target.length) {
                    var headerHeight = $('.header').outerHeight() || 80;
                    var offset = target.offset().top - headerHeight - 20;
                    $('html, body').animate({
                        scrollTop: offset
                    }, 800);
                }
            }, 300);
        }

        /*------------------
            Portfolio filter
        --------------------*/
        $('.portfolio__filter li').on('click', function () {
            $('.portfolio__filter li').removeClass('active');
            $(this).addClass('active');
        });
        if ($('.portfolio__gallery').length > 0) {
            var containerEl = document.querySelector('.portfolio__gallery');
            var mixer = mixitup(containerEl, {
                animation: {
                    animateResizeContainer: false,
                    animateResizeTargets: false
                },
                callbacks: {
                    onMixEnd: function(state) {
                        containerEl.style.height = '';
                    }
                }
            });

            // Auto-apply filter from URL param (e.g. portfolio.html?filter=gameplay-ai)
            var urlParams = new URLSearchParams(window.location.search);
            var urlFilter = urlParams.get('filter');
            if (urlFilter) {
                var filterSel = '.' + urlFilter;
                mixer.filter(filterSel);
                $('.portfolio__filter li').removeClass('active');
                $('.portfolio__filter li[data-filter="' + filterSel + '"]').addClass('active');
                // sync mobile/tablet dropdown label
                var $matchedItem = $('.portfolio__filter li[data-filter="' + filterSel + '"]');
                if ($matchedItem.length) {
                    $('.portfolio__filter-label').text($matchedItem.text());
                }
            }

            // Inject custom dropdown for mobile/tablet
            if (window.innerWidth < 1200 && $('.portfolio__filter').length > 0) {
                var $wrapper = $('<div>', { 'class': 'portfolio__filter-dropdown' });
                var $trigger = $('<div>', { 'class': 'portfolio__filter-trigger' });
                var $label = $('<span>', { 'class': 'portfolio__filter-label', text: 'All' });
                var $triggerCount = $('<span>', { 'class': 'portfolio__filter-count' });
                var $arrow = $('<span>', { 'class': 'portfolio__filter-arrow', html: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>' });
                var $optList = $('<ul>', { 'class': 'portfolio__filter-options' });
                var totalCount = $('.portfolio__gallery .mix').length;

                $triggerCount.text(totalCount);
                $trigger.append($label).append($triggerCount).append($arrow);

                $('.portfolio__filter li').each(function() {
                    var filter = $(this).data('filter') || '*';
                    var text = $(this).text();
                    var count = filter === '*'
                        ? totalCount
                        : $('.portfolio__gallery .mix' + filter).length;

                    var $item = $('<li>', { 'data-filter': filter });
                    var $itemLabel = $('<span>', { text: text });
                    var $itemCount = $('<span>', { 'class': 'portfolio__filter-count', text: count });
                    $item.append($itemLabel).append($itemCount);

                    if ($(this).hasClass('active')) {
                        $item.addClass('active');
                        $label.text(text);
                        $triggerCount.text(count);
                    }
                    $item.on('click', function() {
                        var val = $(this).data('filter');
                        var itemText = $(this).find('span:first').text();
                        var itemCount = $(this).find('.portfolio__filter-count').text();
                        mixer.filter(val);
                        $optList.find('li').removeClass('active');
                        $(this).addClass('active');
                        $label.text(itemText);
                        $triggerCount.text(itemCount);
                        $('.portfolio__filter li').removeClass('active');
                        $('.portfolio__filter li[data-filter="' + val + '"]').addClass('active');
                        if (val === '*') $('.portfolio__filter li:first').addClass('active');
                        $wrapper.removeClass('open');
                    });
                    $optList.append($item);
                });

                $trigger.on('click', function() {
                    $wrapper.toggleClass('open');
                });

                $(document).on('click', function(e) {
                    if (!$(e.target).closest('.portfolio__filter-dropdown').length) {
                        $wrapper.removeClass('open');
                    }
                });

                $wrapper.append($trigger).append($optList);
                $('.portfolio__filter').before($wrapper);
            }
        }

        /*------------------
            Masonry Gallery
        --------------------*/
        if ($('.work__gallery').length > 0) {
            $('.work__gallery').masonry({
                itemSelector: '.work__item',
                columnWidth: '.grid-sizer',
                gutter: 10
            });
        }
        
    });

    /*------------------
        Smooth Scroll for Anchor Links
    --------------------*/
    $('a[href*="#"]:not([href="#"])').on('click', function(e) {
        if (this.pathname === window.location.pathname) {
            e.preventDefault();
            var target = $(this.hash);
            if (target.length) {
                var headerHeight = $('.header').outerHeight() || 80;
                var offset = target.offset().top - headerHeight - 20;
                $('html, body').animate({
                    scrollTop: offset
                }, 500);
            }
        }
    });

    /*------------------
        Back to top
    --------------------*/ 

    var btn = $('#button');

    // Function to check scroll position and show/hide button
    function checkScroll() {
        var windowScroll = $(window).scrollTop();
        var bodyScroll = $(document.body).scrollTop();
        var htmlScroll = $(document.documentElement).scrollTop();
        var projectBlockScroll = $('.project-block').length ? $('.project-block').scrollTop() : 0;
        
        // Get the maximum scroll from all possible containers
        var maxScroll = Math.max(windowScroll, bodyScroll, htmlScroll, projectBlockScroll);
        
        // Show button if any container has scrolled past 100px
        if (maxScroll > 100) {
            btn.addClass('show');
        } else {
            btn.removeClass('show');
        }
    }

    // Initial check on page load
    checkScroll();

    // Attach scroll listeners to all possible scrolling containers
    $(window).on('scroll', checkScroll);
    $(document).on('scroll', checkScroll);
    $('.project-block').on('scroll', checkScroll);
    
    // For mobile/tablet - also listen to touchmove and set interval to check periodically
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var isTablet = window.matchMedia("(max-width: 991px)").matches;
    
    if (isMobile || isTablet) {
        $(document).on('touchmove', function() {
            setTimeout(checkScroll, 100);
        });
        // Check scroll every 500ms on mobile/tablet as backup
        setInterval(checkScroll, 500);
    }

    // Back to top button click handler
    btn.on('click', function(e) {
        e.preventDefault();
        
        // Scroll all possible containers to top
        var projectBlock = $('.project-block');
        
        // Scroll window, html, and body to top
        $('html, body').animate({scrollTop: 0}, 300);
        $(document.body).animate({scrollTop: 0}, 300);
        
        // If project-block exists, scroll it too
        if (projectBlock.length) {
            projectBlock.animate({scrollTop: 0}, 300);
        }
    });


    /*------------------
        Background Set
    --------------------*/
    
    // Removed early .set-bg handler to prevent conflict with lazy loading
    // The IntersectionObserver at the end of the file handles background loading

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
        // console.log('SlickNav button exists:', $('.slicknav_btn').length);
        
        $(document).on('click', '.slicknav_btn', function(e) {
            // console.log('Hamburger clicked!'); // Debug
            e.preventDefault();
            e.stopPropagation();
            $('#mobile-social').slideToggle(300);
            $(this).toggleClass('slicknav_open');
        });
        
        // Also try direct binding as backup
        $('.slicknav_btn').off('click').on('click', function(e) {
            // console.log('Direct click handler!');
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

    /* Carousel code removed - not in use */

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
 		Load Background Images (lazy via IntersectionObserver)
   -----------------------*/
	$(window).on('load', function() {
	    function applyBg($div) {
	        var bgUrl = $div.data("setbg");
	        if (!bgUrl) return;
	        $div.removeClass('lazy-background');
	        $div.css({
	            "background-image":    "url(" + bgUrl + ")",
	            "background-size":     "cover",
	            "background-position": "center center",
	            "background-repeat":   "no-repeat"
	        });
	    }

	    if ('IntersectionObserver' in window) {
	        var observer = new IntersectionObserver(function (entries) {
	            entries.forEach(function (entry) {
	                if (entry.isIntersecting) {
	                    applyBg($(entry.target));
	                    observer.unobserve(entry.target);
	                }
	            });
	        }, { rootMargin: '200px' });

	        $("div[data-setbg]").each(function () { observer.observe(this); });
	    } else {
	        $("div[data-setbg]").each(function () { applyBg($(this)); });
	    }

	    // Re-layout masonry after backgrounds are loaded
	    setTimeout(function() {
	        if ($('.work__gallery').length > 0) {
	            $('.work__gallery').masonry('layout');
	        }
	    }, 100);
	});

})(jQuery);

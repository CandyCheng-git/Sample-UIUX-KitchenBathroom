(function ($) {
    "use strict";

    // Initialize Owl Carousels
    function initOwlCarousel(selector, items) {
        $(selector).owlCarousel({
            items: items || 5,
            loop: true,
            dots: true,
            nav: true,
            margin: 30,
            responsive: {
                0: { items: 1 },
                600: { items: 2 },
                1000: { items: 3 }
            }
        });
    }

    initOwlCarousel('.owl-men-item');
    initOwlCarousel('.owl-women-item');
    initOwlCarousel('.owl-kid-item');
    initOwlCarousel('.owl-clients', 1); // Specific for clients
    initOwlCarousel('.owl-testimonials', 2); // Specific for testimonials
    initOwlCarousel('.owl-banner', 1); // Specific for banner

    // Smooth Scroll and Menu Toggle
    function handleSmoothScroll() {
        $('.scroll-to-section a[href*=\\#]:not([href=\\#])').on('click', function () {
            var target = $(this.hash);
            if (target.length) {
                var width = $(window).width();
                if (width < 991) {
                    $('.menu-trigger').removeClass('active');
                    $('.header-area .nav').slideUp(200);
                }
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 700);
                return false;
            }
        });
    }

    // Header Background Change on Scroll
    function handleHeaderScroll() {
        $(window).scroll(function () {
            var scroll = $(window).scrollTop();
            var box = $('.header-text').height();
            var header = $('header').height();
            $("header").toggleClass("background-header", scroll >= box - header);
        });
    }

    // Mobile Navigation
    function mobileNav() {
        var width = $(window).width();
        $('.submenu').off('click').on('click', function () {
            if (width < 767) {
                $('.submenu ul').removeClass('active');
                $(this).find('ul').toggleClass('active');
            }
        });
    }

    // Page Loading Animation
    function loadingAnimation() {
        $("#preloader").animate({'opacity': '0'}, 600, function () {
            setTimeout(function () {
                $("#preloader").css("visibility", "hidden").fadeOut();
            }, 300);
        });
    }

    // Accordion Functionality
    $('.accordion > li:eq(0) a').addClass('active').next().slideDown();
    $('.accordion a').click(function (j) {
        var dropDown = $(this).closest('li').find('.content');
        $(this).closest('.accordion').find('.content').not(dropDown).slideUp();
        $(this).toggleClass('active');
        dropDown.stop(false, true).slideToggle();
        j.preventDefault();
    });

    // Isotope Filtering
    var $grid = $(".grid").isotope({
        itemSelector: ".all",
        percentPosition: true,
        masonry: { columnWidth: ".all" }
    });

    $('.filters ul li').click(function () {
        $('.filters ul li').removeClass('active');
        $(this).addClass('active');
        var data = $(this).attr('data-filter');
        $grid.isotope({ filter: data });
    });

    // Initialize functions on document ready
    $(document).ready(function () {
        handleSmoothScroll();
        handleHeaderScroll();
        loadingAnimation();
        mobileNav();
    });

    // Window Resize Event
    $(window).on('resize', mobileNav);
})(window.jQuery);


/* (function ($) {
	
	"use strict";
	$('.owl-men-item').owlCarousel({
		items:5,
		loop:true,
		dots: true,
		nav: true,
		margin:30,
		  responsive:{
			  0:{
				  items:1
			  },
			  600:{
				  items:2
			  },
			  1000:{
				  items:3
			  }
		 }
	})

	$('.owl-women-item').owlCarousel({
		items:5,
		loop:true,
		dots: true,
		nav: true,
		margin:30,
		  responsive:{
			  0:{
				  items:1
			  },
			  600:{
				  items:2
			  },
			  1000:{
				  items:3
			  }
		 }
	 })

	$('.owl-kid-item').owlCarousel({
		items:5,
		loop:true,
		dots: true,
		nav: true,
		margin:30,
		  responsive:{
			  0:{
				  items:1
			  },
			  600:{
				  items:2
			  },
			  1000:{
				  items:3
			  }
		 }
	 })

	$(window).scroll(function() {
	  var scroll = $(window).scrollTop();
	  var box = $('#top').height();
	  var header = $('header').height();

	  if (scroll >= box - header) {
	    $("header").addClass("background-header");
	  } else {
	    $("header").removeClass("background-header");
	  }
	});
	

	// Window Resize Mobile Menu Fix
	mobileNav();


	// Scroll animation init
	window.sr = new scrollReveal();
	

	// Menu Dropdown Toggle
	if($('.menu-trigger').length){
		$(".menu-trigger").on('click', function() {	
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
		});
	}


	// Menu elevator animation
	$('.scroll-to-section a[href*=\\#]:not([href=\\#])').on('click', function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				var width = $(window).width();
				if(width < 991) {
					$('.menu-trigger').removeClass('active');
					$('.header-area .nav').slideUp(200);	
				}				
				$('html,body').animate({
					scrollTop: (target.offset().top) - 80
				}, 700);
				return false;
			}
		}
	});

	$(document).ready(function () {
	    $(document).on("scroll", onScroll);
	    
	    //smoothscroll
	    $('.scroll-to-section a[href^="#"]').on('click', function (e) {
	        e.preventDefault();
	        $(document).off("scroll");
	        
	        $('.scroll-to-section a').each(function () {
	            $(this).removeClass('active');
	        })
	        $(this).addClass('active');
	      
	        var target = this.hash,
	        menu = target;
	       	var target = $(this.hash);
	        $('html, body').stop().animate({
	            scrollTop: (target.offset().top) - 79
	        }, 500, 'swing', function () {
	            window.location.hash = target;
	            $(document).on("scroll", onScroll);
	        });
	    });
	});

	function onScroll(event){
	    var scrollPos = $(document).scrollTop();
	    $('.nav a').each(function () {
	        var currLink = $(this);
	        var refElement = $(currLink.attr("href"));
	        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
	            $('.nav ul li a').removeClass("active");
	            currLink.addClass("active");
	        }
	        else{
	            currLink.removeClass("active");
	        }
	    });
	}


	// Page loading animation
	$(window).on('load', function() {
		if($('.cover').length){
			$('.cover').parallax({
				imageSrc: $('.cover').data('image'),
				zIndex: '1'
			});
		}

		$("#preloader").animate({
			'opacity': '0'
		}, 600, function(){
			setTimeout(function(){
				$("#preloader").css("visibility", "hidden").fadeOut();
			}, 300);
		});
	});


	// Window Resize Mobile Menu Fix
	$(window).on('resize', function() {
		mobileNav();
	});


	// Window Resize Mobile Menu Fix
	function mobileNav() {
		var width = $(window).width();
		$('.submenu').on('click', function() {
			if(width < 767) {
				$('.submenu ul').removeClass('active');
				$(this).find('ul').toggleClass('active');
			}
		});
	}


})(window.jQuery);
*/
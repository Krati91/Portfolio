// Project Details Dynamic Content Script
// Handles URL parameter-based project display and sidebar navigation

$(document).ready(function(){
    // Initialize page on load - show project based on URL parameter
    const divID = new URLSearchParams(window.location.search).get("name");
    if (!divID) return;
    
    const $elem = $('a[href="?name=' + divID + '"]');
    const $parentDiv = $elem.closest('.collapse');
    const $categoryHeader = $parentDiv.prev('.list-group-item');

    // Activate selected project in sidebar and expand its category
    $categoryHeader.addClass('active-list-group-item');
    $parentDiv.collapse('show');
    $elem.addClass('active');
    $('#' + divID).show();
    
    // Load lazy backgrounds for the initial project
    $('#' + divID).find('.set-bg').each(function() {
        const bg = $(this).data('setbg');
        if (bg) {
            $(this).css('background-image', 'url(' + bg + ')');
        }
    });
    
    $(document).scrollTop(0);
});

// Handle sidebar project link clicks
$('.sidebar-link').click(function(e){
    e.preventDefault();
    
    const divID = $(this).prop('href').split('=').pop();
    
    // Reset all active states and hide all project details
    $('.sidebar-link').removeClass('active');
    $('.project-details').hide();
    $(this).addClass('active');
    $('#' + divID).show();
    
    // Load lazy backgrounds for the newly visible project
    $('#' + divID).find('.set-bg').each(function() {
        const bg = $(this).data('setbg');
        if (bg) {
            $(this).css('background-image', 'url(' + bg + ')');
        }
    });
    
    $(document).scrollTop(0);
    
    // Update URL without page reload
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?name=' + divID;
    window.history.pushState({ path: newUrl }, '', newUrl);
});

// Collapsible bottom drawer functionality (mobile only)
let drawerInitialized = false;

function initDrawerToggle() {
    if (window.innerWidth <= 991) {
        const sidebar = $('.sidebar');
        const body = $('body');
        
        // Only initialize once to avoid duplicate handlers
        if (!drawerInitialized) {
            // Start collapsed on mobile
            sidebar.addClass('collapsed');
            body.removeClass('drawer-expanded');
            
            // Collapse all categories initially
            $('.list-group-item + div').collapse('hide');
            
            // Toggle on click of handle area (top 30px or entire sidebar when collapsed)
            sidebar.off('click').on('click', function(e) {
            const target = $(e.target);
            
            // Don't toggle if clicking on category header or project link
            if (target.hasClass('list-group-item') || target.closest('.list-group-item').length || 
                target.hasClass('sidebar-link') || target.closest('.sidebar-link').length) {
                return;
            }
            
            // Only toggle if clicking the handle area or if drawer is collapsed
            const clickY = e.pageY - $(this).offset().top;
            if (clickY <= 30 || sidebar.hasClass('collapsed')) {
                sidebar.toggleClass('collapsed expanded');
                
                // Toggle body class for content padding adjustment
                if (sidebar.hasClass('expanded')) {
                    body.addClass('drawer-expanded');
                    
                    // Always open the category containing the currently active project
                    const activeProject = $('.sidebar-link.active');
                    if (activeProject.length > 0) {
                        // Find the parent category of the active project
                        const parentCategory = activeProject.closest('.collapse');
                        const categoryHeader = parentCategory.prev('.list-group-item');
                        
                        // Close all OTHER categories (not the one we want to open)
                        $('.list-group-item').removeClass('active-list-group-item');
                        $('.list-group-item + div').not(parentCategory).collapse('hide');
                        
                        // Open the active project's category and highlight header
                        parentCategory.collapse('show');
                        categoryHeader.addClass('active-list-group-item');
                        
                        // Scroll to the active project if needed
                        setTimeout(function() {
                            if (activeProject[0]) {
                                activeProject[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                        }, 300);
                    }
                } else {
                    body.removeClass('drawer-expanded');
                    // Collapse all categories when drawer closes
                    $('.list-group-item + div').collapse('hide');
                }
                
                e.stopPropagation();
            }
        });
        
        // Handle category header clicks - toggle collapse
        $('.list-group-item').off('click').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = $(this).attr('href');
            const targetCollapse = $(targetId);
            const isCurrentlyActive = $(this).hasClass('active-list-group-item');
            
            // Don't collapse if this is the active category
            if (isCurrentlyActive && targetCollapse.hasClass('show')) {
                // Keep it open, don't collapse
                return;
            }
            
            // Close all other categories
            $('.list-group-item + div').collapse('hide');
            $('.list-group-item').removeClass('active-list-group-item');
            
            // Open clicked category
            targetCollapse.collapse('show');
            $(this).addClass('active-list-group-item');
        });
        
        // Handle project link clicks
        $('.sidebar-link').off('click').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Update active state
            $('.sidebar-link').removeClass('active');
            $(this).addClass('active');
            
            // Find and mark parent category as active
            const parentCategory = $(this).closest('.collapse');
            const categoryHeader = parentCategory.prev('.list-group-item');
            $('.list-group-item').removeClass('active-list-group-item');
            categoryHeader.addClass('active-list-group-item');
            
            // Extract project ID and display
            let urlArray = $(this).prop('href').split('=');
            let divID = urlArray[urlArray.length - 1];
            
            // Hide all projects and show selected one
            $('.project-details').hide();
            $('div#' + divID).show();
            $(document).scrollTop(0);
            
            // Update URL
            let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?name=' + divID;
            window.history.pushState({ path: newUrl }, '', newUrl);
            
            // Collapse the drawer after selection
            sidebar.removeClass('expanded').addClass('collapsed');
            body.removeClass('drawer-expanded');
        });
            
            drawerInitialized = true;
        }
    } else {
        // Reset on desktop
        const sidebar = $('.sidebar');
        const body = $('body');
        sidebar.removeClass('collapsed expanded');
        body.removeClass('drawer-expanded');
        drawerInitialized = false;
    }
}

// Initialize on page load
initDrawerToggle();

// Reinitialize on window resize
let resizeTimer;
$(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        initDrawerToggle();
    }, 250);
});

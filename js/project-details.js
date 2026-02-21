// Project Details Dynamic Content Script
// Handles JSON-based project loading, sidebar generation, and URL parameter-based display

let projectsData = null;

// Load projects data from JSON file
function loadProjectsData() {
    return $.getJSON('data/projects.json')
        .done(function(data) {
            projectsData = data;
            console.log('Projects data loaded successfully');
        })
        .fail(function(jqxhr, textStatus, error) {
            console.error('Failed to load projects data:', textStatus, error);
        });
}

// Render sidebar with categories and projects
function renderSidebar() {
    if (!projectsData) return;
    
    const $sidebar = $('.sidebar .nav');
    $sidebar.empty();
    
    projectsData.categories.forEach(function(category) {
        // Create category header
        const $categoryHeader = $('<h4>', {
            'class': 'list-group-item',
            'data-toggle': 'collapse',
            'href': '#' + category.id,
            'role': 'button',
            'aria-expanded': 'false',
            'aria-controls': category.id,
            text: category.name
        });
        
        // Create container for category projects
        const $categoryContainer = $('<div>', {
            'class': 'container collapse',
            'id': category.id
        });
        
        // Add projects to category
        category.projects.forEach(function(project) {
            const displayName = project.status ? 
                project.name + ' (' + project.status + ')' : 
                project.name;
            
            const $projectLink = $('<a>', {
                'class': 'sidebar-link',
                'href': '?name=' + project.id,
                'data-name': project.name
            });
            
            const $thumbnail = $('<div>', {
                'class': 'col-lg-4 thumbnail set-bg',
                'data-setbg': project.thumbnail,
                'loading': 'lazy'
            });
            
            const $titleDiv = $('<div>', {
                'class': 'col-lg-8 thumbnail__title'
            });
            
            $titleDiv.append($('<h5>', { text: displayName }));
            $titleDiv.append($('<small>', { text: project.subtitle }));
            
            $projectLink.append($thumbnail).append($titleDiv);
            $categoryContainer.append($projectLink);
        });
        
        $sidebar.append($categoryHeader).append($categoryContainer);
    });
    
    // Load backgrounds for all sidebar thumbnails
    $('.sidebar .set-bg').each(function() {
        const bg = $(this).data('setbg');
        if (bg) {
            $(this).css('background-image', 'url(' + bg + ')');
        }
    });
}

// Render project details
function renderProjectDetails() {
    if (!projectsData) return;
    
    const $projectBlock = $('.project-block .container .row .col-lg-9');
    $projectBlock.empty();
    
    projectsData.categories.forEach(function(category) {
        category.projects.forEach(function(project) {
            const $projectDiv = $('<div>', {
                'class': 'container project-details',
                'id': project.id,
                'style': 'display:none;'
            });
            
            // Create cover section with video or image
            const $coverRow = $('<div>', { 'class': 'row' });
            const $coverCol = $('<div>', { 'class': 'col-lg-12', 'style': 'padding:0' });
            const $coverDiv = $('<div>', { 'class': 'large__gif', 'data-setbg': '' });
            
            if (project.coverVideo) {
                const videoId = project.id + '-video';
                const $video = $('<video>', {
                    'playsinline': '',
                    'loop': '',
                    'autoplay': '',
                    'muted': '',
                    'preload': 'metadata',
                    'id': videoId
                });
                
                $video.append($('<source>', {
                    'src': project.coverVideo,
                    'type': 'video/webm'
                }));
                
                $video.append($('<p>').html('Your browser does not support HTML5 video. You can <a href="' + project.coverVideo + '">download the video</a> instead.'));
                
                $coverDiv.append($video);
            } else if (project.coverImage) {
                $coverDiv.attr('data-setbg', project.coverImage);
                $coverDiv.addClass('set-bg lazy-background');
                $coverDiv.css('background-size', '68vw 365px');
            }
            
            const displayName = project.status ? 
                project.name + ' (' + project.status + ')' : 
                project.name;
            
            $coverDiv.append($('<h4>', { text: displayName }));
            $coverCol.append($coverDiv);
            $coverRow.append($coverCol);
            
            // Create About and Project Info section
            const $infoRow = $('<div>', { 'class': 'row row__margin' });
            const $infoContainer = $('<div>', { 'class': 'container d-flex p-0' });
            
            // About card
            const $aboutCol = $('<div>', { 
                'class': 'col-lg-6', 
                'style': 'padding-left: 0; padding-right: 8px;' 
            });
            const $aboutCard = $('<div>', { 'class': 'job-card' });
            $aboutCard.append($('<h4>', { text: 'About' }));
            project.about.forEach(function(paragraph) {
                $aboutCard.append($('<p>').append($('<small>', { text: paragraph })));
            });
            $aboutCol.append($aboutCard);
            
            // Project Info card
            const $infoCol = $('<div>', { 
                'class': 'col-lg-6', 
                'style': 'padding-right: 0; padding-left: 8px;' 
            });
            const $infoCard = $('<div>', { 'class': 'job-card' });
            $infoCard.append($('<h4>', { text: 'Project Info' }));
            const $infoList = $('<ul>');
            
            const info = project.projectInfo;
            $infoList.append($('<li>').append($('<small>').html('<i class="fa fa-clock-o" aria-hidden="true"></i>Time Frame: ' + info.timeFrame)));
            $infoList.append($('<li>').append($('<small>').html('<i class="fa fa-gear"></i>Engine: ' + info.engine)));
            $infoList.append($('<li>').append($('<small>').html('<i class="fa fa-gamepad" aria-hidden="true"></i>Genre: ' + info.genre)));
            $infoList.append($('<li>').append($('<small>').html('<i class="fa fa-users" aria-hidden="true"></i>Game Mode: ' + info.gameMode)));
            $infoList.append($('<li>').append($('<small>').html('<i class="fa fa-desktop" aria-hidden="true"></i>Platform: ' + info.platform)));
            
            $infoCard.append($infoList);
            $infoCol.append($infoCard);
            
            $infoContainer.append($aboutCol).append($infoCol);
            $infoRow.append($infoContainer);
            
            // Create description section with core systems and challenges
            const $descRow = $('<div>', { 'class': 'row row__margin' });
            const $descContainer = $('<div>', { 'class': 'container' });
            const $descInnerRow = $('<div>', { 'class': 'row' });
            const $descCol = $('<div>', { 'class': 'col-lg-12 description' });
            
            // Check if this is the retro games collection
            if (project.games && project.games.length > 0) {
                // Render games list
                $descCol.append($('<h4>', { text: 'List of Games' }));
                const $gamesList = $('<ul>');
                
                project.games.forEach(function(game, index) {
                    const $gameLi = $('<li>');
                    $gameLi.append($('<span>', { 'class': 'heading', text: game.name }));
                    
                    const $gameDiv = $('<div>', { 'class': 'd-flex' });
                    const $gameImg = $('<div>', {
                        'class': 'job-card set-bg',
                        'data-setbg': game.image,
                        'loading': 'lazy'
                    });
                    
                    const $gameDesc = $('<div>', { 'style': 'margin: 25px 0;' });
                    const $gameText = $('<p>').html(
                        game.description + 
                        '<br><br>Check out the repository at <a href="' + game.githubUrl + '" target="_blank" class="github">GitHub</a> for more details and source code.'
                    );
                    $gameDesc.append($gameText);
                    
                    // Alternate layout (left/right)
                    if (index % 2 === 0) {
                        $gameImg.css('margin-right', '10px');
                        $gameDiv.append($gameImg).append($gameDesc);
                    } else {
                        $gameImg.css('margin-left', '10px');
                        $gameDiv.append($gameDesc).append($gameImg);
                    }
                    
                    $gameLi.append($gameDiv);
                    $gamesList.append($gameLi);
                });
                
                $descCol.append($gamesList);
            }
            
            // Core Systems
            if (project.coreSystems && project.coreSystems.length > 0) {
                const systemsHeading = project.systemsHeading || 'Core Systems Implemented';
                $descCol.append($('<h4>', { text: systemsHeading }));
                const $systemsList = $('<ul>');
                
                project.coreSystems.forEach(function(system) {
                    const $systemLi = $('<li>');
                    $systemLi.append($('<span>', { 'class': 'heading', text: system.title }));
                    $systemLi.append(document.createTextNode(system.description));
                    $systemsList.append($systemLi);
                });
                
                $descCol.append($systemsList);
            }
            
            // Technical Challenges
            if (project.technicalChallenges && project.technicalChallenges.length > 0) {
                $descCol.append($('<h4>', { text: 'Technical Challenges' }));
                const $challengesList = $('<ul>');
                
                project.technicalChallenges.forEach(function(challenge) {
                    const $challengeLi = $('<li>');
                    $challengeLi.append($('<span>', { 'class': 'heading', text: challenge.title }));
                    $challengeLi.append(document.createTextNode(challenge.description));
                    $challengesList.append($challengeLi);
                });
                
                $descCol.append($challengesList);
            }
            
            // Gallery images
            if (project.galleryImages && project.galleryImages.length > 0) {
                const $galleryDiv = $('<div>', { 'class': 'd-flex' });
                project.galleryImages.forEach(function(image, index) {
                    const style = index === 0 ? 'margin-right: 8px;' : 'margin-left: 8px;';
                    const $galleryImg = $('<div>', {
                        'class': 'job-card set-bg',
                        'data-setbg': image,
                        'loading': 'lazy',
                        'style': style
                    });
                    $galleryDiv.append($galleryImg);
                });
                $descCol.append($galleryDiv);
            }
            
            // Repository link
            if (project.githubUrl) {
                $descCol.append($('<h4>', { text: 'Repository' }));
                const $repoList = $('<ul>');
                const $repoLi = $('<li>').html('Check out the repository at <a href="' + project.githubUrl + '" target="_blank" class="github">GitHub</a> for more details and source code.');
                $repoList.append($repoLi);
                $descCol.append($repoList);
            }
            
            // YouTube embed
            if (project.youtubeEmbed) {
                const $iframe = $('<iframe>', {
                    'src': project.youtubeEmbed,
                    'title': 'YouTube video player',
                    'frameborder': '0',
                    'allow': 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
                    'referrerpolicy': 'strict-origin-when-cross-origin',
                    'allowfullscreen': ''
                });
                $descCol.append($iframe);
            }
            
            $descInnerRow.append($descCol);
            $descContainer.append($descInnerRow);
            $descRow.append($descContainer);
            
            // Assemble project div
            $projectDiv.append($coverRow).append($infoRow).append($descRow);
            $projectBlock.append($projectDiv);
        });
    });
}

// Initialize page on load
$(document).ready(function() {
    loadProjectsData().done(function() {
        // Render sidebar and project details
        renderSidebar();
        renderProjectDetails();
        
        // Show project based on URL parameter
        const divID = new URLSearchParams(window.location.search).get("name");
        if (divID) {
            // Use setTimeout to ensure DOM is fully updated
            setTimeout(function() {
                const $elem = $('a[href="?name=' + divID + '"]');
                const $parentDiv = $elem.closest('.collapse');
                const $categoryHeader = $parentDiv.prev('.list-group-item');

                // Activate selected project in sidebar and expand its category
                $categoryHeader.addClass('active-list-group-item');
                $parentDiv.addClass('show'); // Bootstrap collapse class
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
            }, 100);
        }
        
        // Initialize drawer toggle after rendering
        initDrawerToggle();
        
        // Setup event handlers after rendering
        setupEventHandlers();
    });
});

// Setup event handlers for sidebar links
function setupEventHandlers() {
    // Handle sidebar project link clicks
    $(document).on('click', '.sidebar-link', function(e) {
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
}

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
        // Desktop view - accordion functionality
        const sidebar = $('.sidebar');
        const body = $('body');
        sidebar.removeClass('collapsed expanded');
        body.removeClass('drawer-expanded');
        drawerInitialized = false;
        
        // Desktop accordion: Only expand section with active project
        if (!window.desktopAccordionInitialized) {
            // On page load, collapse all sections except the one with active project
            const activeProject = $('.sidebar-link.active');
            if (activeProject.length > 0) {
                const parentCategory = activeProject.closest('.collapse');
                const categoryHeader = parentCategory.prev('.list-group-item');
                
                // Collapse all categories first
                $('.list-group-item + div').collapse('hide');
                $('.list-group-item').removeClass('active-list-group-item');
                
                // Then expand only the active one
                parentCategory.collapse('show');
                categoryHeader.addClass('active-list-group-item');
            } else {
                // No active project - collapse all by default
                $('.list-group-item + div').collapse('hide');
                $('.list-group-item').removeClass('active-list-group-item');
            }
            
            // Handle category header clicks - accordion behavior
            $('.list-group-item').off('click.desktop').on('click.desktop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = $(this).attr('href');
                const targetCollapse = $(targetId);
                const isCurrentlyOpen = targetCollapse.hasClass('show');
                
                // Collapse all other categories
                $('.list-group-item + div').not(targetCollapse).collapse('hide');
                $('.list-group-item').not(this).removeClass('active-list-group-item');
                
                // Toggle the clicked category
                if (isCurrentlyOpen) {
                    targetCollapse.collapse('hide');
                    $(this).removeClass('active-list-group-item');
                } else {
                    targetCollapse.collapse('show');
                    $(this).addClass('active-list-group-item');
                }
            });
            
            // Handle project link clicks - update active state and expand its section
            $('.sidebar-link').off('click.desktop').on('click.desktop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Update active state
                $('.sidebar-link').removeClass('active');
                $(this).addClass('active');
                
                // Find and ensure parent category stays open
                const parentCategory = $(this).closest('.collapse');
                const categoryHeader = parentCategory.prev('.list-group-item');
                
                // Collapse all other categories
                $('.list-group-item + div').not(parentCategory).collapse('hide');
                $('.list-group-item').removeClass('active-list-group-item');
                
                // Keep this category open and highlighted
                parentCategory.collapse('show');
                categoryHeader.addClass('active-list-group-item');
                
                // Extract project ID and display
                let urlArray = $(this).prop('href').split('=');
                let divID = urlArray[urlArray.length - 1];
                
                // Hide all projects and show selected one
                $('.project-details').hide();
                $('div#' + divID).show();
                
                // Load lazy backgrounds
                $('#' + divID).find('.set-bg').each(function() {
                    const bg = $(this).data('setbg');
                    if (bg) {
                        $(this).css('background-image', 'url(' + bg + ')');
                    }
                });
                
                $(document).scrollTop(0);
                
                // Update URL
                let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?name=' + divID;
                window.history.pushState({ path: newUrl }, '', newUrl);
            });
            
            window.desktopAccordionInitialized = true;
        }
    }
}

// Reinitialize on window resize
let resizeTimer;
$(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Reset desktop initialization flag on resize to allow re-initialization
        if (window.innerWidth > 991) {
            window.desktopAccordionInitialized = false;
        }
        initDrawerToggle();
    }, 250);
});

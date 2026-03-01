// project-details.js
// New design: Hero overlay, metadata bar, skill keywords,
// systems showcase grid, technical challenges accordion, code samples

let projectsData = null;

// ─── Data Loading ────────────────────────────────────────────────────────────
function loadProjectsData() {
    return $.getJSON('data/projects.json')
        .done(function(data) {
            projectsData = data;
        })
        .fail(function(jqxhr, textStatus, error) {
            console.error('Failed to load projects.json:', textStatus, error);
        });
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function renderSidebar() {
    if (!projectsData) return;

    const $sidebar = $('.sidebar .nav');
    $sidebar.empty();

    // Group projects by primaryDiscipline, sorted by priority
    const sortedProjects = projectsData.projects.slice().sort(function(a, b) {
        return (a.priority || 99) - (b.priority || 99);
    });
    const catMap = {};
    const catOrder = [];
    sortedProjects.forEach(function(project) {
        const catName = project.primaryDiscipline || 'Other';
        if (!catMap[catName]) {
            catMap[catName] = [];
            catOrder.push(catName);
        }
        catMap[catName].push(project);
    });

    catOrder.forEach(function(catName, idx) {
        const catId = 'cat-discipline-' + idx;

        const $header = $('<h4>', {
            'class': 'list-group-item',
            'data-toggle': 'collapse',
            'href': '#' + catId,
            'role': 'button',
            'aria-expanded': 'false',
            'aria-controls': catId,
            text: catName
        });

        const $container = $('<div>', {
            'class': 'container collapse',
            'id': catId
        });

        catMap[catName].forEach(function(project) {
            const $link = $('<a>', {
                'class': 'sidebar-link',
                'href': '?name=' + project.id,
                'data-name': project.name
            });

            const $thumb = $('<div>', {
                'class': 'col-lg-4 thumbnail set-bg',
                'data-setbg': project.thumbnail,
                'loading': 'lazy'
            });

            const $titleDiv = $('<div>', { 'class': 'col-lg-8 thumbnail__title' });
            $titleDiv.append($('<h5>', { text: project.name }));
            $titleDiv.append($('<small>', { text: project.subtitle }));

            $link.append($thumb).append($titleDiv);
            $container.append($link);
        });

        $sidebar.append($header).append($container);
    });

    // Set sidebar thumbnail backgrounds
    $('.sidebar .set-bg').each(function() {
        const bg = $(this).data('setbg');
        if (bg) $(this).css('background-image', 'url(' + bg + ')');
    });
}

// ─── Builders ────────────────────────────────────────────────────────────────

function buildHeroSection(project) {
    const $hero = $('<div>', { 'class': 'pd-hero' });

    // Background media (video or image)
    const $mediaBg = $('<div>', { 'class': 'pd-hero__bg' });
    const fallback = project.thumbnail || '';
    if (project.coverVideo) {
        const $video = $('<video>', {
            playsinline: '',
            loop: '',
            autoplay: '',
            muted: '',
            preload: 'metadata',
            poster: fallback
        });
        $video.append($('<source>', { src: project.coverVideo, type: 'video/webm' }));
        $mediaBg.append($video);
    } else {
        const imgSrc = project.coverImage || project.thumbnail || '';
        if (imgSrc) {
            $mediaBg.css('background-image', 'url(' + imgSrc + ')');
            $mediaBg.addClass('pd-hero__bg--img');
        }
    }

    // Info overlay card
    const $card = $('<div>', { 'class': 'pd-hero__card' });
    $card.append($('<h2>', { 'class': 'pd-hero__title', text: project.name }));
    $card.append($('<p>', { 'class': 'pd-hero__subtitle', text: project.subtitle || project.primaryDiscipline }));
    if (project.subtitleRole) {
        $card.append($('<p>', { 'class': 'pd-hero__subtitle-role', text: project.subtitleRole }));
    }

    // Ownership / feature bullet list
    const bulletSource = project.ownership || project.heroFeatures;
    if (bulletSource && bulletSource.length) {
        const $ul = $('<ul>', { 'class': 'pd-hero__features' });
        bulletSource.forEach(function(f) {
            $ul.append($('<li>', { text: f }));
        });
        $card.append($ul);
    }

    // Tech tags (techStack is a flat array of strings)
    if (project.techStack && project.techStack.length) {
        const $tech = $('<div>', { 'class': 'pd-hero__tech' });
        $tech.append($('<span>', { 'class': 'pd-hero__tech-label', text: 'Tech:' }));

        project.techStack.forEach(function(t, i) {
            $tech.append($('<span>', { 'class': 'pd-hero__tech-tag', text: t }));
            if (i < project.techStack.length - 1) {
                $tech.append($('<span>', { 'class': 'pd-hero__tech-dot', text: '·' }));
            }
        });

        $card.append($tech);
    }

    $hero.append($mediaBg);
    $hero.append($card);
    return $hero;
}

function buildMetaBar(project) {
    const $bar = $('<div>', { 'class': 'pd-meta-bar' });

    const metas = [
        { icon: 'fa fa-user', label: 'Role', value: project.role || '—' },
        { icon: 'fa fa-clock-o', label: 'Duration', value: project.duration || '—' },
        { icon: 'fa fa-gear', label: 'Engine', value: project.engineVersion || '—' },
        { icon: 'fa fa-crosshairs', label: 'Discipline', value: project.primaryDiscipline || '—' },
        { icon: 'fa fa-users', label: 'Team Size', value: project.teamSize != null ? String(project.teamSize) : '—' }
    ];

    metas.forEach(function(m) {
        const $item = $('<div>', { 'class': 'pd-meta-bar__item' });
        $item.append(
            $('<span>', { 'class': 'pd-meta-bar__label' }).append(
                $('<i>', { 'class': m.icon + ' pd-meta-bar__icon' })
            ).append(
                $('<strong>', { text: m.label + ': ' })
            )
        );
        $item.append($('<span>', { 'class': 'pd-meta-bar__value', text: m.value }));
        $bar.append($item);
    });

    // GitHub repo link
    if (project.githubUrl) {
        const $ghItem = $('<div>', { 'class': 'pd-meta-bar__item' });
        $ghItem.append(
            $('<span>', { 'class': 'pd-meta-bar__label' }).append(
                $('<i>', { 'class': 'fa fa-github pd-meta-bar__icon' })
            ).append(
                $('<strong>', { text: 'Repo: ' })
            )
        );
        $ghItem.append(
            $('<a>', {
                'class': 'pd-meta-bar__link',
                href: project.githubUrl,
                target: '_blank',
                text: 'GitHub'
            })
        );
        $bar.append($ghItem);
    }

    return $bar;
}

function buildSkillKeywords(project) {
    if (!project.skillKeywords || !project.skillKeywords.length) return null;

    const $section = $('<div>', { 'class': 'pd-section' });
    $section.append($('<h3>', { 'class': 'pd-section__title', text: 'Skill Keywords' }));

    const $tags = $('<div>', { 'class': 'pd-skill-tags' });
    project.skillKeywords.forEach(function(kw) {
        const cls = 'pd-skill-tag' + (kw.highlighted ? ' pd-skill-tag--highlight' : '');
        $tags.append($('<span>', { 'class': cls, text: kw.label }));
    });

    $section.append($tags);
    return $section;
}

function buildOwnership(project) {
    if (!project.ownership || !project.ownership.length) return null;

    const $section = $('<div>', { 'class': 'pd-section' });
    $section.append($('<h3>', { 'class': 'pd-section__title', text: 'What I Built' }));

    const $list = $('<ul>', { 'class': 'pd-bullet-list' });
    project.ownership.forEach(function(item) {
        $list.append($('<li>', { 'class': 'pd-bullet-list__item', text: item }));
    });

    $section.append($list);
    return $section;
}

function buildArchitectureDiagram(project) {
    return null;
    const diag = project.architectureDiagram;
    if (!diag || !diag.nodes || !diag.nodes.length) return null;

    const $section = $('<div>', { 'class': 'pd-section' });
    $section.append($('<h3>', { 'class': 'pd-section__title', text: 'Architecture Flow' }));

    const $flow = $('<div>', { 'class': 'pd-arch-flow' });

    diag.nodes.forEach(function(node, i) {
        $flow.append($('<span>', { 'class': 'pd-arch-node', text: node }));
        if (i < diag.nodes.length - 1) {
            $flow.append($('<span>', { 'class': 'pd-arch-arrow' }).html('&#8594;'));
        }
    });

    $section.append($flow);
    return $section;
}

function buildArchitectureHighlights(project) {
    if (!project.architectureHighlights || !project.architectureHighlights.length) return null;

    const $section = $('<div>', { 'class': 'pd-section' });
    $section.append($('<h3>', { 'class': 'pd-section__title', text: 'Architecture Highlights' }));

    const $list = $('<ul>', { 'class': 'pd-bullet-list' });
    project.architectureHighlights.forEach(function(item) {
        $list.append($('<li>', { 'class': 'pd-bullet-list__item', text: item }));
    });

    $section.append($list);
    return $section;
}

function buildSystemsShowcase(project) {
    const modules = project.modules;
    if (!modules || !modules.length) return null;

    const contentType = project.contentType || 'systems';

    // Dynamic heading
    function getHeading() {
        if (contentType === 'collection') return 'Games Included';
        const disc = (project.primaryDiscipline || '').toLowerCase();
        if (disc.includes('network'))   return 'Networking Systems';
        if (disc.includes('blueprint')) return 'Blueprint Systems';
        if (disc.includes('low-level') || disc.includes('low level')) return 'Core Implementations';
        return 'Core Systems';
    }

    const $section = $('<div>', { 'class': 'pd-section' });
    $section.append($('<h3>', { 'class': 'pd-section__title', text: getHeading() }));

    // ── COLLECTION layout: sub-project grid ────────────────────────────────
    if (contentType === 'collection') {
        const $grid = $('<div>', { 'class': 'pd-collection-grid' });
        modules.forEach(function(mod) {
            const $card = $('<div>', { 'class': 'pd-collection-card' });

            const $imgWrap = $('<div>', { 'class': 'pd-collection-card__img-wrap' });
            if (mod.image) {
                $imgWrap.append($('<img>', {
                    src: mod.image, alt: mod.title,
                    'class': 'pd-collection-card__img', loading: 'lazy'
                }));
            }
            $card.append($imgWrap);

            const $body = $('<div>', { 'class': 'pd-collection-card__body' });
            $body.append($('<h4>', { 'class': 'pd-collection-card__title', text: mod.title }));
            if (mod.description) {
                $body.append($('<p>', { 'class': 'pd-collection-card__desc', text: mod.description }));
            }
            if (mod.focus) {
                $body.append($('<span>', { 'class': 'pd-collection-card__focus', text: mod.focus }));
            }
            if (mod.githubUrl) {
                $body.append(
                    $('<a>', { href: mod.githubUrl, target: '_blank', 'class': 'pd-collection-card__link' }).html(
                        '<i class="fa fa-github"></i> Repo: GitHub'
                    )
                );
            }
            $card.append($body);
            $grid.append($card);
        });
        $section.append($grid);
        return $section;
    }

    // ── SYSTEMS layout: adaptive grid ──────────────────────────────────────
    const count = modules.length;

    // 1 module → Hero layout
    if (count === 1) {
        const mod = modules[0];
        const $hero = $('<div>', { 'class': 'pd-showcase-hero' });

        const $media = $('<div>', { 'class': 'pd-showcase-hero__media' });
        if (mod.image) {
            $media.append($('<img>', {
                src: mod.image, alt: mod.title,
                'class': 'pd-showcase-hero__img', loading: 'lazy'
            }));
        }
        $hero.append($media);

        const $content = $('<div>', { 'class': 'pd-showcase-hero__content' });
        $content.append($('<h4>', { 'class': 'pd-showcase-hero__title', text: mod.title }));
        if (mod.description) {
            $content.append($('<p>', { 'class': 'pd-showcase-hero__desc', text: mod.description }));
        }
        if (mod.technicalFocus && mod.technicalFocus.length) {
            const $ul = $('<ul>', { 'class': 'pd-showcase-hero__focus' });
            mod.technicalFocus.forEach(function(pt) {
                $ul.append($('<li>', { text: pt }));
            });
            $content.append($ul);
        }
        $hero.append($content);
        $section.append($hero);
        return $section;
    }

    // 2-3 modules → 2-column balanced grid
    // 4+ modules → 2-column flowing grid (2×2 or 2×N)
    const gridClass = 'pd-showcase-grid pd-showcase-grid--' + (count <= 3 ? '2' : '4');
    const $grid = $('<div>', { 'class': gridClass });

    modules.forEach(function(mod) {
        const $card = $('<div>', { 'class': 'pd-showcase-card' });

        const $imgWrap = $('<div>', { 'class': 'pd-showcase-card__img-wrap' });
        if (mod.image) {
            $imgWrap.append($('<img>', {
                src: mod.image, alt: mod.title,
                'class': 'pd-showcase-card__img', loading: 'lazy'
            }));
        }
        $imgWrap.append($('<span>', { 'class': 'pd-showcase-card__img-title', text: mod.title }));
        $card.append($imgWrap);

        const $body = $('<div>', { 'class': 'pd-showcase-card__body' });
        if (mod.description) {
            $body.append($('<p>', { 'class': 'pd-showcase-card__desc', text: mod.description }));
        }
        if (mod.technicalFocus && mod.technicalFocus.length) {
            const $ul = $('<ul>', { 'class': 'pd-showcase-card__focus' });
            mod.technicalFocus.forEach(function(pt) {
                $ul.append($('<li>', { text: pt }));
            });
            $body.append($ul);
        }
        $card.append($body);
        $grid.append($card);
    });

    $section.append($grid);
    return $section;
}

function buildRepositoryHighlights(project) {
    return null; // hidden for now
    if (!project.repositoryHighlights || !project.repositoryHighlights.length) return null;

    const $section = $('<div>', { 'class': 'pd-section' });
    $section.append($('<h3>', { 'class': 'pd-section__title', text: 'Repository Highlights' }));

    const $list = $('<ul>', { 'class': 'pd-bullet-list' });
    project.repositoryHighlights.forEach(function(item) {
        $list.append($('<li>', { 'class': 'pd-bullet-list__item', text: item }));
    });

    $section.append($list);
    return $section;
}

function buildTechnicalChallenges(project) {
    if (!project.technicalChallenges || !project.technicalChallenges.length) return null;

    const $section = $('<div>', { 'class': 'pd-section' });
    $section.append($('<h3>', { 'class': 'pd-section__title', text: 'Technical Challenges' }));

    const $grid = $('<div>', { 'class': 'pd-challenges-grid' });

    project.technicalChallenges.forEach(function(ch, idx) {
        const cardId = 'tc-card-' + project.id + '-' + idx;

        const $card = $('<div>', { 'class': 'pd-challenge-card' });

        // Header row
        const $header = $('<div>', {
            'class': 'pd-challenge-card__header',
            'data-toggle': 'collapse',
            'data-target': '#' + cardId,
            'aria-expanded': 'true'
        });
        $header.append($('<i>', { 'class': 'fa fa-eye pd-challenge-card__eye' }));
        $header.append($('<span>', { 'class': 'pd-challenge-card__title', text: ch.title }));
        $header.append($('<i>', { 'class': 'fa fa-chevron-down pd-challenge-card__chevron', 'style': 'transform: rotate(180deg);' }));

        // Collapsible body — expanded by default
        const $body = $('<div>', {
            'class': 'pd-challenge-card__body collapse show',
            'id': cardId
        });

        if (ch.problem) {
            $body.append(
                $('<div>', { 'class': 'pd-challenge-row' }).append(
                    $('<span>', { 'class': 'pd-challenge-label', text: 'Problem:' })
                ).append(
                    $('<span>', { 'class': 'pd-challenge-text', text: ch.problem })
                )
            );
        }

        if (ch.solution) {
            $body.append(
                $('<div>', { 'class': 'pd-challenge-row' }).append(
                    $('<span>', { 'class': 'pd-challenge-label', text: 'Solution:' })
                ).append(
                    $('<span>', { 'class': 'pd-challenge-text', text: ch.solution })
                )
            );
        }

        if (ch.result) {
            $body.append(
                $('<div>', { 'class': 'pd-challenge-row' }).append(
                    $('<span>', { 'class': 'pd-challenge-label', text: 'Result:' })
                ).append(
                    $('<span>', { 'class': 'pd-challenge-text', text: ch.result })
                )
            );
        }

        $card.append($header).append($body);
        $grid.append($card);
    });

    $section.append($grid);
    return $section;
}

function buildCodeSamples(project) {
    return null; // hidden for now
    if (!project.codeSamples || !project.codeSamples.length) return null;

    const $section = $('<div>', { 'class': 'pd-section' });
    $section.append($('<h3>', { 'class': 'pd-section__title', text: 'Code Samples' }));

    project.codeSamples.forEach(function(sample, idx) {
        const blockId = 'cs-block-' + project.id + '-' + idx;

        const $block = $('<div>', { 'class': 'pd-code-block' });

        // Header
        const $blockHeader = $('<div>', {
            'class': 'pd-code-block__header',
            'data-toggle': 'collapse',
            'data-target': '#' + blockId,
            'aria-expanded': 'false'
        });
        $blockHeader.append($('<i>', { 'class': 'fa fa-code pd-code-block__icon' }));
        $blockHeader.append($('<span>', { text: sample.title }));
        $blockHeader.append($('<i>', { 'class': 'fa fa-chevron-down pd-code-block__chevron' }));

        // Code body
        const $blockBody = $('<div>', {
            'class': 'pd-code-block__body collapse',
            'id': blockId
        });
        const $pre = $('<pre>', { 'class': 'pd-code-pre' });
        const $code = $('<code>', {
            'class': 'language-' + (sample.language || 'cpp'),
            text: sample.code
        });
        $pre.append($code);
        $blockBody.append($pre);

        $block.append($blockHeader).append($blockBody);
        $section.append($block);
    });

    return $section;
}

function buildGallery(project) {
    return null; // hidden for now
    if (!project.galleryImages || !project.galleryImages.length) return null;

    const $section = $('<div>', { 'class': 'pd-section pd-section--gallery' });
    const $row = $('<div>', { 'class': 'pd-gallery-row' });

    project.galleryImages.forEach(function(img) {
        const $card = $('<div>', {
            'class': 'pd-gallery-img set-bg',
            'data-setbg': img
        });
        $row.append($card);
    });

    $section.append($row);
    return $section;
}

function buildLinks(project) {
    const parts = [];

    if (project.githubUrl) {
        parts.push(
            $('<a>', {
                'class': 'pd-link pd-link--github',
                href: project.githubUrl,
                target: '_blank'
            }).append($('<i>', { 'class': 'fa fa-github' }))
              .append($('<span>', { text: ' GitHub Repository' }))
        );
    }

    if (!parts.length) return null;

    const $section = $('<div>', { 'class': 'pd-section pd-section--links' });
    parts.forEach(function(el) { $section.append(el); });
    return $section;
}

function buildYouTube(project) {
    if (!project.demoVideo) return null;

    const $section = $('<div>', { 'class': 'pd-section pd-section--video' });
    const $wrap = $('<div>', { 'class': 'pd-video-wrap' });
    $wrap.append($('<iframe>', {
        src: project.demoVideo,
        title: project.name + ' - Gameplay Video',
        frameborder: '0',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        allowfullscreen: ''
    }));
    $section.append($wrap);
    return $section;
}

// ─── Main Render ─────────────────────────────────────────────────────────────
function renderProjectDetails() {
    if (!projectsData) return;

    const $target = $('.project-block .pd-content');
    $target.empty();

    const sorted = projectsData.projects.slice().sort(function(a, b) {
        return (a.priority || 99) - (b.priority || 99);
    });

    sorted.forEach(function(project) {
        const $wrapper = $('<div>', {
            'class': 'project-details pd-wrapper',
            'id': project.id,
            'style': 'display:none;'
        });

        $wrapper.append(buildHeroSection(project));
        $wrapper.append(buildMetaBar(project));
        $wrapper.append(buildOwnership(project));
        $wrapper.append(buildSkillKeywords(project));
        $wrapper.append(buildArchitectureDiagram(project));
        $wrapper.append(buildArchitectureHighlights(project));
        $wrapper.append(buildSystemsShowcase(project));
        $wrapper.append(buildTechnicalChallenges(project));
        $wrapper.append(buildRepositoryHighlights(project));
        $wrapper.append(buildCodeSamples(project));
        $wrapper.append(buildGallery(project));
        $wrapper.append(buildYouTube(project));

        $target.append($wrapper);
    });
}

// ─── Lazy background loader ───────────────────────────────────────────────────
function loadBgImages(context) {
    $(context || document).find('.set-bg').each(function() {
        const bg = $(this).data('setbg');
        if (bg) $(this).css('background-image', 'url(' + bg + ')');
    });
}

// ─── Show project ─────────────────────────────────────────────────────────────
function showProject(divID) {
    $('.sidebar-link').removeClass('active');
    $('.project-details').hide();

    const $link = $('a[href="?name=' + divID + '"]');
    const $parentDiv = $link.closest('.collapse');
    const $catHeader = $parentDiv.prev('.list-group-item');

    $catHeader.addClass('active-list-group-item');
    $parentDiv.addClass('show');
    $link.addClass('active');

    const $proj = $('#' + divID);
    $proj.show();
    loadBgImages($proj);

    // Scroll to top
    const pb = document.querySelector('.project-block');
    if (pb) pb.scrollTop = 0;
    window.scrollTo(0, 0);
    $('html, body').scrollTop(0);
}

// ─── Init ────────────────────────────────────────────────────────────────────
$(document).ready(function() {
    loadProjectsData().done(function() {
        renderSidebar();
        renderProjectDetails();

        const divID = new URLSearchParams(window.location.search).get('name');
        if (divID) {
            setTimeout(function() { showProject(divID); }, 100);
        }

        initDrawerToggle();
        setupEventHandlers();

        // Bootstrap collapse: rotate chevron
        $(document).on('show.bs.collapse', '.pd-challenge-card__body, .pd-code-block__body', function() {
            $(this).prev().find('.fa-chevron-down').css('transform', 'rotate(180deg)');
        });
        $(document).on('hide.bs.collapse', '.pd-challenge-card__body, .pd-code-block__body', function() {
            $(this).prev().find('.fa-chevron-down').css('transform', 'rotate(0deg)');
        });
    });
});

// ─── Event Handlers ───────────────────────────────────────────────────────────
function setupEventHandlers() {
    $(document).on('click', '.sidebar-link', function(e) {
        e.preventDefault();
        const divID = $(this).prop('href').split('=').pop();
        showProject(divID);
        const newUrl = window.location.protocol + '//' + window.location.host +
            window.location.pathname + '?name=' + divID;
        window.history.pushState({ path: newUrl }, '', newUrl);
    });
}

// ─── Drawer (mobile / tablet) ─────────────────────────────────────────────────
let drawerInitialized = false;

function initDrawerToggle() {
    if (window.innerWidth <= 1199) {
        const $sidebar = $('.sidebar');
        const $body = $('body');

        if (!drawerInitialized) {
            $sidebar.addClass('collapsed');
            $body.removeClass('drawer-expanded');
            $('.list-group-item + div').collapse('hide');

            $sidebar.off('click').on('click', function(e) {
                const $t = $(e.target);
                if ($t.hasClass('list-group-item') || $t.closest('.list-group-item').length ||
                    $t.hasClass('sidebar-link') || $t.closest('.sidebar-link').length) return;

                const clickY = e.pageY - $(this).offset().top;
                if (clickY <= 30 || $sidebar.hasClass('collapsed')) {
                    $sidebar.toggleClass('collapsed expanded');
                    if ($sidebar.hasClass('expanded')) {
                        $body.addClass('drawer-expanded');
                        const $active = $('.sidebar-link.active');
                        if ($active.length) {
                            const $pc = $active.closest('.collapse');
                            $('.list-group-item + div').not($pc).collapse('hide');
                            $('.list-group-item').removeClass('active-list-group-item');
                            $pc.collapse('show');
                            $pc.prev('.list-group-item').addClass('active-list-group-item');
                        }
                    } else {
                        $body.removeClass('drawer-expanded');
                        $('.list-group-item + div').collapse('hide');
                    }
                    e.stopPropagation();
                }
            });

            $('.list-group-item').off('click').on('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                const $target = $($(this).attr('href'));
                if ($(this).hasClass('active-list-group-item') && $target.hasClass('show')) return;
                $('.list-group-item + div').collapse('hide');
                $('.list-group-item').removeClass('active-list-group-item');
                $target.collapse('show');
                $(this).addClass('active-list-group-item');
            });

            $('.sidebar-link').off('click').on('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                $('.sidebar-link').removeClass('active');
                $(this).addClass('active');
                const $pc = $(this).closest('.collapse');
                $('.list-group-item').removeClass('active-list-group-item');
                $pc.prev('.list-group-item').addClass('active-list-group-item');
                const divID = $(this).prop('href').split('=').pop();
                showProject(divID);
                const newUrl = window.location.protocol + '//' + window.location.host +
                    window.location.pathname + '?name=' + divID;
                window.history.pushState({ path: newUrl }, '', newUrl);
                $sidebar.removeClass('expanded').addClass('collapsed');
                $body.removeClass('drawer-expanded');
            });

            drawerInitialized = true;
        }
    } else {
        const $sidebar = $('.sidebar');
        $sidebar.removeClass('collapsed expanded');
        $('body').removeClass('drawer-expanded');
        drawerInitialized = false;

        if (!window.desktopAccordionInitialized) {
            const $active = $('.sidebar-link.active');
            $('.list-group-item + div').collapse('hide');
            $('.list-group-item').removeClass('active-list-group-item');
            if ($active.length) {
                const $pc = $active.closest('.collapse');
                $pc.collapse('show');
                $pc.prev('.list-group-item').addClass('active-list-group-item');
            }

            $('.list-group-item').off('click.desktop').on('click.desktop', function(e) {
                e.preventDefault(); e.stopPropagation();
                const $t = $($(this).attr('href'));
                const open = $t.hasClass('show');
                $('.list-group-item + div').not($t).collapse('hide');
                $('.list-group-item').not(this).removeClass('active-list-group-item');
                if (open) { $t.collapse('hide'); $(this).removeClass('active-list-group-item'); }
                else { $t.collapse('show'); $(this).addClass('active-list-group-item'); }
            });

            $('.sidebar-link').off('click.desktop').on('click.desktop', function(e) {
                e.preventDefault(); e.stopPropagation();
                $('.sidebar-link').removeClass('active');
                $(this).addClass('active');
                const $pc = $(this).closest('.collapse');
                $('.list-group-item + div').not($pc).collapse('hide');
                $('.list-group-item').removeClass('active-list-group-item');
                $pc.collapse('show');
                $pc.prev('.list-group-item').addClass('active-list-group-item');
                const divID = $(this).prop('href').split('=').pop();
                showProject(divID);
                const newUrl = window.location.protocol + '//' + window.location.host +
                    window.location.pathname + '?name=' + divID;
                window.history.pushState({ path: newUrl }, '', newUrl);
            });

            window.desktopAccordionInitialized = true;
        }
    }
}

let resizeTimer;
$(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        if (window.innerWidth > 991) window.desktopAccordionInitialized = false;
        initDrawerToggle();
    }, 250);
});

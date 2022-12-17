var tags = [];

var tour_live = false;
var autoplay_open = false;
var tourProjects = [];
var tour_index = -1;
var tour_project_index = -1;
var tour_interval = 10000;
var title_timeout;
var tour_total = 0;
var tour_sections = [];
var tour_live_open = false;
var tourTimeouts = [];
var tour_curr = -1;
var tour_times = [];
var tour_length = 0;
var tour_active = null;
var tour_ended = false;
var tour_player;
var tour_muted = false;

$(document).ready(function () {

    initListenersCTW();
    init_three();

});

function initListenersCTW() {

    // getTags();

    $(".space--course--list li").click(function () {
        var course = $(this).attr('data-course');
        if ($(this).hasClass('selected')) {
            setFilter('remove');
        } else {
            $(".space--course--list").addClass("filter");
            $(".space--course--list li").removeClass('selected');
            $(this).addClass('selected');
            $(".curr--filter").text($(this).text());
            setFilter(course);
        }
    });

    $(".detail--close").click(function () {
        closePoint(INTERSECTED);
    });
    $(".detail--view").click(function () {
        loadProject(hovered);
    });

    $(".tour--view").click(function () {
        var dest = $(this).attr('data-dest');
        if (!tour_live) {
            loadProject(dest);
        } else {
            window.open(root + '/' + dest, "_blank");
        }
    });
    $(".tour--volume .vid--mute").click(function () {
        if (tour_muted) {
            tour_player.setVolume(0.8);
            tour_muted = false;
            $(this).removeClass('muted');
        } else {
            tour_player.setVolume(0);
            tour_muted = true;
            $(this).addClass('muted');
        }
    });
    $(".tour--play").click(function () {
        tour_player.play();
        $(".tour--play").removeClass('enabled');
        resetTour();

    });
    $(".tour--message, .tour--button").hover(function () {
        $(this).addClass('hovered');
        setTourHover();
    }, function () {
        $(this).removeClass('hovered');
        setTourHover();
    });
    $(".tour--message, .tour--button").focus(function () {
        $(this).addClass('hovered');
        setTourHover();
    });
    $(".tour--message, .tour--button").blur(function () {
        $(this).removeClass('hovered');
        setTourHover();
    });

    $(".graduate").focus(function () {
        if (keyboard) {
            let dest = $(this).attr('data-dest');
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].userData.dest == dest) {
                    changePoint(objects[i]);
                }
            }
        }
    });
    $(".graduate").blur(function () {
        if (keyboard) {
            let dest = $(this).attr('data-dest');
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].userData.dest == dest) {
                    closePoint(objects[i]);
                }
            }
        }
    });

    setInterval(checkTourTime, 10000);
    checkTourTime();

};

function loadHandlerCTW() {

    if (pages[1]) {

        hash = window.location.hash.replace('#', '');
        if (hash != '') {
            $(".space--course--list li").each(function () {
                if (hash == $(this).attr('data-course')) {
                    $(this).addClass('selected');
                    $(".curr--filter").text($(this).text());
                    setFilter(hash);
                }
            });
        }

    } else {


    }
}


function checkTourTime() {

    if (!project_open) {

        var d = moment.tz("Europe/London");
        var h = parseInt(d.format('H'));
        var min = parseInt(d.format('m'));
        var sec = parseInt(d.format('s'));
        var curr_t = h + (min / 60) + ((sec / 60) / 60);

        var found = false;

        $(".tour--button").attr('tabindex', -1).attr('aria-hidden', 'true');
        $(".autoplay--button").attr('tabindex', 0).attr('aria-hidden', 'false');
        $(".tour--message").attr('tabindex', -1).attr('aria-hidden', 'true');

        for (var i = 0; i < tours.length; i++) {
            var t_split = tours[i].time.split(':');
            var start_t = parseInt(t_split[0]) + (parseInt(t_split[1]) / 60)
            var end_t = start_t + (tours[i].duration / 60) / 60;
            if (curr_t >= start_t && curr_t < end_t) {
                found = true;
                tour_active = tours[i];
                $(".tour--button").attr('tabindex', 0).attr('aria-hidden', 'false');
                $(".autoplay--button").attr('tabindex', -1).attr('aria-hidden', 'true');
                $(".tour--message").attr('tabindex', -1).attr('aria-hidden', 'true');
                if (Math.ceil((curr_t - start_t) * 60) > 1) {
                    $(".tour--remaining").addClass('enabled').text(Math.ceil((end_t - curr_t) * 60) + 'm Remaining');
                } else {
                    $(".tour--remaining").removeClass('enabled').text('');
                }
                $(".tour--message .course, .tour--button .course").text($(".space--course--list li[data-course='" + tours[i].course + "'] h4").text());
            } else if (curr_t < start_t && curr_t >= start_t - 0.5) {
                if (!autoplay_open) {
                    $(".tour--message").attr('tabindex', 0).attr('aria-hidden', 'false');
                } else {
                    $(".tour--message").attr('tabindex', -1).attr('aria-hidden', 'true');
                }
                $("body").addClass('tour--soon');
                $(".tour--message .time").text(Math.ceil((start_t - curr_t) * 60));
                $(".tour--message .course, .tour--button .course").text($(".space--course--list li[data-course='" + tours[i].course + "'] h4").text());
            }
        }

        if (found && !tour_live && !mobile && !tour_ended) {
            if (autoplay_open) {
                closeAutoplay();
            }
            tour_live = true;
            $("body").addClass('tour--active');
            $("body").removeClass('tour--soon');
            enterTour();
        } else if (!found) {
            tour_live = false;
            $("body").removeClass('tour--active');
        }

    }

}
function tourHandler() {
    if (tour_live) {
        if (!autoplay_open) {
            enterTour();
        } else {
            closeTour();
        }
    }
}
function enterTour() {

    disableMenu();
    $(".tab--autoplay").attr('tabindex', -1).attr('aria-hidden', 'true');
    $(".tab--default").attr('tabindex', -1).attr('aria-hidden', 'true');
    $(".tab--tour").attr('tabindex', 0).attr('aria-hidden', 'false');

    ariaMessage($(".tour--intro h4").eq(0).text());

    $("body").addClass('tour--loading').removeClass('info--open filter--open');

    $(".tour--feed").load(root + '/' + current_page + '.json', function (response, status, xhr) {

        if (status != "error") {

            $("body").addClass('tour--open tour--live');
            autoplay_open = true;

            tour_total = 0;
            $(".tour--section").each(function (index) {

                if ($(this).attr('data-course') == tour_active.course) {
                    tour_total += parseInt($(this).attr('data-time'));
                    var vid = false;
                    if ($(this).find('iframe').length > 0) {
                        vid = true;
                    }
                    tour_sections.push({ 'time': parseInt($(this).attr('data-time')), 'index': index, 'vid': vid });
                } else {
                    $(this).remove();
                }

            });
            $(".tour--section a").attr('tabindex', -1).attr('aria-hidden', 'true');
            tour_live_open = true;
            let tmin = Math.floor(tour_total / 60);
            $(".tour--runtime").text('Runtime ' + tmin + 'm');

            var d = moment.tz("Europe/London");
            var h = parseInt(d.format('H'));
            var min = parseInt(d.format('m'));
            var sec = parseInt(d.format('s'));
            var curr_t = h + (min / 60) + ((sec / 60) / 60);

            var t_split = tour_active.time.split(':');
            var start_t = parseInt(t_split[0]) + (parseInt(t_split[1]) / 60)
            var end_t = start_t + (tour_total / 60) / 60;

            var offset = (curr_t - start_t) * 60 * 60;

            if (Math.ceil((curr_t - start_t) * 60) > 1) {
                $(".tour--remaining").addClass('enabled').text(Math.ceil((end_t - curr_t) * 60) + 'm Remaining');
            } else {
                $(".tour--remaining").removeClass('enabled').text('');
            }

            setTimeout(function () {
                $("body").removeClass('tour--loading');
                getTourPosition(offset);
            }, 4000);

        } else {
            console.log('error loading tour, please try again');
            $("body").removeClass('tour--loading');
        }
    });

    setFilter('remove');
}
function getTourPosition(offset) {

    var perc = offset / tour_total;
    var c = 0;
    var index = 0;
    var curr_pro = 0;
    var p_offset = 0;
    for (var i = 0; i < tour_sections.length; i++) {
        if (c + tour_sections[i].time >= offset) {
            curr_pro = i;
            p_offset = 1 - ((c + tour_sections[i].time - offset) / tour_sections[i].time);
            index = i;
            break;
        } else {
            c += tour_sections[i].time;
        }
    }

    setTour(curr_pro);
}
function setTour(index) {

    tour_curr = index;

    var sec_index = tour_sections[index].index;

    setTourFeed(sec_index);

    if (!tour_sections[index].vid) {

        autoplayNext(sec_index, 0);

    } else {
        tourPlayVid(sec_index);
        autoplayNext(tour_sections[index].count[0], 0);
        var tt_vid = setTimeout(function () {
            removeTourVid(sec_index);
        }, (tour_sections[index].time + 1) * 1000);
        tourTimeouts.push(tt_vid);
    }

    $(".tour--progress").css({ 'transition': 'transform 1s', 'transform': 'translate(-100%, 0)' });
    setTimeout(function () {
        $(".tour--progress").css({ 'transition': 'transform ' + (tour_sections[index].time + 2) + 's linear', 'transform': 'translate(0, 0)' });
    }, 1000);

    var tt = setTimeout(function () {
        var next = index + 1;
        if (next < tour_sections.length) {
            setTour(next);
        } else {
            tour_ended = true;
            tour_live = false;
            $("body").removeClass('tour--active');
            closeTour();
        }
    }, (tour_sections[index].time + 2) * 1000);
    tourTimeouts.push(tt);

}
function tourPlayVid(index) {
    $("body").addClass('tour--video--playing');
    var iframe = $(".tour--section[data-project='" + index + "']").find('iframe');
    iframe.on("load", function () {
        iframe.off();
        tour_player = new Vimeo.Player(iframe[0]);
        tour_player.play().then(function () {

        }).catch(function (error) {
            switch (error.name) {
                default:
                    if (error.name != 'PlayInterrupted') {
                        $(".tour--play").addClass('enabled');
                    }
                    break;
            }
        });
        if (!tour_muted) {
            tour_player.setVolume(0.8);
            tour_player.setMuted(false).then(function (muted) {
                $(".tour--volume .vid--mute").removeClass('muted');
                tour_muted = false;
            }).catch(function (error) {
                $(".tour--volume .vid--mute").addClass('muted');
                tour_muted = true;
            });
        }
        tour_player.on('play', function () {
            iframeResize(iframe);
        });
        iframeResize(iframe);
    }).each(function () {
        if (this.complete) {
            $(this).trigger('load');
        }
    });
    iframe.attr('src', iframe.attr('data-src'));
}
function removeTourVid(index) {
    $("body").removeClass('tour--video--playing');
    var iframe = $(".tour--section[data-project='" + index + "']").find('iframe');
    setTimeout(function () {
        iframe.attr('src', '');
    }, 1000);
}
function setTourFeed(index) {
    $(".tour--section").removeClass('enabled').attr('aria-hidden', 'true').attr('role', '');
    $(".tour--section[data-project='" + index + "']").addClass('enabled').attr('aria-hidden', 'false').attr('role', 'alert');
    var content = $(".tour--section[data-project='" + index + "']").find('.tour--scroll--wrapper');
    content.find('img').each(function (index) {
        $(this).on('load', function () {
            if (index == content.find('img').length - 1) {
                var h = content.outerHeight() - content.parent().height();
                content.css({ 'transform': 'translate3d(0, ' + -h + 'px, 0)' });
            }
        })
        $(this).attr('src', $(this).attr('data-src'));
    });

}
function resetTour() {
    for (var i = 0; i < tourTimeouts.length; i++) {
        clearTimeout(tourTimeouts[i]);
    }
    tourTimeouts = [];
    setTour(tour_curr);
}
function closeTour() {

    enableMenu();
    $(".tab--autoplay").attr('tabindex', -1).attr('aria-hidden', 'true');
    $(".tab--default").attr('tabindex', 0).attr('aria-hidden', 'false');
    $(".tab--tour").attr('tabindex', -1).attr('aria-hidden', 'true');

    ariaMessage("Leaving Tour, thanks for viewing");

    tour_live_open = false;
    autoplay_open = false;
    focused = false;
    hovered = '';

    tour_project_index = -1;
    tour_index = -1;

    for (var i = 0; i < tourTimeouts.length; i++) {
        clearTimeout(tourTimeouts[i]);
    }
    tourTimeouts = [];

    removeTourVid(tour_sections[tour_curr].index);
    setFilter('remove');

    $("body").removeClass('tour--open tour--live detail--open');
    $(".tour--section").removeClass('enabled');

    var from = {
        x: scene.position.x,
        y: scene.position.y,
        z: scene.position.z
    };
    var to = {
        x: 0,
        y: 0,
        z: 0
    };
    tween3 = new TWEEN.Tween(from)
        .to(to, 3000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function () {
            scene.position.set(from.x, from.y, from.z);
        })
        .start();

    setTimeout(function () {
        $(".tour--feed").children().remove();
    }, 1000);

    $(".draw--wrapper .item").removeClass('selected');


    $("body").addClass('tour--leaving');
    setTimeout(function () {
        $("body").removeClass('tour--leaving');
    }, 4000);
}

function setTourHover() {
    $(".tour--message, .tour--button").each(function () {
        if ($(this).hasClass('hovered')) {
            const h = $(this).find('.course')[0].scrollWidth + padding / 2;
            $(this).find('.course').css({ 'width': h + 'px' });
        } else {
            $(this).find('.course').css({ 'width': '' });
        }
    });
}






function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
var mobile = false;
var touch = false;
var padding = 15;
let reduced_motion = false;
let keyboard = false;

let space = 'BA';

var root = "";
var current_page = "";
var current_space = "";
var pages = [];
var pop = false;
var project_open = false;
let ariaMessageTimeout;

var filter = '';


$(document).ready(function () {

	if (window.innerWidth < 900) {
		mobile = true;
		padding = 10;
	} else if (window.innerWidth < 1100) {
		padding = 12;
	} else {
		padding = 15;
	}
	if ("ontouchstart" in document.documentElement) {
		touch = true;
		$("body").addClass('touch');
	}

	if ($("body").hasClass("undergraduate")) {
		space = 'BA';
	} else {
		space = 'MA';
	}

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		reduced_motion = true;
		$("body").addClass('reduced--motion');
	}

	initListeners();

});


function initListeners() {

	window.addEventListener('keydown', handleFirstTab);

	$.ajaxSetup
		({
			// Disable or Enable caching of AJAX
			cache: false // or true
		});

	if (!touch) {
		$(".space--menu--block").not('.space--menu--button').hover(function () {
			openPanel($(this));
		}, function () {
			closePanel($(this));
		});

		$(".space--menu--block").not('.space--menu--button').focus(function () {
			openPanel($(this));
		});
		$(".space--menu--block").not('.space--menu--button').blur(function () {
			closePanel($(this));
		});

		$(".space--menu--block a, .space--menu--block button").focus(function () {
			if (!$(this).parents(".space--menu--block").hasClass('open')) {
				openPanel($(this).parents(".space--menu--block"));
			}
		});
		$(".space--menu--block a, .space--menu--block button").blur(function () {
			let index = $(this).parents(".space--menu--block").find("a, button").index($(this));
			let total = $(this).parents(".space--menu--block").find("a, button").length;
			if (index == total - 1) {
				closePanel($(this).parents(".space--menu--block"));
			}
		});

	} else {
		$(".space--menu--block").not('.space--menu--button').children('.space--block--title').click(function () {
			if (!$(this).parent().hasClass('open')) {
				$('body').removeClass('filter--open programme--open info--open');
				openPanel($(this).parent());
			} else {
				closePanel($(this).parent());
			}
		});
	}

	$(".space--nav a").click(function (e) {
		e.preventDefault();
		var url = $(this).attr('href');
		$('body').addClass('load');
		if (url.includes('undergraduate')) {
			$("body").addClass('undergraduate');
		} else {
			$("body").removeClass('undergraduate');
		}
		setTimeout(function () {
			window.location = url;
		}, 1500);
	});

	$(".graduate, .costume--project--list a").click(function (e) {
		e.preventDefault();
		var dest = $(this).attr('data-dest');
		loadProject(dest);
	});
	$(".project--back").click(function (e) {
		if (!$(this).hasClass("project--solo")) {
			closeProject();
		}
	});
	$(".project--back").hover(function (e) {
		$(".project--page").addClass('hover');
	}, function () {
		$(".project--page").removeClass('hover');
	});
	$(".project--back").focus(function (e) {
		$(".project--page").addClass('hover');
	});
	$(".project--back").blur(function (e) {
		$(".project--page").removeClass('hover');
	});

	$(".space--info--mobile").click(function () {
		$('body').removeClass('filter--open programme--open');
		closePanel($(".space--nav"));
		if ($('body').hasClass('info--open')) {
			$('body').removeClass('info--open');
		} else {
			$('body').addClass('info--open');
		}
	});
	$(".space--course--mobile").click(function () {
		$('body').removeClass('info--open programme--open');
		closePanel($(".space--nav"));
		if ($('body').hasClass('filter--open')) {
			$('body').removeClass('filter--open');
		} else {
			$('body').addClass('filter--open');
		}
	});
	$(".space--costume--mobile").click(function () {
		$('body').removeClass('info--open');
		closePanel($(".space--nav"));
		if ($('body').hasClass('programme--open')) {
			$('body').removeClass('programme--open');
		} else {
			$('body').addClass('programme--open');
		}
	});

	$(".space--desc a").attr('target', '_blank');

	$(".timetable--zone").text(moment.tz("Europe/London").format('z'));

	setTimeout(titleMarquee, 2000);
	setInterval(titleMarquee, 8000);
	$(window).on("resize", resizeHandler);
	getPaths();
	loadHandler();
	window.addEventListener('popstate', function (event) {
		getPaths();
	});

}
function handleFirstTab(e) {
	if (e.keyCode === 9 || e.ctrlKey) { // the "I am a keyboard user" key
		keyboard = true;
		document.body.classList.add('keyboard--controls');
		window.removeEventListener('keydown', handleFirstTab);
		$(".track input").attr('step', 0.01);
	}
	if (e.ctrlKey && e.altKey) {  // case sensitive
		keyboard = true;
		document.body.classList.add('keyboard--controls');
		window.removeEventListener('keydown', handleFirstTab);
		$(".track input").attr('step', 0.01);
	}
}
function loadHandler() {
	if (pages[1]) {

		$("body").addClass('quick--load');
		quick_load = true;
		if (pages[2]) {
			$("body").addClass('project--loading');
		}

		setTimeout(function () {

			$("body").removeClass('load');

			if (pages[2]) {
				project_open = true;
				$("body").addClass('project--open');
				projectListeners();
			}
			setTimeout(function () {
				quick_load = false;
				$("body, html").removeClass('viewer--loading');
				$("body").removeClass('quick--load');
			}, 500);

		}, 1000);
	} else {
		setTimeout(function () {
			$("body").removeClass('load');
		}, 1000);
	}
}
function openPanel(el) {
	var h = el[0].scrollHeight;
	if (h > window.innerHeight - (padding * 2)) {
		h = window.innerHeight - (padding * 2);
	}
	el.css({ "height": h + 'px' }).addClass('open');
}
function closePanel(el) {
	el.css({ "height": '' }).removeClass('open').animate({ 'scrollTop': 0 }, 500);
}
function loadProject(dest) {

	disableMenu();
	$(".tab--default, .tab--autoplay, .tab--tour, .tour--button, .autoplay--button").attr('tabindex', -1);
	$(".tab--project").attr('tabindex', 0);

	$(".collection--draw, .overlay, .research--detail, .main--wrapper, .costume--controls, .tour--controls").attr('aria-hidden', 'true');
	$(".project--back").attr('aria-hidden', 'false');

	project_open = true;

	if (root != '' && dest.includes(root.replace('/', '') + '/')) {
		dest = dest.replace(root.replace('/', '') + '/', '');
	}

	$("body").addClass('project--open project--loading');
	$(".project--page").load(root + '/' + dest + '.json', function (response, status, xhr) {
		if (status != "error") {

			projectListeners();

			if (!quick_load && !pop) {
				window.history.pushState({}, root + "/" + dest, root + "/" + dest);
			} else if (pop) {
				pop = false;
			}

			$(".summary--block a, .text--block a").addClass('tab--project');

			if (keyboard) {
				$(".track input").attr('step', 0.01);
			}

			if ($(".project--back").hasClass('project--solo')) {
				getPaths();
				$(".project--back").attr('href', root + '/' + current_page);
			}

			pauseSpaces();

		} else {
			console.log('error loading project, please try again');
		}
	});
}
function changeProject(dest) {
	$("body").addClass('project--loading project--change');
	setTimeout(function () {
		$(".project--page").scrollTop(0);
		$(".project--page").html('');
		loadProject(dest);
	}, 1000);
	setTimeout(function () {
		$("body").removeClass('project--change');
	}, 2000);
}
function closeProject() {

	if (!autoplay_open) {
		enableMenu();
		$(".tab--default").attr('tabindex', 0);
	} else {
		$(".tab--autoplay").attr('tabindex', 0);
	}
	$(".tab--project").attr('tabindex', -1);

	$(".collection--draw, .overlay, .main--wrapper, .costume--controls, .tour--controls").attr('aria-hidden', 'false');
	$(".project--back").attr('aria-hidden', 'true');

	project_open = false;
	playSpaces();
	$("body").removeClass('project--open');
	if (!pop) {
		window.history.pushState({}, root + '/' + current_page, root + '/' + current_page);
	} else {
		pop = false;
	}
	if (filter && filter != '') {
		window.location.hash = filter;
	}

	objects3d = [];
	objectsUpdated = true;

	if (keyboard && !autoplay_open) {
		$(".draw--wrapper .item.opened").focus();
		if (current_page == "undergraduate/design-for-performance") {
			$(".tour--view").focus();
		}
	}

	setTimeout(function () {
		$(".project--page").html('');
	}, 500);
}

function pauseSpaces() {
	if (current_page == 'costume-design') {
		pauseVids();
	}
	if (current_page == 'film-and-photography') {
		pauseAll();
	}
}
function playSpaces() {
	if (current_page == 'costume-design') {
		playVids();
	}
}
function enableMenu() {
	$(".space--menu").attr('aria-hidden', 'false');
	$(".tab--menu, .space--menu--block a, .space--menu--block button").attr('tabindex', 0);
}
function disableMenu() {
	$(".space--menu").attr('aria-hidden', 'true');
	$(".tab--menu, .space--menu--block a, .space--menu--block button").attr('tabindex', -1);
}
function ariaMessage(message) {
	clearTimeout(ariaMessageTimeout);
	$(".viewer--message").remove();
	var message = $('<span class="viewer--message" role="alert">' + message + '</span>');
	$("body").prepend(message);
	ariaMessageTimeout = setTimeout(function () {
		$(".viewer--message").remove();
	}, 5000);
}
function titleMarquee(state) {
	$(".title--scroll").each(function () {
		var w = $(this).children().outerWidth();
		var pw = $(this).outerWidth();
		if (w > pw && state != 'reset') {
			if ($(this).hasClass('scrolled')) {
				$(this).children().css({ "transform": 'translate(0, 0)' });
				$(this).removeClass('scrolled');

			} else {
				$(this).children().css({ "transform": 'translate(' + -(w - pw + padding * 2) + 'px, 0)' });
				$(this).addClass('scrolled');
			}
		} else {
			$(this).children().css({ 'transition': 'transform 0s' });
			$(this).removeClass('scrolled');
			var that = $(this);
			setTimeout(function () {
				that.children().css({ "transform": 'translate(0, 0)' });
			}, 10);
			setTimeout(function () {
				that.children().css({ 'transition': '' });
			}, 1000);
		}
	});
}
function resizeHandler() {
	if (window.innerWidth < 900) {
		mobile = true;
	} else {
		mobile = false;
	}
	if (window.innerWidth < 900) {
		padding = 10;
	} else if (window.innerWidth < 1100) {
		padding = 12;
	} else {
		padding = 15;
	}

	if ($("body").hasClass('project--open')) {
		iframeResize($(".vimeo--block iframe, .video--block--3d iframe"));
	}
}
function getPaths() {
	pages = [];
	var path = location.pathname;
	var breakpoint;
	if (path != '/') {
		if (path[path.length - 1] == '/') {
			path = path.slice(0, path.length - 1);
		}
		var path_split = path.split('/');
		root = '';
		for (var i = 0; i < path_split.length; i++) {
			if (path_split[i] != '') {
				if (path_split[i] == 'MA21') {
					root += '/MA21';
					breakpoint = i;
					break;
				} else if (path_split[i] == 'staging') {
					root += '/staging';
					breakpoint = i;
					break;
				} else {
					root += '/' + path_split[i];
				}
			}
		}
		if (breakpoint == undefined) {
			root = '';
			breakpoint = 0;
			current_page = path_split[breakpoint + 1] + '/' + path_split[breakpoint + 2];
			current_space = path_split[breakpoint + 2];
		} else if (path_split[breakpoint + 2] == undefined) {
			current_page = '';
		} else {
			current_page = path_split[breakpoint + 1] + '/' + path_split[breakpoint + 2];
			current_space = path_split[breakpoint + 2];
		}
		for (var i = breakpoint + 1; i < path_split.length; i++) {
			pages.push(path_split[i]);
		}
		if (root == '/') {
			root = '';
		}
	} else {
		root = '';
	}
}

function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
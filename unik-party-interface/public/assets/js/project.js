var can_play = true;
var muted = false;
var vid_volume = 0.8;
var viewer_idle;
var playing = false;

let objects3d = [];
let objectsUpdated = false;

$(document).ready(function(){


});

function projectListeners(){
	initSlides();
	inlineControls();
	iframeResize($(".vimeo--block iframe, .video--block--3d iframe"));

	$(".index--space--title").click(function(e){
		if(!$(".project--back").hasClass('project--solo') && $(this).attr('data-dest') == current_page){
			e.preventDefault();
			closeProject();
		} else {

		}
	});
	$(".graduates--list .graduate").click(function(e){
		e.preventDefault();
		var dest = $(this).attr('data-dest');
		changeProject(dest);
	});

	$(".project--course").click(function(){
		if(!$(".project--back").hasClass('project--solo')){
			closeProject();
			var course = $(this).attr('data-course');
			setFilter(course);
			$(".space--course--list").addClass("filter");
			$(".space--course li[data-course='" + course + "']").addClass('selected');
			$(".curr--filter").text($(".space--course li[data-course='" + course + "']").text());
		} else {
			window.location = $(this).attr('data-url');
		}
	});

	$(".project--block a").attr('target', '_blank');

	// Long form text
	$(".contents--title").click(function(){
		if(mobile){
			if($(this).parent().hasClass('open')){
				$(this).parent().removeClass('open').css({'height': ''});
			} else {
				$(this).parent().addClass('open');
				contentsHeight($(this).parent());
			}
		}
	});
	$(".essay--content").scroll(function(){
		var s = $(this).scrollTop();
		var that = $(this);
		$(this).children().each(function(){
			var offset = $(this).offset().top - that.offset().top - padding;
			if(offset < 0 && offset + $(this).outerHeight() > 0){
				var index = parseInt($(this).attr('data-section'));
				that.parents('.text--block--long').find('.contents').find('li').removeClass('selected');
				that.parents('.text--block--long').find('.contents').find('li[data-section="' + index + '"]').addClass('selected');
			}
		});
	});
	$(".essay--content a").attr('target', '_blank');

	setTimeout(function(){
		$("body").removeClass('project--loading');
	}, 2000);

	$(".threed--block").each(function(){
		let data = $(this).attr('data-object');
		const obj = JSON.parse(data);
		objects3d.push({el: $(this), data: obj});
		objectsUpdated = true;
	});
}

function initSlides(){
	$(".slick").each(function(){
		$(this).slick({
			prevArrow: $(this).siblings(".slideshow--controls").children(".slideshow--prev"),
			nextArrow: $(this).siblings(".slideshow--controls").children(".slideshow--next"),
			variableWidth: true,
			centerMode: true,
			focusOnSelect: true,
			lazyLoad: 'ondemand'
		});
	});
	$(".slick").slick("slickGoTo", 0, false);

	$(".slideshow--item").hover(function(){
		if(!$(this).hasClass('slick-current')){
			var curr_index = $(this).parent().children().index($(this).parent().find(".slick-current"));
			var index = $(this).parent().children().index($(this));
			if(index > curr_index){
				$(this).css({'cursor': 'e-resize'});
			} else if(index < curr_index) {
				$(this).css({'cursor': 'w-resize'});
			} else {
				$(this).css({'cursor': 'grab'});
			}
		} else {
			$(this).css({'cursor': 'grab'});
		}
	}, function(){
		$(this).css({'cursor': 'grab'});
	});
}

function contentsHeight(el){
	var h = el[0].scrollHeight;
	el.css({'height': h + 'px'});
}


function inlineControls(){

	$(".vimeo--block iframe").each(function(){

		var inline_player = new Vimeo.Player($(this)[0]);
		var inline_control = $(this).siblings(".vid--controls--inline");
		var inline_playing = false;
		var inline_muted = false;
		var inline_duration = 0;
		var inline_idle;
		var trackInterval;

		// inline timer
		inline_player.getDuration().then(function(duration) {
		    inline_duration = duration;
		    updateTime();
		    trackInterval = setInterval(function(){
		    	if(inline_playing){
			    	updateTime();
			    }
		    }, 30);
		});
		function updateTime(){
			inline_player.getCurrentTime().then(function(seconds) {
		    	var val = (seconds/inline_duration) * 100;
			    var s = Math.round(seconds % 60);
			    var m = Math.floor(seconds / 60);
			    var ds = Math.round(inline_duration % 60);
			    var dm = Math.floor(inline_duration / 60);
			    inline_control.find(".vid--time").text(pad(m, 2) + ':' + pad(s, 2) + ' / ' + pad(dm, 2) + ':' + pad(ds, 2));
			});
		}
		function setIdle(){
			clearTimeout(inline_idle);
			inline_control.parent().removeClass('viewer--idle');
			inline_idle = setTimeout(function(){
				if(inline_playing){
					inline_control.parent().addClass('viewer--idle');
				}
			}, 3000);
		}

		// IDLE TIMER
	    if(!touch){
			inline_control.parent().mousemove(function(){
				setIdle();
			});
			inline_control.find('button').focus(function(){
				setIdle();
			});
		} else {
			inline_control.parent().click(function(){
				setIdle();
			});
		}

		//inline play
		inline_control.find(".vid--play--inline").click(function(){
			if(!inline_playing){
				inline_playing = true;
				inline_player.play();
				$(this).addClass('playing');
			} else {
				inline_playing = false;
				inline_player.pause();
				setIdle();
				$(this).removeClass('playing');
			}
		});
		$(this).parent().click(function(e){
			if($(e.target).parents('.vid--controls').length == 0){
				if(!inline_playing){
					inline_playing = true;
					inline_player.play();
					setIdle();
					inline_control.find(".vid--play--inline").addClass('playing');
				} else {
					inline_playing = false;
					inline_player.pause();
					inline_control.find(".vid--play--inline").removeClass('playing');
				}
			}
		});

		//inline mute
		inline_control.find(".vid--mute").click(function(){
			if(inline_muted){
				inline_player.setVolume(0.8);
				inline_muted = false;
				$(this).removeClass('muted');
			} else {
				inline_player.setVolume(0);
				inline_muted = true;
				$(this).addClass('muted');
			}
		});

		//inline open
		inline_control.find(".vid--open").click(function(){

			if(can_play){

				$(".tab--video").attr('tabindex', 0);
				$(".tab--project").attr('tabindex', -1);

				inline_playing = false;
				inline_player.pause();
				inline_control.find(".vid--play--inline").removeClass("playing");

				player_open = true;
				can_play = false;
				$(this).addClass('opened');
				$('body').addClass('vid--enabled');

				var url = $(this).attr('data-video');
				var controls_disabled = $(this).attr('data-controls');

				var mute = 0;
				if(touch){
					mute = 1;
				}
				$('.vid--wrapper').append('<iframe aria-hidden="true" class="" id="vimeo_player" src="https://player.vimeo.com/video/' + url + '?title=0&byline=0&portrait=0&background=1&loop=1&muted=' + mute + '" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>');
				$(".vid--wrapper #vimeo_player").on('load', function(){
					inline_player.getCurrentTime().then(function(seconds) {
						videoControls('vimeo', seconds);
						if(controls_disabled && controls_disabled == 'true'){
							$(".vid--viewer .vid--controls").addClass('hide');
						} else {
							$(".vid--viewer .vid--controls").removeClass('hide');
						}
					});
				});
			}
		});

	});

	$(".project--page video").each(function(){

		var inline_player = $(this)[0];
		var inline_control = $(this).siblings(".vid--controls--inline");
		var inline_playing = false;
		var inline_muted = false;
		var inline_duration = 0;
		var inline_idle;
		var trackInterval;

		// inline timer
		if(inline_player.duration){
			inline_duration = inline_player.duration;
		}
	    updateTime();
	    inline_player.onloadedmetadata = function() {
		  inline_duration = inline_player.duration;
		  updateTime();
		};
	    trackInterval = setInterval(function(){
	    	if(inline_playing){
		    	updateTime();
		    }
	    }, 30);
		function updateTime(){
			var seconds = inline_player.currentTime;
	    	var val = (seconds/inline_player.duration) * 100;
		    var s = Math.round(seconds % 60);
		    var m = Math.floor(seconds / 60);
		    var ds = Math.round(inline_player.duration % 60);
		    var dm = Math.floor(inline_player.duration / 60);
		    inline_control.find(".vid--time").text(pad(m, 2) + ':' + pad(s, 2) + ' / ' + pad(dm, 2) + ':' + pad(ds, 2));
		}
		function setIdle(){
			clearTimeout(inline_idle);
			inline_control.parent().removeClass('viewer--idle');
			inline_idle = setTimeout(function(){
				if(inline_playing){
					inline_control.parent().addClass('viewer--idle');
				}
			}, 3000);
		}

		// IDLE TIMER
	    if(!touch){
			inline_control.parent().mousemove(function(){
				setIdle();
			});
			inline_control.find('button').focus(function(){
				setIdle();
			});
		} else {
			inline_control.parent().click(function(){
				setIdle();
			});
		}

		//inline play
		inline_control.find(".vid--play--inline").click(function(){
			if(!inline_playing){
				inline_playing = true;
				inline_player.play();
				setIdle();
				$(this).addClass('playing');
			} else {
				inline_playing = false;
				inline_player.pause();
				$(this).removeClass('playing');
			}
		});
		$(inline_player).click(function(){
			if(!inline_playing){
				inline_playing = true;
				inline_player.play();
				setIdle();
				inline_control.find(".vid--play--inline").addClass('playing');
			} else {
				inline_playing = false;
				inline_player.pause();
				inline_control.find(".vid--play--inline").removeClass('playing');
			}
		});

		//inline mute
		inline_control.find(".vid--mute").click(function(){
			if(inline_muted){
				inline_player.volume = 0.8;
				inline_muted = false;
				$(this).removeClass('muted');
			} else {
				inline_player.volume = 0;
				inline_muted = true;
				$(this).addClass('muted');
			}
		});

		//inline open
		inline_control.find(".vid--open").click(function(){

			if(can_play){

				$(".tab--video").attr('tabindex', 0);
				$(".tab--project").attr('tabindex', -1);

				inline_playing = false;
				inline_player.pause();
				inline_control.find(".vid--play--inline").removeClass("playing");

				player_open = true;
				can_play = false;
				$(this).addClass('opened');
				$('body').addClass('vid--enabled');

				var url = $(this).attr('data-video');
				var controls_disabled = $(this).attr('data-controls');

				$('.vid--wrapper').append('<video aria-hidden="true" src="' + url + '" playsinline loop autoplay></video>');
				$(".vid--wrapper video").on('loadedmetadata', function(){
					var seconds = inline_player.currentTime;
					videoControls('video', seconds);
					$(".vid--viewer .vid--controls").removeClass('hide');
				});
			}
		});
		
	});

	$(".project--page audio").each(function(){

		var inline_player = $(this)[0];
		var inline_control = $(this).siblings(".vid--controls--inline");
		var inline_playing = false;
		var inline_muted = false;
		var inline_duration = 0;
		var trackInterval;
		var hold = false;
	    var hold_volume = false;

	    var dragTimeout = false;
	    var setTime = 0;
	    var setVolume = 0;

	    volumeCheck();
	    var val = vid_volume * 100;
	    inline_control.find(".vid--volume").children(".track--progress").css({"width": val + "%"});
	    inline_control.find(".vid--volume").children('input').val(val / 100);

		// inline timer
		if(inline_player.duration){
			inline_duration = inline_player.duration;
		}
	    updateTime();
	    inline_player.onloadedmetadata = function() {
		  inline_duration = inline_player.duration;
		  updateTime();
		};
	    trackInterval = setInterval(function(){
	    	if(inline_playing && !hold){
		    	updateTime();
		    }
	    }, 30);
		function updateTime(){
			if(inline_player.duration){
				inline_duration = inline_player.duration;
			}
			var seconds = inline_player.currentTime;
	    	var val = (seconds/inline_player.duration) * 100;
	    	inline_control.find(".vid--timeline").children(".track--progress").css({"width": val + "%"});
		    var s = Math.round(seconds % 60);
		    var m = Math.floor(seconds / 60);
		    var ds = Math.round(inline_player.duration % 60);
		    var dm = Math.floor(inline_player.duration / 60);
		    inline_control.find(".vid--time").text(pad(m, 2) + ':' + pad(s, 2) + ' / ' + pad(dm, 2) + ':' + pad(ds, 2));
		    inline_control.find(".vid--timeline").children('input').val(val / 100);
		}

		//inline play
		inline_control.find(".vid--play--inline").click(function(){
			if(!inline_playing){
				inline_playing = true;
				inline_player.play();
				$(this).addClass('playing');
			} else {
				inline_playing = false;
				inline_player.pause();
				$(this).removeClass('playing');
			}
		});

		//inline mute
		inline_control.find(".vid--mute").click(function(){
			if(inline_muted){
				inline_muted = false;
				$(this).removeClass('muted');
				if(vid_volume == 0){
					vid_volume = 0.8;
				}
				inline_player.volume = vid_volume;
				var val = vid_volume * 100;
			    inline_control.find(".vid--volume").children(".track--progress").css({"width": val + "%"});
			    inline_control.find(".vid--volume").children('input').val(vid_volume);
			} else {
				inline_player.volume = 0;
				inline_muted = true;
				$(this).addClass('muted');
				inline_player.volume = 0;
			    inline_control.find(".vid--volume").children(".track--progress").css({"width": 0 + "%"});
			    inline_control.find(".vid--volume").children('input').val(0);
			}
		});

		inline_control.find(".vid--timeline").children('input').mousedown(function(e){
			hold = true;
		});
		inline_control.find(".vid--timeline").children('input').on('change', function(e){
			setTime = $(this).val() * inline_duration;
			inline_player.currentTime = setTime;
			var val = (setTime/inline_duration) * 100;
		    inline_control.find(".vid--timeline").children(".track--progress").css({"width": val + "%"});
		    var s = Math.round(setTime % 60);
		    var m = Math.floor(setTime / 60);
		    var ds = Math.round(inline_duration % 60);
		    var dm = Math.floor(inline_duration / 60);
		    inline_control.find(".vid--time").text(pad(m, 2) + ':' + pad(s, 2) + ' / ' + pad(dm, 2) + ':' + pad(ds, 2));
		    inline_control.addClass("seeking");
		});
		inline_control.find(".vid--timeline").children('input').on('input', function(e){
			var val = (($(this).val() * inline_duration)/inline_duration) * 100;
			inline_control.find(".vid--timeline").children(".track--progress").css({"width": val + "%"});
			var s = Math.round(($(this).val() * inline_duration) % 60);
		    var m = Math.floor(($(this).val() * inline_duration) / 60);
		    var ds = Math.round(inline_duration % 60);
		    var dm = Math.floor(inline_duration / 60);
		    inline_control.find(".vid--time").text(pad(m, 2) + ':' + pad(s, 2) + ' / ' + pad(dm, 2) + ':' + pad(ds, 2));
		    inline_control.addClass("seeking");
		});

		inline_control.find(".vid--volume").children('input').on('input', function(e){
			setVolume = $(this).val();
			inline_player.volume = setVolume;
			vid_volume = setVolume;
			var val = setVolume * 100;
		    inline_control.find(".vid--volume").children(".track--progress").css({"width": val + "%"});
		    if(val == 0){
		    	inline_muted = true;
				inline_control.find(".vid--mute").addClass('muted');
		    } else {
		    	inline_muted = false;
				inline_control.find(".vid--mute").removeClass('muted');
		    }
		    volumeCheck();
		});
		$(this).parent().mouseup(function(){
			hold = false;
		});

		function volumeCheck(){
			var vol = vid_volume;
			if(muted){
				vol = 0;
			}
			if(vol > 0){
				inline_control.find(".vid--mute").addClass('vol--1');
			} else {
				inline_control.find(".vid--mute").removeClass('vol--1');
			}
			if(vol > 0.33){
				inline_control.find(".vid--mute").addClass('vol--2');
			} else {
				inline_control.find(".vid--mute").removeClass('vol--2');
			}
			if(vol > 0.66){
				inline_control.find(".vid--mute").addClass('vol--3');
			} else {
				inline_control.find(".vid--mute").removeClass('vol--3');
			}
		}
		
	});
}

function muteInlineVideo(that, type){
	var player;

	if(type == 'vimeo'){
		player = new Vimeo.Player(that.parents(".vid--controls").siblings('iframe')[0]);
		
	} else {
		player = that.siblings('video')[0];
		if(player.volume == 0){
			player.volume = 0.8;
			that.removeClass('muted');
		} else {
			player.volume = 0;
			that.addClass('muted');
		}
	}
}
function closeVideo(){

	$(".tab--video").attr('tabindex', -1);
	$(".tab--project").attr('tabindex', 0);

	player_open = false;
	$('body').removeClass('vid--enabled');
	setTimeout(function(){
		$('.vid--wrapper').html('');
		$(".vid--open.opened").focus().removeClass('opened');
	}, 500);
}

function videoControls(type, seconds){

	var player;
	if(type == 'vimeo'){
		player = new Vimeo.Player($(".vid--wrapper #vimeo_player")[0]);
	} else {
		player = $(".vid--wrapper video")[0];
	}
    var controls = $(".vid--viewer .vid--controls");
    var durationV;
    var hold = false;
    var hold_volume = false;
    var trackInterval;

    function setIdle(){
    	clearTimeout(viewer_idle);
		$('body').removeClass('viewer--idle');
		viewer_idle = setTimeout(function(){
			if(playing && !hold){
				$('body').addClass('viewer--idle');
			}
		}, 3000);
    }

    // IDLE TIMER
    if(!touch){
		$(".vid--viewer").mousemove(function(){
			setIdle();
		});
		controls.find('button, input').focus(function(){
			setIdle();
		});
		controls.find('input').on('input', function(){
			setIdle();
		});
	} else {
		$(".vid--wrapper").click(function(){
			setIdle();
		});
	}

    // SET INITAL VOLUME
    if(!muted){
	    if(type == 'vimeo'){
		    player.setVolume(vid_volume);
		} else {
			player.volume = vid_volume;
		}
	} else {
		if(type == 'vimeo'){
			player.setVolume(0);
		} else {
			player.volume = 0;
		}
	}
	var val = vid_volume * 100;
    controls.find(".vid--volume").children(".track--progress").css({"width": val + "%"});
    controls.find(".vid--volume").children('input').val(val / 100);
	volumeCheck();

	// SET INITIAL TIME
	if(type == 'vimeo'){
		player.setCurrentTime(seconds);
	} else {
		player.currentTime = seconds;
	}

    // GET DURATION
    if(type == 'vimeo'){
	    player.getDuration().then(function(duration) {
		    durationV = duration;
		    trackInterval = setInterval(function(){
		    	if(playing && !hold){
			    	player.getCurrentTime().then(function(seconds) {
				    	var val = (seconds/durationV) * 100;
					    controls.find(".vid--timeline").children(".track--progress").css({"width": val + "%"});
					    var s = Math.round(seconds % 60);
					    var m = Math.floor(seconds / 60);
					    var ds = Math.round(durationV % 60);
					    var dm = Math.floor(durationV / 60);
					    controls.find(".vid--time").text(pad(m, 2) + ':' + pad(s, 2) + ' / ' + pad(dm, 2) + ':' + pad(ds, 2));
					    controls.find(".vid--timeline").children('input').val(val / 100);
					});
			    }
		    }, 30);
		});
	} else {
		durationV = player.duration;
		trackInterval = setInterval(function(){
	    	if(playing && !hold){
		    	var seconds = player.currentTime;
		    	var val = (seconds/durationV) * 100;
			    controls.find(".vid--timeline").children(".track--progress").css({"width": val + "%"});
			    var s = Math.round(seconds % 60);
			    var m = Math.floor(seconds / 60);
			    var ds = Math.round(durationV % 60);
			    var dm = Math.floor(durationV / 60);
			    controls.find(".vid--time").text(pad(m, 2) + ':' + pad(s, 2) + ' / ' + pad(dm, 2) + ':' + pad(ds, 2));
			    controls.find(".vid--timeline").children('input').val(val / 100);
		    }
	    }, 30);
	}

    var dragTimeout = false;
    var setTime = 0;
    var setVolume = 0;

	controls.find(".vid--timeline").children('input').mousedown(function(e){
		hold = true;
		setIdle();
	});
	controls.find(".vid--timeline").children('input').on('touchstart', function(e){
		hold = true;
		setIdle();
	});
	controls.find(".vid--timeline").children('input').on('change', function(e){
		setTime = $(this).val() * durationV;
		if(type == 'vimeo'){
			player.setCurrentTime(setTime);
		} else {
			player.currentTime = setTime;
		}
		var val = (setTime/durationV) * 100;
	    controls.find(".vid--timeline").children(".track--progress").css({"width": val + "%"});
	    var s = Math.round(setTime % 60);
	    var m = Math.floor(setTime / 60);
	    var ds = Math.round(durationV % 60);
	    var dm = Math.floor(durationV / 60);
	    controls.find(".vid--time").text(pad(m, 2) + ':' + pad(s, 2) + ' / ' + pad(dm, 2) + ':' + pad(ds, 2));
	    controls.addClass("seeking");
	});
	controls.find(".vid--timeline").children('input').on('input', function(e){
		var val = (($(this).val() * durationV)/durationV) * 100;
		controls.find(".vid--timeline").children(".track--progress").css({"width": val + "%"});
		var s = Math.round(($(this).val() * durationV) % 60);
	    var m = Math.floor(($(this).val() * durationV) / 60);
	    var ds = Math.round(durationV % 60);
	    var dm = Math.floor(durationV / 60);
	    controls.find(".vid--time").text(pad(m, 2) + ':' + pad(s, 2) + ' / ' + pad(dm, 2) + ':' + pad(ds, 2));
	    controls.addClass("seeking");
	});

	controls.find(".vid--volume").children('input').on('input', function(e){
		setVolume = $(this).val();
		if(type == 'vimeo'){
			player.setVolume(setVolume);
		} else {
			player.volume = setVolume;
		}
		vid_volume = setVolume;
		var val = setVolume * 100;
	    controls.find(".vid--volume").children(".track--progress").css({"width": val + "%"});
	    if(val == 0){
	    	muted = true;
			$(".vid--mute").addClass('muted');
	    } else {
	    	muted = false;
			$(".vid--mute").removeClass('muted');
	    }
	    volumeCheck();
	});
	$(".vid--viewer").mouseup(function(){
		hold = false;
		setIdle();
	});
	$(".vid--viewer").on('touchend', function(){
		hold = false;
		setIdle();
	});

	if(type == 'vimeo'){
		player.on('play', function(data) {
			player.getDuration().then(function(duration) {
			    durationV = duration;
			    $(".vid--play").addClass('playing');
			    playing = true;
			    setIdle();
			});
		});
		player.on('seeked', function(data) {
		    controls.removeClass("seeking");
		});
	} else {
		$(player).on('play', function() {
		    durationV = player.duration;
		    $(".vid--play").addClass('playing');
		    playing = true;
		});
		$(player).on('seeked', function() {
		    controls.removeClass("seeking");
		});
	}

	$(".vid--viewer .vid--play").click(function(){
		togglePlay();
	});
	$(".vid--viewer .vid--wrapper").click(function(){
		if(!touch){
			togglePlay();
		}
	});

	$(".vid--viewer .vid--mute").click(function(){
		if(muted){
			muted = false;
			$(".vid--mute").removeClass('muted');
			if(vid_volume == 0){
				vid_volume = 0.8;
			}
			if(type == 'vimeo'){
				player.setVolume(vid_volume);
			} else {
				player.volume = vid_volume;
			}
			var val = vid_volume * 100;
		    controls.find(".vid--volume").children(".track--progress").css({"width": val + "%"});
		    controls.find(".vid--volume").children('input').val(vid_volume);
		} else {
			muted = true;
			$(".vid--mute").addClass('muted');
			if(type == 'vimeo'){
				player.setVolume(0);
			} else {
				player.volume = 0;
			}
		    controls.find(".vid--volume").children(".track--progress").css({"width": 0 + "%"});
		    controls.find(".vid--volume").children('input').val(0);
		}
		volumeCheck();
	});

	$('body').on('keypress', function(e){
		if(player_open){
			if(e.keyCode == 32 && !$(".vid--play").is(":focus")){
				togglePlay();
			}
		}
	});

	function togglePlay(){
		if(playing){
			playing = false;
			$(".vid--play").removeClass('playing');
			player.pause();
		} else {
			playing = true;
			$(".vid--play").addClass('playing');
			player.play();
		}
	}

	function volumeCheck(){
		var vol = vid_volume;
		if(muted){
			vol = 0;
		}
		if(vol > 0){
			$(".vid--viewer .vid--mute").addClass('vol--1');
		} else {
			$(".vid--viewer .vid--mute").removeClass('vol--1');
		}
		if(vol > 0.33){
			$(".vid--viewer .vid--mute").addClass('vol--2');
		} else {
			$(".vid--viewer .vid--mute").removeClass('vol--2');
		}
		if(vol > 0.66){
			$(".vid--viewer .vid--mute").addClass('vol--3');
		} else {
			$(".vid--viewer .vid--mute").removeClass('vol--3');
		}
	}

	$(".vid--close").click(function(){
		clearInterval(trackInterval);
		if(type == 'vimeo'){
			player.destroy();
		} else {
			player.src = '';
		}
		closeVideo();
		setTimeout(function(){
    		$(".vid--viewer, .vid--viewer .vid--play, .vid--viewer .vid--track, .vid--viewer .vid--close, .vid--viewer .track input, .vid--viewer .vid--mute").unbind();
    		$("body").off('keypress');
			$(".vid--play").removeClass('playing');
			controls.find(".vid--time").text('00:00 / 00:00');
			controls.find(".vid--timeline").children(".track--progress").css({"width": "0%"});
			controls.find(".vid--timeline").children("input").val(0);
			can_play = true;
    	}, 500);
	});
}

function iframeResize(sel){
	sel.each(function(){
		var that = this;
		var w = 0;
		var h = 0;
		if($(that).parent().hasClass('vimeo--block') || $(that).parent().hasClass('tour--video--wrapper')){
			var player = new Vimeo.Player(this);
			player.getVideoWidth().then(function(width) {
			    w = width;
			    player.getVideoHeight().then(function(height) {
			    	h = height;
				    var ratio = w/h;
				    $(that).css({"width": '100%'});
				    setTimeout(function(){
				    	$(that).css({"height": $(that).width() / ratio + 'px'});
				    	$(that).parent().removeClass('loading');
				    }, 10);
				});
			});
		} else {
			$(that).css({'height': ($(that).outerWidth() / 1.777777778 ) + 'px'});
		}
	});
}


function jumpToSection(that){
	var index = $(that).parent().attr('data-section');
	var essay = $(that).parents('.text--block--long').find('.essay--content');
	
	var section = essay.find('.essay--section[data-section="' + index + '"]');
	var p = section.offset().top - essay.offset().top + essay.scrollTop();
	essay.animate({'scrollTop': p}, 1000);
}

"use strict";
function analyticsPageLoaded() {
  try {
    _satellite.track("data_available");
  } catch (e) {}
  try {
    if (free_messaging) {
      sendAnalyticsPurchaseData({
        packageCode: "SMS",
        origPrice: 0,
        transactionId: 0,
        productDesc: "Free Messaging"
      });
    }
  } catch (e) {
    "ReferenceError" != e.name && window.console && void 0;
  }
}
function sendAnalyticsPurchaseData(e) {
  try {
    var a = {
      productName: e.packageCode,
      purchaseAmount: e.origPrice,
      purchaseConfirmationId: e.transactionId,
      purchaseTitle: e.productDesc
    };
    e.voucherCode && (a.voucherNbr = e.voucherCode),
      window.console && void 0,
      (data_a.product = a),
      _satellite.track("purchase_confirmation");
  } catch (e) {
    "ReferenceError" != e.name && window.console && void 0;
  }
}
function hasTouch() {
  try {
    return document.createEvent("TouchEvent"), !0;
  } catch (e) {}
  return !1;
}
function logGames(e, a, t, o) {
  var i = "event=" + e + "&gameId=" + a + "&category=" + t + "&provider=" + o;
  $.ajax({
    type: "POST",
    url: "/log_games_event.json",
    data: i,
    headers: { "cache-control": "no-cache" },
    success: function(e) {},
    error: function(e, a, t) {
      window.console && void 0;
    }
  });
}
function closeGame() {
  $(".game-frame-container").addClass("hidden"),
    $(".game-frame .game-iframe").attr("src", ""),
    $("body").removeClass("modal-open"),
    $("html").removeClass("modal-open"),
    logGames("Close", gameId, gameCategory, provider);
}
function launchPlayer(e, a, t, o, i, n) {
  e ? launchNativePlayerWithAssetUrl(a) : callGetAsset(a, t, o, i, n);
}
function launchNativePlayerWithAssetUrl(e) {
  var a = $(".movies-wrap").data("isSafari");
  hasTouch() || "True" != a || (e = "/faq?tab=2"), window.location.assign(e);
}
function launchJwplayer(e, a, t, o, i) {
  function n(e) {
    window.console && void 0, i && i();
  }
  try {
    var s = "",
      r = [];
    if (e.modular_asset_url) {
      !0;
      var l = e.modular_licenseurl;
      (s = e.modular_asset_url), (r = checkVtt(s, a));
    }
    var c = {
      base: portal.jwp_base,
      width: "100%",
      stretching: "exactfit",
      aspectratio: "16:9",
      autostart: !0,
      file: s,
      analytics: { enabled: !1, cookies: !1 },
      drm: { widevine: { url: l } }
    };
    r && r.length > 0 && (c.tracks = r), a.setup(c);
    var d = a.currentAssetId,
      u = portal.getLastPlayerPositionById(d),
      p = 0;
    a.on("setupError", function(e) {
      n(e);
    }),
      a.on("error", function(e) {
        n(e);
      }),
      a.on("complete", function(e) {
        o && o();
      }),
      a.on("time", function(e) {
        Math.abs(e.position - p) > portal.playerPositionFrequency &&
          (portal.storePlayerPosition(d, e.position), (p = e.position));
      }),
      a.on("audioTracks", function(e) {
        $(".jw-settings-submenu").find("button").length > 2 &&
          $(".jw-settings-submenu")
            .find("button")[2]
            .remove();
      }),
      a.once("play", function() {
        u > 0 && Math.abs(a.getDuration() - u) > 5 && a.seek(u);
      }),
      t && t.modal("show");
  } catch (e) {
    n(e);
  }
}
function callGetAsset(e, a, t, o, i) {
  function n() {
    t && t.modal("show"), i && i();
  }
  function s(e) {
    launchJwplayer(e, a, t, o, i);
  }
  $.ajax({ dataType: "json", url: e, success: s, error: n });
}
function dccPlayFinishCallback() {
  window.location = "#dcc_end";
}
function dccPlayErrorCallback() {
  window.location = "#dcc_end";
}
function isIpad() {
  const e = window.navigator.userAgent;
  if (e.indexOf("iPad") > -1) return !0;
  if (e.indexOf("Macintosh") > -1)
    try {
      return document.createEvent("TouchEvent"), !0;
    } catch (e) {}
  return !1;
}
function seasonChangeCallback(e) {
  var a = jQuery("#sel_episode-" + e.sid);
  a.find("option").remove();
  for (var t = e.eps, o = t.length, i = 0; i < o; ++i)
    (number = t[i][0]),
      (eid = t[i][1]),
      a.append('<option value="' + eid + '">' + number + "</option>");
  a[0].jcf.buildDropdown(),
    a[0].jcf.refreshState(),
    episodeChangeCallback(e.ep1);
}
function processSeasonEpisodeChange(e, a) {
  var t = jQuery("#sel_episode-" + e),
    o =
      (t.val(),
      location.protocol + "//" + location.host + "/episodes_for_season.json");
  jQuery.ajax({
    url: o,
    data: "sid=" + e + "&s=" + a,
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "seasonChangeCallback",
    timeout: 5e3,
    success: function() {},
    error: function(e) {}
  });
}
function episodeChangeCallback(e) {
  var a = e.sid;
  jQuery("#ep_title-" + a).html(e.title),
    e.year
      ? jQuery("#ep_year-" + a)
          .html(e.year)
          .removeClass("disabled")
      : jQuery("#ep_year-" + a).addClass("disabled"),
    e.duration
      ? jQuery("#ep_duration-" + a)
          .html(e.duration + " minutes")
          .removeClass("disabled")
      : jQuery("#ep_duration-" + a).addClass("disabled"),
    e.summary
      ? jQuery("#ep_summary-" + a)
          .html(e.summary)
          .removeClass("disabled")
      : jQuery("#ep_summary-" + a).addClass("disabled");
}
function processSeriesEpisodeChange(e) {
  var a = e.attr("id"),
    t = a.indexOf("-"),
    o = a.substring(t + 1),
    i = e.val(),
    n = location.protocol + "//" + location.host + "/episode_info.json";
  jQuery.ajax({
    url: n,
    data: "sid=" + o + "&eid=" + i,
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "episodeChangeCallback",
    timeout: 5e3,
    success: function() {},
    error: function(e) {}
  });
}
function getEpisodeId(e) {
  var a = e.split("-"),
    t = a[1],
    o = "0",
    i = jQuery("#sel_season-" + t);
  return (
    i.length
      ? (o = i.val())
      : ((i = jQuery("#sel_episode-" + t)), i.length && (o = i.val())),
    o
  );
}
function replaceVideo(e) {
  var a = e.attr("id"),
    t = a.split("_video")[0],
    o = e.data("use_dtiapp"),
    i = (e.data("use_vdrm"), e.data("use_mobile"), jQuery("#" + a));
  jQuery("#another_vdrm")
    .detach()
    .appendTo("#wrapper"),
    o || i.empty().addClass("active"),
    i.load("/video_load.jq?cid=" + t + " #videoplayer", function(e, t, o) {
      var n = jQuery("#" + a + " #videoplayer"),
        s = n.data("is-drm"),
        r = n.data("is-app-player"),
        l = jwplayer("videoplayer"),
        c = a.split("_video")[0],
        d = portal.getLastPlayerPositionById(c);
      if ("error" != t) {
        if (s && !r && !isIOS && !isAndroid) {
          var u = n.data("url"),
            p = n.data("licensekey"),
            h = n.data("img");
          (m_jwp_setup.file = u),
            p.length && (m_jwp_setup.drm = { widevine: { url: p } }),
            (m_jwp_setup.image = h),
            (m_jwp_setup.width = "100%"),
            (m_jwp_setup.height = i.height() + "px"),
            (m_jwp_setup.autostart = !0);
          var m = checkVtt(u, l);
          m && m.length > 0 && (m_jwp_setup.tracks = m),
            l.setup(m_jwp_setup),
            l
              .on("play", function(e) {
                hideSpeakerIcon(), showSpeakerIcon();
              })
              .on("pause", function(e) {
                hideSpeakerIcon();
              })
              .on("error", function(e) {
                hideSpeakerIcon();
              })
              .on("complete", function(e) {
                hideSpeakerIcon();
              })
              .on("audioTracks", function(e) {
                $(".jw-settings-submenu").find("button").length > 2 &&
                  $(".jw-settings-submenu")
                    .find("button")[2]
                    .remove();
              }),
            jQuery(window).on("resize", function() {
              l.resize(
                jQuery("#" + a + ".active").width(),
                jQuery("#" + a + ".active").height()
              );
            }),
            (l.currentAssetId = c);
          var v = 0;
          l.on("time", function(e) {
            Math.abs(e.position - v) > portal.playerPositionFrequency &&
              (portal.storePlayerPosition(c, e.position), (v = e.position));
          }),
            l.once("play", function() {
              d > 0 && Math.abs(l.getDuration() - d) > 5 && l.seek(d);
            });
        }
        if (s && r) var f = n.data("url");
        if (!isIOS && !isAndroid && !s) {
          var f = n.data("url"),
            g = n.data("img");
          (m_jwp_setup.file = f),
            (m_jwp_setup.image = g),
            (m_jwp_setup.autostart = !0),
            (m_jwp_setup.width = "100%"),
            (m_jwp_setup.height = i.height() + "px"),
            delete m_jwp_setup.drm,
            l.setup(m_jwp_setup),
            l
              .on("play", function() {
                hideSpeakerIcon(), showSpeakerIcon();
              })
              .on("pause", function() {
                hideSpeakerIcon();
              })
              .on("error", function() {
                hideSpeakerIcon();
              })
              .on("complete", function() {
                hideSpeakerIcon();
              }),
            jQuery(window).on("resize", function() {
              l.resize(
                jQuery("#" + a + ".active").width(),
                jQuery("#" + a + ".active").height()
              );
            }),
            (l.currentAssetId = c);
          var v = 0;
          l.on("time", function(e) {
            Math.abs(e.position - v) > portal.playerPositionFrequency &&
              (portal.storePlayerPosition(c, e.position), (v = e.position));
          }),
            l.once("play", function() {
              d > 0 && Math.abs(l.getDuration() - d) > 5 && l.seek(d);
            });
        }
        if ((isIOS || isAndroid) && !s && !r) {
          for (
            var y = jQuery(".thumb-video-display.active"), w = 0;
            w < y.length;
            w++
          ) {
            var b = jQuery(y[w]);
            if (b.attr("id") == a) {
              var _ = b.find("#video");
              _.width(jQuery(b).width()),
                _.height(jQuery(b).height()),
                _.on("play", function(e) {
                  var t = jQuery(e.currentTarget).parents("#" + a);
                  y.removeClass("js-is-playing"),
                    t.addClass("js-is-playing"),
                    closeActivePlayer(),
                    hideSpeakerIcon(),
                    showSpeakerIcon();
                })
                  .on("pause", function() {
                    hideSpeakerIcon();
                  })
                  .on("error", function() {
                    hideSpeakerIcon();
                  })
                  .on("ended", function() {
                    hideSpeakerIcon();
                  });
            }
          }
          jQuery(window).on("resize", function() {
            resizePlayerBox(jQuery(".thumb-video-display.active"));
          });
        }
      }
    });
}
function closeActivePlayer() {
  for (
    var e = jQuery(".thumb-video-display.active"), a = 0;
    a < e.length;
    a++
  ) {
    var t = jQuery(e[a]);
    t.hasClass("js-is-playing") ||
      (t.removeClass("active"),
      t.html('<span class="glyphicon glyphicon-play"></span>'));
  }
}
function showSpeakerIcon() {
  jQuery(".list-thumbnail.is-expanded .caption .icon-volume").show();
}
function hideSpeakerIcon() {
  jQuery(".caption .icon-volume").hide();
}
function resizePlayerBox(e) {
  for (var a = 0; a < e.length; a++) {
    var t = jQuery(e[a]),
      o = t.find("#video");
    o.width(t.width()), o.height(t.height());
  }
}
function checkVtt(e, a) {
  var t,
    o = [];
  return (
    $.ajax({
      url: e.replace(/(\d+).mpd/, "eng_sub/$1_eng.vtt"),
      method: "head",
      async: !1
    }).done(function() {
      void 0 === a["use-vtt"]
        ? ((t = "yes" == portal.jwp_usevtt), window.console && void 0)
        : ((t = a["use-vtt"]), window.console && void 0),
        t &&
          o.push({
            label: "English",
            file: e.replace(/(\d+).mpd/, "eng_sub/$1_eng.vtt"),
            default: !1,
            kind: "captions"
          });
    }),
    window.console && void 0,
    o
  );
}
$(document).ready(function() {
  var e = $(".js-burger-content-menu");
  $(".js-navbar-menu").click(function() {
    e.hasClass("open-burger-content-menu") ||
      ($('<div class="modal-backdrop fade in fade-hamburger"></div>').appendTo(
        document.body
      ),
      $("body").addClass("openmenu"),
      $(".modal-backdrop").css("z-index", 1054),
      e.addClass("open-burger-content-menu"),
      $(".burger-menu").hide(),
      $(".close-menu").show(),
      $(".modal-backdrop, .close-menu").click(function() {
        $("body").removeClass("openmenu"),
          $(".modal-backdrop").css("z-index", 1040),
          $(".modal-backdrop").remove(),
          e.removeClass("open-burger-content-menu"),
          $(".burger-menu").show(),
          $(".close-menu").hide();
      }));
  });
}),
  $(document).ready(function() {
    $(".js-slider").each(function(e) {
      var a = $(".js-slider-" + e),
        t = new Swiper(".js-slider-" + e, {
          slidesPerView: 5,
          paginationClickable: !0,
          centeredSlides: !0,
          loop: !0,
          roundLengths: !0,
          simulateTouch: !0,
          noSwiping: !1,
          pagination: ".drinks__section-list",
          paginationElement: "li",
          bulletClass: "drinks__section-list__bullet",
          bulletActiveClass: "active",
          slideToClickedSlide: !0,
          paginationBulletRender: function(e, t) {
            return (
              '<li class="drinks__section-list__bullet" >' +
              $(a.find(".drinks__fake-list-drink span")[t]).data("title") +
              "</li>"
            );
          },
          breakpoints: {
            767: {
              slidesPerView: 2.5,
              nextButton: ".swiper-button-next",
              prevButton: ".swiper-button-prev",
              simulateTouch: !0,
              noSwiping: !0,
              paginationBulletRender: null
            }
          }
        }),
        o = new Swiper(".gallery-thumbs-" + e, {
          centeredSlides: !0,
          slidesPerView: "auto",
          loop: !0,
          roundLengths: !0,
          slideToClickedSlide: !0,
          spaceBetween: 20
        });
      window.innerWidth < 768 &&
        ((t.params.control = o), (o.params.control = t));
      var i =
        (new Swiper(".js-slider-home", {
          loop: !0,
          roundLengths: !0,
          autoplay: 5e3,
          speed: 700,
          autoHeight: !0,
          nextButton: ".js-slider-home .swiper-button-next",
          prevButton: ".js-slider-home .swiper-button-prev",
          pagination: ".pagination",
          paginationElement: "li",
          paginationClickable: !0,
          bulletClass: "pagination__bullet",
          bulletActiveClass: "active",
          slideToClickedSlide: !0
        }),
        new Swiper(".js-slider-music-hero", {
          loop: !0,
          roundLengths: !0,
          autoplay: 5e3,
          speed: 700,
          nextButton: ".js-slider-music-hero .swiper-button-next",
          prevButton: ".js-slider-music-hero .swiper-button-prev",
          pagination: ".pagination",
          paginationElement: "li",
          paginationClickable: !0,
          bulletClass: "pagination__bullet",
          bulletActiveClass: "active",
          slideToClickedSlide: !0
        }),
        {
          loop: !0,
          roundLengths: !0,
          autoplay: !1,
          speed: 700,
          spaceBetween: 30,
          slidesPerView: 4,
          slidesPerGroup: 4,
          watchSlidesVisibility: !0,
          nextButton: ".swiper-button-next",
          prevButton: ".swiper-button-prev",
          breakpoints: {
            760: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 20,
              nextButton: ".swiper-button-next",
              prevButton: ".swiper-button-prev",
              simulateTouch: !0,
              noSwiping: !1
            },
            480: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 5,
              nextButton: ".swiper-button-next",
              prevButton: ".swiper-button-prev",
              simulateTouch: !0,
              noSwiping: !1
            }
          }
        });
      new Swiper(".js-slider-music-" + e, i),
        new Swiper(".js-slider-music-genre", i),
        new Swiper(".js-slider-music-topstations", i),
        new Swiper(".js-slider-music-kids", i);
    });
  }),
  $(document).ready(function() {
    $(".destinations .icon-close-cta-icon").on("click", function() {
      $(".destinations .destinations-items__item.is-expanded")
        .removeClass("is-expanded")
        .addClass("is-collapsed");
    }),
      $(".destinations-details .icon-close-cta-icon").on("click", function() {
        $(".destinations-details .destinations-items__item.is-expanded")
          .removeClass("is-expanded")
          .addClass("is-collapsed");
      }),
      $(".view-all-city-guides__btn").click(function() {
        $(".destinations-all-city").css("display", "block");
      }),
      $(".js-close-all-destinations").click(function() {
        $(".destinations-all-city").css("display", "none");
      }),
      $(".list").each(function() {
        var e,
          a = $(this),
          t = new Array();
        a.children(".destinations-items__item").each(function() {
          var a = $(this).find(".destinations-items__item-overlay");
          t.push(a.height()), void 0, (e = Math.max.apply(Math, t));
        }),
          a.find(".destinations-items__item-overlay").height(e);
      });
  }),
  $(document).ready(function() {
    function e() {
      $("body").bind("mousewheel DOMMouseScroll touchmove", function(e) {
        e.preventDefault();
      });
    }
    function a() {
      $("body").unbind("mousewheel DOMMouseScroll touchmove");
    }
    var t = $(".js-dropdown-activate-backdrop");
    t.on("shown.bs.dropdown", function() {
      "nav-secondary" ==
      $(this)
        .parents(".navbar")
        .attr("id")
        ? (isIOS || isAndroid
            ? $("body").css({
                overflow: "hidden",
                position: "fixed",
                width: "100%"
              })
            : e(),
          $(this)
            .parents(".navbar")
            .css("zIndex", 1052),
          $("#nav-primaire").css("zIndex", 1054))
        : (isIOS || isAndroid ? $("body").css({ overflow: "hidden" }) : e(),
          $(this)
            .parents(".navbar")
            .css("zIndex", 1054)),
        $('<div class="modal-backdrop fade in"></div>').appendTo(document.body);
      try {
        $(".gee_dropdown_ad a.adlink", this).each(function() {
          var e = $(this);
          portal.logLocalAd(e, "view");
        });
      } catch (e) {
        window.console && void 0;
      }
    }),
      t.on("hidden.bs.dropdown", function() {
        a(),
          "nav-secondary" ==
          $(this)
            .parents(".navbar")
            .attr("id")
            ? ($(this)
                .parents(".navbar")
                .css("zIndex", 1052),
              $("#nav-primaire").css("zIndex", 1054))
            : $(this)
                .parents(".navbar")
                .css("zIndex", 1054),
          $(".modal-backdrop").hasClass("fade-hamburger") ||
            ($(".modal-backdrop").remove(),
            $("body").css({ overflow: "", position: "", width: "" }));
      }),
      $(".dropdown-menu .daily-weather a").on("click", function(e) {
        var a = $(this).attr("aria-controls");
        $(".dropdown-menu .tab-content .tab-pane").hide(),
          $(".dropdown-menu .tab-content " + a).show(),
          $(".daily-weather a").removeClass("enable"),
          $('.daily-weather a[aria-controls="' + a + '"]').addClass("enable"),
          e.stopPropagation();
      }),
      (isIOS || isAndroid) && $(".progress-bar").addClass("tablet");
  }),
  $(document).ready(function() {
    var e = "fknazkdzfkd";
    e += "";
  }),
  (window.onresize = function() {
    $(window).width() > 767 && $("body").removeClass("fixedbg");
  }),
  $(document).ready(function() {
    var e = document.getElementById("flight-tracker-video"),
      a = $(".flight-tracker-video"),
      t = $('.adlink[data-adid="12282"], .adlink[data-adid="12280"]');
    if (t.length) {
      var o = $(window).height() - t.offset().top - t.outerHeight(!0);
      t.wrap("<div class='ad-video'></div>"),
        a.appendTo(".ad-video"),
        o <= $(window).height() / 2
          ? $(".ad-video").addClass("bottom")
          : $(".ad-video").addClass("top");
    }
    $("#flight-tracker-video").click(function() {
      this.paused ? this.play() : this.pause();
    }),
      t.click(function(t) {
        t.preventDefault(),
          a.show(),
          a.addClass("open"),
          a.removeClass("closed"),
          ((window.matchMedia("(orientation: portrait)").matches &&
            $(window).width() <= 767) ||
            (window.matchMedia("(orientation: landscape)").matches &&
              $(window).width() <= 959)) &&
            $(window).width() <= 812 &&
            $("body").addClass("fixedbg"),
          (e.currentTime = 0),
          e.play();
      }),
      $("video").on("ended", function() {
        a.removeClass("open"),
          a.addClass("closed"),
          a.delay(500).hide(0),
          $("body").removeClass("fixedbg");
      }),
      a.find(".icon-close-cta-icon").click(function() {
        $("body").removeClass("fixedbg"),
          a.removeClass("open"),
          a.addClass("closed"),
          a.delay(500).hide(0),
          e.pause();
      });
  }),
  $(document).ready(function() {
    function e() {
      a.addClass("fixed"),
        document.body.scrollTop > 120 ||
        document.documentElement.scrollTop > 120
          ? (a.show(),
            $(".footer").isInViewport()
              ? (a.addClass("static"), a.removeClass("fixed"))
              : (a.addClass("fixed"), a.removeClass("static")))
          : a.hide();
    }
    var a = $(".backtotop");
    ($.fn.isInViewport = function() {
      var e = $(this).offset().top,
        a = e + $(this).outerHeight(),
        t = $(window).scrollTop(),
        o = t + $(window).height() - 90;
      return a > t && e < o;
    }),
      (window.onscroll = function() {
        e();
      }),
      a.on("click", function() {
        return $("html, body").animate({ scrollTop: 0 }, "fast"), !1;
      });
  });
var gameId = "",
  gameCategory = "",
  provider = "";
$(document).ready(function() {
  function e() {
    var e = 0;
    (e =
      document.getElementsByClassName("mobile").length > 0
        ? window.innerHeight - 50
        : window.innerHeight - 170),
      $(".game-frame .iframe-container").css(
        "height",
        e.toString().concat("px")
      );
  }
  $(".games-items .icon-close-cta-icon").on("click", function() {
    $(".games-items .games-items__item.is-expanded")
      .removeClass("is-expanded")
      .addClass("is-collapsed");
  }),
    $(".games-items .play_btn a").on("click", function() {
      var e = $(this).data("getAssetUrl"),
        a = $(this).data("title");
      (gameId = $(this).data("gameId")),
        (gameCategory = $(this).data("category")),
        (provider = $(this).data("provider")),
        $(".game-frame .game-iframe").attr("src", e),
        $(".game-frame-container .game-title").text(a),
        $(".game-frame-container").removeClass("hidden"),
        $("body").addClass("modal-open"),
        $("html").addClass("modal-open"),
        window.scrollTo(0, 1),
        logGames("Play", gameId, gameCategory, provider);
    });
  var a = document.getElementById("game-iframe");
  try {
    a.onload = function() {
      document.domain = "southwestwifi.com";
      var t = a.contentDocument ? a.contentDocument : a.contentWindow.document,
        o = document.getElementById("game-frame-container");
      t.addEventListener(
        "touchmove",
        function(e) {
          e.preventDefault();
        },
        { passive: !1 }
      ),
        o.addEventListener(
          "touchmove",
          function(e) {
            e.preventDefault();
          },
          { passive: !1 }
        ),
        e();
    };
  } catch (e) {}
  window.onresize = function() {
    e();
  };
}),
  $(document).ready(function() {
    $("a[data-toggle='load-more'],button[data-toggle='load-more']").on(
      "click",
      function(e) {
        e.preventDefault();
        var a =
            "#" +
            $(this)[0]
              .href.split("#")
              .pop(),
          t = $(".load-more", $(a)),
          o = 4;
        this.hasAttribute("data-slice") &&
          (o = parseInt($(this).attr("data-slice"))),
          t.length <= o && $(this).fadeOut("slow"),
          0 != t.length &&
            ((t = t.slice(0, o)),
            t.slideDown(),
            t.removeClass("load-more"),
            $("html,body").animate({ scrollTop: $(this).offset().top }, 1500));
      }
    );
  }),
  $(document).ready(function() {
    var e = "True" == jQuery("#whatsapmessage").data("isSafari") && hasTouch();
    null === document.getElementById("messaging") ||
      e ||
      $("#whatsapmessage").modal();
  }),
  $(document).ready(function() {
    $("ul.nav-movies li.movie-collapse a").on("click", function() {
      var e = $(this),
        a = e.attr("aria-controls"),
        t = $(".movie-tabs .tab-pane" + a),
        o = "",
        i = "";
      $(".movie-tabs .tab-pane").hasClass("active") &&
        ((o = $(".movie-tabs .tab-pane.active").attr("id")),
        (i = $(".movie-tabs .tab-pane#" + o))),
        $(e.parent()).hasClass("active")
          ? t.removeClass("active")
          : (o && i.removeClass("active"),
            t.addClass("active"),
            setTimeout(function() {
              t.is(":visible") &&
                $("html, body").animate(
                  { scrollTop: t.offset().top - 200 },
                  600
                );
            }, 300));
    }),
      "True" != $(".movies-wrap").data("isSafari") ||
        hasTouch() ||
        ($(".free-movies-disclaimer").remove(),
        $(".action-play-asset").text("See FAQ")),
      $(".movie-tabs .icon-close-cta-icon").on("click", function() {
        $(".movie-tabs .movie-collapse.active").removeClass("active"),
          $(".movie-tabs .tab-pane.active").removeClass("active");
      }),
      $(".recent_movies_grid .icon-close-cta-icon").on("click", function() {
        $(".recent_movies_grid .list-thumbnail.is-expanded")
          .removeClass("is-expanded")
          .addClass("is-collapsed");
      }),
      $("#all-movie-list .icon-close-cta-icon").on("click", function() {
        $("#all-movie-list .list-thumbnail.is-expanded")
          .removeClass("is-expanded")
          .addClass("is-collapsed");
      });
  }),
  $(document).ready(function() {
    var e = $("#nav-secondary");
    $(window).scroll(function() {
      $(document).scrollTop() > 50
        ? e.addClass("navbar--shrink")
        : e.removeClass("navbar--shrink");
    });
  }),
  $(document).ready(function() {
    $(".action-play-asset")
      .not(".need-dcc")
      .on("click", function(e) {
        $("#nav-primaire").css("zIndex", 1e3);
        var a = $("#videoModal"),
          t = $(this),
          o = null;
        if (portal.hasJWPlayer) {
          var i = t.data("id");
          (o = jwplayer("videoplayer")), (o.currentAssetId = i);
        }
        var n = t.data("title"),
          s = t.data("getAssetUrl"),
          r = t.data("useNativePlayer");
        $(".property-movie-title").text(n);
        var l = t.data("mid"),
          c = t.data("sponsored-movies"),
          d = $(".movies-wrap").data("isSafari"),
          u = d && !hasTouch();
        l && c && !u
          ? $.ajax({
              url: "sponsored_auth.json",
              data: { movieId: l },
              dataType: "json",
              timeout: 1e4,
              type: "GET",
              success: function() {
                launchPlayer(r, s, o, a, null, null);
              },
              error: function(e) {
                window.console && void 0, launchPlayer(r, s, o, a, null, null);
              }
            })
          : launchPlayer(r, s, o, a, null, null);
      }),
      $("#videoModal .close").on("click", function(e) {
        return jwplayer("videoplayer").stop(), !0;
      }),
      $(".action-movie-buy-now.need-dcc, .action-play-asset.need-dcc").on(
        "click",
        function(e) {
          try {
            var a = String($(this).data("mid")),
              t = String($(this).data("laptop")).toLowerCase();
            window.location =
              "true" == t
                ? "/movies-setup?id=" + a + "#dcc_start"
                : "/movies-setup?id=" + a + "#slide_enquiry";
          } catch (e) {}
          return !1;
        }
      ),
      $(".action-play-dcc").on("click", function(e) {
        var a = null;
        portal.hasJWPlayer && (a = jwplayer("dcc_videoplayer"));
        var t = $(this),
          o = t.data("get-asset-url");
        return (
          launchPlayer(t.data("use-native-player"), o, a, null, null, null), !1
        );
      }),
      $(".dcc-played-yes").on("click", function(e) {
        var a = new Date();
        a.setTime(a.getTime() + 864e5),
          (document.cookie =
            "r44player=true; expires=" + a.toUTCString() + "; path=/");
        var t =
          location.protocol +
          "//" +
          location.host +
          "/set_has_player.json?p=true";
        jQuery.getJSON(t, function(e) {});
        var o =
          location.protocol + "//" + location.host + "/dcc_log.json?result=yes";
        jQuery.getJSON(o, function(e) {});
      }),
      $(".dcc-played-no").on("click", function(e) {
        var a =
          location.protocol + "//" + location.host + "/dcc_log.json?result=no";
        jQuery.getJSON(a, function(e) {});
      });
  });
var portal = new PORTAL();
class PORTAL {
    constructor() {
        function e(e) {
            try {
                return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            catch (e) {
                return window.console && void 0, "";
            }
        }
        function a(e, a, t) {
            (t = void 0 !== t ? "" + t : ""),
                a && a.trim()
                    ? t.trim()
                        ? $(e).text(a + " " + t)
                        : $(e).text(a)
                    : $(e).html("&nbsp;");
        }
        var t = navigator.userAgent, o = /iPad/i.test(t) || /iPhone OS/i.test(t) || isIpad(), i = /iPad/i.test(t), n = /android/i.test(t);
        (this.isAndroid = n),
            (this.isiPad = i),
            (this.isIOS = o),
            (this.channelId = ""),
            (this.coverage = ""),
            (this.jwp_base = ""),
            (this.jwp_usevtt = ""),
            (this.hasLocalStorage = "undefined" != typeof Storage),
            (this.hasJWPlayer = "undefined" != typeof jwplayer),
            (this.storedPlayerPositionExpiration = 5),
            (this.playerPositionFrequency = 5),
            (this.ad_impressions = {}),
            (this.logLocalAd = function (e, a, t) {
                var o = "";
                try {
                    o = t || "";
                    var i = location.protocol + "//" + location.host + "/log_ad_data.json", n = e.data("adslot");
                    if ("view" == a && n in this.ad_impressions)
                        return;
                    (this.ad_impressions[n] = 1),
                        $.ajax({
                            url: i,
                            data: {
                                adCampaign: e.data("campaign"),
                                adImage: e.data("image"),
                                adId: e.data("adid"),
                                imageId: e.data("imageid"),
                                adsov: e.data("adsov"),
                                adType: n,
                                adAction: a,
                                page: location.pathname
                            },
                            dataType: "json",
                            timeout: 1e4,
                            type: "GET",
                            success: function () {
                                o && (window.location = o);
                            },
                            error: function (e) {
                                o && (window.location = o);
                            }
                        });
                }
                catch (e) {
                    window.console && void 0, o && (window.location = o);
                }
            }),
            (this.processLocalAdClick = function (e, a) {
                try {
                    var t = a || "", o = e.attr("href");
                    if ("" == o || "#" == o)
                        return void (t && t.preventDefault());
                    "_self" == e.attr("target")
                        ? (t && t.preventDefault(), this.logLocalAd(e, "click", o))
                        : this.logLocalAd(e, "click");
                }
                catch (e) {
                    window.console && void 0;
                }
            }),
            (this.update_current_info = function () {
                var t = location.protocol + "//" + location.host + "/current.json", o = this;
                $.getJSON(t, function (t) {
                    a("#fi_ttgc", t.ttgc),
                        a("#fi_ctime", t.actime24),
                        a("#fi_ttg", t.ttgc),
                        a("#fi_etad", t.etad, void 0 !== t.dtzone ? t.dtzone : ""),
                        a("#fi_dist_remain", e(t.dist_remain), "mi"),
                        a("#fi_alt", e(t.altVal), "ft"),
                        a("#fi_gspd", e(t.gspdVal), "mph");
                    var i = void 0 !== t.pcent_flt_complete ? t.pcent_flt_complete : 0;
                    $("#fi_pbar").attr("aria-valuenow", i),
                        $("#fi_pbar").css("width", i + "%"),
                        (o.coverage =
                            void 0 !== t.within_us
                                ? t.within_us
                                    ? "yes"
                                    : "no"
                                : o.coverage),
                        "function" == typeof current_info_callback &&
                        current_info_callback(t);
                });
            }),
            (this.cleanLocalStorage = function () {
                var e = localStorage.JWPlayerPositions, a = new Date().getTime() -
                    60 * portal.storedPlayerPositionExpiration * 60 * 24;
                if (void 0 !== e) {
                    for (var t in e) {
                        e[t].timestamp < a && delete e[t];
                    }
                    jQuery.isEmptyObject(e) &&
                        localStorage.removeItem("JWPlayerPositions");
                }
                else
                    localStorage.removeItem("JWPlayerPositions");
            }),
            (this.storePlayerPosition = function (e, a) {
                if (this.hasLocalStorage && this.hasJWPlayer) {
                    var t = {};
                    void 0 != localStorage.JWPlayerPositions &&
                        (t = JSON.parse(localStorage.JWPlayerPositions));
                    var o = new Date().getTime();
                    (t[e] = { position: a, timestamp: o }),
                        (localStorage.JWPlayerPositions = JSON.stringify(t));
                }
            }),
            (this.getLastPlayerPositionById = function (e) {
                if (this.hasLocalStorage &&
                    this.hasJWPlayer &&
                    void 0 != localStorage.JWPlayerPositions) {
                    var a = JSON.parse(localStorage.JWPlayerPositions);
                    if (void 0 !== a[e] && a[e].hasOwnProperty("position"))
                        return a[e].position;
                }
                return 0;
            });
    }
}
$(document).ready(function() {
  (portal.jwp_base = $("#portalData").data("jwp_base")),
    (portal.jwp_usevtt = $("#portalData").data("jwp_usevtt")),
    (portal.coverage = $("#portalData").data("coverage")),
    $(".gee_ad a.adlink").each(function() {
      var e = $(this);
      portal.logLocalAd(e, "view");
    }),
    $(".gee_ad a.adlink, .gee_dropdown_ad a.adlink").click(function(e) {
      var a = $(this);
      portal.processLocalAdClick(a, e);
    });
  var e = window.innerWidth;
  $(".gee_ad a.slider_adlink").each(function() {
    var a = $(this);
    if (e < 768) {
      a.data("image", a.data("image_mobile")),
        a.data("imageid", a.data("imageid_mobile"));
      var t = a.data("link_mobile");
      t && a.attr("href", t);
    } else {
      a.data("image", a.data("image_laptop")),
        a.data("imageid", a.data("imageid_laptop"));
      var o = a.data("link_laptop");
      o && a.attr("href", o);
    }
    portal.logLocalAd(a, "view");
  }),
    $(".gee_ad a.slider_adlink").click(function(e) {
      var a = $(this);
      portal.processLocalAdClick(a, e);
    }),
    portal.update_current_info(),
    setInterval(function() {
      portal.update_current_info();
    }, 6e4),
    portal.hasLocalStorage && portal.cleanLocalStorage();
});
var events = {
  events: {},
  on: function(e, a) {
    (this.events[e] = this.events[e] || []), this.events[e].push(a);
  },
  off: function(e, a) {
    if (this.events[e])
      for (var t = 0; t < this.events[e].length; t++)
        if (this.events[e][t] === a) {
          this.events[e].splice(t, 1);
          break;
        }
  },
  emit: function(e, a) {
    this.events[e] &&
      this.events[e].forEach(function(e) {
        e(a);
      });
  }
};
$(document).ready(function() {
  function e(e) {
    e.stopPropagation();
    var t = $(this).closest(".image__cell");
    t.hasClass("is-collapsed")
      ? (o
          .not(t)
          .removeClass("is-expanded")
          .addClass("is-collapsed"),
        t.removeClass("is-collapsed").addClass("is-expanded"),
        a(t, 400))
      : t.removeClass("is-expanded").addClass("is-collapsed");
  }
  function a(e, a) {
    setTimeout(function() {
      e.is(":visible") &&
        $("html, body").animate({ scrollTop: e.offset().top + 50 }, a);
    }, a / 2);
  }
  function t(e) {
    if ($(this).hasClass("active")) {
      e.stopPropagation(), $(this).removeClass("active");
      $(".tab-pane").each(function() {
        $(this).removeClass("active");
      });
    }
  }
  $(".tv-series-wrap .icon-close-cta-icon").on("click", function() {
    $(".tv-series-wrap .list-thumbnail.is-expanded")
      .removeClass("is-expanded")
      .addClass("is-collapsed");
  });
  var o = $(".image__cell");
  $(".movie-collapse").click(t),
    o.find(".image--basic").click(e),
    o.find(".expand__close").click(function() {
      $(this)
        .closest(".image__cell")
        .removeClass("is-expanded")
        .addClass("is-collapsed");
    });
  var i = document.location.hash;
  i.match("#expand-jump") &&
    (function(e) {
      var t = "",
        o = e.replace("#expand-jump", "list-more");
      (t = $("#" + o).parent()),
        t.removeClass("is-collapsed").addClass("is-expanded"),
        t.hasClass("load-more") &&
          ($(".list-thumbnail.list-item.load-more").removeClass("load-more"),
          $(".row .btn-load-more").hide()),
        a(t, 800),
        setTimeout(function() {
          $("#" + o + " .action-play-asset").trigger("click");
        }, 1e3);
    })(i);
});
var ua = navigator.userAgent,
  isIOS =
    /iPad/i.test(ua) ||
    /iPhone OS/i.test(ua) ||
    (/macbook/i.test(ua) && hasTouch()),
  isiPad = /iPad/i.test(ua),
  isAndroid = /android/i.test(ua);
jQuery(document).ready(function() {
  var e =
    "True" == jQuery("#tv-series-drm-list").data("isSafari") && !hasTouch();
  e && jQuery(".episode-link").attr("href", "/faq?tab=2"),
    jQuery(".sel_seasonList").change(function(e) {
      processSeriesEpisodeChange(jQuery(this)), e.preventDefault();
    }),
    jQuery(".sel_season").change(function(e) {
      var a = jQuery(this);
      id = a.attr("id");
      var t = id.indexOf("-");
      processSeasonEpisodeChange(id.substring(t + 1), a.val()),
        e.preventDefault();
    }),
    jQuery(".sel_episode").change(function(e) {
      processSeriesEpisodeChange(jQuery(this)), e.preventDefault();
    }),
    jQuery(".js-series-carousel").bind("slid.bs.carousel", function(a) {
      e ||
        jQuery(a.relatedTarget)
          .find(".js-episode-click")
          .trigger("click");
    }),
    (isIOS || isAndroid || hasTouch()) &&
      jQuery(".js-series-click").click(function(e) {
        var a = jQuery(e.currentTarget.parentElement).find(".js-episode-click"),
          t = !1;
        resizePlayerBox(jQuery(".thumb-video-display.active"));
        for (var o = 0; o < a.length; o++) {
          if (jQuery(a[o]).hasClass("js-is-playing")) {
            t = !0;
            break;
          }
        }
        0 == t && a.first().trigger("click");
      }),
    jQuery(".js-episode-click").click(function(e) {
      var a = jQuery(this),
        t = a.attr("id"),
        o = t.split("_video")[0],
        i = a.data("need_dcc"),
        n = a.data("use_vdrm"),
        s = (a.data("use_mobile"), a.data("use_dtiapp"));
      if ((s && !hasTouch() && window.location.assign("/faq?tab=2"), n && i))
        try {
          var r = "expand-jump-type-tv_series-drm-" + o;
          return (
            s
              ? ((r = "expand-jump-type-tv_series-drm-mob-" + o),
                (window.location = "/series-setup?id=" + r + "#slide_enquiry"))
              : (window.location = "/series-setup?id=" + r + "#dcc_start"),
            !1
          );
        } catch (e) {}
      var l = !0;
      if (isIOS || isAndroid || hasTouch())
        if (a.hasClass("js-is-playing"));
        else {
          if (s) return !0;
          replaceVideo(a);
        }
      else {
        if (a.hasClass("active")) return !1;
        closeActivePlayer(),
          "function" == typeof watch_btn_callback &&
            watch_btn_callback(a) &&
            (l = !1),
          l && replaceVideo(a);
      }
    });
}),
  (window.onbeforeunload = function() {
    if (
      portal.hasLocalStorage &&
      portal.hasJWPlayer &&
      "function" == typeof jwplayer("videoplayer").getPosition
    ) {
      var e = jwplayer("videoplayer").currentAssetId,
        a = jwplayer("videoplayer").getPosition();
      portal.storePlayerPosition(e, a);
    }
  }),
  $(document).ready(function() {
    var e = document.location.toString(),
      a = $(".js-anchor-ready .js-tab-anchor"),
      t = function(e) {
        e = e.split("#")[1];
        var t = $('.js-anchor-ready .js-tab-anchor[href="#' + e + '"]');
        t.tab("show"), a.removeClass("active"), t.addClass("active");
      };
    e.match("#") && t(e),
      a.on("click", function(e) {
        (window.location.hash = e.target.hash),
          a.removeClass("active"),
          $(this).addClass("active");
      }),
      (window.onhashchange = function() {
        t(window.location.hash);
      });
  });

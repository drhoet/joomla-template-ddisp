/*
 * Foundation Orbit Circular
 * Circular version of the Foundation Orbit. For the original version, see: http://foundation.zurb.com
 * Copyright 2013, Dries Hoet
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs = Foundation.libs || {};

  Foundation.libs.orbitcircular = {
    name: 'orbitcircular',

    version: '4.2.0',

    settings: {
      timer_speed: 10000,
      pause_on_hover: true,
      resume_on_mouseout: false,
      animation_speed: 500,
      bullets: true,
      stack_on_small: true,
      navigation_arrows: true,
      slide_number: true,
      container_class: 'orbit-container',
      stack_on_small_class: 'orbit-stack-on-small',
      next_class: 'orbit-next',
      prev_class: 'orbit-prev',
      timer_container_class: 'orbit-timer',
      timer_paused_class: 'paused',
      timer_progress_class: 'orbit-progress',
      slides_container_class: 'orbit-slides-container',
      bullets_container_class: 'orbit-bullets',
      bullets_active_class: 'active',
      slide_number_class: 'orbit-slide-number',
      caption_class: 'orbit-caption',
      active_slide_class: 'active',
      orbit_transition_class: 'orbit-transitioning',
      slide_width: 'auto',
      slide_height: 'auto'
    },

    _margin_position_property: Foundation.rtl ? 'marginRight' : 'marginLeft',

    init: function (scope, method, options) {
      var self = this;
      Foundation.inherit(self, 'data_options');

      if (typeof method === 'object') {
        $.extend(true, self.settings, method);
      }

      if ($(scope).is('[data-orbitcircular]')) {
        var scoped_self = $.extend(true, {}, self);
        scoped_self._init(idx, el);
      }

      $('[data-orbitcircular]', scope).each(function(idx, el) {
        var scoped_self = $.extend(true, {}, self);
        scoped_self._init(idx, el);
      });
    },

    _container_html: function() {
      var self = this;
      return '<div class="' + self.settings.container_class + '"></div>';
    },

    _bullets_container_html: function($slides) {
      var self = this,
          $list = $('<ol class="' + self.settings.bullets_container_class + '"></ol>');
      $slides.each(function(idx, slide) {
        var $item = $('<li data-orbitcircular-slide-number="' + (idx+1) + '" class=""></li>');
        if (idx === 0) {
          $item.addClass(self.settings.bullets_active_class);
        }
        $list.append($item);
      });
      return $list;
    },

    _slide_number_html: function(slide_number, total_slides) {
      var self = this,
          $container = $('<div class="' + self.settings.slide_number_class + '"></div>');
      $container.append('<span>' + slide_number + '</span> of <span>' + total_slides + '</span>');
      return $container;
    },

    _timer_html: function() {
      var self = this;
      if (typeof self.settings.timer_speed === 'number' && self.settings.timer_speed > 0) {
        return '<div class="' + self.settings.timer_container_class
          + '"><span></span><div class="' + self.settings.timer_progress_class
          + '"></div></div>';
      } else {
        return '';
      }
    },

    _next_html: function() {
      var self = this;
      return '<a href="#" class="' + self.settings.next_class + '">Next <span></span></a>';
    },

    _prev_html: function() {
      var self = this;
      return '<a href="#" class="' + self.settings.prev_class + '">Prev <span></span></a>';
    },

    _init: function (idx, slider) {
      var self = this,
          $slides_container = $(slider),
          $container = $slides_container.wrap(self._container_html()).parent(),
          $slides = $slides_container.children();
      
      $.extend(true, self.settings, self.data_options($slides_container));

      if(self.settings.slide_width == 'auto') {
          self.settings.slide_width = $slides.first().children("img").first().width();
      }

      if(self.settings.slide_height == 'auto') {
          self.settings.slide_height = $slides.first().children("img").first().height();
      }
      
      if (self.settings.navigation_arrows) {
          $container.append(self._prev_html());
          $container.append(self._next_html());
      }
      $slides_container.addClass(self.settings.slides_container_class);
      if (self.settings.stack_on_small) {
        $container.addClass(self.settings.stack_on_small_class);
      }
      if (self.settings.slide_number) {
        $container.append(self._slide_number_html(1, $slides.length));
      }
      $container.append(self._timer_html());
      if (self.settings.bullets) {
        $container.after(self._bullets_container_html($slides));
      }

      self._init_dimensions_and_buffer($slides_container);
      self._init_events($slides_container);
    
      self._start_timer($slides_container);
    },

    _init_dimensions_and_buffer: function($slides_container) {
      var self=this,
          $active_slide = $slides_container.find('.' + self.settings.active_slide_class),
          active_index = $active_slide.index(),
          $slides = $slides_container.children();

      self._buffer_size = Math.ceil(($slides_container.width() - self.settings.slide_width) / (2 * self.settings.slide_width)) + 1;
      // To support the "sliding" effect we need to clone slides from
      // begin and end with the size of the buffer
      if($slides.length < self._buffer_size) {
        self._buffer_size = Math.ceil(self._buffer_size / $slides.length) * $slides.length;
        for(var i = 0; i < self._buffer_size / $slides.length; ++i) {
          $slides_container.prepend($slides.clone().attr('data-orbitcircular-slide', '').removeClass(self.settings.active_slide_class));
          $slides_container.append($slides.clone().attr('data-orbitcircular-slide', '').removeClass(self.settings.active_slide_class));
        }
      } else {
        $slides_container.prepend($slides.slice($slides.length - self._buffer_size).clone().attr('data-orbitcircular-slide', '').removeClass(self.settings.active_slide_class));
        $slides_container.append($slides.slice(0, self._buffer_size).clone().attr('data-orbitcircular-slide', '').removeClass(self.settings.active_slide_class));
      }
      self._slide_offset = - (((2*self._buffer_size - 1) * self.settings.slide_width) - $slides_container.width()) / 2;
      self._init_dimensions($slides_container);
      
      if(active_index < 0) {
        // Make the first "real" slide active
        active_index = self._buffer_size;
        $slides.first().addClass(self.settings.active_slide_class);
      }

      $slides_container.css(self._margin_position_property, self._get_offset(active_index + self._buffer_size)); //this index is without the buffer!!
    },

    _init_events: function ($slides_container) {
      var self = this,
          $container = $slides_container.parent();

      $(window)
        .on('load.fndtn.orbitcircular', function() {
          $slides_container.height('');
          $slides_container.height(self.settings.slide_height);
          $slides_container.trigger('orbitcircular:ready');
        })
        .on('resize.fndtn.orbitcircular', function() {
          $slides_container.height('');
          $slides_container.height(self.settings.slide_height);
          $slides_container.children('[data-orbitcircular-slide]').remove();
          $slides_container.width('');
          $slides_container.css(self._margin_position_property, '');
          self._init_dimensions_and_buffer($slides_container);
        });

      $(document).on('click.fndtn.orbitcircular', '[data-orbitcircular-link]', function(e) {
        e.preventDefault();
        var id = $(e.currentTarget).attr('data-orbitcircular-link'),
            $slide = $slides_container.find('[data-orbitcircular-slide=' + id + ']').first();

        if ($slide.length === 1) {
          self._reset_timer($slides_container, true);
          self._goto($slides_container, $slide.index(), function() {});
        }
      });

      $container.siblings('.' + self.settings.bullets_container_class)
        .on('click.fndtn.orbitcircular', '[data-orbitcircular-slide-number]', function(e) {
          e.preventDefault();
          self._reset_timer($slides_container, true);
          self._goto($slides_container, $(e.currentTarget).data('orbitcircular-slide-number'),function() {});
        });

      $container
        .on('mouseenter.fndtn.orbitcircular', function(e) {
          if (self.settings.pause_on_hover) {
            self._stop_timer($slides_container);
          }
        })
        .on('mouseleave.fndtn.orbitcircular', function(e) {
          if (self.settings.resume_on_mouseout) {
            self._start_timer($slides_container);
          }
        })
        .on('orbitcircular:after-slide-change.fndtn.orbitcircular', function(e, orbit) {
          var $slide_number = $container.find('.' + self.settings.slide_number_class);

          if ($slide_number.length === 1) {
            $slide_number.replaceWith(self._slide_number_html(orbit.slide_number, orbit.total_slides));
          }
        })
        .on('orbitcircular:next-slide.fndtn.orbitcircular click.fndtn.orbitcircular', '.' + self.settings.next_class.split(" ").join("."), function(e) {
          e.preventDefault();
          self._reset_timer($slides_container, true);
          self._goto($slides_container, 'next', function() {});
        })
        .on('orbitcircular:prev-slide.fndtn.orbitcircular click.fndtn.orbitcircular', '.' + self.settings.prev_class.split(" ").join("."), function(e) {
          e.preventDefault();
          self._reset_timer($slides_container, true);
          self._goto($slides_container, 'prev', function() {});
        })
        .on('orbitcircular:toggle-play-pause.fndtn.orbitcircular click.fndtn.orbitcircular touchstart.fndtn.orbitcircular', '.' + self.settings.timer_container_class, function(e) {
          e.preventDefault();
          var $timer = $(e.currentTarget).toggleClass(self.settings.timer_paused_class),
              $slides_container = $timer.closest('.' + self.settings.container_class)
                .find('.' + self.settings.slides_container_class);

          if ($timer.hasClass(self.settings.timer_paused_class)) {
            self._stop_timer($slides_container);
          } else {
            self._start_timer($slides_container);
          }
        })
        .on('touchstart.fndtn.orbitcircular', function(e) {
          if (!e.touches) { e = e.originalEvent; }
          var data = {
            start_page_x: e.touches[0].pageX,
            start_page_y: e.touches[0].pageY,
            start_time: (new Date()).getTime(),
            delta_x: 0,
            is_scrolling: undefined
          };
          $container.data('swipe-transition', data);
          e.stopPropagation();
        })
        .on('touchmove.fndtn.orbitcircular', function(e) {
          if (!e.touches) { e = e.originalEvent; }
          // Ignore pinch/zoom events
          if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

          var data = $container.data('swipe-transition');
          if (typeof data === 'undefined') {
            data = {};
          }

          data.delta_x = e.touches[0].pageX - data.start_page_x;

          if ( typeof data.is_scrolling === 'undefined') {
            data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
          }

          if (!data.is_scrolling && !data.active) {
            e.preventDefault();
            self._stop_timer($slides_container);
            var direction = (data.delta_x < 0) ? 'next' : 'prev';
            data.active = true;
            self._goto($slides_container, direction, function() {});
          }
        })
        .on('touchend.fndtn.orbitcircular', function(e) {
          $container.data('swipe-transition', {});
          e.stopPropagation();
        });
    },

    _init_dimensions: function ($slides_container) {
      var self=this,
          $container = $slides_container.parent(),
          $slides = $slides_container.children();

      $slides_container.css('width', $slides.length * self.settings.slide_width + 'px');
      $slides.css('width', self.settings.slide_width + 'px');
      $slides_container.height(self.settings.slide_height);
      $slides_container.css('width', $slides.length * self.settings.slide_width + 'px');
    },

    _start_timer: function ($slides_container) {
      var self = this,
          $container = $slides_container.parent();

      var callback = function() {
        self._reset_timer($slides_container, false);
        self._goto($slides_container, 'next', function() {
          self._start_timer($slides_container);
        });
      };

      var $timer = $container.find('.' + self.settings.timer_container_class),
          $progress = $timer.find('.' + self.settings.timer_progress_class),
          progress_pct = ($progress.width() / $timer.width()),
          delay = self.settings.timer_speed - (progress_pct * self.settings.timer_speed);

      $progress.animate({'width': '100%'}, delay, 'linear', callback);
      $slides_container.trigger('orbitcircular:timer-started');
    },

    _stop_timer: function ($slides_container) {
      var self = this,
          $container = $slides_container.parent(),
          $timer = $container.find('.' + self.settings.timer_container_class),
          $progress = $timer.find('.' + self.settings.timer_progress_class),
          progress_pct = $progress.width() / $timer.width();
      self._rebuild_timer($container, progress_pct * 100 + '%');
      // $progress.stop();
      $slides_container.trigger('orbitcircular:timer-stopped');
      $timer = $container.find('.' + self.settings.timer_container_class);
      $timer.addClass(self.settings.timer_paused_class);
    },

    _reset_timer: function($slides_container, is_paused) {
      var self = this,
          $container = $slides_container.parent();
      self._rebuild_timer($container, '0%');
      if (typeof is_paused === 'boolean' && is_paused) {
        var $timer = $container.find('.' + self.settings.timer_container_class);
        $timer.addClass(self.settings.timer_paused_class);
      }
    },

    _rebuild_timer: function ($container, width_pct) {
      // Zepto is unable to stop animations since they
      // are css-based. This is a workaround for that
      // limitation, which rebuilds the dom element
      // thus stopping the animation
      var self = this,
          $timer = $container.find('.' + self.settings.timer_container_class),
          $new_timer = $(self._timer_html()),
          $new_timer_progress = $new_timer.find('.' + self.settings.timer_progress_class);

      if (typeof Zepto === 'function') {
        $timer.remove();
        $container.append($new_timer);
        $new_timer_progress.css('width', width_pct);
      } else if (typeof jQuery === 'function') {
        var $progress = $timer.find('.' + self.settings.timer_progress_class);
        $progress.css('width', width_pct);
        $progress.stop();
      }
    },

    _get_offset: function(active_index) {
      var self = this;
      return ((self.settings.slide_width * (self._buffer_size - active_index - 1)) + self._slide_offset) + 'px';
    },

    _goto: function($slides_container, index_or_direction, callback) {
      var self = this,
          $container = $slides_container.parent(),
          $slides = $slides_container.children(),
          $active_slide = $slides_container.find('.' + self.settings.active_slide_class),
          active_index = $active_slide.index();

      if ($container.hasClass(self.settings.orbit_transition_class)) {
        return false;
      }

      if (index_or_direction === 'prev') {
        if (active_index <= self._buffer_size) {
          active_index = $slides.length - self._buffer_size - 1;
          $slides_container.css(self._margin_position_property, self._get_offset(active_index + 1)); 
        }
        else {
          active_index--;
        }
      }
      else if (index_or_direction === 'next') {
        if(active_index >= $slides.length - self._buffer_size - 1) {
	  active_index = self._buffer_size;
	  $slides_container.css(self._margin_position_property, self._get_offset(active_index - 1));
        }
	else {
          active_index++;
	}
      }
      else if (typeof index_or_direction === 'number') {
        active_index = index_or_direction + self._buffer_size - 1;
      }
      // Start transition, make next slide active
      $container.addClass(self.settings.orbit_transition_class);
      $active_slide.removeClass(self.settings.active_slide_class);
      $($slides[active_index]).addClass(self.settings.active_slide_class);
      // Make next bullet active
      var $bullets = $container.siblings('.' + self.settings.bullets_container_class);
      if ($bullets.length === 1) {
        $bullets.children().removeClass(self.settings.bullets_active_class);
        $($bullets.children()[active_index-self._buffer_size]).addClass(self.settings.bullets_active_class);
      }
      var new_margin_left = self._get_offset(active_index);
      // Check to see if animation will occur, otherwise perform
      // callbacks manually
      $slides_container.trigger('orbitcircular:before-slide-change');
      if ($slides_container.css(self._margin_position_property) === new_margin_left) {
        $container.removeClass(self.settings.orbit_transition_class);
        $slides_container.trigger('orbitcircular:after-slide-change', [{slide_number: active_index-self._buffer_size+1, total_slides: $slides_container.children().length - 2 * self._buffer_size}]);
        callback();
      } else {
        var properties = {};
        properties[self._margin_position_property] = new_margin_left;

        $slides_container.animate(properties, self.settings.animation_speed, 'linear', function() {
          $container.removeClass(self.settings.orbit_transition_class);
          $slides_container.trigger('orbitcircular:after-slide-change', [{slide_number: active_index-self._buffer_size+1, total_slides: $slides_container.children().length - 2 * self._buffer_size}]);
          callback();
        });
      }
    }
  };
}(Foundation.zj, this, this.document));

(function($) {
    'use strict';

    var themes = [
        { name: 'bootstrap', url: '//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css' },
        { name: 'amelia', url: '//netdna.bootstrapcdn.com/bootswatch/3.0.0/amelia/bootstrap.min.css' },
        { name: 'cerulean', url: '//netdna.bootstrapcdn.com/bootswatch/3.0.0/cerulean/bootstrap.min.css' },
        { name: 'cosmo', url: '//netdna.bootstrapcdn.com/bootswatch/3.0.0/cosmo/bootstrap.min.css' },
        { name: 'cyborg', url: '//netdna.bootstrapcdn.com/bootswatch/3.0.0/cyborg/bootstrap.min.css' },
        { name: 'flatly', url: '//netdna.bootstrapcdn.com/bootswatch/3.0.0/flatly/bootstrap.min.css' },
        { name: 'journal', url: '//netdna.bootstrapcdn.com/bootswatch/3.0.0/journal/bootstrap.min.css' },
        { name: 'readable', url: '//netdna.bootstrapcdn.com/bootswatch/3.0.0/readable/bootstrap.min.css' },
        { name: 'simplex', url: '//netdna.bootstrapcdn.com/bootswatch/3.0.0/simplex/bootstrap.min.css' },
        { name: 'slate', url: '//netdna.bootstrapcdn.com/bootswatch/3.0.0/slate/bootstrap.min.css' },
        { name: 'spacelab', url: '//netdna.bootstrapcdn.com/bootswatch/3.0.0/spacelab/bootstrap.min.css' },
        { name: 'united', url: '//netdna.bootstrapcdn.com/bootswatch/3.0.0/united/bootstrap.min.css' }
    ];
    var themeChooserGimmick = {
        name: 'Themes',
        version: $.md.version,
        once: function() {
            $.md.linkGimmick(this, 'themechooser', themechooser, 'skel_ready');
            $.md.linkGimmick(this, 'theme', apply_theme);

        }
    };
    $.md.registerGimmick(themeChooserGimmick);

    var log = $.md.getLogger();

    var set_theme = function(theme) {
        theme.inverse = theme.inverse || false;

        if (theme.url === undefined) {
            if (!theme.name) {
                log.error('Theme name must be given!');
                return;
            }
            var saved_theme = themes.filter(function(t) {
                return t.name === theme.name;
            })[0];
            if (!saved_theme) {
                log.error('Theme ' + name + ' not found, removing link');
                return;
            }
            theme = $.extend(theme, saved_theme);
        }

        // in devel & fat version the style is inlined, remove it
        $('style[id*=bootstrap]').remove();

        $('link[rel=stylesheet][href*="netdna.bootstrapcdn.com"]')
            .remove();

        $('<link rel="stylesheet" type="text/css">')
            .attr('href', theme.url)
            .appendTo('head');

        if (theme.inverse === true) {
            $('#md-menu').removeClass ('navbar-default');
            $('#md-menu').addClass ('navbar-inverse');
        } else {
            $('#md-menu').addClass ('navbar-default');
            $('#md-menu').removeClass ('navbar-inverse');
        }
    };

    var apply_theme = function($links, opt, text) {
        opt.name = opt.name || text;
        return $links.each(function(i, link) {
            $.md.stage('postgimmick').subscribe(function(done) {
                var $link = $(link);

                // only set a theme if no theme from the choser is selected
                if (window.localStorage.theme === undefined) {
                    set_theme(opt);
                }

                $link.remove();
                done();
            });
        });
    };

    var themechooser = function($links, opt, text) {

        $.md.stage('bootstrap').subscribe(function(done) {
            restore_theme(opt);
            done();
        });

        return $links.each(function(i, e) {
            var $this = $(e);
            var $chooser = $('<a href=""></a><ul></ul>'
            );
            $chooser.eq(0).text(text);

            $.each(themes, function(i, theme) {
                var $li = $('<li></li>');
                $chooser.eq(1).append($li);
                var $a = $('<a/>')
                    .text(theme.name)
                    .attr('href', 'fpp')
                    .click(function(ev) {
                        ev.preventDefault();
                        window.localStorage.theme = theme.name;
                        window.location.reload();
                    })
                    .appendTo($li);
            });

            $chooser.eq(1).append('<li class="divider" />');
            var $li = $('<li/>');
            var $a_use_default = $('<a>Use default</a>');
            $a_use_default.click(function(ev) {
                ev.preventDefault();
                window.localStorage.removeItem('theme');
                window.location.reload();
            });
            $li.append($a_use_default);
            $chooser.eq(1).append($li);

            $chooser.eq(1).append('<li class="divider" />');
            $chooser.eq(1).append('<li><a href="http://www.bootswatch.com">Powered by Bootswatch</a></li>');
            $this.replaceWith($chooser);
        });
    };

    var restore_theme = function(opt) {
        if (window.localStorage.theme) {
            opt = $.extend({ name: window.localStorage.theme }, opt);
            set_theme(opt);
        }
    };
}(jQuery));

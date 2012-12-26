/*
 * Copyright 2009-2012 Prime Teknoloji.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * PUI Object 
 */
PUI = {
    
    zindex : 1000,
        
    /**
     *  Aligns container scrollbar to keep item in container viewport, algorithm copied from jquery-ui menu widget
     */
    scrollInView: function(container, item) {        
        var borderTop = parseFloat(container.css('borderTopWidth')) || 0,
        paddingTop = parseFloat(container.css('paddingTop')) || 0,
        offset = item.offset().top - container.offset().top - borderTop - paddingTop,
        scroll = container.scrollTop(),
        elementHeight = container.height(),
        itemHeight = item.outerHeight(true);

        if(offset < 0) {
            container.scrollTop(scroll + offset);
        }
        else if((offset + itemHeight) > elementHeight) {
            container.scrollTop(scroll + offset - elementHeight + itemHeight);
        }
    },
    
    isIE: function(version) {
        return ($.browser.msie && parseInt($.browser.version, 10) == version);
    }
};/**
 * PrimeUI Accordion widget
 */
$(function() {

    $.widget("prime-ui.puiaccordion", {
       
        options: {
             activeIndex: 0,
             multiple: false
        },
        
        _create: function() {
            if(this.options.multiple) {
                this.options.activeIndex = [];
            }
        
            var $this = this;
            this.element.addClass('pui-accordion ui-widget ui-helper-reset');
            
            this.element.children('h3').addClass('pui-accordion-header ui-helper-reset ui-state-default').each(function(i) {
                var header = $(this),
                title = header.html(),
                headerClass = (i == $this.options.activeIndex) ? 'ui-state-active ui-corner-top' : 'ui-corner-all',
                iconClass = (i == $this.options.activeIndex) ? 'ui-icon ui-icon-triangle-1-s' : 'ui-icon ui-icon-triangle-1-e';
                                
                header.addClass(headerClass).html('<span class="' + iconClass + '"></span><a href="#">' + title + '</a>');
            });
            
            this.element.children('div').each(function(i) {
                var content = $(this);
                content.addClass('pui-accordion-content ui-helper-reset ui-widget-content');
                
                if(i != $this.options.activeIndex) {
                    content.addClass('ui-helper-hidden');
                }
            });
            
            this.headers = this.element.children('.pui-accordion-header');
            this.panels = this.element.children('.pui-accordion-content');
            this.headers.children('a').disableSelection();
            
            this._bindEvents();
        },
        
        _bindEvents: function() {
            var $this = this;

            this.headers.mouseover(function() {
                var element = $(this);
                if(!element.hasClass('ui-state-active')&&!element.hasClass('ui-state-disabled')) {
                    element.addClass('ui-state-hover');
                }
            }).mouseout(function() {
                var element = $(this);
                if(!element.hasClass('ui-state-active')&&!element.hasClass('ui-state-disabled')) {
                    element.removeClass('ui-state-hover');
                }
            }).click(function(e) {
                var element = $(this);
                if(!element.hasClass('ui-state-disabled')) {
                    var tabIndex = element.index() / 2;

                    if(element.hasClass('ui-state-active')) {
                        $this.unselect(tabIndex);
                    }
                    else {
                        $this.select(tabIndex);
                    }
                }

                e.preventDefault();
            });
        },

        /**
         *  Activates a tab with given index
         */
        select: function(index) {
            var panel = this.panels.eq(index);

            this._trigger('change', panel);
            
            //update state
            if(this.options.multiple) 
                this._addToSelection(index);
            else
                this.options.activeIndex = index;

            this._show(panel);
        },

        /**
         *  Deactivates a tab with given index
         */
        unselect: function(index) {
            var panel = this.panels.eq(index),
            header = panel.prev();

            header.attr('aria-expanded', false).children('.ui-icon').removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
            header.removeClass('ui-state-active ui-corner-top').addClass('ui-corner-all');
            panel.attr('aria-hidden', true).slideUp();

            this._removeFromSelection(index);
        },

        _show: function(panel) {
            //deactivate current
            if(!this.options.multiple) {
                var oldHeader = this.headers.filter('.ui-state-active');
                oldHeader.children('.ui-icon').removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
                oldHeader.attr('aria-expanded', false).removeClass('ui-state-active ui-corner-top').addClass('ui-corner-all').next().attr('aria-hidden', true).slideUp();
            }

            //activate selected
            var newHeader = panel.prev();
            newHeader.attr('aria-expanded', true).addClass('ui-state-active ui-corner-top').removeClass('ui-state-hover ui-corner-all')
                    .children('.ui-icon').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');

            panel.attr('aria-hidden', false).slideDown('normal');
        },

        _addToSelection: function(nodeId) {
            this.options.activeIndex.push(nodeId);
        },

        _removeFromSelection: function(index) {
            this.options.activeIndex = $.grep(this.options.activeIndex, function(r) {
                return r != index;
            });
        }
        
    });
});
/**
 * PrimeFaces Growl Widget
 */
$(function() {

    $.widget("prime-ui.puibutton", {
       
        options: {
            icon: null
            ,iconPos : 'left'
        },
        
        _create: function() {
            var element = this.element,
            text = element.text()||'pui-button',
            disabled = element.prop('disabled'),
            styleClass = null;
            
            if(this.options.icon) {
                styleClass = (text === 'pui-button') ? 'pui-button-icon-only' : 'pui-button-text-icon-' + this.options.iconPos;
            }
            else {
                styleClass = 'pui-button-text-only';
            }
        
            if(disabled) {
                styleClass += ' ui-state-disabled';
            }
            
            this.element.addClass('pui-button ui-widget ui-state-default ui-corner-all ' + styleClass).text('');
            
            if(this.options.icon) {
                this.element.append('<span class="pui-button-icon-' + this.options.iconPos + ' ui-icon ' + this.options.icon + '" />');
            }
            
            this.element.append('<span class="pui-button-text">' + text + '</span>');
            
            //aria
            element.attr('role', 'button').attr('aria-disabled', disabled);    
            
            if(!disabled) {
                this._bindEvents();
            }
        },
        
        _bindEvents: function() {
            var element = this.element,
            $this = this;
            
            element.on('mouseover.puibutton', function(){
                if(!element.prop('disabled')) {
                    element.addClass('ui-state-hover');
                }
            }).on('mouseout.puibutton', function() {
                $(this).removeClass('ui-state-active ui-state-hover');
            }).on('mousedown.puibutton', function() {
                if(!element.hasClass('ui-state-disabled')) {
                    element.addClass('ui-state-active').removeClass('ui-state-hover');
                }
            }).on('mouseup.puibutton', function(e) {
                element.removeClass('ui-state-active').addClass('ui-state-hover');
                
                $this._trigger('click', e);
            }).on('focus.puibutton', function() {
                element.addClass('ui-state-focus');
            }).on('blur.puibutton', function() {
                element.removeClass('ui-state-focus');
            }).on('keydown.puibutton',function(e) {
                if(e.keyCode == $.ui.keyCode.SPACE || e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.NUMPAD_ENTER) {
                    element.addClass('ui-state-active');
                }
            }).on('keyup.puibutton', function() {
                element.removeClass('ui-state-active');
            });

            return this;
        },
        
        _unbindEvents: function() {
            this.element.off('mouseover.puibutton mouseout.puibutton mousedown.puibutton mouseup.puibutton focus.puibutton blur.puibutton keydown.puibutton keyup.puibutton');
        },
        
        disable: function() {
            this._unbindEvents();
            
            this.element.addClass('ui-state-disabled');
        },
        
        enable: function() {
            this._bindEvents();
            
            this.element.removeClass('ui-state-disabled');
        }
    });
});/**
 * PrimeUI Dialog Widget
 */
$(function() {

    $.widget("prime-ui.puidialog", {
       
        options: {
            draggable: true,
            resizable: true,
            location: 'center',
            minWidth: 150,
            minHeight: 25,
            height: 'auto',
            width: '300px',
            visible: false,
            modal: false,
            showEffect: null,
            hideEffect: null,
            effectOptions: {},
            effectSpeed: 'normal',
            closeOnEscape: true,
            rtl: false,
            closable: true,
            minimizable: false,
            maximizable: false,
            appendTo: null,
            buttons: null
        },
        
        _create: function() {
            //container
            this.element.addClass('pui-dialog ui-widget ui-widget-content ui-helper-hidden ui-corner-all pui-shadow')
                        .contents().wrapAll('<div class="pui-dialog-content ui-widget-content" />');
                    
            //header
            this.element.prepend('<div class="pui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">'
                                + '<span id="' + this.element.attr('id') + '_label" class="pui-dialog-title">' + this.element.attr('title') + '</span>')
                                .removeAttr('title');
            
            //footer
            if(this.options.buttons) {
                this.footer = $('<div class="pui-dialog-buttonpane ui-widget-content ui-helper-clearfix"></div>').appendTo(this.element);
                for(var i = 0; i < this.options.buttons.length; i++) {
                    var buttonMeta = this.options.buttons[i],
                    button = $('<button type="button"></button>').appendTo(this.footer);
                    if(buttonMeta.text) {
                        button.text(buttonMeta.text);
                    }
                    
                    button.puibutton(buttonMeta);
                }  
            }
            
            if(this.options.rtl) {
                this.element.addClass('pui-dialog-rtl');
            }
            
            //elements
            this.content = this.element.children('.pui-dialog-content');
            this.titlebar = this.element.children('.pui-dialog-titlebar');
            
            if(this.options.closable) {
                this._renderHeaderIcon('pui-dialog-titlebar-close', 'ui-icon-close');
            }
            
            if(this.options.minimizable) {
                this._renderHeaderIcon('pui-dialog-titlebar-maximize', 'ui-icon-extlink');
            }
            
            if(this.options.minimizable) {
                this._renderHeaderIcon('pui-dialog-titlebar-minimize', 'ui-icon-minus');
            }
            
            //icons
            this.icons = this.titlebar.children('.pui-dialog-titlebar-icon');
            this.closeIcon = this.titlebar.children('.pui-dialog-titlebar-close');
            this.minimizeIcon = this.titlebar.children('.pui-dialog-titlebar-minimize');
            this.maximizeIcon = this.titlebar.children('.pui-dialog-titlebar-maximize');
            
            this.blockEvents = 'focus.puidialog mousedown.puidialog mouseup.puidialog keydown.puidialog keyup.puidialog';            
            this.parent = this.element.parent();
            
            //size
            this.element.css({'width': this.options.width, 'height': 'auto'});
            this.content.height(this.options.height);

            //events
            this._bindEvents();

            if(this.options.draggable) {
                this._setupDraggable();
            }

            if(this.options.resizable){
                this._setupResizable();
            }

            if(this.options.appendTo){
                this.element.appendTo(this.options.appendTo);
            }

            //docking zone
            if($(document.body).children('.pui-dialog-docking-zone').length == 0) {
                $(document.body).append('<div class="pui-dialog-docking-zone"></div>')
            }

            //aria
            this._applyARIA();

            if(this.options.visible){
                this.show();
            }
        },
        
        _renderHeaderIcon: function(styleClass, icon) {
            this.titlebar.append('<a class="pui-dialog-titlebar-icon ' + styleClass + ' ui-corner-all" href="#" role="button">'
                                + '<span class="ui-icon ' + icon + '"></span></a>');
        },
        
        _enableModality: function() {
            var $this = this,
            doc = $(document);

            this.modality = $('<div id="' + this.element.attr('id') + '_modal" class="ui-widget-overlay"></div>').appendTo(document.body)
                                .css({
                                    'width' : doc.width(),
                                    'height' : doc.height(),
                                    'z-index' : this.element.css('z-index') - 1
                                });

            //Disable tabbing out of modal dialog and stop events from targets outside of dialog
            doc.bind('keydown.puidialog',
                    function(event) {
                        if(event.keyCode == $.ui.keyCode.TAB) {
                            var tabbables = $this.content.find(':tabbable'), 
                            first = tabbables.filter(':first'), 
                            last = tabbables.filter(':last');

                            if(event.target === last[0] && !event.shiftKey) {
                                first.focus(1);
                                return false;
                            } 
                            else if (event.target === first[0] && event.shiftKey) {
                                last.focus(1);
                                return false;
                            }
                        }
                    })
                    .bind(this.blockEvents, function(event) {
                        if ($(event.target).zIndex() < $this.element.zIndex()) {
                            return false;
                        }
                    });
        },

        _disableModality: function(){
            this.modality.remove();
            this.modality = null;
            $(document).unbind(this.blockEvents).unbind('keydown.dialog');
        },

        show: function() {
            if(this.element.is(':visible')) {
                return;
            }

            if(!this.positionInitialized) {
                this._initPosition();
            }
            
            this._trigger('beforeShow', null);

            if(this.options.showEffect) {
                var $this = this;

                this.element.show(this.options.showEffect, this.options.effectOptions, this.options.effectSpeed, function() {
                    $this._postShow();
                });
            }    
            else {
                this.element.show();

                this._postShow();
            }

            this._moveToTop();

            if(this.options.modal) {
                this._enableModality();
            }
        },

        _postShow: function() {   
            //execute user defined callback
            this._trigger('afterShow', null);

            this.element.attr({
                'aria-hidden': false
                ,'aria-live': 'polite'
            });

            this._applyFocus();
        },

        hide: function() {   
            if(this.element.is(':hidden')) {
                return;
            }
            
            this._trigger('beforeHide', null);

            if(this.options.hideEffect) {
                var _self = this;

                this.element.hide(this.options.hideEffect, this.options.effectOptions, this.options.effectSpeed, function() {
                    _self._postHide();
                });
            }
            else {
                this.element.hide();

                this._postHide();
            }

            if(this.options.modal) {
                this._disableModality();
            }
        },
        
        _postHide: function() {
            //execute user defined callback
            this._trigger('afterHide', null);

            this.element.attr({
                'aria-hidden': true
                ,'aria-live': 'off'
            });
        },

        _applyFocus: function() {
            this.element.find(':not(:submit):not(:button):input:visible:enabled:first').focus();
        },

        _bindEvents: function() {   
            var $this = this;

            this.icons.mouseover(function() {
                $(this).addClass('ui-state-hover');
            }).mouseout(function() {
                $(this).removeClass('ui-state-hover');
            });

            this.closeIcon.on('click.puidialog', function(e) {
                $this.hide();
                e.preventDefault();
            });

            this.maximizeIcon.click(function(e) {
                $this.toggleMaximize();
                e.preventDefault();
            });

            this.minimizeIcon.click(function(e) {
                $this.toggleMinimize();
                e.preventDefault();
            });

            if(this.options.closeOnEscape) {
                $(document).on('keydown.dialog_' + this.element.attr('id'), function(e) {
                    var keyCode = $.ui.keyCode,
                    active = parseInt($this.element.css('z-index')) === PUI.zindex;

                    if(e.which === keyCode.ESCAPE && $this.is(':visible') && active) {
                        $this.hide();
                    };
                });
            }
            
            if(this.options.modal) {
                $(window).on('resize.puidialog', function() {
                    $(document.body).children('.ui-widget-overlay').css({
                        'width': $(document).width()
                        ,'height': $(document).height()
                    });
                });
            }
        },

        _setupDraggable: function() {    
            this.element.draggable({
                cancel: '.pui-dialog-content, .pui-dialog-titlebar-close',
                handle: '.pui-dialog-titlebar',
                containment : 'document'
            });
        },

        _setupResizable: function() {
            this.element.resizable({
                minWidth : this.options.minWidth,
                minHeight : this.options.minHeight,
                alsoResize : this.content,
                containment: 'document'
            });

            this.resizers = this.element.children('.ui-resizable-handle');
        },

        _initPosition: function() {
            //reset
            this.element.css({left:0,top:0});

            if(/(center|left|top|right|bottom)/.test(this.options.location)) {
                this.options.location = this.options.location.replace(',', ' ');

                this.element.position({
                            my: 'center'
                            ,at: this.options.location
                            ,collision: 'fit'
                            ,of: window
                            //make sure dialog stays in viewport
                            ,using: function(pos) {
                                var l = pos.left < 0 ? 0 : pos.left,
                                t = pos.top < 0 ? 0 : pos.top;

                                $(this).css({
                                    left: l
                                    ,top: t
                                });
                            }
                        });
            }
            else {
                var coords = this.options.position.split(','),
                x = $.trim(coords[0]),
                y = $.trim(coords[1]);

                this.element.offset({
                    left: x
                    ,top: y
                });
            }

            this.positionInitialized = true;
        },

        _moveToTop: function() {
            this.element.css('z-index',++PUI.zindex);
        },

        toggleMaximize: function() {
            if(this.minimized) {
                this.toggleMinimize();
            }

            if(this.maximized) {
                this.element.removeClass('pui-dialog-maximized');
                this._restoreState();

                this.maximizeIcon.removeClass('ui-state-hover').children('.ui-icon').removeClass('ui-icon-newwin').addClass('ui-icon-extlink');
                this.maximized = false;
            }
            else {
                this._saveState();

                var win = $(window);

                this.element.addClass('pui-dialog-maximized').css({
                    'width': win.width() - 6
                    ,'height': win.height()
                }).offset({
                    top: win.scrollTop()
                    ,left: win.scrollLeft()
                });

                //maximize content
                this.content.css({
                    width: 'auto',
                    height: 'auto'
                });

                this.maximizeIcon.removeClass('ui-state-hover').children('.ui-icon').removeClass('ui-icon-extlink').addClass('ui-icon-newwin');
                this.maximized = true;
                this._trigger('maximize');
            }
        },

        toggleMinimize: function() {
            var animate = true,
            dockingZone = $(document.body).children('.pui-dialog-docking-zone');

            if(this.maximized) {
                this.toggleMaximize();
                animate = false;
            }

            var $this = this;

            if(this.minimized) {
                this.element.appendTo(this.parent).removeClass('pui-dialog-minimized').css({'position':'fixed', 'float':'none'});
                this._restoreState();
                this.content.show();
                this.minimizeIcon.removeClass('ui-state-hover').children('.ui-icon').removeClass('ui-icon-plus').addClass('ui-icon-minus');
                this.minimized = false;

                if(this.options.resizable) {
                    this.resizers.show();
                }
                
                if(this.footer) {
                    this.footer.show();
                }
            }
            else {
                this._saveState();

                if(animate) {
                    this.element.effect('transfer', {
                                    to: dockingZone
                                    ,className: 'pui-dialog-minimizing'
                                    }, 500, 
                                    function() {
                                        $this._dock(dockingZone);
                                        $this.element.addClass('pui-dialog-minimized');
                                    });
                } 
                else {
                    this._dock(dockingZone);
                }
            }
        },

        _dock: function(zone) {
            this.element.appendTo(zone).css('position', 'static');
            this.element.css({'height':'auto', 'width':'auto', 'float': 'left'});
            this.content.hide();
            this.minimizeIcon.removeClass('ui-state-hover').children('.ui-icon').removeClass('ui-icon-minus').addClass('ui-icon-plus');
            this.minimized = true;

            if(this.options.resizable) {
                this.resizers.hide();
            }
            
            if(this.footer) {
                this.footer.hide();
            }
            
            zone.css('z-index',++PUI.zindex);

            this._trigger('minimize');
        },

        _saveState: function() {
            this.state = {
                width: this.element.width()
                ,height: this.element.height()
            };

            var win = $(window);
            this.state.offset = this.element.offset();
            this.state.windowScrollLeft = win.scrollLeft();
            this.state.windowScrollTop = win.scrollTop();
        },

        _restoreState: function() {
            this.element.width(this.state.width).height(this.state.height);
            
            var win = $(window);
            this.element.offset({
                    top: this.state.offset.top + (win.scrollTop() - this.state.windowScrollTop)
                    ,left: this.state.offset.left + (win.scrollLeft() - this.state.windowScrollLeft)
            });
        },

        _applyARIA: function() {
            this.element.attr({
                'role': 'dialog'
                ,'aria-labelledby': this.element.attr('id') + '_title'
                ,'aria-hidden': !this.options.visible
            });

            this.titlebar.children('a.pui-dialog-titlebar-icon').attr('role', 'button');
        }
    });
});/**
 * PrimeFaces Fieldset Widget
 */
$(function() {

    $.widget("prime-ui.puifieldset", {
       
        options: {
            toggleable: false,
            toggleDuration: 'normal',
            collapsed: false
        },
        
        _create: function() {
            this.element.addClass('pui-fieldset ui-widget ui-widget-content ui-corner-all').
                children('legend').addClass('pui-fieldset-legend ui-corner-all ui-state-default');
            
            this.element.contents(':not(legend)').wrapAll('<div class="pui-fieldset-content" />');
            
            this.legend = this.element.children('legend.pui-fieldset-legend');
            this.content = this.element.children('div.pui-fieldset-content');
            
            if(this.options.toggleable) {
                this.element.addClass('pui-fieldset-toggleable');
                this.toggler = $('<span class="pui-fieldset-toggler ui-icon" />').prependTo(this.legend);
                
                this._bindEvents();
                
                if(this.options.collapsed) {
                    this.content.hide();
                    this.toggler.addClass('ui-icon-plusthick');
                } else {
                    this.toggler.addClass('ui-icon-minusthick');
                }
            }
        },
        
        _bindEvents: function() {
            var $this = this;
            
            this.legend.on('click.puifieldset', function(e) {$this.toggle(e);})
                            .on('mouseover.puifieldset', function() {$this.legend.addClass('ui-state-hover');})
                            .on('mouseout.puifieldset', function() {$this.legend.removeClass('ui-state-hover ui-state-active');})
                            .on('mousedown.puifieldset', function() {$this.legend.removeClass('ui-state-hover').addClass('ui-state-active');})
                            .on('mouseup.puifieldset', function() {$this.legend.removeClass('ui-state-active').addClass('ui-state-hover');})
        },
        
        toggle: function(e) {
            var $this = this;
            
            this._trigger('beforeToggle', e);

            if(this.options.collapsed) {
                this.toggler.removeClass('ui-icon-plusthick').addClass('ui-icon-minusthick');
            } else {
                this.toggler.removeClass('ui-icon-minusthick').addClass('ui-icon-plusthick');
            }

            this.content.slideToggle(this.options.toggleSpeed, 'easeInOutCirc', function() {
                $this._trigger('afterToggle', e);
                $this.options.collapsed = !$this.options.collapsed;
            });
        }
        
    });
});/**
 * PrimeUI Lightbox Widget
 */
$(function() {

    $.widget("prime-ui.puigalleria", {
       
        options: {
            panelWidth: 600,
            panelHeight: 400,
            frameWidth: 60,
            frameHeight: 40,
            activeIndex: 0,
            showFilmstrip: true,
            autoPlay: true,
            transitionInterval: 4000,
            effect: 'fade',
            effectSpeed: 250,
            effectOptions: {},
            showCaption: true,
            customContent: false
        },
        
        _create: function() {
            this.element.addClass('pui-galleria ui-widget ui-widget-content ui-corner-all');
            this.panelWrapper = this.element.children('ul');
            this.panelWrapper.addClass('pui-galleria-panel-wrapper');
            this.panels = this.panelWrapper.children('li');
            this.panels.addClass('pui-galleria-panel ui-helper-hidden');
                        
            this.element.width(this.options.panelWidth);
            this.panelWrapper.width(this.options.panelWidth).height(this.options.panelHeight);
            this.panels.width(this.options.panelWidth).height(this.options.panelHeight);

            if(this.options.showFilmstrip) {
                this._renderStrip();
                this._bindEvents();
            }
            
            if(this.options.customContent) {
                this.panels.children('img').remove();
                this.panels.children('div').addClass('pui-galleria-panel-content');
            }
            
            //show first
            var activePanel = this.panels.eq(this.options.activeIndex);
            activePanel.removeClass('ui-helper-hidden');
            if(this.options.showCaption) {
                this._showCaption(activePanel);
            }
            
            this.element.css('visibility', 'visible');

            if(this.options.autoPlay) {
                this.startSlideshow();
            }
        },
        
        _renderStrip: function() {
            var frameStyle = 'style="width:' + this.options.frameWidth + "px;height:" + this.options.frameHeight + 'px;"';

            this.stripWrapper = $('<div class="pui-galleria-filmstrip-wrapper"></div>')
                    .width(this.element.width() - 50)
                    .height(this.options.frameHeight)
                    .appendTo(this.element);

            this.strip = $('<ul class="pui-galleria-filmstrip"></div>').appendTo(this.stripWrapper);

            for(var i = 0; i < this.panels.length; i++) {
                var image = this.panels.eq(i).children('img'),
                frameClass = (i == this.options.activeIndex) ? 'pui-galleria-frame pui-galleria-frame-active' : 'pui-galleria-frame',
                frameMarkup = '<li class="'+ frameClass + '" ' + frameStyle + '>'
                + '<div class="pui-galleria-frame-content" ' + frameStyle + '>'
                + '<img src="' + image.attr('src') + '" class="pui-galleria-frame-image" ' + frameStyle + '/>'
                + '</div></li>';

                this.strip.append(frameMarkup);
            }

            this.frames = this.strip.children('li.pui-galleria-frame');

            //navigators
            this.element.append('<div class="pui-galleria-nav-prev ui-icon ui-icon-circle-triangle-w" style="bottom:' + (this.options.frameHeight / 2) + 'px"></div>' + 
                '<div class="pui-galleria-nav-next ui-icon ui-icon-circle-triangle-e" style="bottom:' + (this.options.frameHeight / 2) + 'px"></div>');

            //caption
            if(this.options.showCaption) {
                this.caption = $('<div class="pui-galleria-caption"></div>').css({
                    'bottom': this.stripWrapper.outerHeight(true),
                    'width': this.panelWrapper.width()
                    }).appendTo(this.element);
            }
        },
        
        _bindEvents: function() {
            var $this = this;

            this.element.children('div.pui-galleria-nav-prev').on('click.puigalleria', function() {
                if($this.slideshowActive) {
                    $this.stopSlideshow();
                }

                if(!$this.isAnimating()) {
                    $this.prev();
                }
            });

            this.element.children('div.pui-galleria-nav-next').on('click.puigalleria', function() {
                if($this.slideshowActive) {
                    $this.stopSlideshow();
                }

                if(!$this.isAnimating()) {
                    $this.next();
                }
            });

            this.strip.children('li.pui-galleria-frame').on('click.puigalleria', function() {
                if($this.slideshowActive) {
                    $this.stopSlideshow();
                }

                $this.select($(this).index(), false);
            });
        },

        startSlideshow: function() {
            var $this = this;

            this.interval = setInterval(function() {
                $this.next();
            }, this.options.transitionInterval);

            this.slideshowActive = true;
        },

        stopSlideshow: function() {
            clearInterval(this.interval);

            this.slideshowActive = false;
        },

        isSlideshowActive: function() {
            return this.slideshowActive;
        },

        select: function(index, reposition) {
            if(index !== this.options.activeIndex) {
                if(this.options.showCaption) {
                    this._hideCaption();
                }

                var oldPanel = this.panels.eq(this.options.activeIndex),
                oldFrame = this.frames.eq(this.options.activeIndex),
                newPanel = this.panels.eq(index),
                newFrame = this.frames.eq(index);

                //content
                oldPanel.hide(this.options.effect, this.options.effectOptions, this.options.effectSpeed);
                newPanel.show(this.options.effect, this.options.effectOptions, this.options.effectSpeed);

                //frame
                oldFrame.removeClass('pui-galleria-frame-active').css('opacity', '');
                newFrame.animate({opacity:1.0}, this.options.effectSpeed, null, function() {
                   $(this).addClass('pui-galleria-frame-active'); 
                });

                //caption
                if(this.options.showCaption) {
                    this._showCaption(newPanel);
                }

                //viewport
                if(reposition === undefined || reposition === true) {
                    var frameLeft = newFrame.position().left,
                    stepFactor = this.options.frameWidth + parseInt(newFrame.css('margin-right')),
                    stripLeft = this.strip.position().left,
                    frameViewportLeft = frameLeft + stripLeft,
                    frameViewportRight = frameViewportLeft + this.options.frameWidth;

                    if(frameViewportRight > this.stripWrapper.width()) {
                        this.strip.animate({left: '-=' + stepFactor}, this.options.effectSpeed, 'easeInOutCirc');
                    } else if(frameViewportLeft < 0) {
                        this.strip.animate({left: '+=' + stepFactor}, this.options.effectSpeed, 'easeInOutCirc');
                    }
                }

                this.options.activeIndex = index;
            }
        },
        
        _hideCaption: function() {
            this.caption.slideUp(this.options.effectSpeed);
        },
        
        _showCaption: function(panel) {
            var image = panel.children('img');
            this.caption.html('<h4>' + image.attr('title') + '</h4><p>' + image.attr('alt') + '</p>').slideDown(this.options.effectSpeed);
        },

        prev: function() {
            if(this.options.activeIndex != 0) {
                this.select(this.options.activeIndex - 1);
            }
        },

        next: function() {
            if(this.options.activeIndex !== (this.panels.length - 1)) {
                this.select(this.options.activeIndex + 1);
            } 
            else {
                this.select(0, false);
                this.strip.animate({left: 0}, this.options.effectSpeed, 'easeInOutCirc');
            }
        },

        isAnimating: function() {
            return this.strip.is(':animated');
        }
    });
});/**
 * PrimeFaces Growl Widget
 */
$(function() {

    $.widget("prime-ui.puigrowl", {
       
        options: {
            sticky: false,
            life: 3000
        },
        
        _create: function() {
            var container = this.element;
            
            container.addClass("pui-growl ui-widget").appendTo(document.body);
        },
        
        show: function(msgs) {
            var $this = this;
        
            //this.jq.css('z-index', ++PrimeFaces.zindex);

            this.clear();

            $.each(msgs, function(i, msg) {
                $this._renderMessage(msg);
            }); 
        },
        
        clear: function() {
            this.element.children('div.pui-growl-item-container').remove();
        },
        
        _renderMessage: function(msg) {
            var markup = '<div class="pui-growl-item-container ui-state-highlight ui-corner-all ui-helper-hidden pui-shadow" aria-live="polite">';
            markup += '<div class="pui-growl-item">';
            markup += '<div class="pui-growl-icon-close ui-icon ui-icon-closethick" style="display:none"></div>';
            markup += '<span class="pui-growl-image pui-growl-image-' + msg.severity + '" />';
            markup += '<div class="pui-growl-message">';
            markup += '<span class="pui-growl-title">' + msg.summary + '</span>';
            markup += '<p>' + msg.detail + '</p>';
            markup += '</div><div style="clear: both;"></div></div></div>';

            var message = $(markup);
            
            this._bindMessageEvents(message);
            message.appendTo(this.element).fadeIn();
        },
        
        _removeMessage: function(message) {
            message.fadeTo('normal', 0, function() {
                message.slideUp('normal', 'easeInOutCirc', function() {
                    message.remove();
                });
            });
        },
        
        _bindMessageEvents: function(message) {
            var $this = this,
            sticky = this.options.sticky;

            message.on('mouseover.puigrowl', function() {
                var msg = $(this);

                if(!msg.is(':animated')) {
                    msg.find('div.pui-growl-icon-close:first').show();
                }
            })
            .on('mouseout.puigrowl', function() {        
                $(this).find('div.pui-growl-icon-close:first').hide();
            });

            //remove message on click of close icon
            message.find('div.pui-growl-icon-close').on('click.puigrowl',function() {
                $this._removeMessage(message);

                if(!sticky) {
                    clearTimeout(message.data('timeout'));
                }
            });

            if(!sticky) {
                this._setRemovalTimeout(message);
            }
        },
        
        _setRemovalTimeout: function(message) {
            var $this = this;

            var timeout = setTimeout(function() {
                $this._removeMessage(message);
            }, this.options.life);

            message.data('timeout', timeout);
        }
    });
});/**
 * PrimeUI inputtext widget
 */
$(function() {

    $.widget("prime-ui.puiinputtext", {
       
        _create: function() {
            var input = this.element,
            disabled = input.prop('disabled');

            //visuals
            input.addClass('pui-inputtext ui-widget ui-state-default ui-corner-all');
            
            if(disabled) {
                input.addClass('ui-state-disabled');
            }
            else {
                input.hover(function() {
                    input.toggleClass('ui-state-hover');
                }).focus(function() {
                    input.addClass('ui-state-focus');
                }).blur(function() {
                    input.removeClass('ui-state-focus');
                });
            }

            //aria
            input.attr('role', 'textbox').attr('aria-disabled', disabled)
                                          .attr('aria-readonly', input.prop('readonly'))
                                          .attr('aria-multiline', input.is('textarea'));
        },
        
        _destroy: function() {
            
        }
        
    });
    
});/**
 * PrimeUI inputtextarea widget
 */
$(function() {

    $.widget("prime-ui.puiinputtextarea", {
       
        options: {
             autoResize: false
            ,autoComplete: false
            ,maxlength: null
            ,counter: null
            ,counterTemplate: '{0}'
            ,minQueryLength: 3
            ,queryDelay: 700
        },

        _create: function() {
            var $this = this;
            
            this.element.puiinputtext();
            
            if(this.options.autoResize) {
                this.options.rowsDefault = this.element.attr('rows');
                this.options.colsDefault = this.element.attr('cols');
        
                this.element.addClass('pui-inputtextarea-resizable');
                
                this.element.keyup(function() {
                    $this._resize();
                }).focus(function() {
                    $this._resize();
                }).blur(function() {
                    $this._resize();
                });
            }
            
            if(this.options.maxlength) {
                this.element.keyup(function(e) {
                    var value = $this.element.val(),
                    length = value.length;

                    if(length > $this.options.maxlength) {
                        $this.element.val(value.substr(0, $this.options.maxlength));
                    }

                    if($this.options.counter) {
                        $this._updateCounter();
                    }
                });
            }
            
            if(this.options.counter) {
                this._updateCounter();
            }
            
            if(this.options.autoComplete) {
                this._initAutoComplete();
            }
        },
        
        _updateCounter: function() {
            var value = this.element.val(),
            length = value.length;

            if(this.options.counter) {
                var remaining = this.options.maxlength - length,
                remainingText = this.options.counterTemplate.replace('{0}', remaining);

                this.options.counter.text(remainingText);
            }
        },
        
        _resize: function() {
            var linesCount = 0,
            lines = this.element.val().split('\n');

            for(var i = lines.length-1; i >= 0 ; --i) {
                linesCount += Math.floor((lines[i].length / this.options.colsDefault) + 1);
            }

            var newRows = (linesCount >= this.options.rowsDefault) ? (linesCount + 1) : this.options.rowsDefault;

            this.element.attr('rows', newRows);
        },
        
        
        _initAutoComplete: function() {
            var panelMarkup = '<div id="' + this.id + '_panel" class="pui-autocomplete-panel ui-widget-content ui-corner-all ui-helper-hidden ui-shadow"></div>',
            $this = this;

            this.panel = $(panelMarkup).appendTo(document.body);

            this.element.keyup(function(e) {
                var keyCode = $.ui.keyCode;

                switch(e.which) {

                    case keyCode.UP:
                    case keyCode.LEFT:
                    case keyCode.DOWN:
                    case keyCode.RIGHT:
                    case keyCode.ENTER:
                    case keyCode.NUMPAD_ENTER:
                    case keyCode.TAB:
                    case keyCode.SPACE:
                    case keyCode.CONTROL:
                    case keyCode.ALT:
                    case keyCode.ESCAPE:
                    case 224:   //mac command
                        //do not search
                    break;

                    default:
                        var query = $this._extractQuery();           
                        if(query && query.length >= $this.options.minQueryLength) {

                             //Cancel the search request if user types within the timeout
                            if($this.timeout) {
                                $this._clearTimeout($this.timeout);
                            }

                            $this.timeout = setTimeout(function() {
                                $this.search(query);
                            }, $this.options.queryDelay);

                        }
                    break;
                }

            }).keydown(function(e) {
                var overlayVisible = $this.panel.is(':visible'),
                keyCode = $.ui.keyCode;

                switch(e.which) {
                    case keyCode.UP:
                    case keyCode.LEFT:
                        if(overlayVisible) {
                            var highlightedItem = $this.items.filter('.ui-state-highlight'),
                            prev = highlightedItem.length == 0 ? $this.items.eq(0) : highlightedItem.prev();

                            if(prev.length == 1) {
                                highlightedItem.removeClass('ui-state-highlight');
                                prev.addClass('ui-state-highlight');

                                if($this.options.scrollHeight) {
                                    PUI.scrollInView($this.panel, prev);
                                }
                            }

                            e.preventDefault();
                        }
                        else {
                            $this._clearTimeout();
                        }
                    break;

                    case keyCode.DOWN:
                    case keyCode.RIGHT:
                        if(overlayVisible) {
                            var highlightedItem = $this.items.filter('.ui-state-highlight'),
                            next = highlightedItem.length == 0 ? _self.items.eq(0) : highlightedItem.next();

                            if(next.length == 1) {
                                highlightedItem.removeClass('ui-state-highlight');
                                next.addClass('ui-state-highlight');

                                if($this.options.scrollHeight) {
                                    PUI.scrollInView($this.panel, next);
                                }
                            }

                            e.preventDefault();
                        }
                        else {
                            $this._clearTimeout();
                        }
                    break;

                    case keyCode.ENTER:
                    case keyCode.NUMPAD_ENTER:
                        if(overlayVisible) {
                            $this.items.filter('.ui-state-highlight').trigger('click');

                            e.preventDefault();
                        }
                        else {
                            $this._clearTimeout();
                        } 
                    break;

                    case keyCode.SPACE:
                    case keyCode.CONTROL:
                    case keyCode.ALT:
                    case keyCode.BACKSPACE:
                    case keyCode.ESCAPE:
                    case 224:   //mac command
                        $this._clearTimeout();

                        if(overlayVisible) {
                            $this._hide();
                        }
                    break;

                    case keyCode.TAB:
                        $this._clearTimeout();

                        if(overlayVisible) {
                            $this.items.filter('.ui-state-highlight').trigger('click');
                            $this._hide();
                        }
                    break;
                }
            });

            //hide panel when outside is clicked
            $(document.body).bind('mousedown.puiinputtextarea', function (e) {
                if($this.panel.is(":hidden")) {
                    return;
                }
                var offset = $this.panel.offset();
                if(e.target === $this.element.get(0)) {
                    return;
                }

                if (e.pageX < offset.left ||
                    e.pageX > offset.left + $this.panel.width() ||
                    e.pageY < offset.top ||
                    e.pageY > offset.top + $this.panel.height()) {
                    $this._hide();
                }
            });

            //Hide overlay on resize
            var resizeNS = 'resize.' + this.id;
            $(window).unbind(resizeNS).bind(resizeNS, function() {
                if($this.panel.is(':visible')) {
                    $this._hide();
                }
            });
        },

        _bindDynamicEvents: function() {
            var $this = this;

            //visuals and click handler for items
            this.items.bind('mouseover', function() {
                var item = $(this);

                if(!item.hasClass('ui-state-highlight')) {
                    $this.items.filter('.ui-state-highlight').removeClass('ui-state-highlight');
                    item.addClass('ui-state-highlight');
                }
            })
            .bind('click', function(event) {
                var item = $(this),
                itemValue = item.attr('data-item-value'),
                insertValue = itemValue.substring($this.query.length);

                $this.element.focus();

                $this.element.insertText(insertValue, $this.element.getSelection().start, true);

                $this._hide();
                
                $this._trigger("itemselect", event, item);
            });
        },

        _clearTimeout: function() {
            if(this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = null;
        },

        _extractQuery: function() {
            var end = this.element.getSelection().end,
            result = /\S+$/.exec(this.element.get(0).value.slice(0, end)),
            lastWord = result ? result[0] : null;

            return lastWord;
        },

        search: function(q) {
            this.query = q;

            var request = {
                query: q 
            };

            if(this.options.completeSource) {
                this.options.completeSource.call(this, request, this._handleResponse);
            }
        },

        _handleResponse: function(data) {
            this.panel.html('');

            var listContainer = $('<ul class="pui-autocomplete-items pui-autocomplete-list ui-widget-content ui-widget ui-corner-all ui-helper-reset"></ul>');

            for(var i = 0; i < data.length; i++) {
                var item = $('<li class="pui-autocomplete-item pui-autocomplete-list-item ui-corner-all"></li>');
                item.attr('data-item-value', data[i].value);
                item.text(data[i].label);

                listContainer.append(item);
            }

            this.panel.append(listContainer).show();
            this.items = this.panel.find('.pui-autocomplete-item');

            this._bindDynamicEvents();

            if(this.items.length > 0) {                            
                //highlight first item
                this.items.eq(0).addClass('ui-state-highlight');

                //adjust height
                if(this.options.scrollHeight && this.panel.height() > this.options.scrollHeight) {
                    this.panel.height(this.options.scrollHeight);
                }

                if(this.panel.is(':hidden')) {
                    this._show();
                } 
                else {
                    this._alignPanel(); //with new items
                }

            }
            else {
                this.panel.hide();
            }
        },

        _alignPanel: function() {
            var pos = this.element.getCaretPosition(),
            offset = this.element.offset();

            this.panel.css({
                            'left': offset.left + pos.left,
                            'top': offset.top + pos.top,
                            'width': this.element.innerWidth()
                    });
        },

        _show: function() {
            this._alignPanel();

            this.panel.show();
        },

        _hide: function() {        
            this.panel.hide();
        },

        // called when created, and later when changing options
        _refresh: function() {
            
        },

        _destroy: function() {
            alert('destroy');
        }
        
    });
    
});/**
 * PrimeUI Lightbox Widget
 */
$(function() {

    $.widget("prime-ui.puilightbox", {
       
        options: {
            iframeWidth: 640,
            iframeHeight: 480,
            iframe: false
        },
        
        _create: function() { 
            this.options.mode = this.options.iframe ? 'iframe' : (this.element.children('div').length == 1) ? 'inline' : 'image';
            
            var dom = '<div class="pui-lightbox ui-widget ui-helper-hidden ui-corner-all pui-shadow">';
            dom += '<div class="pui-lightbox-content-wrapper">';
            dom += '<a class="ui-state-default pui-lightbox-nav-left ui-corner-right ui-helper-hidden"><span class="ui-icon ui-icon-carat-1-w">go</span></a>';
            dom += '<div class="pui-lightbox-content ui-corner-all"></div>';
            dom += '<a class="ui-state-default pui-lightbox-nav-right ui-corner-left ui-helper-hidden"><span class="ui-icon ui-icon-carat-1-e">go</span></a>';
            dom += '</div>';
            dom += '<div class="pui-lightbox-caption ui-widget-header"><span class="pui-lightbox-caption-text"></span>';
            dom += '<a class="pui-lightbox-close ui-corner-all" href="#"><span class="ui-icon ui-icon-closethick"></span></a><div style="clear:both" /></div>';
            dom += '</div>';

            this.panel = $(dom).appendTo(document.body);
            this.contentWrapper = this.panel.children('.pui-lightbox-content-wrapper');
            this.content = this.contentWrapper.children('.pui-lightbox-content');
            this.caption = this.panel.children('.pui-lightbox-caption');
            this.captionText = this.caption.children('.pui-lightbox-caption-text');        
            this.closeIcon = this.caption.children('.pui-lightbox-close');
            
            if(this.options.mode === 'image') {
                this._setupImaging();
            } 
            else if(this.options.mode === 'inline') {
                this._setupInline();
            } 
            else if(this.options.mode === 'iframe') {
                this._setupIframe();
            }
            
            this._bindCommonEvents();
            
            this.links.data('puilightbox-trigger', true).find('*').data('puilightbox-trigger', true);
            this.closeIcon.data('puilightbox-trigger', true).find('*').data('puilightbox-trigger', true);
        },
        
        _bindCommonEvents: function() {
            var $this = this;

            this.closeIcon.hover(function() {
                $(this).toggleClass('ui-state-hover');
            }).click(function(e) {
                $this.hide();
                e.preventDefault();
            });

            //hide when outside is clicked
            $(document.body).bind('click.pui-lightbox', function (e) {            
                if($this.isHidden()) {
                    return;
                }

                //do nothing if target is the link
                var target = $(e.target);
                if(target.data('puilightbox-trigger')) {
                    return;
                }

                //hide if mouse is outside of lightbox
                var offset = $this.panel.offset();
                if(e.pageX < offset.left ||
                    e.pageX > offset.left + $this.panel.width() ||
                    e.pageY < offset.top ||
                    e.pageY > offset.top + $this.panel.height()) {

                    $this.hide();
                }
            });

            //sync window resize
            $(window).resize(function() {
                if(!$this.isHidden()) {
                    $(document.body).children('.ui-widget-overlay').css({
                        'width': $(document).width()
                        ,'height': $(document).height()
                    });
                }
            });
        },
                
        _setupImaging: function() {
            var $this = this;

            this.links = this.element.children('a');
            this.content.append('<img class="ui-helper-hidden"></img>');
            this.imageDisplay = this.content.children('img');
            this.navigators = this.contentWrapper.children('a');

            this.imageDisplay.load(function() { 
                var image = $(this);

                $this._scaleImage(image);

                //coordinates to center overlay
                var leftOffset = ($this.panel.width() - image.width()) / 2,
                topOffset = ($this.panel.height() - image.height()) / 2;

                //resize content for new image
                $this.content.removeClass('pui-lightbox-loading').animate({
                    width: image.width()
                    ,height: image.height()
                },
                500,
                function() {            
                    //show image
                    image.fadeIn();
                    $this._showNavigators();
                    $this.caption.slideDown();
                });

                $this.panel.animate({
                    left: '+=' + leftOffset
                    ,top: '+=' + topOffset
                }, 500);
            });

            this.navigators.hover(function() {
                $(this).toggleClass('ui-state-hover'); 
            })
            .click(function(e) {
                var nav = $(this);

                $this._hideNavigators();

                if(nav.hasClass('pui-lightbox-nav-left')) {
                    var index = $this.current == 0 ? $this.links.length - 1 : $this.current - 1;

                    $this.links.eq(index).trigger('click');
                } 
                else {
                    var index = $this.current == $this.links.length - 1 ? 0 : $this.current + 1;

                    $this.links.eq(index).trigger('click');
                }

                e.preventDefault(); 
            });

            this.links.click(function(e) {
                var link = $(this);

                if($this.isHidden()) {
                    $this.content.addClass('pui-lightbox-loading').width(32).height(32);
                    $this.show();
                }
                else {
                    $this.imageDisplay.fadeOut(function() {
                        //clear for onload scaling
                        $(this).css({
                            'width': 'auto'
                            ,'height': 'auto'
                        });

                        $this.content.addClass('pui-lightbox-loading');
                    });

                    $this.caption.slideUp();
                }

                setTimeout(function() {
                    $this.imageDisplay.attr('src', link.attr('href'));
                    $this.current = link.index();

                    var title = link.attr('title');
                    if(title) {
                        $this.captionText.html(title);
                    }
                }, 1000);


                e.preventDefault();
            });
        },

        _scaleImage: function(image) {
            var win = $(window),
            winWidth = win.width(),
            winHeight = win.height(),
            imageWidth = image.width(),
            imageHeight = image.height(),
            ratio = imageHeight / imageWidth;

            if(imageWidth >= winWidth && ratio <= 1){
                imageWidth = winWidth * 0.75;
                imageHeight = imageWidth * ratio;
            } 
            else if(imageHeight >= winHeight){
                imageHeight = winHeight * 0.75;
                imageWidth = imageHeight / ratio;
            }

            image.css({
                'width':imageWidth + 'px'
                ,'height':imageHeight + 'px'
            })
        },
        
        _setupInline: function() {
            this.links = this.element.children('a');
            this.inline = this.element.children('div').addClass('pui-lightbox-inline');
            this.inline.appendTo(this.content).show();
            var $this = this;

            this.links.click(function(e) {
                $this.show();

                var title = $(this).attr('title');
                if(title) {
                    $this.captionText.html(title);
                    $this.caption.slideDown();
                }

                e.preventDefault();
            });
        },

        _setupIframe: function() {
            var $this = this;
            this.links = this.element;
            this.iframe = $('<iframe frameborder="0" style="width:' + this.options.iframeWidth + 'px;height:' 
                            + this.options.iframeHeight + 'px;border:0 none; display: block;"></iframe>').appendTo(this.content);

            if(this.options.iframeTitle) {
                this.iframe.attr('title', this.options.iframeTitle);
            }

            this.element.click(function(e) {
                if(!$this.iframeLoaded) {
                    $this.content.addClass('pui-lightbox-loading').css({
                        width: $this.options.iframeWidth
                        ,height: $this.options.iframeHeight
                    });
                    
                    $this.show();

                    $this.iframe.on('load', function() {
                                    $this.iframeLoaded = true;
                                    $this.content.removeClass('pui-lightbox-loading');
                                })
                                .attr('src', $this.element.attr('href'));
                }
                else {
                    $this.show();
                }

                var title = $this.element.attr('title');
                if(title) {
                    $this.caption.html(title);
                    $this.caption.slideDown();
                }

                e.preventDefault();
            });
        },

        show: function() {
            this.center();

            this.panel.css('z-index', ++PUI.zindex).show();

            if(!this.modality) {
                this._enableModality();
            }

            this._trigger('show');
        },

        hide: function() {
            this.panel.fadeOut();
            this._disableModality();
            this.caption.hide();

            if(this.options.mode === 'image') {
                this.imageDisplay.hide().attr('src', '').removeAttr('style');
                this._hideNavigators();
            }

            this._trigger('hide');
        },

        center: function() { 
            var win = $(window),
            left = (win.width() / 2 ) - (this.panel.width() / 2),
            top = (win.height() / 2 ) - (this.panel.height() / 2);

            this.panel.css({
                'left': left,
                'top': top
            });
        },

        _enableModality: function() {
            this.modality = $('<div class="ui-widget-overlay"></div>')
                            .css({
                                'width': $(document).width()
                                ,'height': $(document).height()
                                ,'z-index': this.panel.css('z-index') - 1
                            })
                            .appendTo(document.body);
        },

        _disableModality: function() {
            this.modality.remove();
            this.modality = null;
        },

        _showNavigators: function() {
            this.navigators.zIndex(this.imageDisplay.zIndex() + 1).show();
        },

        _hideNavigators: function() {
            this.navigators.hide();
        },
        
        isHidden: function() {
            return this.panel.is(':hidden');
        },

        showURL: function(opt) {
            if(opt.width)
                this.iframe.attr('width', opt.width);
            if(opt.height)
                this.iframe.attr('height', opt.height);

            this.iframe.attr('src', opt.src); 

            this.show();
        }
    });
});/**
 * PrimeUI Panel Widget
 */
$(function() {

    $.widget("prime-ui.puipanel", {
       
        options: {
            toggleable: false,
            toggleDuration: 'normal',
            toggleOrientation : 'vertical',
            collapsed: false,
            closable: false,
            closeDuration: 'normal'
        },
        
        _create: function() {
            this.element.addClass('pui-panel ui-widget ui-widget-content ui-corner-all')
                .contents().wrapAll('<div class="pui-panel-content ui-widget-content" />');
                
            var title = this.element.attr('title');
            if(title) {
                this.element.prepend('<div class="pui-panel-titlebar ui-widget-header ui-helper-clearfix ui-corner-all"><span class="ui-panel-title">'
                        + title + "</span></div>")
                        .removeAttr('title');
            }
            
            this.header = this.element.children('div.pui-panel-titlebar');
            this.title = this.header.children('span.ui-panel-title');
            this.content = this.element.children('div.pui-panel-content');
            
            var $this = this;
            
            if(this.options.closable) {
                this.closer = $('<a class="pui-panel-titlebar-icon ui-corner-all ui-state-default" href="#"><span class="ui-icon ui-icon-closethick"></span></a>')
                                .appendTo(this.header)
                                .on('click.puipanel', function(e) {
                                    $this.close();
                                    e.preventDefault();
                                });
            }
            
            if(this.options.toggleable) {
                var icon = this.options.collapsed ? 'ui-icon-plusthick' : 'ui-icon-minusthick';
                
                this.toggler = $('<a class="pui-panel-titlebar-icon ui-corner-all ui-state-default" href="#"><span class="ui-icon ' + icon + '"></span></a>')
                                .appendTo(this.header)
                                .on('click.puipanel', function(e) {
                                    $this.toggle();
                                    e.preventDefault();
                                });
                                
                if(this.options.collapsed) {
                    this.content.hide();
                }
            }
            
            this._bindEvents();
        },

        _bindEvents: function() {
            this.header.find('a.pui-panel-titlebar-icon').on('hover.puipanel', function() {$(this).toggleClass('ui-state-hover');});
        },
        
        close: function() {
            var $this = this;
            
            this._trigger('beforeClose', null);
            
            this.element.fadeOut(this.options.closeDuration,
                function() {
                    $this._trigger('afterClose', null);
                }
            );
        },
        
        toggle: function() {
            if(this.options.collapsed) {
                this.expand();
            }
            else {
                this.collapse();
            }
        },
        
        expand: function() {
            this.toggler.children('span.ui-icon').removeClass('ui-icon-plusthick').addClass('ui-icon-minusthick');
            
            if(this.options.toggleOrientation === 'vertical') {
                this._slideDown();
            } 
            else if(this.options.toggleOrientation === 'horizontal') {
                this._slideRight();
            }
        },

        collapse: function() {
            this.toggler.children('span.ui-icon').removeClass('ui-icon-minusthick').addClass('ui-icon-plusthick');
            
            if(this.options.toggleOrientation === 'vertical') {
                this._slideUp();
            } 
            else if(this.options.toggleOrientation === 'horizontal') {
                this._slideLeft();
            }
        },
        
        _slideUp: function() {        
            var $this = this;
            
            this._trigger('beforeCollapse');
            
            this.content.slideUp(this.options.toggleDuration, 'easeInOutCirc', function() {
                $this._trigger('afterCollapse');
                $this.options.collapsed = !$this.options.collapsed;
            });
        },

        _slideDown: function() {  
            var $this = this;
            
            this._trigger('beforeExpand');
            
            this.content.slideDown(this.options.toggleDuration, 'easeInOutCirc', function() {
                $this._trigger('afterExpand');
                $this.options.collapsed = !$this.options.collapsed;
            }); 
        },

        _slideLeft: function() {
            var $this = this;

            this.originalWidth = this.element.width();

            this.title.hide();
            this.toggler.hide();
            this.content.hide();

            this.element.animate({
                width: '42px'
            }, this.options.toggleSpeed, 'easeInOutCirc', function() {
                $this.toggler.show();
                $this.element.addClass('pui-panel-collapsed-h');
                $this.options.collapsed = !$this.options.collapsed;
            });
        },

        _slideRight: function() {
            var $this = this,
            expandWidth = this.originalWidth||'100%';

            this.toggler.hide();

            this.element.animate({
                width: expandWidth
            }, this.options.toggleSpeed, 'easeInOutCirc', function() {
                $this.element.removeClass('pui-panel-collapsed-h');
                $this.title.show();
                $this.toggler.show();
                $this.options.collapsed = !$this.options.collapsed;

                $this.content.css({
                    'visibility': 'visible'
                    ,'display': 'block'
                    ,'height': 'auto'
                });
            });
        }
    });
});/**
 * PrimeUI Spinner widget
 */
$(function() {

    $.widget("prime-ui.puirating", {
       
        options: {
            stars: 5,
            cancel: true
        },
        
        _create: function() {
            var input = this.element;
            
            input.wrap('<div />');
            this.container = input.parent();
            this.container.addClass('pui-rating');
            
            var inputVal = input.val(),
            value = inputVal == '' ? null : parseInt(inputVal);
            
            if(this.options.cancel) {
                this.container.append('<div class="pui-rating-cancel"><a></a></div>');
            }

            for(var i = 0; i < this.options.stars; i++) {
                var styleClass = (value > i) ? "pui-rating-star pui-rating-star-on" : "pui-rating-star";

                this.container.append('<div class="' + styleClass + '"><a></a></div>');
            }
            
            this.stars = this.container.children('.pui-rating-star');

            if(input.prop('disabled')) {
                this.container.addClass('ui-state-disabled');
            }
            else if(!input.prop('readonly')){
                this._bindEvents();
            }
        },
        
        _bindEvents: function() {
            var $this = this;

            this.stars.click(function() {
                var value = $this.stars.index(this) + 1;   //index starts from zero

                $this._setValue(value);
            });

            this.container.children('.pui-rating-cancel').hover(function() {
                $(this).toggleClass('pui-rating-cancel-hover');
            })
            .click(function() {
                $this.cancel();
            });
        },
        
        cancel: function() {
            this.element.val('');
        
            this.stars.filter('.pui-rating-star-on').removeClass('pui-rating-star-on');
        },
        
        _getValue: function() {
            var inputVal = this.element.val();

            return inputVal == '' ? null : parseInt(inputVal);
        },

        _setValue: function(value) {
            this.element.val(value);

            //update visuals
            this.stars.removeClass('pui-rating-star-on');
            for(var i = 0; i < value; i++) {
                this.stars.eq(i).addClass('pui-rating-star-on');
            }
            
            this._trigger('rate', null, value);
        }
    });
    
});/**
 * PrimeUI Spinner widget
 */
$(function() {

    $.widget("prime-ui.puispinner", {
       
        options: {
            step: 1.0
        },
        
        _create: function() {
            var input = this.element,
            disabled = input.prop('disabled');
            
            input.puiinputtext().addClass('pui-spinner-input').wrap('<span class="pui-spinner ui-widget ui-corner-all" />');
            this.wrapper = input.parent();
            this.wrapper.append('<a class="pui-spinner-button pui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-n"></span></span></a><a class="pui-spinner-button pui-spinner-down ui-corner-br ui-button ui-widget ui-state-default ui-button-text-only"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-s"></span></span></a>');
            this.upButton = this.wrapper.children('a.pui-spinner-up');
            this.downButton = this.wrapper.children('a.pui-spinner-down');
            
            this._initValue();
    
            if(!disabled&&!input.prop('readonly')) {
                this._bindEvents();
            }
            
            if(disabled) {
                this.wrapper.addClass('ui-state-disabled');
            }

            //aria
            input.attr({
                'role': 'spinner'
                ,'aria-multiline': false
                ,'aria-valuenow': this.value
            });
            
            if(this.options.min != undefined) 
                input.attr('aria-valuemin', this.options.min);

            if(this.options.max != undefined) 
                input.attr('aria-valuemax', this.options.max);

            if(input.prop('disabled'))
                input.attr('aria-disabled', true);

            if(input.prop('readonly'))
                input.attr('aria-readonly', true);
        },
        

        _bindEvents: function() {
            var $this = this;
            
            //visuals for spinner buttons
            this.wrapper.children('.pui-spinner-button')
                .mouseover(function() {
                    $(this).addClass('ui-state-hover');
                }).mouseout(function() {
                    $(this).removeClass('ui-state-hover ui-state-active');

                    if($this.timer) {
                        clearInterval($this.timer);
                    }
                }).mouseup(function() {
                    clearInterval($this.timer);
                    $(this).removeClass('ui-state-active').addClass('ui-state-hover');
                }).mousedown(function(e) {
                    var element = $(this),
                    dir = element.hasClass('pui-spinner-up') ? 1 : -1;

                    element.removeClass('ui-state-hover').addClass('ui-state-active');

                    if($this.element.is(':not(:focus)')) {
                        $this.element.focus();
                    }

                    $this._repeat(null, dir);

                    //keep focused
                    e.preventDefault();
            });

            this.element.keydown(function (e) {        
                var keyCode = $.ui.keyCode;

                switch(e.which) {            
                    case keyCode.UP:
                        $this._spin($this.options.step);
                    break;

                    case keyCode.DOWN:
                        $this._spin(-1 * $this.options.step);
                    break;

                    default:
                        //do nothing
                    break;
                }
            })
            .keyup(function () { 
                $this._updateValue();
            })
            .blur(function () { 
                $this._format();
            })
            .focus(function () {
                //remove formatting
                $this.element.val($this.value);
            });

            //mousewheel
            this.element.bind('mousewheel', function(event, delta) {
                if($this.element.is(':focus')) {
                    if(delta > 0)
                        $this._spin($this.options.step);
                    else
                        $this._spin(-1 * $this.options.step);

                    return false;
                }
            });
        },

        _repeat: function(interval, dir) {
            var $this = this,
            i = interval || 500;

            clearTimeout(this.timer);
            this.timer = setTimeout(function() {
                $this._repeat(40, dir);
            }, i);

            this._spin(this.options.step * dir);
        },

        _spin: function(step) {
            var newValue = this.value + step;

            if(this.options.min != undefined && newValue < this.options.min) {
                newValue = this.cfg.min;
            }

            if(this.options.max != undefined && newValue > this.options.max) {
                newValue = this.cfg.max;
            }

            this.element.val(newValue).attr('aria-valuenow', newValue);
            this.value = newValue;

            this.element.trigger('change');
        },

        _updateValue: function() {
            var value = this.element.val();

            if(value == '') {
                if(this.options.min != undefined)
                    this.value = this.options.min;
                else
                    this.value = 0;
            }
            else {
                if(this.options.step)
                    value = parseFloat(value);
                else
                    value = parseInt(value);

                if(!isNaN(value)) {
                    this.value = value;
                }
            }
        },

        _initValue: function() {
            var value = this.element.val();

            if(value == '') {
                if(this.options.min != undefined)
                    this.value = this.options.min;
                else
                    this.value = 0;
            }
            else {
                if(this.options.prefix)
                    value = value.split(this.options.prefix)[1];

                if(this.options.suffix)
                    value = value.split(this.options.suffix)[0];

                if(this.options.step)
                    this.value = parseFloat(value);
                else
                    this.value = parseInt(value);
            }
        },

        _format: function() {
            var value = this.value;

            if(this.options.prefix)
                value = this.options.prefix + value;

            if(this.options.suffix)
                value = value + this.options.suffix;

            this.element.val(value);
        }
    });
});/**
 * PrimeUI TabView widget
 */
$(function() {

    $.widget("prime-ui.puitabview", {
       
        options: {
             activeIndex:0
            ,orientation:'top'
        },
        
        _create: function() {
            var element = this.element;
            
            element.addClass('pui-tabview ui-widget ui-widget-content ui-corner-all ui-hidden-container')
                .children('ul').addClass('pui-tabview-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all')
                .children('li').addClass('ui-state-default ui-corner-top');
                
            element.addClass('pui-tabview-' + this.options.orientation);

            element.children('div').addClass('pui-tabview-panels').children().addClass('pui-tabview-panel ui-widget-content ui-corner-bottom');

            element.find('> ul.pui-tabview-nav > li').eq(this.options.activeIndex).addClass('pui-tabview-selected ui-state-active');
            element.find('> div.pui-tabview-panels > div.pui-tabview-panel:not(:eq(' + this.options.activeIndex + '))').addClass('ui-helper-hidden');
            
            this.navContainer = element.children('.pui-tabview-nav');
            this.panelContainer = element.children('.pui-tabview-panels');

            this._bindEvents();
        },
        
        _bindEvents: function() {
            var $this = this;

            //Tab header events
            this.navContainer.children('li')
                    .on('mouseover.tabview', function(e) {
                        var element = $(this);
                        if(!element.hasClass('ui-state-disabled')&&!element.hasClass('ui-state-active')) {
                            element.addClass('ui-state-hover');
                        }
                    })
                    .on('mouseout.tabview', function(e) {
                        var element = $(this);
                        if(!element.hasClass('ui-state-disabled')&&!element.hasClass('ui-state-active')) {
                            element.removeClass('ui-state-hover');
                        }
                    })
                    .on('click.tabview', function(e) {
                        var element = $(this);

                        if($(e.target).is(':not(.ui-icon-close)')) {
                            var index = element.index();

                            if(!element.hasClass('ui-state-disabled') && index != $this.options.selected) {
                                $this.select(index);
                            }
                        }

                        e.preventDefault();
                    });

            //Closable tabs
            this.navContainer.find('li .ui-icon-close')
                .on('click.tabview', function(e) {
                    var index = $(this).parent().index();

                    $this.remove(index);

                    e.preventDefault();
                });
        },
        
        select: function(index) {
           this.options.selected = index;

           var newPanel = this.panelContainer.children().eq(index),
           headers = this.navContainer.children(),
           oldHeader = headers.filter('.ui-state-active'),
           newHeader = headers.eq(newPanel.index()),
           oldPanel = this.panelContainer.children('.pui-tabview-panel:visible'),
           $this = this;

           //aria
           oldPanel.attr('aria-hidden', true);
           oldHeader.attr('aria-expanded', false);
           newPanel.attr('aria-hidden', false);
           newHeader.attr('aria-expanded', true);

           if(this.options.effect) {
                oldPanel.hide(this.options.effect.name, null, this.options.effect.duration, function() {
                   oldHeader.removeClass('pui-tabview-selected ui-state-active');

                   newHeader.removeClass('ui-state-hover').addClass('pui-tabview-selected ui-state-active');
                   newPanel.show($this.options.name, null, $this.options.effect.duration, function() {
                       $this._trigger('change', null, index);
                   });
               });
           }
           else {
               oldHeader.removeClass('pui-tabview-selected ui-state-active');
               oldPanel.hide();

               newHeader.removeClass('ui-state-hover').addClass('pui-tabview-selected ui-state-active');
               newPanel.show();

               this._trigger('change', null, index);
           }
       },

       remove: function(index) {    
           var header = this.navContainer.children().eq(index),
           panel = this.panelContainer.children().eq(index);

           this._trigger('close', null, index);

           header.remove();
           panel.remove();

           //active next tab if active tab is removed
           if(index == this.options.selected) {
               var newIndex = this.options.selected == this.getLength() ? this.options.selected - 1: this.options.selected;
               this.select(newIndex);
           }
       },

       getLength: function() {
           return this.navContainer.children().length;
       },

       getActiveIndex: function() {
           return this.options.selected;
       },

       _markAsLoaded: function(panel) {
           panel.data('loaded', true);
       },

       _isLoaded: function(panel) {
           return panel.data('loaded') == true;
       },

       disable: function(index) {
           this.navContainer.children().eq(index).addClass('ui-state-disabled');
       },

       enable: function(index) {
           this.navContainer.children().eq(index).removeClass('ui-state-disabled');
       }

    });
});
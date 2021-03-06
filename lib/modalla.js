/*
  Modalla.js
  Copyright(c) 2012 Troy Whiteley <troy@somanyscientists.com>
  Released under the MIT license
*/

(function() {
  var Modalla;

  Modalla = function(selector) {
    if (selector === null) {
      selector = "[data-modalla-trigger]";
    }
    this.selector = selector;
    this.closeSelector = '[data-modalla-close]';
    return this.bindClicks();
  };

  Modalla.prototype.bindClicks = function() {
    var self;
    self = this;
    this.unbindClicks();
    $(this.selector).bind('click.modalla', function(event) {
      var element;
      element = $(event.target);
      if (element.data('modalla-content')) {
        event.preventDefault();
        return self.open(element.data('modalla-content'));
      }
    });
    return this;
  };

  Modalla.prototype.unbindClicks = function() {
    $(this.selector).unbind('click.modalla');
    $(this.closeSelector, '.Modalla').unbind('click.modalla');
    return this;
  };

  Modalla.prototype.open = function(target) {
    var body, content, modal, modalData, modalFrame, modalFrameCss, modalClose, overlay, self;
    self = this;
    if (typeof window.Prison === 'object') {
      window.Prison.enable();
    }
    target = $(target);
    content = target.html();
    body = $('body');
    modalData = target.data() || {};
    body.addClass('ModallaOpen');
    modal = $('<div class="Modalla" role="modal" aria-live="assertive"></div>');
    modal.data(modalData);
    if (modalData.modalName) {
      modal.attr('id', modalData.modalName);
    }
    overlay = $('<div class="ModallaOverlay"></div>');
    overlay.css({
      'top': window.scrollY
    });
    modal.append(overlay);
    modalFrame = $('<div class="ModallaFrame"></div>');
    modalFrameCss = {
      'position': 'absolute'
    };
    modalClose = $('<div class="close"></div>');
    modalFrame.css(modalFrameCss);
    if (modalData.width) {
      modalFrame.css({
        'width': modalData.width || 'auto',
        'height': modalData.height || 'auto',
        'left': '50%',
        'margin-left': (modalData.width / 2) * -1,
        'top': window.scrollY + 50
      });
    }
    modalFrame.append(content);
    modal.append(modalFrame);
    $(this.closeSelector, modal).bind('click.modalla', function(event) {
      event.preventDefault();
      return self.close();
    });
    modalFrame.before(modalClose);
    body.append(modal);
    body.trigger('modalla-open');
    return this;
  };

  Modalla.prototype.close = function() {
    var body;
    body = $('body');
    body.removeClass('ModallaOpen');
    $('.Modalla').fadeOut('fast', function() {
      $(this).remove();
      if (typeof window.Prison === 'object') {
        return window.Prison.disable();
      }
    });
    body.trigger('modalla-close');
    return this.bindClicks();
  };

  this.Modalla = Modalla;

}).call(this);

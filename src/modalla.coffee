###
  Modalla.js
  Copyright(c) 2012 Troy Whiteley <troy@somanyscientists.com>
  Released under the MIT license
###

Modalla = (selector = "[data-modalla-trigger]") ->
  this.selector = selector
  this.closeSelector = '[data-modalla-close]'
  this.bindClicks()

Modalla::bindClicks = () ->
  self = this

  # Just to be sure
  this.unbindClicks()

  $(this.selector).bind 'click.modalla', (event) ->
    element = $ event.target

    if element.data 'modalla-content'
      event.preventDefault()
      self.open element.data 'modalla-content'
  
  return this

Modalla::unbindClicks = () ->
  $(this.selector).unbind 'click.modalla'
  $(this.closeSelector, '.Modalla').unbind 'click.modalla'

  return this

Modalla::open = (target) ->
  self = this

  # Lets see if the Prison plugin is available
  if typeof window.Prison is 'object'
    window.Prison.enable()

  target = $ target
  content = target.html()
  body = $ 'body'
  modalData =  target.data()

  body.addClass 'ModallaOpen'

  modal = $ '<div class="Modalla" role="modal" aria-live="assertive"></div>'
  modal.data modalData

  if modalData.modalName
    modal.attr 'id', modalData.modalName

  overlay = $ '<div class="ModallaOverlay"></div>'

  overlay.css
    'top': window.scrollY

  modal.append overlay

  modalFrame = $ '<div class="ModallaFrame"></div>'

  modalFrameCss = 
    'position': 'absolute'

  modalFrame.css modalFrameCss

  if modalData.width
    modalFrame.css 
      'width': modalData.width
      'left': '50%'
      'margin-left': (modalData.width / 2) * -1
      'top': window.scrollY + 50

  modalFrame.append content

  modal.append modalFrame

  $(this.closeSelector, modal).bind 'click.modalla', (event) ->
    event.preventDefault()
    self.close()

  body.append modal

  body.trigger 'modalla-open'

  return this

Modalla::close = () ->
  body = $ 'body'

  body.removeClass 'ModallaOpen'

  $('.Modalla').fadeOut 'fast', () ->
    $(this).remove()

    # Lets see if the Prison plugin is available
    if typeof window.Prison is 'object'
      window.Prison.disable()

  body.trigger 'modalla-close'

  this.bindClicks()

this.Modalla = Modalla
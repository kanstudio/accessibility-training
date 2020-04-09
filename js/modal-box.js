(function modalBoxModule() {
  var SELECTOR_MODAL_OPEN = '.modal-button';
  var SELECTOR_BUTTON = 'button'
  var SELECTOR_MODAL = '.modal';
  var SELECTOR_MODAL_CONTENT = '.modal-content';
  var SELECTOR_MODAL_CLOSE = '.modal-close';
  
  var CLASS_MODAL_OPEN = 'modal-button';
  var CLASS_MODAL_CONTENT = 'modal-content';
  var CLASS_MODAL_ACTIVE = 'is-active';

  var TAG_NAME_BUTTON = 'BUTTON';

  var TIMEOUT_TO_SET_FOCUS = 100;

  function ModalBox(modalElement) {
    var openButtonSelector = SELECTOR_MODAL_OPEN + '[data-target="' + modalElement.id + '"]';

    this.openButtonElements = document.querySelectorAll(openButtonSelector);
    this.modalElement = modalElement;
    this.modalContentElement = modalElement.querySelector(SELECTOR_MODAL_CONTENT);
    this.closeButtonElement = modalElement.querySelector(SELECTOR_MODAL_CLOSE);
  }

  ModalBox.prototype.open = function open() {
    document.documentElement.style.overflowY = 'hidden';
    document.body.style.overflowY = 'scroll';

    this.modalElement.classList.add(CLASS_MODAL_ACTIVE);

    setTimeout(this.focusModal.bind(this), TIMEOUT_TO_SET_FOCUS);
  };

  ModalBox.prototype.close = function close() {
    document.documentElement.style.overflowY = '';
    document.body.style.overflowY = '';

    this.modalElement.classList.remove(CLASS_MODAL_ACTIVE);
  };

  ModalBox.prototype.focusModal = function focusModal() {
    this.modalContentElement.focus();
  };

  ModalBox.prototype.focusCloseButton = function focusCloseButton() {
    this.closeButtonElement.focus();
  };

  ModalBox.prototype.focusEntryElement = function focusEntryElement() {
    this.entryElement.focus();
  };

  ModalBox.prototype.setEntryElement = function setEntryElement(eventTarget) {
    var closestOpenElement = eventTarget.closest(SELECTOR_MODAL_OPEN);

    this.entryElement = closestOpenElement.tagName === TAG_NAME_BUTTON
      ? closestOpenElement
      : document.querySelector(
        SELECTOR_BUTTON +
        SELECTOR_MODAL_OPEN +
        '[data-target="' + this.modalElement.id + '"]'
      ) || document.body;
  };

  ModalBox.prototype.onOpenButtonClick = function onOpenButtonClick(event) {
    event.preventDefault();
    this.setEntryElement(event.target);
    this.open();
  };

  ModalBox.prototype.onOpenButtonKeydown = function onOpenButtonKeydown(event) {
    if (
      event.target &&
      event.target.classList.contains(CLASS_MODAL_OPEN) &&
      (event.keyCode === KEY_SPACE || event.keyCode === KEY_ENTER)
    ) {
      this.onOpenButtonClick(event);
    }
  };

  ModalBox.prototype.onModalKeydown = function onModalKeydown(event) {
    switch (event.keyCode) {
      case KEY_ESCAPE:
        this.onCloseButtonClick(event);
        break;
      case KEY_TAB:
        if (
          event.target &&
          event.target.classList.contains(CLASS_MODAL_CONTENT) &&
          event.shiftKey
        ) {
          event.preventDefault();
          this.focusCloseButton();
        }

        break;
      default:
        break;
    }
  };

  ModalBox.prototype.onCloseButtonClick = function onCloseButtonClick(event) {
    event.preventDefault();
    this.close();
    this.focusEntryElement();
  };

  ModalBox.prototype.onCloseButtonKeydown = function onCloseButtonKeydown(event) {
    switch (event.keyCode) {
      case KEY_ENTER:
      case KEY_SPACE:
      case KEY_ESCAPE:
        this.onCloseButtonClick(event);
        break;
      case KEY_TAB:
        if (!event.shiftKey) {
          event.preventDefault();
          this.focusModal();
        }

        break;
      default:
        event.preventDefault();
        break;
    }
  };

  ModalBox.prototype.listenOpenButtonsClick = function listenOpenButtonsClick() {
    this.openButtonElements.forEach(function listenOpenButtonClick(openButtonElement) {
      openButtonElement.addEventListener('click', this.onOpenButtonClick.bind(this));
    }, this);
  };

  ModalBox.prototype.listenOpenButtonsKeydown = function listenOpenButtonsKeydown() {
    this.openButtonElements.forEach(function listenOpenButtonKeydown(openButtonElement) {
      openButtonElement.addEventListener('keydown', this.onOpenButtonKeydown.bind(this));
    }, this);
  };

  ModalBox.prototype.listenModalKeydown = function listenModalKeydown() {
    this.modalContentElement.addEventListener('keydown', this.onModalKeydown.bind(this));
  };

  ModalBox.prototype.listenCloseButtonClick = function listenCloseButtonClick() {
    this.closeButtonElement.addEventListener('click', this.onCloseButtonClick.bind(this));
  };

  ModalBox.prototype.listenCloseButtonKeydown = function listenCloseButtonKeydown() {
    this.closeButtonElement.addEventListener('keydown', this.onCloseButtonKeydown.bind(this));
  };

  ModalBox.prototype.init = function init() {
    this.listenOpenButtonsClick();
    this.listenOpenButtonsKeydown();
    this.listenModalKeydown();
    this.listenCloseButtonClick();
    this.listenCloseButtonKeydown();
  };

  document.querySelectorAll(SELECTOR_MODAL).forEach(function initModalBox(modalElement) {
    var modalBox = new ModalBox(modalElement);
    modalBox.init();
  });
}());

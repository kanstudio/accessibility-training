(function() {
  var burger = document.querySelector(".burger");
  var menu = document.querySelector("#" + burger.dataset.target);
  burger.addEventListener("click", function() {
    burger.classList.toggle("is-active");
    menu.classList.toggle("is-active");
  });
})();

document.querySelectorAll("#nav li").forEach(function(navEl) {
  navEl.onclick = function() {
    toggleTab(this.id, this.dataset.target);
  };
});

function toggleTab(selectedNav, targetId) {
  var navEls = document.querySelectorAll("#nav li");

  navEls.forEach(function(navEl) {
    if (navEl.id == selectedNav) {
      navEl.classList.add("is-active");
    } else {
      if (navEl.classList.contains("is-active")) {
        navEl.classList.remove("is-active");
      }
    }
  });

  var tabs = document.querySelectorAll(".tab-pane");

  tabs.forEach(function(tab) {
    if (tab.id == targetId) {
      tab.style.display = "block";
    } else {
      tab.style.display = "none";
    }
  });
}

/* Skip link menu */
var SELECTOR_SKIP_LINK_HEADER = '.skip-link-header';
var SELECTOR_SKIP_LINK = '.skip-link';
var CLASS_ACTIVE = 'active';
var ATTR_HREF = 'href';
var KEY_TAB = 9;
var KEY_ENTER = 13;
var KEY_ESCAPE = 27;
var KEY_SPACE = 32;
var KEY_UP = 38;
var KEY_DOWN = 40;
var DIRECTION_NEXT = 'nextElementSibling';
var DIRECTION_PREVIOUS = 'previousElementSibling';

var skipLinkMenu = {
  initElements: function initElements() {
    this.headerElement = document.querySelector(SELECTOR_SKIP_LINK_HEADER);
    this.linkElements = document.querySelectorAll(SELECTOR_SKIP_LINK);
  },
  hideSkipLinkMenu: function hideSkipLinkMenu() {
    this.headerElement.classList.remove(CLASS_ACTIVE);
  },
  showSkipLinkMenu: function showSkipLinkMenu() {
    this.headerElement.classList.add(CLASS_ACTIVE);
  },
  focusFirstSkipLink: function focusFirstSkipLink() {
    this.linkElements[0].focus();
  },
  focusSkipLinkSibling: function focusSkipLinkSibling(skipLink, direction) {
    var skipLinkSiblingParent = skipLink.parentElement[direction];
    var skipLinkSibling = skipLinkSiblingParent && skipLinkSiblingParent.children[0];
  
    if (skipLinkSibling) {
      skipLinkSibling.focus();
    }
  },
  goToElementById: function goToElementByHashId(hashId) {
    location.hash = hashId;
  },
  initHeaderEventHandlers: function initHeaderEventHandlers() {
    this.headerElement.onfocus = this.showSkipLinkMenu.bind(this);
    this.headerElement.onblur = this.hideSkipLinkMenu.bind(this);
    this.headerElement.onclick = this.focusFirstSkipLink.bind(this);
    this.headerElement.onkeydown = function onSkipLinkHeaderKeydown(event) {
      switch (event.keyCode) {
        case KEY_SPACE:
        case KEY_ENTER:
          event.preventDefault();
          this.focusFirstSkipLink();
          break;
        case KEY_ESCAPE:
          event.preventDefault();
          this.hideSkipLinkMenu();
          break;
        case KEY_TAB:
          break;
        default:
          event.preventDefault();
          break;
      }
    }.bind(this);
  },
  initSkipLinksEventHandlers: function initSkipLinksEventHandlers() {
    this.linkElements.forEach(function setSkipLink(skipLink) {
      skipLink.onblur = this.hideSkipLinkMenu.bind(this);
      skipLink.onfocus = this.showSkipLinkMenu.bind(this);
      skipLink.onkeydown = function onSkipLinkKeydown(event) {
        switch (event.keyCode) {
          case KEY_SPACE:
            event.preventDefault();
            this.goToElementById(skipLink.getAttribute(ATTR_HREF));
            break;
          case KEY_ESCAPE:
            event.preventDefault();
            this.hideSkipLinkMenu();
            break;
          case KEY_DOWN:
            event.preventDefault();
            this.focusSkipLinkSibling(skipLink, DIRECTION_NEXT);
            break;
          case KEY_UP:
            event.preventDefault();
            this.focusSkipLinkSibling(skipLink, DIRECTION_PREVIOUS);
            break;
          case KEY_TAB:
          case KEY_ENTER:
            break;
          default:
            event.preventDefault();
            break;
        }
      }.bind(this);
    }, this);
  },
  init: function init() {
    this.initElements();
    this.initHeaderEventHandlers();
    this.initSkipLinksEventHandlers();
  }
};

skipLinkMenu.init();

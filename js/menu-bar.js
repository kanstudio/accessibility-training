(function menuBarModule() {
  var SELECTOR_MENU_ITEM = '.navbar-item > .navbar-link';
  var SELECTOR_MENU_SUBITEM = '.navbar-subitem';
  var CLASS_NAVBAR_SUBITEM = 'navbar-subitem';
  var CLASS_ACTIVE = 'active';
  var ATTR_ARIA_EXPANDED = 'aria-expanded';
  var ATTR_TABINDEX = 'tabindex';

  function MenuBar(menuItemSelector, menuSubitemSelector) {
    var menuItemsElements = document.querySelectorAll(menuItemSelector);

    this.items = this.createItems(menuItemsElements).map(function addSubitems(item) {
      var submenuElement = item.itemElement.nextElementSibling;
      var submenuItemsElements = submenuElement
        ? submenuElement.querySelectorAll(menuSubitemSelector)
        : [];
      var subitems = this.createItems(submenuItemsElements);

      return Object.assign({ subitems: subitems }, item);
    }, this);

    this.unsubscribers = [];
  }

  MenuBar.prototype.init = function init() {
    this.listenDocumentClick();
    this.listenItemsClick();
    this.listenItemKeydown();
    this.listenItemsSubitemsKeydown();
  };

  MenuBar.prototype.createItems = function createItems(itemsElements) {
    return Array.prototype.map.call(itemsElements, function createItem(itemElement, index) {
      return {
        itemElement: itemElement,
        index: index,
        isFirst: index === 0,
        isLast: index === itemsElements.length - 1
      };
    });
  };

  MenuBar.prototype.deactivateAllItems = function deactivateAllItems() {
    this.items.forEach(function deactivateItem(item) {
      var hasSubmenu = Boolean(item.subitems.length);

      if (hasSubmenu) {
        item.itemElement.setAttribute(ATTR_ARIA_EXPANDED, 'false');
        item.itemElement.classList.remove(CLASS_ACTIVE);
      }
    });
  };

  MenuBar.prototype.activateItem = function activateItem(item) {
    item.itemElement.setAttribute(ATTR_ARIA_EXPANDED, 'true');
    item.itemElement.classList.add(CLASS_ACTIVE);

    this.focusFirstSubitem(item);
  };

  MenuBar.prototype.goToItem = function goToItem(item) {
    this.items.forEach(function deactivateItem(item) {
      item.itemElement.setAttribute(ATTR_TABINDEX, '-1');
    });

    item.itemElement.setAttribute(ATTR_TABINDEX, '0');
    item.itemElement.focus();
  };

  MenuBar.prototype.goToFirstItem = function goToFirstItem() {
    this.goToItem(this.items[0]);
  };

  MenuBar.prototype.goToLastItem = function goToLastItem() {
    this.goToItem(this.items[this.items.length - 1]);
  };

  MenuBar.prototype.goToNextItem = function goToNextItem(currentItem) {
    if (currentItem.isLast) {
      this.goToFirstItem();
    } else {
      this.goToItem(this.items[currentItem.index + 1]);
    }
  };

  MenuBar.prototype.goToPreviousItem = function goToPreviousItem(currentItem) {
    if (currentItem.isFirst) {
      this.goToLastItem();
    } else {
      this.goToItem(this.items[currentItem.index - 1]);
    }
  };

  MenuBar.prototype.focusFirstSubitem = function focusFirstSubitem(item) {
    var firstSubitem = item.subitems[0];
    firstSubitem.itemElement.focus();
  };

  MenuBar.prototype.focusLastSubitem = function focusLastSubitem(item) {
    var lastSubitem = item.subitems[item.subitems.length - 1];
    lastSubitem.itemElement.focus();
  };

  MenuBar.prototype.focusNextSubitem = function focusNextSubitem(item, currentSubitem) {
    if (currentSubitem.isLast) {
      this.focusFirstSubitem(item);
    } else {
      var nextSubitem = item.subitems[currentSubitem.index + 1];
      nextSubitem.itemElement.focus();
    }
  };

  MenuBar.prototype.focusPreviousSubitem = function focusPreviousSubitem(item, currentSubitem) {
    if (currentSubitem.isFirst) {
      this.focusLastSubitem(item);
    } else {
      var previousSubitem = item.subitems[currentSubitem.index - 1];
      previousSubitem.itemElement.focus();
    }
  };

  MenuBar.prototype.followElementLink = function followElementLink(linkElement) {
    location.href = linkElement.href;
  };

  MenuBar.prototype.onItemClick = function onItemClick(item, event) {
    var isItemActive = item.itemElement.classList.contains(CLASS_ACTIVE);
    var hasSubmenu = Boolean(item.subitems.length);

    event.preventDefault();
    event.stopPropagation();

    this.deactivateAllItems();

    if (hasSubmenu) {
      if (!isItemActive) {
        this.activateItem(item);
      }
    } else {
      this.followElementLink(item.itemElement);
    }
  };

  MenuBar.prototype.onItemKeydown = function onItemKeydown(item, event) {
    switch (event.keyCode) {
      case KEY_LEFT:
        event.preventDefault();
        this.goToPreviousItem(item);
        break;
      case KEY_RIGHT:
        event.preventDefault();
        this.goToNextItem(item);
        break;
      case KEY_SPACE:
      case KEY_ENTER:
        event.preventDefault();
        this.onItemClick(item, event);
        break;
      case KEY_HOME:
        event.preventDefault();
        this.goToFirstItem();
        break;
      case KEY_END:
        event.preventDefault();
        this.goToLastItem();
        break;
      default:
        break;
    }
  };

  MenuBar.prototype.onSubitemKeydown = function onSubitemKeydown(item, subitem, event) {
    switch (event.keyCode) {
      case KEY_UP:
        event.preventDefault();
        this.focusPreviousSubitem(item, subitem);
        break;
      case KEY_DOWN:
        event.preventDefault();
        this.focusNextSubitem(item, subitem);
        break;
      case KEY_SPACE:
      case KEY_ENTER:
        event.preventDefault();
        this.deactivateAllItems();
        this.followElementLink(subitem.itemElement);
        break;
      case KEY_HOME:
        event.preventDefault();
        this.focusFirstSubitem(item);
        break;
      case KEY_END:
        event.preventDefault();
        this.focusLastSubitem(item);
        break;
      case KEY_ESCAPE:
        event.preventDefault();
        item.itemElement.focus();
      case KEY_TAB:
        this.deactivateAllItems();
        break;
      default:
        break;
    }
  };

  MenuBar.prototype.listenDocumentClick = function listenDocumentClick() {
    document.addEventListener('click', function onDocumentClick(event) {
      var isClickOnSubitem = event.target.classList.contains(CLASS_NAVBAR_SUBITEM);

      this.deactivateAllItems();

      if (isClickOnSubitem) {
        event.preventDefault();
        this.followElementLink(event.target);
      }
    }.bind(this));
  };

  MenuBar.prototype.listenItemsClick = function listenItemsClick() {
    this.items.forEach(function listenItemClick(item) {
      item.itemElement.addEventListener('click', this.onItemClick.bind(this, item));
    }, this);
  };

  MenuBar.prototype.listenItemKeydown = function listenItemKeydown() {
    this.items.forEach(function listenItemKeydown(item) {
      item.itemElement.addEventListener('keydown', this.onItemKeydown.bind(this, item));
    }, this);
  };

  MenuBar.prototype.listenItemsSubitemsKeydown = function listenItemsSubitemsKeydown() {
    this.items.forEach(function listenItemSubitemsKeydown(item) {
      item.subitems.forEach(function listenItemSubitemKeydown(subitem) {
        subitem.itemElement
          .addEventListener('keydown', this.onSubitemKeydown.bind(this, item, subitem));
      }, this);
    }, this);
  };

  var menuBar = new MenuBar(SELECTOR_MENU_ITEM, SELECTOR_MENU_SUBITEM);
  menuBar.init();
}());

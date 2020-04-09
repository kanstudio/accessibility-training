(function tabsSwitcherModule() {
  var SELECTOR_TAB = '.tab';
  var ATTR_TABINDEX = 'tabindex';
  var ATTR_ARIA_SELECTED = 'aria-selected';
  var ATTR_ARIA_CONTROLS = 'aria-controls';
  var CLASS_IS_ACTIVE = 'is-active';

  var tabsSwitcher = {
    initTabs: function initTabs() {
      var tabsElements = document.querySelectorAll(SELECTOR_TAB);

      this.tabs = Array.prototype.map.call(tabsElements, function createTab(tabElement, index) {
        var panelId = tabElement.getAttribute(ATTR_ARIA_CONTROLS);

        return {
          tabElement: tabElement,
          tabWrapperElement: tabElement.parentElement,
          panelElement: document.getElementById(panelId),
          index: index,
          isFirst: index === 0,
          isLast: index === tabsElements.length - 1
        };
      });
    },
    deactivateAllTabs: function deactivateAllTabs() {
      this.tabs.forEach(function deactivateTab(tab) {
        tab.tabElement.setAttribute(ATTR_TABINDEX, '-1');
        tab.tabElement.setAttribute(ATTR_ARIA_SELECTED, 'false');
        tab.tabWrapperElement.classList.remove(CLASS_IS_ACTIVE);
        tab.panelElement.classList.remove(CLASS_IS_ACTIVE);
      });
    },
    activateTab: function activateTab(tab) {
      this.deactivateAllTabs();

      tab.tabElement.setAttribute(ATTR_TABINDEX, '0');
      tab.tabElement.setAttribute(ATTR_ARIA_SELECTED, 'true');
      tab.tabWrapperElement.classList.add(CLASS_IS_ACTIVE);
      tab.panelElement.classList.add(CLASS_IS_ACTIVE);
    },
    focusFirstTab: function focusFirstTab() {
      var firstTab = this.tabs[0];
      firstTab.tabElement.focus();
    },
    focusLastTab: function focusLastTab() {
      var lastTab = this.tabs[this.tabs.length - 1];
      lastTab.tabElement.focus();
    },
    focusNextTab: function focusNextTab(currentTab) {
      if (currentTab.isLast) {
        this.focusFirstTab();
      } else {
        var nextTab = this.tabs[currentTab.index + 1];
        nextTab.tabElement.focus();
      }
    },
    focusPreviousTab: function focusPreviousTab(currentTab) {
      if (currentTab.isFirst) {
        this.focusLastTab();
      } else {
        var previousTab = this.tabs[currentTab.index - 1];
        previousTab.tabElement.focus();
      }
    },
    onTabClick: function onTabClick(tab, event) {
      event.preventDefault();
      this.activateTab(tab);
    },
    onTabKeydown: function onTabKeydown(tab, event) {
      switch (event.keyCode) {
        case KEY_LEFT:
          event.preventDefault();
          this.focusPreviousTab(tab);
          break;
        case KEY_RIGHT:
          event.preventDefault();
          this.focusNextTab(tab);
          break;
        case KEY_SPACE:
        case KEY_ENTER:
          event.preventDefault();
          this.activateTab(tab);
          break;
        case KEY_HOME:
          event.preventDefault();
          this.focusFirstTab();
          break;
        case KEY_END:
          event.preventDefault();
          this.focusLastTab();
          break;
        default:
          break;
      }
    },
    listenTabsClick: function listenTabsClick() {
      this.tabs.forEach(function listenTabClick(tab) {
        tab.tabElement.addEventListener('click', this.onTabClick.bind(this, tab));
      }, this);
    },
    listenTabsKeydown: function listenTabsKeydown() {
      this.tabs.forEach(function listenTabKeydown(tab) {
        tab.tabElement.addEventListener('keydown', this.onTabKeydown.bind(this, tab));
      }, this);
    },
    init: function init() {
      this.initTabs();
      this.listenTabsClick();
      this.listenTabsKeydown();
    }
  };

  tabsSwitcher.init();
}());

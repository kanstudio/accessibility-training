(function() {
  var burger = document.querySelector(".burger");
  var menu = document.querySelector("#" + burger.dataset.target);
  burger.addEventListener("click", function() {
    burger.classList.toggle("is-active");
    menu.classList.toggle("is-active");
  });

  /* aria notifier */
  var PERIOD_FOR_NOTIFICATIONS = 60000;
  var SELECTOR_NOTIFIER = '.aria-notifier';

  var ariaNotifier = {
    initElements: function initElements() {
      this.notifierElement = document.querySelector(SELECTOR_NOTIFIER);
    },
    initCounter: function initCounter() {
      this.counter = 0;
    },
    increaseCounter: function increaseCounter() {
      this.counter = this.counter + 1;
    },
    setNotification: function setNotification(notification) {
      this.notifierElement.textContent = notification;
    },
    setNotifier: function () {
      if (this.notifierElement) {
        setInterval(function notify() {
          this.increaseCounter();
          this.setNotification('Page was updated ' + this.counter + ' times');
        }.bind(this), PERIOD_FOR_NOTIFICATIONS);
      }
    },
    init: function init() {
      this.initElements();
      this.initCounter();
      this.setNotifier();
    }
  };

  ariaNotifier.init();
})();

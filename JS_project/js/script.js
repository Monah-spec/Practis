window.addEventListener('DOMContentLoaded', () => {
// Tabs

  const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

  const hideTabContent = () => {
    tabsContent.forEach(tab => {
      tab.classList.add('hide');
      tab.classList.remove('show');
    });

    tabs.forEach(tab => tab.classList.remove('tabheader__item_active'));
  };

  const showTabContent = (index = 0) => {
    tabsContent[index].classList.add('show', 'fade');
    tabsContent[index].classList.remove('hide');
    tabs[index].classList.add('tabheader__item_active');
  };

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener('click', event => {
    const target = event.target;
    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((tab, index) => {
        if (target == tab) {
          hideTabContent();
          showTabContent(index);
        }
      });
    }
  });

// Timer

  const deadLine = '2022-03-10';

  const getTimeRemaining = endtime => {
    const time = Date.parse(endtime) - Date.parse(new Date()),
          daysMs = Math.floor(time / (1000 * 60 * 60 * 24)),
          hoursMs = Math.floor((time / (1000 * 60 * 60) % 24)),
          minutesMs = Math.floor((time / 1000 / 60) % 60),
          secondsMs = Math.floor((time / 1000) % 60);
    return {
      'total': time,
      'days': daysMs,
      'hours': hoursMs,
      'minutes': minutesMs,
      'seconds': secondsMs,
    };
  };

  function getZero (num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  const setClock = (selector, endtime) => {
    const timer = document.querySelector(selector),
          days = timer.querySelector('#days'),
          hours = timer.querySelector('#hours'),
          minutes = timer.querySelector('#minutes'),
          seconds = timer.querySelector('#seconds'),
          timeInterval = setInterval(updateClock, 1000);

    updateClock();      

    function updateClock () {
      const time = getTimeRemaining(endtime);

      days.innerHTML = getZero(time.days);
      hours.innerHTML = getZero(time.hours);
      minutes.innerHTML = getZero(time.minutes);
      seconds.innerHTML = getZero(time.seconds);

      if (time.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  };

  setClock('.timer', deadLine);
});
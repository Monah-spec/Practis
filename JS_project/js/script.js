window.addEventListener("DOMContentLoaded", () => {
   let tabs = document.querySelectorAll('.tabheader__item'),
       tabsContent = document.querySelectorAll('.tabcontent'),
       tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent () {
      tabsContent.forEach(tab => {
        tab.classList.add('hide');
        tab.classList.remove('show');
      });

      tabs.forEach(tab => tab.classList.remove('tabheader__item_active')) ;
    }

    function showTabContent (index = 0) {
      tabsContent[index].classList.add('show', 'fade');
      tabsContent[index].classList.remove('hide');
      tabs[index].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
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
});
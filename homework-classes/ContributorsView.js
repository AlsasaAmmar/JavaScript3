'use strict';

{
  const { createAndAppend } = window.Util;

  class ContributorsView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.contributors);
      }
    }

    /**
     * Renders the list of contributors
     * @param {Object[]} contributors An array of contributor objects
     */
    render(contributors) {
      // TODO: replace this comment and the console.log with your own code
      console.log('ContributorsView', contributors);

      const contributorContainer = document.querySelector(
        '.contributors-container',
      );
      let child = contributorContainer.lastElementChild;
      while (child) {
        contributorContainer.removeChild(child);
        child = contributorContainer.lastElementChild;
      }

      contributors.forEach(contributor => {
        const contributorBox = createAndAppend('div', contributorContainer, {
          class: 'contributorClass',
        });
        const photo = createAndAppend('img', contributorBox, {
          src: contributor.avatar_url,
          class: 'images',
        });
        const contributorName = createAndAppend('a', contributorBox, {
          text: contributor.login,
          href: contributor.html_url,
          target: '_blank',
          class: 'name',
        });

        const contributionsNum = createAndAppend('p', contributorBox, {
          text: contributor.contributions,
          class: 'contributionsNum',
        });
      });
    }
  }

  window.ContributorsView = ContributorsView;
}

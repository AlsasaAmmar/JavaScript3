'use strict';

{
  const { createAndAppend } = window.Util;

  class RepoView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.selectedRepo);
      }
    }

    /**
     * Renders the repository details.
     * @param {Object} repo A repository object.
     */

    render(repo) {
      const leftCells = document.querySelectorAll('.leftCells');
      leftCells.forEach((key, i) => {
        switch (i) {
          case 0:
            key.innerHTML = `<a href='${repo.html_url}'target="_blank">${repo.name}</a>`;
            break;
          case 1:
            key.innerText =
              repo.description === null ? 'Not available' : repo.description;
            break;
          case 2:
            key.innerText = repo.forks;
            break;
          case 3:
            key.innerText = repo.updated_at
              .replace('T', ', ')
              .replace('Z', ' ')
              .replace(/-/g, '/');
            break;
        }
      });
      let cells = document.getElementsByTagName('td');
      for (let i = 0; i < cells.length; i++) {
        const element = cells[i];
        if (i % 2) {
          element.classList.add('.list');
        } else {
          element.classList.add('key-column');
        }
      }
      console.log('RepoView', repo);
    }
  }

  window.RepoView = RepoView;
}

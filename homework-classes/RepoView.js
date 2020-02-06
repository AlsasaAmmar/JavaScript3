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
      // TODO: replace this comment and the console.log with your own code
      console.log('RepoView', repo);

      const repoContainer = document.querySelector('.repo-container');
      const table = createAndAppend('table', repoContainer);
      const cellsArr = [];
      const rows = ['Update', 'Forks', 'Description', 'Name'];
      rows.forEach((key, i) => {
        const row = table.insertRow(0);
        const rightCell = row.insertCell(0);
        rightCell.innerText = `${key}:`;
        let leftCells = row.insertCell(1);
        cellsArr.push(leftCells);
      });
    }
  }

  window.RepoView = RepoView;
}

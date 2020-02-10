'use strict';

{
  /********************
   * 
   *  Configuration  
   * 
   /////////////////////*/
  const header = document.querySelector('.header');
  const mainSection = document.querySelector('.main-container');
  const repoContainer = document.querySelector('.repo-container');
  const contributorContainer = document.querySelector(
    '.contributors-container',
  );
  const contributorsBox = createAndAppend('div', contributorContainer, {
    class: 'contributor-container',
  });
  const token = '6b0cc169d9c5b1913612f309b8af66d80d5b55ac';
  const contributorsWrapper = document.querySelector('.contributors-box');
  const select = createAndAppend('select', header, { class: 'selectEl' });
  const table = createAndAppend('table', repoContainer);
  const rows = ['Update', 'Forks', 'Description', 'Name'];
  const cellsArr = createLeftCells(rows);
  /********************
   * 
   *  Creates left cells and returns them in an array
   @pram arr of the cells needed
   * 
   /////////////////////*/

  function createLeftCells(arr) {
    const cellsArr = [];
    arr.forEach((key, i) => {
      const row = table.insertRow(0);
      const rightCell = row.insertCell(0);
      rightCell.innerText = `${key}:`;
      let leftCells = row.insertCell(1);
      cellsArr.push(leftCells);
    });
    return cellsArr;
  }
  /********************
   * 
   *  Function gets the api 
   *    
   * 
   /////////////////////*/
  async function getData(url, cb) {
    try {
      const response = await axios.get(url);
      const data = response.data;
      return data;
    } catch (error) {
      cb(error);
    }
  }
  /********************
   * 
   *  Function gets the api with headers
   /////////////////////*/
  async function getDataWithHeaders(url, cb, token) {
    try {
      const response = await axios({
        method: 'get',
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      return data;
    } catch (error) {
      cb(error);
    }
  }
  /********************
   * this function creates and appends a element (
   * name ='the element you want' , parent = where, options = styles and so on)
   *  
   * 
   /////////////////////*/
  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }
  /********************
   * func formats the time given in de API
   *  
   * 
   /////////////////////*/

  function formateTime(time) {
    let hours = time.slice(11, 13);
    let AmOrPm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    let minutes = time.slice(14, 16);
    let finalTime = hours + ':' + minutes + ' ' + AmOrPm;
    return finalTime;
  }
  /********************
   * if the data is not there this will return 'not available'
   *  
   * 
   /////////////////////*/
  function checkIfDataAvailable(data) {
    if (data === null) {
      return 'Not available';
    } else {
      return data;
    }
  }
  /********************
   * updates the person's info
   *  
   * 
   /////////////////////*/
  function updateContributor(parent, person) {
    const contributorBox = createAndAppend('div', parent, {
      class: 'contributorClass',
    });
    const photo = createAndAppend('img', contributorBox, {
      src: person.avatar_url,
      class: 'images',
    });
    const contributorName = createAndAppend('a', contributorBox, {
      text: person.login,
      href: person.html_url,
      target: '_blank',
      class: 'name',
    });

    const contributionsNum = createAndAppend('p', contributorBox, {
      text: person.contributions,
      class: 'contributionsNum',
    });
  }
  /********************
   * deletes elements children
   *  
   * 
   /////////////////////*/
  function deleteChildren(element) {
    let child = element.lastElementChild;
    while (child) {
      contributorsWrapper.removeChild(child);
      child = contributorsWrapper.lastElementChild;
    }
  }
  /********************
   * error handler     
   * 
   /////////////////////*/
  function errorHandler(response) {
    if (response.status !== 200) {
      const errorDiv = createAndAppend('div', mainSection, {
        class: 'alert-error',
      });
      createAndAppend('img', errorDiv, {
        class: 'photo',
        src: 'https://media3.giphy.com/media/Y4wgyGATg0rRYCZGOs/source.gif',
      });
      return;
    }
  }
  /********************
   * updates table content   
   * 
   /////////////////////*/
  function updateTable(repo) {
    cellsArr.forEach((key, i) => {
      switch (i) {
        case 3:
          key.innerHTML = `<a href='${repo.html_url}'target="_blank">${repo.name}</a>`;
          break;
        case 2:
          key.innerText = checkIfDataAvailable(repo.description);
          break;
        case 1:
          key.innerText = repo.forks;
          break;
        case 0:
          key.innerText =
            repo.updated_at
              .replace('T', ', ')
              .replace('Z', ' ')
              .replace(/-/g, '/')
              .slice(0, 11) +
            ' ' +
            formateTime(repo.updated_at);
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
  }
  function main(url) {
    getData(url, errorHandler).then(function(repos) {
      repos
        .sort((a, b) => {
          return a.name.localeCompare(b.name);
        })
        .forEach((repo, i) => {
          const option = createAndAppend('option', select, {
            value: i,
            text: repo.name,
          });
        });

      updateTable(repos[0]);
      let firstRepoContributors = `https://api.github.com/repos/HackYourFuture/${repos[0].name}/contributors `;

      getDataWithHeaders(firstRepoContributors, errorHandler, token).then(
        response1 => {
          response1.forEach(person => {
            updateContributor(contributorsWrapper, person);
          });
        },
      );

      select.addEventListener('change', () => {
        deleteChildren(contributorsWrapper);
        let index = select.value;
        let selectedRepo = repos[index];
        updateTable(selectedRepo);

        let contributors = `https://api.github.com/repos/HackYourFuture/${selectedRepo.name}/contributors `;
        getDataWithHeaders(contributors, errorHandler, token).then(response => {
          response.forEach(function(contributor, i) {
            updateContributor(contributorsWrapper, contributor);
          });
        });
      });
    });
  }

  //I need to add text to each of these ietms. and then get the info after them
  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=10';
  window.onload = () => main(HYF_REPOS_URL);
}

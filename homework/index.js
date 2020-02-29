'use strict';

{
  const header = document.querySelector('.header');
  const mainSection = document.querySelector('.main-container');
  const repoContainer = document.querySelector('.repo-container');
  const contributorContainer = document.querySelector(
    '.contributors-container',
  );
  const token = '98d1c9573a5d89af3d54be22e0908f60eeca4027';
  const contributorsBox = createAndAppend('div', contributorContainer, {
    class: 'contributor-container',
  });
  const contributorsWrapper = document.querySelector('.contributors-box');
  const select = createAndAppend('select', header, { class: 'selectEl' });

  //this function fetches Json and uses a call back function on the link passed as a para
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }
  //this function creates and appends a element (name ='the element you want' , parent = where, options = styles and so one)
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

  function formateTime(time) {
    let hours = time.slice(11, 13);
    let AmOrPm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    let minutes = time.slice(14, 16);
    let finalTime = hours + ':' + minutes + ' ' + AmOrPm;
    return finalTime;
  }
  // if the data is not there this will return 'not availabe'
  function checkIfDataAvailable(data) {
    if (data === null) {
      return 'Not available';
    } else {
      return data;
    }
  }
  //updates the persons info
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

  //deletes elemeents childeren
  function deleteChilderen(element) {
    while (element.lastElementChild) {
      element.removeChild(element.lastElementChild);
    }
  }
  //handles errors
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

  function main(url) {
    const table = createAndAppend('table', repoContainer);
    // const tableKeys = [update, forks, description, name].forEach(tableKey => {
    //   table.insertRow(0);
    // });
    const update = table.insertRow(0);
    const forks = table.insertRow(0);
    const description = table.insertRow(0);
    const name = table.insertRow(0);

    const cellName = name.insertCell(0);
    cellName.innerText = 'Repository :';

    const cellDescription = description.insertCell(0);
    cellDescription.innerText = 'Description :';

    const cellforks = forks.insertCell(0);
    cellforks.innerText = 'Forks :';

    const cellUpdate = update.insertCell(0);
    cellUpdate.innerText = 'Last Updated :';
    const infoName = name.insertCell(1);
    const infoDescription = description.insertCell(1);
    const infoForks = forks.insertCell(1);
    const infoUpdate = update.insertCell(1);

    const cells = document.getElementsByTagName('td');
    for (let i = 0; i < cells.length; i++) {
      const element = cells[i];
      if (i % 2) {
        element.classList.add('.list');
      } else {
        element.classList.add('key-column');
      }
    }
    //updates the tables info
    function updateTable(repo) {
      infoName.innerHTML = `<a href='${repo.html_url}'target="_blank">${repo.name}</a>`;
      infoDescription.innerText = checkIfDataAvailable(repo.description);
      infoForks.innerText = repo.forks;
      infoUpdate.innerText = new Date(repo.updated_at).toLocaleString('nl-NL');
    }

    fetch(url)
      .then(function(response) {
        errorHandler(response);
        response.json().then(function(repos) {
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
          fetch(firstRepoContributors, {
            method: 'GET',
            headers: new Headers({
              Authorization: `Bearer${token}`,
            }),
          }).then(function(response1) {
            errorHandler(response1);
            response1.json().then(response1 => {
              response1.forEach(person => {
                updateContributor(contributorsWrapper, person);
              });
            });
          });

          select.addEventListener('change', () => {
            deleteChilderen(contributorsWrapper);
            let index = select.value;
            let selectedRepo = repos[index];
            updateTable(selectedRepo);

            let contributors = `https://api.github.com/repos/HackYourFuture/${selectedRepo.name}/contributors `;
            fetch(contributors, {
              method: 'GET',
              headers: new Headers({
                Authorization: `Bearer${token}`,
              }),
            }).then(function(response) {
              errorHandler(response);
              response.json().then(response => {
                response.forEach(function(contributor, i) {
                  updateContributor(contributorsWrapper, contributor);
                });
              });
            });
          });
        });
      })
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
  }

  //I need to add text to each of these ietms. and then get the info after them
  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=10';
  window.onload = () => main(HYF_REPOS_URL);
}

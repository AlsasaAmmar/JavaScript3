'use strict';

{
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
  //this function takes the repo and the ul and creates il elements, adds them to given ul and adds a text with their names
  function renderRepoDetails(repo, ul) {
    createAndAppend('li', ul, {
      text: repo.name,
      class: 'list',
    });
  }
  const h1 = createAndAppend('h1', root, {
    text: 'HYF Repositories',
  });
  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      if (err) {
        const errorDiv = createAndAppend('div', root, {
          class: 'alert-error',
        });
        createAndAppend('img', errorDiv, {
          class: 'photo',
          src: 'https://media3.giphy.com/media/Y4wgyGATg0rRYCZGOs/source.gif',
        });
        return;
      }
      repos
        .sort((a, b) => {
          return a.name.localeCompare(b.name);
        })
        .slice(0, 10)
        .forEach(repo => {
          const div = createAndAppend('div', root, { class: 'repo-container' });

          const table = createAndAppend('table', div, { class: 'key-list' });
          const update = table.insertRow(0);
          const forks = table.insertRow(0);
          const description = table.insertRow(0);
          const name = table.insertRow(0);

          let cellName = name.insertCell(0);
          cellName.innerText = 'Repository :';

          let cellDescription = description.insertCell(0);
          cellDescription.innerText = 'Description :';

          let cellforks = forks.insertCell(0);
          cellforks.innerText = 'Forks :';

          let cellUpdate = update.insertCell(0);
          cellUpdate.innerText = 'Last Updated :';

          cellName.classList.add('key-column');
          cellDescription.classList.add('key-column');
          cellforks.classList.add('key-column');
          cellUpdate.classList.add('key-column');

          let infoName = name.insertCell(1);
          infoName.innerText = repo.name;

          let infoDescription = description.insertCell(1);
          infoDescription.innerText = repo.description;

          let infoForks = forks.insertCell(1);
          infoForks.innerText = repo.forks;

          let infoUpdate = update.insertCell(1);
          infoUpdate.innerText =
            repo.updated_at
              .replace('T', ', ')
              .replace('Z', ' ')
              .replace(/-/g, '/')
              .slice(0, 11) +
            ' ' +
            formateTime(repo.updated_at);

          function formateTime(time) {
            let hours = time.slice(11, 13);
            let AmOrPm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12 || 12;
            let minutes = time.slice(14, 16);
            let finalTime = hours + ':' + minutes + ' ' + AmOrPm;
            return finalTime;
          }

          function appendProperty(repo, listProperty) {
            for (let property in repo) {
              if (property === listProperty) {
                let el = createAndAppend('li', ulEl);
                if (repo[listProperty] != null) {
                  el.innerText = repo[listProperty];
                } else {
                  el.innerText = 'data not available';
                }
              }
            }
          }
        });
    });
  }

  //I need to add text to each of these ietms. and then get the info after them
  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}

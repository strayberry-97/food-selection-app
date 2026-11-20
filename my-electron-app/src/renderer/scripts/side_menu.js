const container = document.getElementById('sidebar');
const newHTML = `<img src="../assets/svg/Menu.svg" id="menu-svg">
        <div class="menu">
          <button id="homeButton">home</button>
          <button id="historyButton">history</button>
          <button id="preferencesButton">preferences</button>
        </div>
        <div id="main-screen-menu-line"></div>
        <div class="menu" id="menuSecondPart">
            <button id="importButton">import restaurant</button>
            <button id="databaseButton">access database</button>
        </div>`;

container.insertAdjacentHTML('beforeend', newHTML);
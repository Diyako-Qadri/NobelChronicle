$(() => {
  const apiNobel_URL = 'https://api.nobelprize.org/2.0/nobelPrize/all/';

  const inputSection = () => {
    $('.search').append(
      `  
            <div class="search">
              <label for="date-search"></label>
              <input id="date-search" type="number" placeholder="ex.1999" min="1901" max="2023">
              <button class="date-search">Search</button>
            </div>
        `
    );
  };
  inputSection();

  const displayMessage = () => {
    $('.main-content')
      .append(
        `<div class="display-message">The Nobel Prize is a prestigious international award presented annually in recognition of outstanding achievements in the fields of Physics, Chemistry, Medicine, Literature, Peace, and Economic Sciences. Established by the will of Alfred Nobel, the prizes are awarded to individuals and organizations that have made significant contributions to humanity. The Nobel Prizes were first awarded in 1901, and since then, they have celebrated individuals and endeavors that have made remarkable advancements or promoted positive change in their respective fields, fostering progress, knowledge, and peace on a global scale.</div>`
      )
      .hide()
      .fadeIn(800);
  };

  displayMessage();

  $('.nobelLogo').on('click', () => {
    $('.main-content').empty();
    $('.search').empty();
    displayMessage();
    inputSection();
    getData();
  });

  const getData = async url => {
    try {
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error('Somthing went wrong' + response.status);
      }
      let data = await response.json();
      console.log(data);

      data.forEach(nobel => {
        let name;
        let awarded;
        let nameElement = '';
        if (nobel.laureates) {
          name = nobel.laureates[0].knownName !== undefined
               ? nobel.laureates[0].knownName.en
               : nobel.laureates[0].orgName.en;
          awarded = nobel.laureates[0].motivation.en;
          nameElement = `<p> Name: ${name} </p>`;
        } else {
          awarded = nobel.topMotivation.en;
        }

        console.log(name, awarded);
        $('.main-content').append(
          `
            <div class="article">
                <h2 class="name">${nobel.categoryFullName.en}</h2>
                ${nameElement}
                <p> Year: ${nobel.awardYear}</p>
                <p> Motivation: ${awarded}</p> 
            </div>
         `
        );
      });
    } catch (error) {
      console.log('Error fetching data:' + error);
    }
  };

  $('body').on('click', '.date-search', () => {
    let awardYear = $('#date-search').val();
    if (awardYear >= 1901 && awardYear <= 2023) {
      $('.main-content').empty();
      getData(apiNobel_URL + awardYear);
    } else {
      alert('Please enter a year between 1901 and 2023.');
    }
  });
});

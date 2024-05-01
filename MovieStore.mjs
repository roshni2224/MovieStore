import inquirer from 'inquirer';
let favoriteMovies = [];
async function mainMenu() {
  const choice = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'Register',
        'Search Movies',
        'Search Movie Details',
        'Manage Favorites',
        'Exit',
      ],
    },
  ]);

  switch (choice.action) {
    case 'Register':
      await registerUser();
      break;
    case 'Search Movies':
      await searchMovies();
      break;
    case 'Search Movie Details':
      if (filteredMovies) {
        await searchMovieDetails(filteredMovies); 
      } else {
          console.log('Please search for movies first.');
      }
        break;
    case 'Manage Favorites':
      await manageFavorites();
      break;
    case 'Exit':
      console.log('Exiting application.');
      process.exit(0);
  }

  mainMenu(); 
}

mainMenu(); 

async function registerUser() {
  const newUser = await inquirer.prompt([
    { name: 'name', type: 'input', message: 'Enter your name:' },
    { name: 'email', type: 'input', message: 'Enter your email:' },
    
  ]);
  
  console.log(`Welcome, ${newUser.name}! You are now registered.`);
}

async function searchMovies() {
  const manuallyAddedMovies = [
    { title: 'The Shawshank Redemption', year: 1994, details: { cast: ['Tim Robbins', 'Morgan Freeman'], category: 'Drama', releaseDate: '1994-09-23', budget: '$25 million' } },
    { title: 'The Godfather', year: 1972, details: { cast: ['Marlon Brando', 'Al Pacino'], category: 'Crime', releaseDate: '1972-03-24', budget: '$6.8 million' } },
    { title: 'The Dark Knight', year: 2008, details: { cast: ['Christian Bale', 'Heath Ledger'], category: 'Action', releaseDate: '2008-07-18', budget: '$185 million' } },
    { title: 'Pulp Fiction', year: 1994, details: { cast: ['John Travolta', 'Samuel L. Jackson'], category: 'Crime', releaseDate: '1994-09-23', budget: '$8 million' } },
    { title: 'Schindler\'s List', year: 1993, details:  { cast: ['Liam Neeson', 'Ralph Fiennes'], category: 'Historical Drama', releaseDate: '1993-12-15', budget: '$75 million' } },
  ];

  const searchTerm = await inquirer.prompt({
    name: 'searchTerm',
    type: 'input',
    message: 'Enter a movie title or keyword to search:',
  });

  const filteredMovies = manuallyAddedMovies.filter(
    (movie) => movie.title.toLowerCase().includes(searchTerm.searchTerm.toLowerCase())
  );

  if (filteredMovies.length > 0) {
    console.log('Search results:');
    filteredMovies.forEach((movie) => {
      console.log(`${movie.title} (${movie.year})`);
    });

    const seeDetailsChoice = await inquirer.prompt({
      name: 'seeDetails',
      type: 'confirm',
      message: 'See details for any movie?',
    });

    if (seeDetailsChoice.seeDetails) {
      await searchMovieDetails(filteredMovies); 
    }
  } else {
    console.log('No movies found matching your search term.');
  }
}

async function searchMovieDetails(filteredMovies) {
  const movieSelection = await inquirer.prompt({
    name: 'movie',
    type: 'list',
    message: 'Select a movie to see details:',
    choices: filteredMovies.map((movie) => movie.title),
  });

  const selectedMovie = filteredMovies.find((movie) => movie.title === movieSelection.movie);

  console.log(`
Title: ${selectedMovie.title}
Year: ${selectedMovie.year}
Cast: ${selectedMovie.details.cast.join(', ')}
Category: ${selectedMovie.details.category}
Release Date: ${selectedMovie.details.releaseDate}
Budget: ${selectedMovie.details.budget}
`);

  mainMenu(); 
} 

async function manageFavorites() {
  const action = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: ['Add Movie to Favorites', 'Remove Movie from Favorites', 'List Favorites', 'Back to Main Menu'],
  });

  switch (action.action) {
    case 'Add Movie to Favorites':
      await addMovieToFavorites();
      break;
    case 'Remove Movie from Favorites':
      await removeMovieFromFavorites();
      break;
    case 'List Favorites':
      listFavorites();
      break;
    case 'Back to Main Menu':
      mainMenu(); 
      break;
  }
}

async function addMovieToFavorites() {
  const movieToAdd = await inquirer.prompt({
    name: 'title',
    type: 'input',
    message: 'Enter the title of the movie you want to add to favorites:',
  });

  
  if (favoriteMovies.some(movie => movie.title === movieToAdd.title)) {
    console.log(`"${movieToAdd.title}" is already in favorites.`);
  } else {
    favoriteMovies.push(movieToAdd);
    console.log(`Added "${movieToAdd.title}" to favorites.`);
  }
  manageFavorites(); 
}

async function removeMovieFromFavorites() {
  if (favoriteMovies.length === 0) {
    console.log('No movies in favorites to remove.');
    manageFavorites(); 
    return;
  }

  const movieToRemove = await inquirer.prompt({
    name: 'title',
    type: 'input',
    message: 'Enter the title of the movie you want to remove from favorites:',
  });

  const index = favoriteMovies.findIndex(movie => movie.title === movieToRemove.title);
  if (index !== -1) {
    favoriteMovies.splice(index, 1);
    console.log(`Removed "${movieToRemove.title}" from favorites.`);
  } else {
    console.log(`"${movieToRemove.title}" is not in favorites.`);
  }
  manageFavorites(); 
}

function listFavorites() {
  if (favoriteMovies.length === 0) {
    console.log('No favorite movies to list.');
  } else {
    console.log('Listing favorite movies:');
    favoriteMovies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title}`);
    });
  }
  manageFavorites(); 
}




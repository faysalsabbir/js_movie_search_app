
class SetMovie {
    constructor() {
        // HTML DOM ELEMENT SELECTION
        this.relatedMovie = document.querySelector('.related__movie')
        this.movieSearchInput = document.querySelector('.search__movie--title')
        // Select all dom element which use for display movie data
        this.movieEl = {
            movieName: document.querySelector('.movie__name'),
            movieTagline: document.querySelector('.movie__tagline'),
            movieStory: document.querySelector('.movie__story'),
            movieGenre: document.querySelector('.movie__genre'),
            movieProduction: document.querySelector('.movie__production--list'),
            movieReleaseDate: document.querySelector('.original__release--date'),
            movieIncome: document.querySelector('.box__office--income'),
            voteAverage: document.querySelector('.vote__average--rating'),
            runningTime: document.querySelector('.running__time--minute'),
            moviePoster: document.querySelector('#moviePoster'),
            body: document.querySelector('body')
        }
    }

    // This function for deStructuring an array object to string array
    movieDataStructuring(data, keyName) {
        let string = []
        data.forEach(str => {
            string.push(` ${str[keyName]}`)
        })
        return string
    }

    // It does display single movie to website with given movie
    displaySingleMovie(movie) {
        // console.log('MOVIE IS DISPLAYED')

        this.movieEl.movieName.innerHTML = movie.original_title
        this.movieEl.movieTagline.innerHTML = movie.tagline
        this.movieEl.movieStory.innerHTML = movie.overview
        this.movieEl.movieGenre.innerHTML = this.movieDataStructuring(movie.genres, 'name')
        this.movieEl.movieProduction.innerHTML = this.movieDataStructuring(movie.production_companies, 'name')
        this.movieEl.movieReleaseDate.innerHTML = movie.release_date
        this.movieEl.movieIncome.innerHTML = `$${movie.revenue}`
        this.movieEl.voteAverage.innerHTML = `${movie.vote_average} / 10`
        this.movieEl.runningTime.innerHTML = `${movie.runtime} mins`
        this.movieEl.moviePoster.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`
        this.movieEl.body.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
    }

    // It check is given value empty or not
    isValueEmpty(input) {
        return input ? true : false
    }

    // It display user search related movie name
    displayRelatedMovie(movies) {
        // It create all html element with movie data
        this.createRelatedMovie(movies)
    }

    // it create a list of movie name
    createRelatedMovie(movies) {
        this.relatedMovie.innerHTML = ''
        let ul = `<ul>`
        if (movies) {
            movies.forEach(movieName => {
                ul += `<li id="${movieName.id}"><a href="#" id="${movieName.id}">${movieName.original_title}</a></li>`
            })
        }
        ul += `</ul>`
        this.relatedMovie.insertAdjacentHTML('afterbegin', ul)
    }
    // It get data from api side and help to display data to website as temporary
    temporaryMovie(movie) {
        this.displaySingleMovie(movie)
    }

    // it Visible and hide based on user search and selection
    toggleRelatedMovie(input) {
        if (this.isValueEmpty(input)) {
            this.relatedMovie.style.cssText =
                `top: 3.6rem;
        visibility: visible;
        z-index: 1; `
        } else {
            this.relatedMovie.style.cssText = ``
        }
    }

}

let setMovie = new SetMovie()


class GetMovieAPI extends SetMovie {
    constructor() {
        super()
        this.API_KEY = `b0f0c76ab0b1753866233d98981040bd`
    }

    // It does displaying the demo to website when user do nothing
    DemoMovie() {
        let demo = `https://api.themoviedb.org/3/movie/475557?api_key=${this.API_KEY}&language=en-US`
        fetch(demo)
            .then(response => {
                return response.json()
            }).then(movie => {
                this.temporaryMovie(movie)
            })
    }

    // It search movie by given name
    searchMovie(name) {
        let movieByName = `https://api.themoviedb.org/3/search/movie?api_key=${this.API_KEY}&language=en-US&query=${name}&page=1&include_adult=false`

        fetch(movieByName)
            .then(response => {
                return response.json()
            }).then(movie => {
                let fiveMovieName = ''

                // Take only five movie within all movie
                if (movie) {
                    try {
                        fiveMovieName = movie.results.filter((movie, index) => {
                            return index < 5
                        })
                    } catch(err) {
                        
                    }
                }
                this.getRelatedMovie(fiveMovieName)
                // It pass first movie id to searchMovieById
                this.searchMovieById(movie.results[0].id)
            })
    }

    // It Search For Movie By Given Id
    searchMovieById(id) {
        this.movieById(movie => {
            this.getMovie(movie)
        }, id)
    }

    // By this function user can get a movie by movie id
    movieById(cb, id) {
        let movieById = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.API_KEY}&language=en-US`
        fetch(movieById)
            .then(response => {
                return response.json()
            }).then(movie => {
                cb(movie)
            })
    }
    // Get Single Movie Information
    getMovie(movie) {
        try {
            this.getSingleMovie(movie)
        } catch(err) {

        }
    }
    // Get Related 5 Movie Information based on search
    getRelatedMovie(movies) {
        // It Display Related Movie When User Search For Movie
        this.displayRelatedMovie(movies)
    }
    // Display movie based on movie id which given when user search
    selectMovie(id) {
        this.movieById(movie => {
            this.selectedMovie(movie)
        }, id)
    }
    // Do Something when user select a movie name
    selectedMovie(movie) {
        // Display selected movie
        this.displaySingleMovie(movie)
    }

}

let movieAPI = new GetMovieAPI()

// Temporary movie it shows by default
movieAPI.DemoMovie()

// Event Happen when user type something in search input
movieAPI.movieSearchInput.addEventListener('keyup', (event) => {
    try {
        // Toggle Related Movie
        movieAPI.toggleRelatedMovie(setMovie.movieSearchInput.value)
        // Search Movie By Name
        movieAPI.searchMovie(event.target.value)
        // Get Related Movies
        movieAPI.displayRelatedMovie()
    } catch (err) {
        // console.log(err.message)
    }

})

// Hide related movie if user click it over relatedMovie
document.addEventListener('click', (event) => {
    try {
        if (event.target.id != '#38700') movieAPI.toggleRelatedMovie('')

    } catch(err) {
        // console.log(err.message)
    }
})

let relatedMovie = document.querySelector('.related__movie')

// Display a movie based on selection result of search
relatedMovie.addEventListener('click', function (event) {
    try {
        if (relatedMovie.contains(event.target)) movieAPI.selectMovie(event.target.id)

    } catch(err) {
        // console.log(err.message)
    }
})

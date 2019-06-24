    
    $(document).ready(() => {
        $('#searchForm').on('submit', (e) => {
            var searchText = $('#searchText').val();
            getMovies(searchText);
            e.preventDefault();
        });
    });

    function getMovies(searchText) {
        axios.get('http://www.omdbapi.com/?apikey=c6f5d209'+ '&s=' + searchText)
        .then((response) => {
            console.log(response);
            var movies = response.data.Search;
            let output = '';
            $.each(movies, (index, movie) => {
                output += `
                    <div class="col-md-3">
                        <div class="well text-center">
                            <img src="${movie.Poster}">
                            <div class="movie_title">${movie.Title}</div>
                            <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
                        </div>
                    </div>
                `;
            });
            $('#movies').html(output);
            //self.vue.movie_list = movies;
            //enumerate(self.vue.movie_list);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    var movieSelected = function(id) {
        sessionStorage.setItem('movieId', id);
        window.location = 'movie.html';
        return false

    }
    var getMovie = function() {
        var movieId = sessionStorage.getItem('movieId')
        axios.get('http://www.omdbapi.com/?apikey=c6f5d209'+ '&i=' + movieId)
        .then((response) => {
            console.log(response);
            var movie = response.data;
            var output = `
                <div class="row">
                    <div class="col-md-4">
                        <h2>${movie.Title}</h2>
                        <img src ="${movie.Poster}" class="thumbnail">
                        </div>
                        <div class="half">
                            <div class="container">
                                <br>
                                <br>
                                <br>
                                <br>
                                <ul class="list-group">
                   
                                    <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
                                    <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
                                    <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
                                    <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
                                    <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
                                </ul>
                                <br>
                                <div class="well">
                                    <h3>Plot</h3>
                                    ${movie.Plot}
                                    <hr>
                                    <a href="add_review.html" class="btn btn-default">Review Another Movie</a>
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>

            `;

            $('#movie').html(output);
        })          
    }







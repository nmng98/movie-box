var app = function() {

    var self = {};

    Vue.config.silent = false;

    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};
	
    
    self.add_review = function () {
        //$.web2py.disableElement($("#add-review"));
        	var sent_title = self.vue.form_title;
        	var sent_genre = self.vue.form_genre;
			var sent_rating = self.vue.form_rating;
			var sent_body = self.vue.form_body;
        	$.post(add_review_url,
            	{
                	title: self.vue.form_title,
                	genre: self.vue.form_genre,
                	rating: self.vue.form_rating,
                	body: self.vue.form_body
            	},
            	function (data) {
                //$.web2py.enableElement($("#add-review"));
                	self.vue.form_title = "";
                	self.vue.form_genre = "";
                	self.vue.form_rating = "";
                	self.vue.form_body = "";
                	var new_review = {
                    	id: data.review_id,
                    	title: sent_title,
                    	genre: sent_genre,
                    	rating: sent_rating,
                    	body: sent_body,
                	};
                	self.vue.review_list.unshift(new_review);
                	self.process_reviews();
    		});
    };

    self.get_reviews = function() {
        $.getJSON(get_review_list_url,
            function(data) {
                
                self.vue.review_list = data.review_list;
                self.process_reviews();
                console.log(self.vue.review_list);
            }
        );
    };
    self.get_most_liked = function() {
        $.getJSON(get_most_liked_url,
            function(data) {
                
                self.vue.most_liked = data.most_liked;
                self.process_reviews();
                //console.log(self.vue.most_liked);
            }
        );

    };
    self.get_my_liked = function() {
        $.getJSON(get_my_liked_url,
            function(data) {
                self.vue.my_liked = data.my_liked;
                self.process_reviews();
            }
        );
    };
    self.get_my_reviews = function() {
    	$.getJSON(get_my_review_url,
            function(data) {
                
                self.vue.my_review = data.my_review;
                self.process_reviews();
            }
        );
    };
    self.show_likers = function(review_idx) {
        var p = self.vue.review_list[review_idx];
        p._show_likers = true;
        if (!p._likers_known) {
            $.getJSON(get_likers_url, {review_id: p.id}, 
            function (data) {
                p._likers = data.likers;
                p._likers_known = true;
            })
        }
    };
    self.hide_likers = function(review_idx) {
        var p = self.vue.review_list[review_idx];
        p._show_likers = false;
    };

    self.like_mouseover = function (review_idx) {
        // When we mouse over something, the face has to assume the opposite
        // of the current state, to indicate the effect.
        var p = self.vue.review_list[review_idx];
        p._smile = !p.like;
    };

    self.like_click = function (review_idx) {
        // The like status is toggled; the UI is not changed.
        var p = self.vue.review_list[review_idx];
        console.log(p.id);
        p.like = !p.like;
        // We force a refresh.
        p._likers_known = false;
        // We need to post back the change to the server.
        $.post(set_like_url, {
            review_id: p.id,
            like: p.like
        }, 
        function (data) {
            console.log(data);
            self.show_likers(review_idx);
            p._smile = p.like;
        });
    };

    self.like_mouseout = function (review_idx) {
        // The like and smile status coincide again.
        var p = self.vue.review_list[review_idx];
        p._smile = p.like;
    };

    self.process_reviews = function() {
        enumerate(self.vue.review_list);
        enumerate(self.vue.most_liked);
        enumerate(self.vue.my_liked);
        enumerate(self.vue.my_review);
        //enumerate(self.vue.movie_list);
        //enumerate(self.vue.review_movie);
        
        self.vue.review_list.map(function (e) {
            Vue.set(e, '_smile', e.like);
            Vue.set(e, '_likers', []);
            Vue.set(e, '_likers_known', false);
            Vue.set(e, '_show_likers', false);
        });
    };

    /*$(document).ready(() => {
        $('#searchForm').on('submit', (e) => {
            var searchText = $('#searchText').val();
            getMovies(searchText);
            e.preventDefault();
        });
    });
    
    var getMovies = function(searchText) {
        axios.get('http://www.omdbapi.com/?apikey=c6f5d209'+ '&s=' + searchText)
        .then((response) => {
            console.log(response);
            var movies = response.data.Search;
            self.vue.movie_list = movies;
             
        })
        .catch((err) => {
            console.log(err);
        });
    }
    var movieSelected = function(id) {
        sessionStorage.setItem('movieId', id);
        window.location = 'movie.html';
        return false;
    }

    var getMovie = function(id) {
        var movieId = self.vue.movie_list[id];
        axios.get('http://www.omdbapi.com/?apikey=c6f5d209'+ '&i=' + movieId)
        .then((response) => {
            console.log(response);
            var movie = response.data;
            self.vue.review_movie = movie;
            
        })
        .catch((err) => {
            console.log(err);
        });
    }*/

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            form_title: "",
            form_genre: "",
            form_rating:"",
            form_body: "",
            review_list: [],
            my_review: [],
            most_liked: [],
            my_liked: [],
            is_logged_in: is_logged_in,

        },
        methods: {
            add_review: self.add_review,

            like_mouseover: self.like_mouseover,
            like_mouseout: self.like_mouseout,
            like_click: self.like_click,

            show_likers: self.show_likers,
            hide_likers: self.hide_likers,
            

        }

    });
    if (is_logged_in) {
        $("#add_review").show();
    }

    // populate everything
    // make new JS file for just my reviews
    self.get_reviews();
    self.get_most_liked();
    self.get_my_reviews();
    if (is_logged_in){
        self.get_my_liked();
    }
    return self;

};

var APP = null;

jQuery(function(){APP = app();});

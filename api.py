
@auth.requires_signature()
def add_review():
  review_id = db.review.insert(
        title=request.vars.title,
        genre=request.vars.genre,
        rating=request.vars.rating,
        body=request.vars.body,
    )
    # We return the id of the new review, so we can insert it along all the others.
    return response.json(dict(review_id=review_id))


def get_review_list():
    results = []
    if auth.user is None:
        # Not logged in.
        rows = db().select(db.review.ALL, db.profile.ALL, groupby=db.review.id, orderby=~db.review.times)
        for row in rows:
            results.append(dict(
                id=row.review.id,
                title=row.review.title,
                genre=row.review.genre,
                rating=row.review.rating,
                body=row.review.body,
                username='Annonymous',
                like = False
            ))
    else:
        rows = db().select(db.review.ALL, db.user_like.ALL, db.profile.ALL,
                                left=[
                                db.user_like.on((db.user_like.review_id == db.review.id) & (db.user_like.email == auth.user.email)),
                                db.profile.on(db.profile.email == db.review.email)],
                                orderby=~db.review.times)
        
        for row in rows:
            results.append(dict(
                id=row.review.id,
                title=row.review.title,
                genre=row.review.genre,
                rating=row.review.rating,
                body=row.review.body,
                username=row.profile.username,
                like = False if row.user_like.id is None else True,
            ))
    # For homogeneity, we always return a dictionary.

    return response.json(dict(review_list=results))

# get my reviews open new vue js
@auth.requires_login()
@auth.requires_signature(hash_vars=False)
def set_like():
    print(request.vars.review_id)
    review_id = int(request.vars.review_id)
    like_status = request.vars.like.lower().startswith('t');
    if like_status:
        db.user_like.update_or_insert(
            (db.user_like.review_id == review_id) & (db.user_like.email == auth.user.email),
            review_id = review_id,
            email = auth.user.email,
        )
        
    else:
        db((db.user_like.review_id == review_id) & (db.user_like.email == auth.user.email)).delete()
    return "ok"


@auth.requires_login()
def get_likers():
    """Gets the list of people who liked a review."""
    review_id = int(request.vars.review_id)
    # We get directly the list of all the users who liked the review. 
    rows = db(db.user_like.review_id == review_id).select(db.user_like.email)
    # If the user is logged in, we remove the user from the set.
    likers_list = [r.email for r in rows]
    likers_list.sort()
    # We return this list as a dictionary field, to be consistent with all other calls.
    return response.json(dict(likers=likers_list))


def get_most_liked():
    most_liked = []
    #that = db(db.user_like.id).select().first()
    count = db(db.user_like.id).count()
    # maybe show profile name too ??
    rows = db(db.user_like.review_id == db.review.id).select(db.review.ALL, groupby=db.review.id)

    for row in rows:
        most_liked.append(dict(
        	id=row.id,
        	title=row.title,
        	genre=row.genre,
        	rating=row.rating,
        	body=row.body
        	
     	))

    return response.json(dict(most_liked = most_liked))


@auth.requires_login()
def get_my_liked():
    my_liked = []
    rows = db((db.user_like.email == auth.user.email) & (db.user_like.review_id == db.review.id)).select(db.review.ALL)
    for row in rows:
        my_liked.append(dict(
            id=row.id,
            title=row.title,
            genre=row.genre,
            rating=row.rating,
            body=row.body

        ))
    return response.json(dict(my_liked =  my_liked))

@auth.requires_login()
def get_my_review():
	my_review = []
	rows = db(db.review.email == auth.user.email).select(db.review.ALL)
	for row in rows:
		my_review.append(dict(
			id=row.id,
            title=row.title,
            genre=row.genre,
            rating=row.rating,
            body=row.body

		))
	return response.json(dict(my_review = my_review))





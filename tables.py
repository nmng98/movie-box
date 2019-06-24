
import datetime
def get_current_time():
    return datetime.datetime.utcnow()
    
def get_user_email():
    return None if auth.user is None else auth.user.email

def get_user_name():
    return None if auth.user is None else auth.user.first_name + '   ' + auth.user.last_name



db.define_table('profile',
    Field('email', default=get_user_email()),
    Field('name', 'string'),
    Field('username', default='The Masked Critic'),
    Field('bio', 'text')
    
)

db.profile.id.readable = False

db.profile.email.readable = True
db.profile.email.writable = False


db.define_table('review',
    Field('title', 'string'),
    Field('genre', 'string'), 
    Field('rating', 'integer'),
    Field('body', 'text'),
    Field('email', default=get_user_email()),
    Field('username', 'reference profile'),
    Field('times', 'datetime', default=get_current_time()),
)

db.review.rating.requires = IS_INT_IN_RANGE(1, 10)

db.define_table('user_like',
    Field('email'), 
    Field('review_id', 'reference review'), 
)


db.review.email.writable = False

db.review.times.writable = False

db.review.rating.requires = IS_INT_IN_RANGE(0,10)

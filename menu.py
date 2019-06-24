response.menu = [
    (T('Home'), False, URL('default', 'index'), []),
	(T('Profile'), False,  URL('default', 'view_profile'), [
		#(T('View Profile'), False, URL('default', 'view_profile')),
		#(T('Edit Profile'), False, URL('default', 'edit_profile')),
        ]),
	(T('Reviews'), False, '#', [
		#(T('My Reviews'), False, URL('default', 'my_review')),
		(T('Add Review'), False, URL('default', 'add_review')),
		(T('Liked Reviews'), False, URL('default', 'my_liked_review')),
		(T('My Reviews'), False, URL('default', 'my_review')),
		]),
]

# ----------------------------------------------------------------------------------------------------------------------
# provide shortcuts for development. you can remove everything below in production
# ----------------------------------------------------------------------------------------------------------------------

if not configuration.get('app.production'):
    _app = request.application
    response.menu += []

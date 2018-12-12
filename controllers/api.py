# Here go your api methods.

def get_excercise_list():
	results = []
	rows = db().select(db.excercises.ALL)
	groups = db(db.auth_user.email == auth.user.email).select()

	# Gets the groups that the user has selected to work out
	targets = get_user_targets()
	
	for row in rows:
		row.body_part = row.body_part.title()
		# Only display the excercise on the list if user is targeting it currently
		if row.body_part in targets:
			results.append(dict(
                id=row.id,
                body_part = row.body_part,
                name = row.name
            ))
	return response.json(dict(excercise_list = results))
# Get's user's target body parts from user db
def get_user_targets():
	groups = db(db.auth_user.email == auth.user.email).select()

	# Gets the groups that the user has selected to work out
	for group in groups:
		targets = group.target_groups
	return set(targets)
# Add all excercises to workouts table per user
def init_workouts():
	print "WORKOUTS INIT"
	rows = db().select(db.excercises.ALL)
	excercises = []

	for row in rows:
		# Dictionary Format: 
		# {Body Part: Excercise Name}
		excercises.append(dict(
			target_group = row.body_part,
			exc_name = row.name

		))

	# Populate workouts table for each individual user
	for exc in excercises:
		db.workouts.update_or_insert(
			username = auth.user.email,
			target_group = exc["target_group"],
			name = exc["exc_name"],
		)

# Retreives workout list
def get_workouts_list():
	results = []
	user_targets = get_user_targets()
	rows = db(db.workouts.username == auth.user.email).select(orderby=db.workouts.target_group)

	for row in rows:
		if (row.target_group in user_targets): # If the user has selected to work out this target group, then add to list
			results.append(dict(
			username = row.username,
			name = row.name,
			target_group = row.target_group,
			rep_weight = row.rep_weight,
			goal_weight = row.goal_weight

		))
	return response.json(dict(workouts_list = results))


# Get's username
def get_username():
	if auth.user.onboarded != True:
		onboarded = False
		init_workouts()
	return response.json(dict(username=auth.user.first_name, is_onboarded=onboarded, email=auth.user.email))

# Get's groups
def get_groups():
	results = []
	rows = db().select(db.excercises.body_part, distinct=True);
	for row in rows:
		row.body_part = row.body_part.title()
		results.append(dict(
                group_name = row.body_part
            ))
	return response.json(dict(groups = results))

def get_metrics(username, exc_name):
	return "ok"

def send_metrics():
	email = request.vars.username
	exc_name = request.vars.exc_name

	rep_weight = int(request.vars.rep_weight)
	goal_weight = int(request.vars.goal_weight)

	db.workouts.update_or_insert(
            (db.workouts.username == email) & (db.workouts.name == exc_name),
            rep_weight = rep_weight,
            goal_weight = goal_weight
    )


	return "ok"


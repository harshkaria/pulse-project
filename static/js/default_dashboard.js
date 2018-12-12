// This is the js for the default/index.html view.

// Individual Work
// New DB table with workouts (will have type and user idas reference)
// Log workouts w/ stats (insert every workout)?
// Auth table have list of body groups, compare with parent list that's hardcoded
// Carousel
// Figure out Feed


var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    self.get_list = function()
    {
        console.log("fired");
        $.getJSON(get_excercises_url,
            function(data) 
            {
                self.vue.excercise_list = data.excercise_list;   
            }
        );

    };

    self.init = function()
    {
        self.populate_target_list();
        // Gets the username
        $.getJSON(get_username_url,
            function(data) 
            {
                self.vue.username = data.username;   
                self.vue.is_onboarded = data.is_onboarded; 
                self.vue.email = data.email;
            }
        );

    }
    self.populate_target_list = function()
    {
        $.getJSON(get_groups_url,
            function(data)
            {
                self.vue.groups_list = data.groups;
            }
        );
    }
    self.get_workouts_list = function()
    {
        $.getJSON(get_workouts_url,
            function(data)
            {
                self.vue.workouts_list = data.workouts_list;
            }
        );
    }
    self.clicked = function(exc_name, rep_weight, goal_weight)
    {
         self.vue.curr_exc_name = exc_name;
         self.vue.curr_weight = rep_weight;
         self.vue.goal_weight = goal_weight;
    }
    self.get_metrics = function(email, exc_name)
    {
        console.log(email, exc_name);
    }
    self.send_metrics = function(email, exc_name)
    {
        console.log(email, exc_name);
        $.post(send_metrics_url, {
             username: email,
             exc_name: exc_name,
             rep_weight: self.vue.curr_weight,
             goal_weight: self.vue.goal_weight

         },
        function (data) 
        {
            self.get_workouts_list();
            self.vue.curr_weight = "";
            self.vue.goal_weight = "";

        }

        );
    }


    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            excercise_list: [],
            username: "",
            email: "",
            is_onboarded: false,
            groups_list: [],
            workouts_list: [],
            curr_exc_name: "",
            curr_weight: "",
            goal_weight: "",
            isTyping: false
        },
        methods: 
        {
            clicked: self.clicked,
            get_metrics: self.get_metrics,
            send_metrics: self.send_metrics
        },
        filters: 
        {
            uppercase: function(v) {
                return v.toUpperCase();
            }

        }
});

    self.get_workouts_list();
    self.init();


    return self;
};


var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});




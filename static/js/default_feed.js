// Get Groups for Requested User based on First Name
// Display workout feed accordingly
// Input form to search users and redirect??

var app = function() {
    var self = {};
    Vue.config.silent = false; // show all warnings

    self.init = function(req_name)
    {
    	self.vue.request_user = req_name;
        // Gets the username
        $.post(get_feed_url, {
             name: req_name

         },
        function (data) 
        {
            self.vue.feed_list = data.feed_list;
            self.vue.request_user = req_name;

        }

        );

    }

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            feed_list: [],
            username: "",
            email: "",
            is_onboarded: false,
            groups_list: [],
            workouts_list: [],
            curr_exc_name: "",
            curr_weight: "",
            goal_weight: "",
            request_user: "",
            isTyping: false,
            init: self.init
        },
        methods: 
        {
            
        },
        watch: {
            request_user: _.debounce(function() {
                 this.isTyping = false;
                }, 1000),
                isTyping: function(value) {
                if (!value) {
                 self.init(this.request_user);
               }
        }
    },
        filters: 
        {
            uppercase: function(v) {
                return v.toUpperCase();
            }

        }
});


    self.init(request_name);

    return self;

};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
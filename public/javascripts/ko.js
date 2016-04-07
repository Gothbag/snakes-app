/* global Knockout*/
(function () {

	//the main view model
	var ViewModel = function (snakes) {
		var self = this;

		this.loadSnakes = function () {
			$.ajax({
		        type: "POST",
		        url: '/api/snakes', /* El servicio web */
		        contentType: "application/json; charset=utf-8",
		        dataType: 'json',
		        success: function (data) {
		        	self.snakes.removeAll();
					data.map(function (snake) {
						self.snakes.push(new Snake(snake));
					});
		        }
		    });
		};

		//store the new snake being added
		this.current = ko.observable();
		//add a new snake
		this.add = function () {
			this.snakes.push(new Snake({"name":"Snake","len":1,"age":1}));
		}.bind(this); // this ensure the value "this" is the parent object and not the array item. 

		this.remove = function (snake) {
			if (snake.hasOwnProperty("_id")) {
				snake.visible(false); //we hide the snake
				snake.deleteItem(true); //we mark if for deletion
			} else {
				this.remove(snake); //the snake is just removed from the array
			}
		}.bind(this);

		this.save = function () {
			var data = ko.toJSON(this.snakes);
			$.ajax({
		        type: "POST",
		        url: '/api/snakes/save', /* El servicio web */
		        contentType: "application/json; charset=utf-8",
		        dataType: 'json',
		  		data: data,
		        success: function (snakes) {
		            self.snakes.removeAll();
		            $.each(snakes, function (index, snake) {
		                self.snakes.push(new Snake(snake));
		            });
		        }
		    });
		}

		this.snakes = ko.observableArray();
		this.loadSnakes();

	};

	//represent a single snake item le
	var Snake = function (snake) {
		this._id = snake._id;
		this.visible = ko.observable(true);
		this.deleteItem = ko.observable(false);
		this.name = ko.observable(snake.name);
		this.len = ko.observable(snake.len);
		this.age = ko.observable(snake.age);
	}
	//we load the data

	var viewModel = new ViewModel();
	ko.applyBindings(viewModel);

}());


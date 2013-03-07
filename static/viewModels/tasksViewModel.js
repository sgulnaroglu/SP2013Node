(function (ns) {
    var Task = ns.Task;

    ns.TasksViewModel = function () {
		var self = this;		
		self.tasks = ko.observableArray();


		self.addTask = function (task) {
		    task.progress.subscribe(function (val) {
		        self.onTaskChange(task,'progress',val);
		    });

		    self.tasks.push(task);
		};

		self.saveTask = function (task, callback) {
		    var data = ko.getJSON(task);
		    $.ajax({
		        type: "POST",
		        url: '/_api/task/post',
		        data: data,
		        dataType: 'json',
		        success: function (data) {
		            console.log('task saved');
		            console.log(data);
		            if (callback) {
		                callback(null, data);
		            }
		        } 
		    });
		};


		self.onTaskChange = function (task, property, value) {
		    if (task.propagate === false) {
		        return;
		    }
		    var msg = { id: task.id, property: value };
		    if (ns.socket) {
		        socket.emit('moveEvent', msg);
		    }
		};


		self.createNewTask = function () {
			var newTask = new Task( 100,'You','Rule','So much','high',0.5,'07.03.2013');
			self.addTask(newTask);
			setTimeout(function () {
			    newTask.progress(50);
			}, 1000);
		};

		self.serverTask2AppTask=function(task){
		    return new Task(task.id, task.owner, task.title, task.description, task.priority, task.progress, task.dueOn);

		};

		self.setTasks = function (tasks) {
		    if (self.tasks) {
		        self.tasks([]);
		    }
		    for (var i in tasks) {
		        self.addTask(self.serverTask2AppTask(tasks[i]));
		    }
		};
		self.getAllTasks = function () {
		    $.getJSON('/_api/task', self.setTasks);
		};

		self.getAllTasks();


		ns.socket.on('moveEvent', function (msg) {
		    var tasks = self.tasks();
		    for (var i = 0; i < self.tasks().length; i++) {
		        if (tasks[i].id == msg.id) {
		            delete msg.id;
		            task[i].propagate = false;
		            for (var p in msg) {
		                tasks[i][p](msg[p]);
		            }
		            task[i].propagate = true;
		            return;
		        }
		    }
		});

		ns.socket.on('newTask', function (task) {
		    self.addTask(self.serverTask2AppTask(task));
		});

		
		this.highPriorityTasks = ko.computed(function(){
			jQuery.grep(function(){
				
			});
		});
		
    };



})(window);
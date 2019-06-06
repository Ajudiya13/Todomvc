var view = {

	listTodo: document.getElementsByClassName('list-todo')[0],

	getInputTodo: function(){
		return document.getElementsByClassName('initial-container_input-todo')[0];
	},

	setOnClickOnAllSelector: function(){
		var allSelector = document.getElementsByClassName('initial-container__all-selector-container')[0];
		allSelector.setAttribute('onclick','controller.selectAll()');
	},

	setFocusOnInputTodo: function(){
		var inputTodo = this.getInputTodo();
		inputTodo.focus();
	},

	setInputTodoEmpty: function(){
		var inputTodo = this.getInputTodo();
		inputTodo.value = "";
	},

	setOnClickOnDisplayHandlers: function(){
		var allDisplayer = document.getElementsByClassName('all-displayer')[0];
		var activeDisplayer = document.getElementsByClassName('active-displayer')[0];
		var completedDisplayer = document.getElementsByClassName('completed-displayer')[0];

		viewTodo.setAttribute(allDisplayer,'onclick','controller.changeView(this)');
		viewTodo.setAttribute(activeDisplayer,'onclick','controller.changeView(this)');
		viewTodo.setAttribute(completedDisplayer,'onclick','controller.changeView(this)');
	},

	setOnClickOnClearCompleted: function(){
		var clearCompleted = document.getElementsByClassName('clear-completed')[0];
		viewTodo.setAttribute(clearCompleted,'onclick','controller.clearCompleted()');
	},

	addEventListenerInputTodo: function(){
		var inputTodo = this.getInputTodo();
		inputTodo.addEventListener("keyup", function(event) {
		  	if(event.keyCode === 13) {
		  		controller.addNewTodoToModel(inputTodo.value,false);
		  		view.setInputTodoEmpty();
			}
		});

		inputTodo.addEventListener("blur", function(event) {
		  	controller.addNewTodoToModel(inputTodo.value,false);
		  	view.setInputTodoEmpty();
		});
	},

	addEventListenerChangeContent: function(contentChanger,curTodoId){
		contentChanger.addEventListener("keyup",function(event){
			if(event.keyCode === 13){
				controller.setContent(curTodoId,contentChanger.value);
			}
		});

		contentChanger.addEventListener("blur",function(event){
			controller.setContent(curTodoId,contentChanger.value);
		});
	},

	addNewTodo: function(Content,IsCompleted,id){
		var newTodo = viewTodo.createNewTodo(Content,IsCompleted,id);
		this.listTodo.appendChild(newTodo);
	},

	changeState: function(curTodoId){
		var curTodo = document.getElementById(curTodoId);
		if(curTodo.classList.contains('active') === true){
			viewTodo.removeClass(curTodo,'active');
			viewTodo.addClass(curTodo,'completed');
		}
		else{
			viewTodo.removeClass(curTodo,'completed');
			viewTodo.addClass(curTodo,'active');
		}
	},

	setInformation: function(countActive,countCompleted){
		if(countActive+countCompleted > 0){
			var numberOfItems = document.getElementsByClassName('number-of-items')[0];
			numberOfItems.innerText = countActive + " items left";
		}
	},

	displayInformation: function(countActive,countCompleted) {
		var informationDisplayer = document.getElementsByClassName('information-displayer')[0];
		if(countActive + countCompleted === 0){
			viewTodo.addClass(informationDisplayer,'display_none');
			viewTodo.removeClass(informationDisplayer,'display_flex');
		}
		else{
			viewTodo.addClass(informationDisplayer,'display_flex');
			viewTodo.removeClass(informationDisplayer,'display_none');
		}
	},

	setClearCompleted: function(countCompleted){
		var clearCompleted = document.getElementsByClassName('clear-completed')[0];
		if(countCompleted === 0){
			viewTodo.addClass(clearCompleted,'display_none');
			viewTodo.removeClass(clearCompleted,'display_flex');
		}
		else{
			viewTodo.addClass(clearCompleted,'display_flex');
			viewTodo.removeClass(clearCompleted,'display_none');
		}
	},

	setPropertiesForAllSelector: function(countActive,countCompleted){
		var allSelector = document.getElementsByClassName('initial-container__all-selector')[0];
		if(countActive + countCompleted === 0){
			viewTodo.addClass(allSelector,'visibility_hidden');
			viewTodo.removeClass(allSelector,'visibility_visible');
		}
		else{
			viewTodo.removeClass(allSelector,'visibility_hidden');
			viewTodo.addClass(allSelector,'visibility_visible');

			if(countActive===0){
				viewTodo.addClass(allSelector,'color_alfa0pt5');
			}
			else{
				viewTodo.removeClass(allSelector,'color_alfa0pt5');
			}
		}

	},

	changeView: function(curDisplayer){
		var newViewDisplayer = document.getElementsByClassName(curDisplayer + "-displayer")[0];
		var curViewDisplayer = document.getElementsByClassName('isClick')[0];

		viewTodo.removeClass(curViewDisplayer,'isClick');
		viewTodo.addClass(newViewDisplayer,'isClick');

		var allTodos = document.getElementsByClassName('all');
		for(var i=0;i<allTodos.length;i++)
		{
			curTodo = allTodos[i];
			if(!curTodo.classList.contains(curDisplayer))
			{
				viewTodo.addClass(curTodo,'display_none');
				viewTodo.removeClass(curTodo,'display_flex');
			}
			else
			{
				viewTodo.removeClass(curTodo,'display_none');
				viewTodo.addClass(curTodo,'display_flex');	
			}
		}
	},

	editContent: function(curTodoId,curTodoContent){
		var contentChanger = viewTodo.createContentChager(curTodoContent);
		var curTodo = document.getElementById(curTodoId);
		var curTodoContentContainer = curTodo.childNodes[1];
		curTodo.replaceChild(contentChanger,curTodoContentContainer);
		contentChanger.focus();
		this.addEventListenerChangeContent(contentChanger,curTodoId);
	},

	setContent: function(curTodoId,content){
		var curTodo = document.getElementById(curTodoId);
		var contentContainer = viewTodo.createTodoContentContainer(content);
		var contentChanger = curTodo.childNodes[1];
		curTodo.replaceChild(contentContainer,contentChanger);
	},

	removeTodo: function(id){
		var curTodo = document.getElementById(id);
		this.listTodo.removeChild(curTodo);
	},

	init: function(){
		this.setOnClickOnAllSelector();
		this.setFocusOnInputTodo();
		this.addEventListenerInputTodo();
		this.setOnClickOnDisplayHandlers();
		this.setOnClickOnClearCompleted();
	},

	render: function(countActive,countCompleted){
		this.setInformation(countActive,countCompleted);
		this.displayInformation(countActive,countCompleted);
		this.setClearCompleted(countCompleted);
		this.changeView(document.getElementsByClassName('isClick')[0].innerHTML.toLowerCase());
		this.setPropertiesForAllSelector(countActive,countCompleted);
	},
};

var controller = {
	init: function(){
		view.init();
		this.getLocalStorage();
		this.render();
	},

	getLocalStorage: function(){
		var tempCurDisplayer;
		var tempTodos = [];
		while(localStorage.length>0)
		{
			var curKey = localStorage.key(0);
			var curContent = localStorage.getItem(curKey);

			if(curKey === 'curDisplayer')
				tempCurDisplayer = curContent;
			else
				tempTodos.push(JSON.parse(curContent));

			localStorage.removeItem(curKey);
		}
		
		for(var i=0;i<tempTodos.length;i++)
			this.addNewTodoToModel(tempTodos[i].content,tempTodos[i].isCompleted);

		tempCurDisplayer = tempCurDisplayer || 'all';
		model.setCurDisplayer(tempCurDisplayer);
		view.changeView(model.curDisplayer);
	},

	addNewTodoToModel: function(Content,IsCompleted){
		model.addNewTodo(Content,IsCompleted);
	},

	addNewTodoToView: function(Content,IsCompleted,id){
		view.addNewTodo(Content,IsCompleted,id);
		this.render();
	},

	changeState: function(curTodoId){
		model.changeState(curTodoId);
		view.changeState(curTodoId);
		this.render();
	},

	changeView: function(element){
		model.setCurDisplayer(element.innerHTML.toLowerCase());
		view.changeView(model.curDisplayer);
	},

	removeTodo: function(curTodoId){
		model.removeTodo(curTodoId);
		view.removeTodo(curTodoId);
		this.render();
	},

	clearCompleted: function(){
		var allTodos = model.Todos;
		for(var i=0;i<allTodos.length;i++)
		{
			if(allTodos[i]!== undefined && allTodos[i].isCompleted === true)
				this.removeTodo(i);
		}

	},

	selectAll: function(){
		var curDisplayer = model.curDisplayer;
		var allTodos = model.Todos;
		var curActive = model.countActive;
		var curCompleted = model.countCompleted;
		for(var i=0;i<allTodos.length;i++)
		{
			if(allTodos[i] !== undefined)
				this.selectAllByDisplayer(allTodos[i],i,curDisplayer,curActive,curCompleted);
		}
	},

	selectAllByDisplayer: function(curTodo,curTodoId,curDisplayer,curActive,curCompleted){
		
		if((curDisplayer === 'all' || curDisplayer === 'active') && (curTodo.isCompleted === false || curActive===0)){
			this.changeState(curTodoId);
		}
		else if(curDisplayer==='completed' && (curTodo.isCompleted === true || curCompleted==0)){
			this.changeState(curTodoId);
		}
	},

	editContent: function(curTodoId){
		view.editContent(curTodoId,model.getContent(curTodoId));
	},

	setContent(curTodoId,content){
		if(model.setContent(curTodoId,content)===true){
			view.setContent(curTodoId,model.getContent(curTodoId));
		}
	},

	render: function(){
		view.render(model.countActive,model.countCompleted);
	}
};

var model = {
	Todos: [],
	countActive: 0,
	countCompleted: 0,
	noOfTodos: 0,

	setCurDisplayer: function(CurDisplayer){
		this.curDisplayer = CurDisplayer;
		this.setCurDisplayerToLocalStorage();
	},

	setCurDisplayerToLocalStorage: function(){
		localStorage.setItem('curDisplayer',this.curDisplayer);
	},

	getContent: function(id){
		return this.Todos[id].content;
	},

	setContent: function(id,content){
		if(this.isValidContent(content)===false){
			controller.removeTodo(id);
			return false;
		}
		this.Todos[id].content = content;
		localStorage.setItem(id,JSON.stringify(this.Todos[id]));
		return true;
	},

	isValidContent: function(Content){
		if(Content.trim().length === 0)
			return false;
		return true;
	},

	addNewTodo: function(Content,IsCompleted){
		if(this.isValidContent(Content)===false){
			return;
		}

		var newTodo = {};
		newTodo.content = Content;
		newTodo.isCompleted = IsCompleted;
		this.incrementCounter(IsCompleted);
		this.Todos.push(newTodo);

		controller.addNewTodoToView(Content,IsCompleted,this.noOfTodos);
		localStorage.setItem(this.noOfTodos,JSON.stringify(newTodo));

		this.incrementNoOfTodosCounter();
	},

	incrementNoOfTodosCounter: function(){
		this.noOfTodos++;
	},

	incrementCounter: function(IsCompleted){
		if(IsCompleted === true){
			this.countCompleted++;
		}
		else{
			this.countActive++;
		}
	},

	decrementCounter: function(IsCompleted){
		if(IsCompleted===true){
			this.countActive--;
		}
		else{
			this.countCompleted--;
		}
	},

	changeState: function(curTodoId){
		var curState = this.Todos[curTodoId].isCompleted;
		if(curState === false){
			this.Todos[curTodoId].isCompleted = true;
			this.incrementCounter(true);
			this.decrementCounter(true);
		}
		else{
			this.Todos[curTodoId].isCompleted = false;
			this.incrementCounter(false);
			this.decrementCounter(false);
		}
		localStorage.setItem(curTodoId,JSON.stringify(this.Todos[curTodoId]));
	},

	removeTodo: function(id){
		this.decrementCounter(!this.Todos[id].isCompleted);
		localStorage.removeItem(id);
		delete this.Todos[id];
	},
};


var viewTodo = {
	createNewTodo: function(Content,IsCompleted,id){
		var newTodo = this.createTodoContainer(IsCompleted);
		newTodo.id = id;

		var newTodoCheckboxContainer = this.createTodoCheckboxContainer();
		var newTodoCheckbox = this.createTodoCheckbox();
		var newTodoTickmark = this.createTodoTickmark();

		newTodoCheckbox.appendChild(newTodoTickmark);
		newTodoCheckboxContainer.appendChild(newTodoCheckbox);
		newTodo.appendChild(newTodoCheckboxContainer);

		var newTodoContentContainer = this.createTodoContentContainer(Content);
		newTodo.appendChild(newTodoContentContainer);

		var newTodoCloseContainer = this.createTodoCloseContainer();
		newTodo.appendChild(newTodoCloseContainer);
		return newTodo;
	},

	createDiv: function(){
		return document.createElement("div");
	},

	addClass: function(...elementWithClassnNames){
		[element,...className]  =elementWithClassnNames;
		element.classList.add(...className);
	},

	removeClass: function(...elementWithClassnNames){
		[element,...className]  =elementWithClassnNames;
		element.classList.remove(...className);
	},	

	createTodoContainer: function(IsCompleted){
		var newTodo = this.createDiv();
		this.addClass(newTodo,'all','margin-left_auto','margin-right_auto',
			'top_0','width_60rem','background-color_white','display_flex','border_solid_1px_ededed','text-align_left','vertical-align_middle','border-top_none');
		
		this.setAttribute(newTodo,'ondblclick','controller.editContent(this.id)');
		if(IsCompleted===true){
			this.addClass(newTodo,'completed');
		}
		else{
			this.addClass(newTodo,'active');
		}

		return newTodo;
	},

	createTodoCheckboxContainer: function(){
		var newTodoCheckboxContainer = this.createDiv();
		this.addClass(newTodoCheckboxContainer,'checkbox-container','display_flex','align-items_center');
		return newTodoCheckboxContainer;
	},

	createTodoCheckbox: function(){
		var newTodoCheckbox = this.createDiv();
		this.addClass(newTodoCheckbox,'checkbox','display_flex','margin_auto');
		this.setAttribute(newTodoCheckbox,'onclick','controller.changeState(this.parentNode.parentNode.id)');
		return newTodoCheckbox;
	},

	createTodoTickmark: function(){
		var newTodoTickmark = this.createDiv();
		this.addClass(newTodoTickmark,'tickmark','padding_0');
		return newTodoTickmark;
	},

	createTodoContentContainer: function(Content){
		var newTodoContentContainer = this.createDiv();
		this.addClass(newTodoContentContainer,'content-container','font-size_2pt4rem');
		newTodoContentContainer.innerText = Content;
		return newTodoContentContainer;
	},

	createTodoCloseContainer: function(){
		var newTodoCloseContainer = this.createDiv();
		this.addClass(newTodoCloseContainer,'close-container','text-align_center','display_flex','align-items_center','visibility_hidden');
		newTodoCloseContainer.innerText = "X";
		this.setAttribute(newTodoCloseContainer,'onclick','controller.removeTodo(this.parentNode.id)');
		return newTodoCloseContainer;
	},

	createContentChager: function(curContent){
		var contentChanger = document.createElement('input');
		this.setAttribute(contentChanger,'type','text');
		this.addClass(contentChanger,'content-changer','font-size_2pt4rem');
		this.setAttribute(contentChanger,'value',curContent);
		return contentChanger;
	},

	setAttribute: function(element,attribute,value){
		element.setAttribute(attribute,value);
	}
}

controller.init();
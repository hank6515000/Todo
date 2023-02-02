let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click",e=>{
    //避免瀏覽器將資料送出
 e.preventDefault();

 //取得input values
 let form = e.target.parentElement;
 let todoText = form.children[0].value;
 let todoMonth = form.children[1].value;
 let todoDay = form.children[2].value;

 if(todoText === ""){
    alert("請輸入代辦事項");
    return;//直接回傳alert 不會執行下面的code
 }

 //創造一個todo
let todo = document.createElement("div");
todo.classList.add("todo");
let text = document.createElement("p");
text.classList.add("todo-text");
text.innerText = todoText;
let time = document.createElement("p");
time.classList.add("todo-time");
time.innerText = todoMonth+" / "+todoDay;
todo.appendChild(text);
todo.appendChild(time);


let completeButton = document.createElement("button");
completeButton.classList.add("complete")
completeButton.innerHTML='<i class="fa-solid fa-check"></i>';
completeButton.addEventListener("click",e=>{
let todoItem = e.target.parentElement;
todoItem.classList.toggle("done");
})

let trashButton = document.createElement("button");
trashButton.classList.add("trash");
trashButton.innerHTML='<i class="fa-solid fa-trash"></i>';

trashButton.addEventListener("click",e=>{
    let todoItem = e.target.parentElement;
    
    todoItem.addEventListener("animationend",()=>{

//刪除localStorage
        let text = todoItem.children[0].innerText;
    let mylistArr = JSON.parse(localStorage.getItem("list"));
    mylistArr.forEach((item,index)=>{
        if(item.todoText == text){
            mylistArr.splice(index,1);
            localStorage.setItem("list",JSON.stringify(mylistArr));
        }
    })

        todoItem.remove();
    })

    todoItem.style.animation="scaleDown 0.3s forwards";
})


todo.appendChild(completeButton);
todo.appendChild(trashButton);

todo.style.animation="scaleUp 0.3s forwards";

//創建 object
let myTodo = {
    todoText:todoText,
    todoMonth:todoMonth,
    todoDay:todoDay
};

//把創建的todo放入Array
let myList = localStorage.getItem("list");
if(myList==null){
localStorage.setItem("list",JSON.stringify([myTodo]));
}else{
let mylistArr = JSON.parse(myList);
mylistArr.push(myTodo);
localStorage.setItem("list",JSON.stringify(mylistArr));
}

console.log(JSON.parse(localStorage.getItem("list")))

form.children[0].value="";//清空TEXT
section.appendChild(todo);
})

loadData();

function loadData() {
let myList = localStorage.getItem("list");
if(myList!==null){
    let mylistArr = JSON.parse(myList);
    mylistArr.forEach(item=>{

//創建Todo
        let todo = document.createElement("div");
        todo.classList.add("todo");
        let text = document.createElement("p");
        text.classList.add("todo-text");
        text.innerText = item.todoText;
        let time = document.createElement("p");
        time.classList.add("todo-time");
        time.innerText = item.todoMonth+" / "+item.todoDay;
        todo.appendChild(text);
        todo.appendChild(time);

//創建check按鈕
        let completeButton = document.createElement("button");
completeButton.classList.add("complete")
completeButton.innerHTML='<i class="fa-solid fa-check"></i>';

completeButton.addEventListener("click",e=>{
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
    })

//創建回收桶按鈕
    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML='<i class="fa-solid fa-trash"></i>';
    
    trashButton.addEventListener("click",e=>{
        let todoItem = e.target.parentElement;
        todoItem.addEventListener("animationend",()=>{
            
            //刪除localStaorage
            let text = todoItem.children[0].innerText;
            let mylistArr = JSON.parse(localStorage.getItem("list"));
            mylistArr.forEach((item, index) => {
                if(item.todoText == text){
                    mylistArr.splice(index,1);
                    localStorage.setItem("list",JSON.stringify(mylistArr));
                }
            })
            todoItem.remove();
        })

        todoItem.style.animation="scaleDown 0.3s forwards";
    
    })

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);
    
    section.appendChild(todo);
    })
}
}


function MargeTime(arr1, arr2){
    let result = [];
    let i = 0;
    let j = 0;

    while(i < arr1.length && j < arr2.length){
        if(Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)){
            result.push(arr2[j]);
            j++;
        }else if(Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)){
            result.push(arr1[i]);
            i++;
        }else if(Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)){
            if(Number(arr1[i].todoDay) > Number(arr2[j].todoDay)){
                result.push(arr2[j]);
                j++;
            }else{
                result.push(arr1[i]);
                i++;
            }
        }
    }

    while(i > arr1.length){
        result.push(arr1[i]);
        i++;
    }
    while(j < arr2.length){
        result.push(arr2[j]);
        j++;
    }

    return result;
}

function MargeSort(arr){
    if(arr.length === 1){
        return arr;
    }else{
        let middle = Math.floor(arr.length/2);
        let right = arr.slice(0,middle);
        let left = arr.slice(middle,arr.length);
        return MargeTime(MargeSort(right),MargeSort(left))
    }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click",()=>{
//資料排序
let sortedArr = MargeSort(JSON.parse(localStorage.getItem("list")));
localStorage.setItem("list",JSON.stringify(sortedArr));

//刪除資料
let len =section.children.length;
for(let i = 0; i < len; i++){
    section.children[0].remove();
}

//loadData
loadData();
})
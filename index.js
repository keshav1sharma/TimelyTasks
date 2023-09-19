////////////////////// CLOCK////////////////////////////


const secondHand = document.querySelector('.second-hand');
const minsHand = document.querySelector('.min-hand');
const hourHand = document.querySelector('.hour-hand');

function setDate() {
  const now = new Date();

  const seconds = now.getSeconds();
  const secondsDegrees = ((seconds / 60) * 360) + 90;
  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

  const mins = now.getMinutes();
  const minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6) + 90;
  minsHand.style.transform = `rotate(${minsDegrees}deg)`;

  const hour = now.getHours();
  const hourDegrees = ((hour / 12) * 360) + ((mins/60)*30) + 90;
  hourHand.style.transform = `rotate(${hourDegrees}deg)`;
}

setInterval(setDate, 1000);

setDate();
 



////////////////////////////////////////////////////////////////

function addTask() {
    const input = document.querySelector("textarea");
    const category = document.querySelector("select");
    const dueDate = document.querySelector("#due-date-input"); 
    if (!input || !category || !dueDate) {
        console.error("One or more elements not found.");
        return;
    }
    const inputValue = input.value;
    const categoryValue = category.value;
    const dueDateValue = dueDate.value;


    if(inputValue === "" || categoryValue === "" || dueDateValue === "") {
        alert("Please fill in all fields.");
        return;
    }

    if(categoryValue === "Work") {
    document.querySelector(".box2").innerHTML += `
    <div class='card' data-due-date="${dueDateValue}">
    <span contentEditable='true'>${inputValue}</span>
    <button onclick="removeTask(this.parentElement)">
    <span class='material-symbols-outlined delete-btn'>delete</span>
    </button>
    </div>`;


    input.value = "";
    }
    else if(categoryValue === "Personal") {
    document.querySelector(".box3").innerHTML += `
    <div class='card' data-due-date="${dueDateValue}">
    <span contentEditable='true'>${inputValue}</span>
    <button onclick="removeTask(this.parentElement)">
    <span class='material-symbols-outlined delete-btn'>delete</span>
    </button>
    </div>`;

    input.value = "";

    }
    else if(categoryValue === "Misc") {
        document.querySelector(".box4").innerHTML += `
        <div class='card' data-due-date="${dueDateValue}">
        <span contentEditable='true'>${inputValue}</span>
        <button onclick="removeTask(this.parentElement)">
        <span class='material-symbols-outlined delete-btn'>delete</span>
        </button>
        </div>`;

    input.value = "";
    }
    //reset date value to default
    dueDate.value = "";


    saveData();
}

function removeTask(element) {
    element.remove();
    saveData();
}

function searchTasks(searchValue)
{
    let list1 = document.querySelector(".box2").children;
    let list2 = document.querySelector(".box3").children;
    let list3 = document.querySelector(".box4").children;

    searchValue = searchValue.toLowerCase();

    const arr1 = [];
    const arr2 = [];
    const arr3 = [];
    let flag = false;

    for(let i=0;i<list1.length;i++)
    {
        let temp = list1[i].innerText.replace("\ndelete","");
        arr1.push(temp.toLowerCase());
        if(arr1[i].includes(searchValue))
        {
            list1[i].style.backgroundColor = "yellow";
            flag = true;
        }
    }

    for(let i=0;i<list2.length;i++)
    {
        let temp = list2[i].innerText.replace("\ndelete","");
        arr2.push(temp.toLowerCase());
        if(arr2[i].includes(searchValue))
        {
            list2[i].style.backgroundColor = "yellow";
            flag = true;
        }
    }

    for(let i=0;i<list3.length;i++)
    {
        let temp = list3[i].innerText.replace("\ndelete","");
        arr3.push(temp.toLowerCase());
        if(arr3[i].includes(searchValue))
        {
            list3[i].style.backgroundColor = "yellow";
            flag = true;
        }
    }

    if(flag == false)
    {
        alert("No such task found");
    }

    document.querySelector('#searchInput').value = "";

}


function sortTasks() {
    const tasks = document.querySelectorAll(".card");
    const sortedTasks = Array.from(tasks).sort((a, b) => {
        const dueDateA = new Date(a.getAttribute("data-due-date"));
        const dueDateB = new Date(b.getAttribute("data-due-date"));
        return dueDateA - dueDateB;
    });

    const sortedTasksArray = Array.from(sortedTasks); // Create a new array with sorted tasks
    //console.log(sortedTasksArray);
    const box2 = document.querySelector(".box2");
    const box3 = document.querySelector(".box3");
    const box4 = document.querySelector(".box4");

    //Clear existing tasks
    // box2.innerHTML = "";
    // box3.innerHTML = "";
    // box4.innerHTML = "";

    // Re-add sorted tasks to respective boxes
    sortedTasksArray.forEach(task => {
        let category;
        if( task.parentElement.className.includes("box2"))
        {
            category = "box2";
        }
        else if( task.parentElement.className.includes("box3") )
        {
            category = "box3";
        }
        else
        {
            category = "box4";
        }
        console.log(category);
        if (category === "box2") {
            box2.appendChild(task.cloneNode(true)); // Clone the task to preserve event listeners
        } else if (category === "box3") {
            box3.appendChild(task.cloneNode(true)); 
        } else if (category === "box4") {
            box4.appendChild(task.cloneNode(true)); 
        }
    });
}


function startDictation() {

  const button = document.getElementById("voice-button");
  const result = document.querySelector(".input-field");
  const main = document.querySelectorAll(".voice-input")[0];

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (typeof SpeechRecognition === "undefined") {
    button.remove();
    const message = document.getElementById("message");
    message.removeAttribute("hidden");
    message.setAttribute("aria-hidden", "false");
  }
  else 
  {
       let listening = false;
       const recognition = new SpeechRecognition();
       const start = () => {
           recognition.start();
           button.textContent = "Stop listening";
           listening = true;
           main.classList.add("speaking");
       };
       const stop = () => {
           recognition.stop();
           //console.log("Stopped listening");
           button.textContent = "Start listening";
           main.classList.remove("speaking");
           listening = false;
       };
       const onResult = event => {
           document.querySelector(".input-field").value = "";

           for (const res of event.results) {
               const text = document.createTextNode(res[0].transcript);
               document.querySelector(".input-field").value += text.textContent;
           }
       };

         recognition.continuous = true;
         recognition.interimResults = true;
         recognition.addEventListener("result", onResult);

         button.addEventListener("click", () => {
           if (listening) {
               stop();
               listening = !listening;
           } else {
               start();
           }
           
         });
    }

}


function saveData()
{
    localStorage.setItem("box2",document.querySelector(".box2").innerHTML);
    localStorage.setItem("box3",document.querySelector(".box3").innerHTML);
    localStorage.setItem("box4",document.querySelector(".box4").innerHTML);

}

function loadData()
{
    document.querySelector(".box2").innerHTML = localStorage.getItem("box2");
    document.querySelector(".box3").innerHTML = localStorage.getItem("box3");
    document.querySelector(".box4").innerHTML = localStorage.getItem("box4");
}

loadData();

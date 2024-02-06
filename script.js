// @ts-nocheck

const worker = new Worker("workers.js");
let wworker = document.getElementById("wworker");
let woworker = document.getElementById("woworker");
let outputDiv = document.getElementsByClassName("table-show")[0];
let timeDiv = document.getElementById("time");

wworker?.addEventListener("click", withoutWorkers);
woworker?.addEventListener("click", withWorkers);

async function withoutWorkers(e) {
  e.preventDefault();
  const startTime = performance.now();
  isLoading(true);
  const data = await LoadData();
  data.sort((a, b) => a.postId - b.postId);
  console.log(data);
  isLoading(!true);
  const endTime = performance.now();
  displayResults(data, endTime - startTime);
}

function withWorkers(e) {
  e.preventDefault();
  isLoading(true);
  const startTime = performance.now();
  worker.postMessage({});
  worker.onmessage = function (e) {
    isLoading(!true);
  
    const endTime = performance.now();
  
    displayResults(e.data, endTime - startTime);
  };
}

function isLoading(status) {
  if (status) {
    outputDiv.innerHTML = `<div class='loading'>Loading ...</div>`;
  } else {
    outputDiv.innerHTML = ``;
  }
}
function displayResults(data, processingTime) {
  outputDiv.innerHTML = `<table class='data-table'>
                    <thead class='table-head'>
                        <tr >
                            <th>id</th>
                            <th>postId</th>
                            <th>User ID</td>
                            <th>Username</td>
                            <th>Comment</td>
                        </tr>
                    </thead>
                    <tbody class="table-body">
                    </tbody>
                </table>
            
  `;
  let tBody = document.getElementsByClassName("table-body")[0];

  data.forEach((e) => {
    tBody.innerHTML += `<tr style="border: 0.5px solid black;">
        <td>${e["id"]}</td>
        <td>${e["postId"]}</td>
        <td>${e["user"]["id"]}</td>
        <td>${e["user"]["username"]}</td>
        <td>${e["body"]}</td>
      </tr>`;
  });
  timeDiv.value = ``;
  timeDiv.value = `${processingTime} ms`;
  // <p>Processing Time: ${processingTime.toFixed(2)} milliseconds</p>
}

async function LoadData() {
  let data = await fetch("https://dummyjson.com/comments?limit=340", {
    method: "GET",
  });

  let d = await data.json();
  console.log(d.comments);
  return d.comments;
}

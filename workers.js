onmessage = async function (event) {
  let arr = await LoadData();
  arr.sort((a, b) => a.postId - b.postId);

  this.postMessage(arr);
};

async function LoadData() {
  let data = await fetch("https://dummyjson.com/comments?limit=340", {
    method: "GET",
  });
  let d = await data.json();
  return d.comments;
}

form.addEventListener("submit", submitForm);
document.getElementById("d").addEventListener("submit", download);
function submitForm(e) {
  e.preventDefault();
  const name = document.getElementById("name");
  const files = document.getElementById("file");
  const formData = new FormData();
  formData.append("name", name.value);
  for (let i = 0; i < files.files.length; i++) {
    formData.append("file", files.files[i]);
  }

  fetch("http://localhost:5000/upload_files", {
    method: "POST",
    body: formData,
  })
    .then((res) => console.log(res))
    .catch((err) => ("Error occured", err));
}

function download(e) {
  e.preventDefault();
  const name = document.getElementById("di");
  const formData = new FormData();
  formData.append("di", name.value);

  console.log(name.value);

  fetch("http://localhost:5000/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileName: name.value }),
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "has.PNG";
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((error) => console.error("Error:", error));
}

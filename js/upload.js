document.getElementById("uploadBtn").addEventListener("click", async () => {

  const status = document.getElementById("status");
  const fileInput = document.getElementById("videoFile");
  const file = fileInput.files[0];

  if (!file) {
    status.innerText = "Select a file first.";
    return;
  }

  status.innerText = "Uploading...";

  const fileName = Date.now() + "-" + file.name.replace(/\s+/g, "_");

  const { data, error } = await supabaseClient
    .storage
    .from("videos")
    .upload(fileName, file);

  if (error) {
    console.error(error);
    status.innerText = "Upload failed: " + error.message;
    return;
  }

  const { data: publicData } = supabaseClient
    .storage
    .from("videos")
    .getPublicUrl(fileName);

  status.innerText = "Upload successful!";
  console.log("Public URL:", publicData.publicUrl);

});

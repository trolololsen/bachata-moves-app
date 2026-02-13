async function uploadMove() {

  const status = document.getElementById("status");
  status.innerText = "Uploading...";

  const file = document.getElementById("video").files[0];

  if (!file) {
    status.innerText = "Select a video.";
    return;
  }

  const fileName = Date.now() + "-" + file.name;

  const { error: uploadError } =
    await supabaseClient.storage
      .from("videos")
      .upload(fileName, file);

  if (uploadError) {
    status.innerText = uploadError.message;
    return;
  }

  const videoUrl =
    SUPABASE_URL +
    "/storage/v1/object/public/videos/" +
    fileName;

  const { error: dbError } =
    await supabaseClient
      .from("moves")
      .insert({
        name: document.getElementById("name").value,
        position: document.getElementById("position").value,
        type: document.getElementById("type").value,
        difficulty: document.getElementById("difficulty").value,
        video_url: videoUrl
      });

  if (dbError) {
    status.innerText = dbError.message;
    return;
  }

  status.innerText = "Upload complete.";
}

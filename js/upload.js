async function uploadMove() {
  const status = document.getElementById("status");
  status.innerText = "Uploading...";

  // Grab inputs
  const name = document.getElementById("name").value.trim();
  const position = document.getElementById("position").value;
  const type = document.getElementById("type").value;
  const difficulty = document.getElementById("difficulty").value;
  const fileInput = document.getElementById("video");
  const file = fileInput.files[0];

  // Basic validation
  if (!name || !position || !type || !difficulty) {
    status.innerText = "Please fill in all fields.";
    return;
  }

  if (!file) {
    status.innerText = "Please select a video file.";
    return;
  }

  try {
    // Create unique file name
    const fileName = `${Date.now()}-${file.name}`;

    // Upload to Supabase storage
    const { error: uploadError } = await supabaseClient
      .storage
      .from("videos")
      .upload(fileName, file);

    if (uploadError) {
      status.innerText = "Video upload failed: " + uploadError.message;
      return;
    }

    // Generate public URL for stored video
    const videoUrl = `${SUPABASE_URL}/storage/v1/object/public/videos/${fileName}`;

    // Insert new move into database
    const { error: dbError } = await supabaseClient
      .from("moves")
      .insert({
        name: name,
        position: position,
        type: type,
        difficulty: difficulty,
        video_url: videoUrl
      });

    if (dbError) {
      status.innerText = "Database insert failed: " + dbError.message;
      return;
    }

    status.innerText = "Upload complete!";

    // Clear inputs
    document.getElementById("name").value = "";
    fileInput.value = "";

  } catch (err) {
    status.innerText = "Unexpected error: " + err.message;
  }
}

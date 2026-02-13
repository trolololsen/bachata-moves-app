// Upload a Bachata move with video to Supabase
async function uploadMove() {
  const status = document.getElementById("status");
  status.innerText = "Uploading...";

  // Grab input fields
  const name = document.getElementById("name").value.trim();
  const position = document.getElementById("position").value;
  const type = document.getElementById("type").value;
  const difficulty = document.getElementById("difficulty").value;
  const fileInput = document.getElementById("video");
  const file = fileInput.files[0];

  // Validate inputs
  if (!name || !position || !type || !difficulty) {
    status.innerText = "Please fill in all fields.";
    return;
  }
  if (!file) {
    status.innerText = "Please select a video file.";
    return;
  }

  try {
    // Sanitize filename
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from("videos")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      status.innerText = "Video upload failed: " + uploadError.message;
      return;
    }

    // Generate public URL for the uploaded video
    const { data: publicData, error: urlError } = await supabaseClient
      .storage
      .from("videos")
      .getPublicUrl(fileName);

    if (urlError) {
      console.error("Public URL error:", urlError);
      status.innerText = "Failed to get public URL: " + urlError.message;
      return;
    }

    const videoUrl = publicData.publicUrl;

    // Insert new move into Supabase database
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
      console.error("Database insert error:", dbError);
      status.innerText = "Database insert failed: " + dbError.message;
      return;
    }

    // Success
    status.innerText = "Upload complete!";
    console.log("Move uploaded successfully:", name, videoUrl);

    // Clear form
    document.getElementById("name").value = "";
    fileInput.value = "";

  } catch (err) {
    console.error("Unexpected error:", err);
    status.innerText = "Unexpected error: " + err.message;
  }
}

// Attach upload function to your button
document.getElementById("uploadBtn").addEventListener("click", uploadMove);

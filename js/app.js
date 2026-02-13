async function loadMoves() {

  let query = supabaseClient
    .from("moves")
    .select("*")
    .order("created_at", { ascending: false });

  const position = document.getElementById("filterPosition").value;
  const type = document.getElementById("filterType").value;
  const difficulty = document.getElementById("filterDifficulty").value;

  if (position)
    query = query.eq("position", position);

  if (type)
    query = query.eq("type", type);

  if (difficulty)
    query = query.eq("difficulty", difficulty);

  const { data, error } = await query;

  if (error) {
    alert(error.message);
    return;
  }

  const container = document.getElementById("movesContainer");
  container.innerHTML = "";

  data.forEach(move => {

    const div = document.createElement("div");
    div.className = "move";

    div.innerHTML = `
      <h3>${move.name}</h3>
      <p>
        Position: ${move.position}<br>
        Type: ${move.type}<br>
        Difficulty: ${move.difficulty}
      </p>
      <video controls src="${move.video_url}"></video>
    `;

    container.appendChild(div);

  });
}

loadMoves();

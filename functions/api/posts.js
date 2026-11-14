export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM posts ORDER BY id DESC"
    ).all();
    return Response.json(results);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { type, title, content, author } = body;

    if (!type || !title || !content || !author) {
      return Response.json({ error: "すべての項目を入力してください" }, { status: 400 });
    }

    await context.env.DB.prepare(
      "INSERT INTO posts (type, title, content, author) VALUES (?, ?, ?, ?)"
    ).bind(type, title, content, author).run();

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

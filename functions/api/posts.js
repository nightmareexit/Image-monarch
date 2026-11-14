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
    // 送られてきた生データをそのままテキストとして取得
    const rawText = await context.request.text();
    let body;
    
    try {
      body = JSON.parse(rawText);
    } catch (e) {
      // 失敗した理由と、実際に何が送られてきたかを返す
      return Response.json({ 
        error: "Invalid request body", 
        receivedText: rawText 
      }, { status: 400 });
    }

    const { type, title, content, author } = body || {};

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

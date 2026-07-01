import { useState } from "react";

export default function StaffPage({ data, setData }) {
  const [text, setText] = useState((data.staff || []).join("\n"));
  return (
    <section className="page">
      <h2>スタッフ管理</h2>
      <div className="panel">
        <p>1行に1名ずつ入力してください。全端末に同期されます。</p>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={() => setData({ ...data, staff: text.split("\n").map((v) => v.trim()).filter(Boolean) })}>保存</button>
      </div>
    </section>
  );
}

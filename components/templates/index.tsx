import Template from "./template";

function Templates({ templates }) {
  if (templates) {
    return (
      <div>
        {templates.map((e) => (
          <div key={e.id} className="py-2">
            <Template id={e.id} name={e.name} html={e.html} />
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
}

export default Templates;

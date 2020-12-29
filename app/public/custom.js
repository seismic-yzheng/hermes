const React = window.unlayer.React

// Custom Property Editor

const MyColorPicker = (props) => {
  const { label, value, updateValue, data } = props;

  return (
    <div>
      <div>My React Color Picker</div>
      <input class="color-value" defaultValue={value} onChange={e => updateValue(e.target.value)} />
      <button class="red" onClick={() => updateValue("#f00")}>Red</button>
      <button class="green" onClick={() => updateValue("#0f0")}>Green</button>
      <button class="blue" onClick={() => updateValue("#00f")}>Blue</button>
    </div>
  );
}

unlayer.registerPropertyEditor({
  name: 'my_color_picker',
  Widget: MyColorPicker,
});

// Custom Tool

const Viewer = () => {
  return <div>I am a custom tool.</div>
}

unlayer.registerTool({
  name: 'my_tool',
  label: 'My Tool',
  icon: 'fa-smile',
  supportedDisplayModes: ['web', 'email'],
  options: {
    default: {
      title: null,
    },
    text: {
      title: "Text",
      position: 1,
      options: {
        "textColor": {
          "label": "Color",
          "defaultValue": "#ff0000",
          "widget": "my_color_picker" // React custom property editor
        }
      },
    }
  },
  values: {},
  renderer: {
    Viewer: Viewer, // React custom tool
    exporters: {
      web: function(values) {
        return `<div style="color: ${values.textColor};">I am a custom tool.</div>`
      },
      email: function(values) {
        return `<div style="color: ${values.textColor};">I am a custom tool.</div>`
      }
    },
    head: {
      css: function(values) {},
      js: function(values) {}
    }
  }
});

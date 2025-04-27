import Editor from '@monaco-editor/react';

export default function MonacoJsonEditor({
  value,
  onChange,
  height = '200px',
  readOnly = false
}) {
  return (
    <Editor
      height={height}
      defaultLanguage="json"
      value={value}
      theme="vs-dark"
      options={{
        readOnly,
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        wordWrap: 'on',
        tabSize: 2,
        padding: { top: 16 }
      }}
      onChange={(val) => onChange?.(val || '')}
    />
  );
}
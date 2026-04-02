"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";

type CodeEditorProps = {
    onRun: (code: string) => void;
};

export default function CodeEditor({ onRun }: CodeEditorProps) {
    const [code, setCode] = useState<string>("// escribe tu código");

    return (
        <div>
            <Editor
                height="400px"
                defaultLanguage="javascript"
                value={code}
                onChange={(val) => setCode(val || "")}
            />

            <button onClick={() => onRun(code)}>
                Ejecutar
            </button>
        </div>
    );
}
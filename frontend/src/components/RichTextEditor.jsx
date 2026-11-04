"use client";

import React, { useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Minus,
  RotateCcw,
} from "lucide-react";

export default function RichTextEditor({ value, onChange, placeholder = "Enter your detailed curriculum, module syllabus, or institutional description here..." }) {
  const editorRef = useRef(null);

  // Sync internal innerHTML when external value changes and not focused
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const executeCommand = (command, commandValue = null) => {
    document.execCommand(command, false, commandValue);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="flex flex-col border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:border-[#FF4667] focus-within:ring-2 focus-within:ring-rose-100 transition-all">
      {/* CKEditor-style Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 select-none">
        {/* Headings */}
        <div className="flex items-center space-x-1 border-r border-slate-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<h1>")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<h2>")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<h3>")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Text Styling */}
        <div className="flex items-center space-x-1 border-r border-slate-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => executeCommand("bold")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("italic")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("underline")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("strikeThrough")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center space-x-1 border-r border-slate-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => executeCommand("insertUnorderedList")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Bulleted List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertOrderedList")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<blockquote>")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center space-x-1 border-r border-slate-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => executeCommand("justifyLeft")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyCenter")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyRight")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Formatting Extras */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<pre>")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertHorizontalRule")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Horizontal Divider"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("removeFormat")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors text-xs"
            title="Clear Formatting"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editable Canvas */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[320px] max-h-[500px] overflow-y-auto p-4 focus:outline-none prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed"
        data-placeholder={placeholder}
      />
    </div>
  );
}

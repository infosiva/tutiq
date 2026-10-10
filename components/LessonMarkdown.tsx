'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Real markdown (tables, headings, lists, bold) with AA-contrast ink on the light theme.
export default function LessonMarkdown({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: p => <h2 className="text-2xl font-extrabold text-slate-900 mt-5 mb-2" {...p} />,
        h2: p => <h3 className="text-xl font-bold text-slate-900 mt-5 mb-2" {...p} />,
        h3: p => <h4 className="text-lg font-bold text-sky-800 mt-4 mb-1" {...p} />,
        p: p => <p className="text-slate-800 leading-relaxed my-2" {...p} />,
        strong: p => <strong className="font-bold text-slate-900" {...p} />,
        ul: p => <ul className="list-disc pl-5 my-2 space-y-1 text-slate-800" {...p} />,
        ol: p => <ol className="list-decimal pl-5 my-2 space-y-1 text-slate-800" {...p} />,
        code: p => <code className="rounded bg-sky-100 px-1.5 py-0.5 text-sky-900 text-[0.95em]" {...p} />,
        blockquote: p => <blockquote className="my-3 rounded-xl bg-amber-50 border border-amber-300 px-4 py-2 text-slate-800" {...p} />,
        table: p => <div className="my-3 overflow-x-auto rounded-xl border border-slate-300 bg-white"><table className="w-full text-sm text-slate-800" {...p} /></div>,
        th: p => <th className="bg-sky-100 px-3 py-2 text-left font-bold text-slate-900 border-b border-slate-300" {...p} />,
        td: p => <td className="px-3 py-2 border-b border-slate-200 align-top" {...p} />,
      }}
    >
      {text}
    </ReactMarkdown>
  )
}

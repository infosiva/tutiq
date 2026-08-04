const TOOLS = [
  { name: "Kwizzo",       url: "https://kwizzo.app",        desc: "Family quiz game" },
  { name: "Tutiq",        url: "https://tutiq.app",         desc: "AI personal tutor" },
  { name: "QuizBites",    url: "https://quizbites.app",     desc: "Live classroom quiz" },
  { name: "ResumeVault",  url: "https://resumevault.app",   desc: "AI resume builder" },
  { name: "WanderAI",     url: "https://ai-travel-planner-vert.vercel.app", desc: "AI travel planner" },
  { name: "WealthPilot",  url: "https://ai-investment-tracker-delta.vercel.app", desc: "Investment tracker" },
  { name: "SpeakFast",    url: "https://language-learning-bot-blue.vercel.app", desc: "Language learning" },
  { name: "ComplyScan",   url: "https://complybuddy-y3lj4k0nv-infosivas-projects.vercel.app", desc: "Compliance scanner" },
];

export default function FooterExtras() {
  return (
    <div className="border-t border-black/[0.06] pt-8 mt-2">
      {/* More AI Tools */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-4">More AI Tools</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {TOOLS.map((t) => (
            <a
              key={t.name}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 text-sm transition-colors"
              title={t.desc}
            >
              {t.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

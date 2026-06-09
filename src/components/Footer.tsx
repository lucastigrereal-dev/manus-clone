import React from "react";

const footerColumns = [
  {
    title: "Product",
    links: ["Pricing", "Docs", "API", "Team plan"],
  },
  {
    title: "Resources",
    links: ["Docs", "API", "Tutorials", "Changelog"],
  },
  {
    title: "Community",
    links: ["Discord", "Forum", "Events"],
  },
  {
    title: "Compare",
    links: ["vs ChatGPT", "vs Claude", "vs Gemini"],
  },
  {
    title: "Download",
    links: ["Desktop app", "Mobile app"],
  },
  {
    title: "Business",
    links: ["Enterprise", "Partners"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Contact"],
  },
];

export default function Footer() {
  return (
    <footer className="w-full self-stretch" style={{ backgroundColor: "var(--Button-black)" }}>
      <div
        className="mx-auto px-6 py-[100px]"
        style={{ maxWidth: "1080px" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-7 gap-6">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold" style={{ color: "var(--text-white)" }}>
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[14px] transition-colors hover:text-white"
                      style={{ color: "var(--text-white-tsp)" }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="h-px w-full mt-12 mb-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            {/* LinkedIn */}
            <a href="#" className="transition-colors hover:text-white" style={{ color: "var(--text-white-tsp)" }} aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-3.328-3.981-3.079-3.981 0v5.569h-3.555V9.756h3.414v1.463h.047a3.774 3.774 0 013.396-1.863c3.651 0 4.322 2.402 4.322 5.525v5.571zM5.694 8.32a2.063 2.063 0 110-4.126 2.063 2.063 0 010 4.126zm1.777 12.132H3.917V9.756h3.554v10.696zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .773 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            {/* X */}
            <a href="#" className="transition-colors hover:text-white" style={{ color: "var(--text-white-tsp)" }} aria-label="X">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" className="transition-colors hover:text-white" style={{ color: "var(--text-white-tsp)" }} aria-label="YouTube">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a2.996 2.996 0 00-2.103-2.109C19.516 3.5 12 3.5 12 3.5s-7.516 0-9.395.577a2.996 2.996 0 00-2.103 2.109C0 8.07 0 12 0 12s0 3.93.502 5.814a2.996 2.996 0 002.103 2.109c1.879.577 9.395.577 9.395.577s7.516 0 9.395-.577a2.996 2.996 0 002.103-2.109C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="transition-colors hover:text-white" style={{ color: "var(--text-white-tsp)" }} aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            {/* TikTok */}
            <a href="#" className="transition-colors hover:text-white" style={{ color: "var(--text-white-tsp)" }} aria-label="TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.8-.1 3.354.896 4.04 2.53.214.574.314 1.2.314 1.82v8.68c0 .36-.04.72-.12 1.06-.36 1.48-1.56 2.54-3.08 2.6-1.72.06-3.18-1.28-3.24-3-.04-1.62 1.22-3 2.84-3.06.36-.02.7.02 1.02.1V7.06c-.32-.08-.66-.12-1-.12-3.58 0-6.5 2.92-6.5 6.5s2.92 6.5 6.5 6.5c3.58 0 6.5-2.92 6.5-6.5V6.36c1.06.72 2.32 1.14 3.68 1.14V4.26c-1.54 0-2.92-.66-3.88-1.7-.8-.88-1.28-2.02-1.34-3.26-.02-.26-.02-.52-.02-.78v-.02z" />
              </svg>
            </a>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-[14px] transition-colors hover:text-white" style={{ color: "var(--text-white-tsp)" }}>English</button>
            <span className="text-[14px]" style={{ color: "var(--text-white-tsp)" }}>© 2026 Meta</span>
            <span className="text-[14px] hidden sm:inline" style={{ color: "var(--text-white-tsp)" }}>Manus: Hands On AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

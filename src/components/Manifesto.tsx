import React from "react";

export default function Manifesto() {
  return (
    <section
      className="w-full py-[100px] md:py-[140px]"
      style={{ backgroundColor: "var(--Button-black)" }}
    >
      <div
        className="mx-auto px-6 text-center"
        style={{ maxWidth: "1080px" }}
      >
        <h2
          className="font-serif italic"
          style={{
            color: "var(--text-white)",
            fontSize: "2.25rem",
            lineHeight: "44px",
          }}
        >
          Less structure,
          <br />
          more intelligence.
        </h2>
      </div>
    </section>
  );
}

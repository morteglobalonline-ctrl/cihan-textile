/**
 * A fabric bolt seen side-on — a horizontal cylinder, drawn entirely in CSS so
 * there is no extra image request and it tints with the palette.
 *
 * Three stacked layers make it read as a roll rather than a bar:
 *   1. a vertical gradient for cylinder shading (dark rim, bright centre),
 *   2. fine horizontal rules for the wound layers of cloth,
 *   3. a soft contact shadow underneath.
 *
 * `Hero` animates it: layer 2's background position scrolls at the same rate as
 * the roll travels, which is what sells the rotation.
 *
 * Purely decorative — `Hero` renders it aria-hidden.
 */
export default function Bolt() {
  return (
    <div className="relative h-full w-full">
      {/* Contact shadow — grows on impact, then trails the roll. */}
      <div
        data-bolt-shadow
        className="absolute inset-x-2 top-full h-8 origin-top"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(26,24,20,0.34), rgba(26,24,20,0) 72%)",
        }}
      />

      <div className="absolute inset-0 overflow-hidden rounded-[3px]">
        {/* Cylinder shading */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #6d6558 0%, #a49b8c 9%, #ded7c9 26%, #ffffff 45%, #f6f1e8 58%, #cdc5b6 78%, #8b8272 92%, #5f5749 100%)",
          }}
        />
        {/* Wound layers of cloth */}
        <div
          data-bolt-layers
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, rgba(74,69,60,0.55) 0 1px, rgba(74,69,60,0) 1px 5px)",
            backgroundSize: "100% 5px",
          }}
        />
        {/* Specular band, keeps the tube from looking flat */}
        <div
          className="absolute inset-x-0 top-[38%] h-[10%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>

      {/* End caps — the visible ellipse of the tube at each end. */}
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          className="absolute top-0 h-full w-3"
          style={{
            [side]: 0,
            borderRadius: "50%",
            background:
              "linear-gradient(180deg, #4f4840 0%, #8d8474 40%, #b9b0a0 60%, #4f4840 100%)",
          }}
        />
      ))}
    </div>
  );
}

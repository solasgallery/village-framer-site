/**
 * Per-page search description and shop photograph for the regional pages.
 * Descriptions are drawn from Edna's page copy (no new claims). Photos are real shop
 * photography already on the site; none shows the town itself.
 */
export type AreaMeta = { description: string; photo: string; alt: string; wide?: boolean };

export const hubMeta: AreaMeta = {
  description:
    "Salado sits on I-35 between Waco and Austin. For thirty years Central Texas families have made the drive to frame with us. Find your town and plan your visit.",
  photo: "village-framer-entrance",
  alt: "The entrance to Salado Village Framer, with the shop sign above the door",
  wide: true,
};

export const areaMeta: Record<string, AreaMeta> = {
  "custom-framing-temple-tx": {
    description:
      "Custom framing for Temple, twenty minutes up I-35 in Salado. Sit with us, handle real moulding samples, and have your piece framed by hand in our own shop.",
    photo: "small-artwork-consultation",
    alt: "Two framers holding a small framed drawing at the shop worktable",
    wide: true,
  },
  "custom-framing-belton-tx": {
    description:
      "Belton's framer is twelve minutes up I-35 in Salado. Diplomas, family portraits, shadow boxes and old frames worth restoring, all framed by hand in our shop.",
    photo: "historic-photo-framed",
    alt: "An old photograph of a woman in a field, framed in an arched wood frame",
  },
  "custom-framing-waco-tx": {
    description:
      "Waco-area households drive to Salado for framing done in one shop, start to finish: Baylor diplomas, art for historic homes, quilts, flags and oversized work.",
    photo: "large-framed-textile",
    alt: "Two framers holding up a large framed textile in the shop",
  },
  "custom-framing-killeen-tx": {
    description:
      "Shadow boxes for flags, medals and unit photographs, and retirement pieces built to be handed down. Framing for Killeen families, a half hour away in Salado.",
    photo: "memorabilia-display",
    alt: "A framer with framed keepsakes and clippings in front of the moulding wall",
    wide: true,
  },
  "custom-framing-harker-heights-tx": {
    description:
      "New houses have empty walls. Harker Heights families come to Salado for large statement pieces, family photo series and keepsakes, framed by hand in our shop.",
    photo: "gallery-wall",
    alt: "A grouping of six framed pieces hung together on a wall",
    wide: true,
  },
  "custom-framing-copperas-cove-tx": {
    description:
      "Flag cases, medal displays, diplomas and family photographs, framed by hand in Salado, about forty-five minutes east of Copperas Cove. Start with a photo.",
    photo: "hero-hands-at-work",
    alt: "Two framers working together over artwork and matting at the workbench",
    wide: true,
  },
  "custom-framing-gatesville-tx": {
    description:
      "Western art, ranch photographs and rodeo keepsakes from Gatesville, framed by hand in Salado with wide wood mouldings chosen from real samples in the shop.",
    photo: "moulding-wall",
    alt: "A framer holding framed pieces beside the wall of moulding samples",
  },
  "custom-framing-georgetown-tx": {
    description:
      "Georgetown, your framer is twenty-five minutes north in Salado. Collected art, needlework, textiles and family photographs, framed properly in our own shop.",
    photo: "textile-frame-detail",
    alt: "Close-up of a woven piece framed over a dark mat in a patterned wood frame",
  },
  "custom-framing-round-rock-tx": {
    description:
      "Round Rock, forty minutes up I-35 there is a framer who works by hand: jerseys, sports pieces, tall-wall art and matching sets, framed in our Salado shop.",
    photo: "careful-detail-work",
    alt: "A framer in gloves working carefully on a piece at the light table",
  },
  "custom-framing-cedar-park-tx": {
    description:
      "Cedar Park, Leander and Pflugerville families drive to Salado for framing done by a person, in a shop, with the piece in front of them. Start with a photo.",
    photo: "colorful-artwork",
    alt: "A colorful framed artwork with a wide mat hanging on a wall",
  },
  "custom-framing-austin-tx": {
    description:
      "Austin, you have a framer an hour up I-35 in Salado. Festival pieces, gallery buys, photography and inherited art, framed by hand and kept in our own shop.",
    photo: "graphic-artwork",
    alt: "A bold black-and-white print framed in a narrow black frame",
  },
  "custom-framing-dallas-tx": {
    description:
      "For Dallas families with history in this shop: portraits, inherited pieces and art for second homes, framed by hand in Salado. Start with a photo and a note.",
    photo: "portrait-process-03",
    alt: "Two framers with a large framed portrait at the shop worktable",
    wide: true,
  },
  "custom-framing-fort-worth-tx": {
    description:
      "Western art, ranch and rodeo pieces and old family photographs from Fort Worth, framed by hand in our Salado shop with conservation care and real wood samples.",
    photo: "historic-photo-fitting",
    alt: "A framer fitting an old photograph into an arched wood frame",
  },
  "custom-framing-houston-tx": {
    description:
      "Houston is three hours away, and Houston households still keep us as their framer. Portraits, inherited art and oversized work, framed by hand in Salado.",
    photo: "finished-piece-at-table",
    alt: "Two framers carrying a finished framed piece across the shop",
    wide: true,
  },
  "custom-framing-san-antonio-tx": {
    description:
      "San Antonio families have framed with us for years: service pieces, flags, family photographs and religious art, framed by hand in our Salado shop on I-35.",
    photo: "design-table-collaboration",
    alt: "Three framers working together at the design table",
    wide: true,
  },
  "custom-framing-college-station-tx": {
    description:
      "Texas A&M diplomas, Corps photographs and Aggie keepsakes, mounted, sealed and framed by hand in our Salado shop. Send a photo for options and a plain price.",
    photo: "document-framing",
    alt: "Two framers holding a framed antique document at the shop worktable",
    wide: true,
  },
};

export type EditorialSection = { heading: string; body: string };
export type EditorialPage = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: EditorialSection[];
  relatedLinks: { label: string; href: string }[];
};

export const business = {
  name: "Salado Village Framer",
  phone: "(254) 613-6123",
  phoneHref: "tel:+12546136123",
  address: "2 Rock Creek Dr, Unit A, Salado, TX 76571",
  hours: "Monday–Saturday, 10am–5pm",
  email: "info@solasgallery.com",
  budget:
    "Custom framing typically starts around $350. Larger pieces can exceed $1,000. Visit our Salado shop to explore options that suit your artwork and budget.",
};
export const regionCities = [
  "Killeen",
  "Waco",
  "Round Rock",
  "Temple",
  "Georgetown",
  "Cedar Park",
  "Leander",
  "Pflugerville",
  "Copperas Cove",
  "Hutto",
  "Harker Heights",
  "Belton",
  "Taylor",
  "Hewitt",
  "Robinson",
  "North Austin",
];
const links = [
  { label: "Explore your framing idea", href: "/studio" },
  { label: "Plan your visit to Salado", href: "/visit" },
  { label: "See our work", href: "/gallery" },
];
export const regionalHub = {
  title: "Your artwork deserves the trip.",
  description:
    "Personal custom framing in Salado for customers across Central Texas.",
  intro:
    "A piece you love deserves more than a quick choice from a screen. At Salado Village Framer, you can work through the colors, materials, and details with people who bring 30 years of experience and an artistic eye to the conversation. Your framing work stays in our Salado shop.",
  body: "We welcome customers from Killeen, Temple, Belton, Georgetown, Round Rock, Waco, and communities throughout Central Texas. Whether you are starting with a small photograph or a piece that needs a much larger frame, you can share a photo before you visit. We will use it to begin a useful conversation about your project, your room, and your budget.",
  locationNote:
    "Our storefront is in Salado. The communities listed here describe the region we welcome customers from; they are not additional shop locations.",
  cities: regionCities,
};
export const cityPages: EditorialPage[] = [
  {
    slug: "killeen",
    title: "Custom framing for Killeen, made in Salado",
    description:
      "Bring your artwork, photographs, and meaningful pieces to Salado Village Framer for personal design guidance and framing that stays in our shop.",
    intro:
      "Some pieces belong on the wall because of what they mean, as much as how they look. If you are coming from Killeen with a photograph, document, artwork, or collection of keepsakes, we will start by asking what you want the finished piece to say.",
    sections: [
      {
        heading: "Make room for the whole story",
        body: "A group of objects or photographs needs a different conversation from a single print. Bring the pieces together, or send a photo of the collection first. We can discuss which elements should lead, how much space each needs, and whether one presentation or several separate frames feels right. We will assess the actual materials in person before settling on the construction.",
      },
      {
        heading: "Personal guidance, from first idea to finished frame",
        body: "Cherie and Tim bring 30 years of experience to the work. You can compare real moulding and mat samples in the shop, see colors beside your piece, and explain the details that matter to you. Your framing work stays here in Salado, with the people you meet.",
      },
      {
        heading: "Start before you make the trip",
        body: "Use our studio preview to explore a direction, then send it with approximate dimensions and a short description. Mention whether you have the original, a print, or a three-dimensional object. The preview is a conversation starter; we will confirm materials, fit, and the final design together in the shop.",
      },
      {
        heading: "Visit our Salado storefront",
        body: "Find us at 2 Rock Creek Dr, Unit A, Salado, TX 76571, Monday–Saturday, 10am–5pm. Custom framing typically starts around $350; larger pieces can exceed $1,000. Call (254) 613-6123 if you would like to discuss what to bring.",
      },
    ],
    relatedLinks: links,
  },
  {
    slug: "temple",
    title: "Thoughtful custom framing for Temple",
    description:
      "Explore artwork, photograph, and oversized framing with Salado Village Framer. Visit our Salado shop for real samples and personal design advice.",
    intro:
      "The right frame can make a familiar piece feel completely at home. For customers visiting from Temple, our Salado shop offers space to compare options, consider the room, and choose a design with an experienced framer beside you.",
    sections: [
      {
        heading: "Begin with the artwork and the place it will live",
        body: "Bring a photo of the wall as well as the piece itself. A close-up of nearby finishes or a fabric swatch can help, but there is no need to bring a complete design plan. We will consider the artwork first, then work through the balance between the frame, mat, furniture, and surrounding space.",
      },
      {
        heading: "Small details change the result",
        body: "Two pale mats can look very different against the same paper. A narrow dark frame can give a piece definition, while a broader profile can create a more substantial presence. Comparing actual samples makes these decisions easier than choosing from product thumbnails. We draw on multiple suppliers to explore a direction that fits your piece.",
      },
      {
        heading: "Larger work is welcome",
        body: "If your piece is awkward to transport or unusually large, send us its dimensions and a photo before loading it into the car. Let us know its depth and current condition, including whether it is already framed. We can discuss the next step before you travel; the final plan depends on seeing the work and understanding its construction.",
      },
      {
        heading: "Make a useful first visit",
        body: "Our shop is at 2 Rock Creek Dr, Unit A, Salado, TX 76571. We are open Monday–Saturday, 10am–5pm. Bring approximate dimensions, a room photo if helpful, and a comfortable budget. Framing typically starts around $350, with larger pieces often exceeding $1,000.",
      },
    ],
    relatedLinks: links,
  },
  {
    slug: "georgetown",
    title: "A personal framing destination for Georgetown",
    description:
      "Visit Salado Village Framer for artistic guidance, real frame and mat samples, and custom framing made in our Salado shop.",
    intro:
      "A room can hold pieces from many different chapters: a new painting, an old photograph, a print you have kept rolled up for years. We help Georgetown customers find a thoughtful way to display each one without making every frame look the same.",
    sections: [
      {
        heading: "Create a conversation between pieces",
        body: "If you are framing several works for one room, bring photos of the group. A shared color, finish, or mat treatment can connect different pieces without requiring identical frames. We can also consider which piece should be the focal point and which ones should have a quieter presentation.",
      },
      {
        heading: "An artistic eye, backed by experience",
        body: "Our approach starts with looking closely. What color needs space? Where does the artwork end visually? Would a mat help, or would it interrupt the piece? With 30 years of experience, Cherie and Tim can help you compare possibilities and understand the effect of each decision. Your work stays in our Salado shop.",
      },
      {
        heading: "Use a preview to discover what you like",
        body: "An uploaded photo can help you explore contrasts and proportions before visiting. Save a direction you like and tell us what appeals to you. Screen colors and illustrated profiles are only a starting point; the best next step is seeing the actual samples beside your artwork.",
      },
      {
        heading: "Come to Salado with a starting point",
        body: "Visit 2 Rock Creek Dr, Unit A, Salado, TX 76571, Monday–Saturday, 10am–5pm. Custom framing typically starts around $350; larger pieces can exceed $1,000. If you are bringing several pieces, a short note or call to (254) 613-6123 can help begin the conversation.",
      },
    ],
    relatedLinks: links,
  },
  {
    slug: "round-rock",
    title: "Custom framing worth exploring beyond Round Rock",
    description:
      "Bring your artwork and ideas to Salado Village Framer for personal design guidance, larger-piece framing, and an in-shop experience.",
    intro:
      "You do not need to arrive knowing the name of a moulding or the right width of a mat. If you are coming from Round Rock, bring the piece, a few thoughts about where it belongs, and any questions you have. We will help shape the idea with you.",
    sections: [
      {
        heading: "Go beyond the quick online choice",
        body: "A preview is useful for trying a direction. In the shop, you can see the texture of a finish, compare subtle mat colors, and hold a sample against your actual artwork. That conversation is especially useful when the piece has unusual proportions or you like several very different looks.",
      },
      {
        heading: "A plan for the pieces that need more room",
        body: "We welcome larger pieces and the design questions that come with them. Send dimensions and a photograph first if transporting your work takes planning. Its size, weight, materials, and intended display all inform the frame; we will discuss the actual requirements before confirming the project.",
      },
      {
        heading: "Bring the room into the conversation",
        body: "A wall photo, approximate wall measurements, and a note about nearby furnishings can help us understand your goals. You can also bring a picture of an existing frame you like. These references are helpful context, while the artwork remains at the center of the design.",
      },
      {
        heading: "Meet the people doing your framing",
        body: "Cherie and Tim bring 30 years of experience, and your framing work stays in our Salado shop. Find us at 2 Rock Creek Dr, Unit A, Salado, TX 76571, Monday–Saturday, 10am–5pm. Framing typically starts around $350; larger pieces can exceed $1,000.",
      },
    ],
    relatedLinks: links,
  },
  {
    slug: "waco",
    title: "Bring your framing project from Waco to Salado",
    description:
      "Personal custom framing for Waco customers at our Salado storefront, with experienced design guidance and a welcome for larger artwork.",
    intro:
      "When a piece deserves a considered approach, the first step can happen before the drive. Send Salado Village Framer a photo and a few details, and start a conversation about the frame, the setting, and the result you have in mind.",
    sections: [
      {
        heading: "Make the first conversation count",
        body: "Tell us what the piece is, its approximate size, whether it is already framed, and what you would like to change or achieve. Include a close-up if its surface or depth is unusual. This gives us a useful starting point; we will still need to assess the actual piece before confirming a final design and price.",
      },
      {
        heading: "A wider view of the finished piece",
        body: "The frame is part of how you experience the artwork every day. We can discuss a quiet finish that recedes, a stronger profile that gives the piece presence, or matting that adds visual space. With choices from multiple suppliers, the conversation can follow the artwork instead of stopping at a short preset menu.",
      },
      {
        heading: "Care you can see in person",
        body: "Visit the shop, meet Cherie and Tim, and compare materials together. We bring 30 years of experience and an artistic eye to the project, and your framing work stays in Salado. Larger pieces are welcome; call before bringing something that needs special transport planning.",
      },
      {
        heading: "Plan your visit",
        body: "Our only storefront is at 2 Rock Creek Dr, Unit A, Salado, TX 76571, open Monday–Saturday, 10am–5pm. Call (254) 613-6123 with questions before setting out. Custom framing typically starts around $350, and larger pieces can exceed $1,000. A photo and dimensions help us begin discussing your budget.",
      },
    ],
    relatedLinks: links,
  },
];

export const articles: EditorialPage[] = [
  {
    slug: "framing-oversized-art",
    title: "A little planning for a much larger piece",
    description:
      "What to gather before bringing oversized artwork to a framer, from dimensions and room photos to transport questions.",
    intro:
      "A large piece can change the feeling of a room. It also asks different questions of a frame than a small photograph does. At Salado Village Framer, larger work is welcome. A few details shared before your visit can make the conversation more useful—and save you from moving a substantial piece before you know the next step.",
    sections: [
      {
        heading: "Start with the measurements you can safely take",
        body: "Note the approximate height and width, and tell us what you measured: the artwork itself, the outside of an existing frame, or a stretched canvas. Include depth when it matters. If the piece is already framed, you do not need to take it apart for us. A photograph of the front, plus a view of the side or back where safely accessible, can explain a great deal. Tell us if it is especially heavy, fragile, or difficult to move. Approximate measurements are enough to begin a conversation; we will confirm what the job needs in person.",
      },
      {
        heading: "Show us where it will live",
        body: "Take a photograph of the wall from far enough back to include nearby furniture and doorways. Note the approximate available wall space. This is useful for thinking about the finished proportions: a mat and frame can add a noticeable amount to the overall dimensions. If the piece will hang above furniture, include that furniture in the photo. We are looking for context, not a perfectly styled room. A simple phone picture is often the best starting point.",
      },
      {
        heading: "Think about presence, not just frame width",
        body: "Large artwork does not automatically need the widest-looking frame. The visual choice depends on the piece, while the construction needs to suit its size, weight, and materials. A restrained profile might be the right look, but we need to discuss how that look can be achieved appropriately. Matting, glazing where appropriate, and the depth of the assembly can all affect the finished piece. Real samples help you see whether the design gives the artwork enough space or starts to compete with it.",
      },
      {
        heading: "Talk transport before loading the car",
        body: "Call or send a message before transporting an unusually large piece. Share its dimensions and explain whether it is loose, stretched, mounted, or already framed. Avoid unframing or rolling it just to make it fit. We can talk through the situation and what to bring before your visit. The completed frame may be larger than what you started with, so pickup planning belongs in the conversation too. If you are also thinking about installation, mention it while we are discussing the project.",
      },
      {
        heading: "Keep the first budget conversation simple",
        body: "Custom framing typically starts around $350, and larger pieces can exceed $1,000. Size is one factor; materials and the needs of the individual piece matter too. Tell us a budget you are comfortable discussing so we can make the sample selection useful. You do not need to know every specification before you arrive. Bring the artwork when practical, your room photo, and your goals. We will work through the possibilities together in our Salado shop, where the framing work stays.",
      },
    ],
    relatedLinks: [
      { label: "Start with a photo", href: "/studio" },
      { label: "Talk about your project", href: "/visit" },
      { label: "Explore framing services", href: "/services" },
    ],
  },
  {
    slug: "choosing-a-frame-and-mat",
    title: "Find a frame direction before you visit",
    description:
      "Simple ways to explore frame and mat choices at home, while leaving the final material decisions for an in-person consultation.",
    intro:
      "You do not have to choose a finished framing design at home. It is enough to notice what you like, try a few possibilities, and arrive with a direction. A photo of your artwork and a little time looking at its intended room can give your consultation a useful head start.",
    sections: [
      {
        heading: "Begin by looking at the artwork",
        body: "Before matching the sofa or wall paint, spend a moment with the piece itself. Notice its lightest and darkest areas, the colors that repeat, and how much visual detail it contains. Ask what you want your eye to meet first. A frame might quietly define the edge, echo a color, or give a spare piece more presence. There is no requirement to pull out the brightest color or repeat every detail. Often, a choice feels right because it gives the work room to be seen.",
      },
      {
        heading: "Try a few clearly different directions",
        body: "Upload a straight-on photo to the studio preview and compare a small number of options. Try a light finish, a dark one, and a warmer wood direction. Notice which makes the artwork easier to look at. Then compare a mat with a little more visual space against a narrower treatment. Change one thing at a time so you can tell what made the difference. You are collecting preferences, not passing a design test. If two approaches appeal to you for different reasons, save both for the conversation.",
      },
      {
        heading: "Let the room provide context",
        body: "Take a photo of the intended wall that includes nearby furnishings. You might want the new piece to connect with existing frames, or you might want it to stand on its own. Either is a useful goal to share. Note approximate wall space, particularly if the piece will sit between windows or above a cabinet. Remember that the finished frame extends beyond the artwork. A room photograph helps explain the setting; precise placement and scale still depend on actual measurements.",
      },
      {
        heading: "Treat the screen as a sketch",
        body: "Digital previews are useful for comparing general colors and proportions, but they cannot show every finish, texture, or subtle variation in a mat. Your artwork photo and screen settings influence the result too. A pale mat that looks neutral on your phone can appear warmer beside the actual paper. That is why we make final choices with physical samples in the shop. If you are interested in a fillet—the narrow decorative detail sometimes used inside a frame or mat—mention it so we can explore whether it suits the design.",
      },
      {
        heading: "Bring questions, not a finished specification",
        body: "Send your preferred preview with approximate dimensions and a few words about what you like. Bring the artwork, a room photo, and any helpful reference when you visit. Cherie and Tim bring 30 years of experience to the conversation, and your framing work stays in our Salado shop. Custom framing typically starts around $350; larger pieces can exceed $1,000. We will help you work from an idea toward a design that feels right for the piece and a budget you are comfortable with.",
      },
    ],
    relatedLinks: [
      { label: "Explore a framing direction", href: "/studio" },
      { label: "See finished projects", href: "/gallery" },
      { label: "Visit the shop", href: "/visit" },
    ],
  },
];

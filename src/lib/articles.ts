export type Block = { h: string; p: string[]; list?: string[] };
export type Article = {
  kind: "service" | "guide";
  slug: string;
  path: string;
  title: string; // <title>, 50-60 chars
  description: string; // 150-160 chars
  h1: string;
  intro: string;
  image: string; // /images/selected/<name>.webp
  imageAlt: string;
  blocks: Block[];
  related: string[]; // paths
  published: string;
};

const PUB = "2026-11-21";

export const services: Article[] = [
  {
    kind: "service",
    slug: "shadow-box-framing",
    path: "/services/shadow-box-framing",
    title: "Shadow Box Framing in Salado, TX | Salado Village Framer",
    description:
      "Shadow box framing in Salado for jerseys, medals, textiles and keepsakes. Objects are held safely and shown with depth. Start with a photo for a ballpark.",
    h1: "Shadow box framing, built around your objects.",
    intro:
      "A shadow box is a frame with real depth, so a three-dimensional piece can sit behind glass without being crushed or glued down. The design question is always the same: what is in it, how heavy is it, and how should it be held?",
    image: "memorabilia-display",
    imageAlt: "Memorabilia displayed in a deep shadow box frame",
    blocks: [
      {
        h: "What goes in a shadow box",
        p: [
          "Jerseys and uniforms, medals and pins, baby clothes, a christening gown, a ticket stub collection, a favorite cap, a handful of coins. If it is small enough to hang and means something to you, it can be framed.",
        ],
      },
      {
        h: "How objects are held",
        p: [
          "The safest mounts are the ones you can undo. Light items are sewn or pinned to a fabric-covered board. Heavier pieces are held with brackets, or with clear supports shaped to the object. We avoid gluing anything that might need to come out again, because glue is rarely reversible and can stain what it touches.",
          "Textiles such as a jersey are usually stitched to a padded board so the weight is spread across many points rather than hanging from a few.",
        ],
      },
      {
        h: "Depth, glass and what sits behind it",
        p: [
          "The depth of the box should come from the tallest object, with a little extra so nothing touches the glass. Contact with glass traps moisture and can mark an object over time. Glazing that filters ultraviolet light slows fading in fabric, photographs and printed paper, which matters most for anything hung in a bright Texas room.",
          "The backing fabric is chosen to flatter the objects, not to match the sofa. Dark, quiet colors let medals and metal catch the eye; lighter linens suit christening gowns and baby clothes.",
        ],
      },
      {
        h: "Bring what you have",
        p: [
          "You do not need to arrive with a finished layout. Bring the objects, or start with photos and the thickness of the biggest one. Measure the piece's width, height and depth in inches and tell us what you measured. We will confirm everything in the shop before any work begins.",
        ],
      },
    ],
    related: ["/services/memorial-framing", "/guides/how-to-measure-for-framing", "/guides/how-much-does-custom-framing-cost"],
    published: PUB,
  },
  {
    kind: "service",
    slug: "oversized-framing",
    path: "/services/oversized-framing",
    title: "Oversized Art Framing in Salado, TX | Village Framer",
    description:
      "Oversized art framing in Salado, Texas. Strong joinery, lighter glazing and safe hanging for big canvases, prints and textiles. Start with a photo and size.",
    h1: "Oversized framing, planned before it is cut.",
    intro:
      "Large work asks different questions than a small photograph. The frame has to be strong enough to stay square, the glazing has to be safe to handle, and the piece has to get from our bench to your wall without a mishap.",
    image: "large-framed-textile",
    imageAlt: "A large framed textile with a wide mat",
    blocks: [
      {
        h: "Why big pieces are different",
        p: [
          "Weight grows faster than size. Doubling the width and height of a piece roughly quadruples the glass over it. A long rail of moulding also flexes more than a short one, so large frames need stronger corner joins and sometimes internal bracing to stay square for decades.",
        ],
      },
      {
        h: "Glazing for large frames",
        p: [
          "Glass is heavy and unforgiving at size. For many large pieces acrylic glazing is the better answer: it weighs much less, and if it is ever struck it does not shatter into sharp pieces. Acrylic attracts dust and scratches more easily, so it needs gentle cleaning. We talk through the trade-offs for the piece in front of us.",
          "Standard mat board is sold in sheets of about 32 by 40 or 40 by 60 inches. Pieces larger than that need a planned approach to the mat, which is one reason to start the conversation early.",
        ],
      },
      {
        h: "Hanging it safely",
        p: [
          "A wire and a nail will not do for a big frame. Heavy pieces hang best on a French cleat, two interlocking strips that spread the weight along the width of the frame and into wall studs or proper anchors. Tell us roughly where it will hang and whether the wall is drywall, plaster or masonry.",
        ],
      },
      {
        h: "Getting it here",
        p: [
          "Please do not take a large piece out of its current frame or roll it just to fit your car. Send the measurements and a photo first. Tell us whether it is loose, stretched, mounted or already framed. Then we can say what to bring and how.",
        ],
      },
    ],
    related: ["/services/mirror-framing", "/guides/how-to-measure-for-framing", "/guides/how-much-does-custom-framing-cost"],
    published: PUB,
  },
  {
    kind: "service",
    slug: "conservation-framing",
    path: "/services/conservation-framing",
    title: "Conservation Framing in Salado, TX | Village Framer",
    description:
      "Conservation framing in Salado, Texas by a certified picture framer. Archival mats, UV-filtering glazing and reversible mounting for art worth keeping.",
    h1: "Conservation framing for pieces you want to keep.",
    intro:
      "Framing can protect a piece or slowly harm it. Conservation framing is the set of choices that favors protection: materials that do not break down, mounting that can be undone, and glazing that slows fading.",
    image: "historic-photo-framed",
    imageAlt: "A framed historic photograph ready for the wall",
    blocks: [
      {
        h: "What conservation framing means",
        p: [
          "It is not one product. It is a list of decisions made together, and each one answers a way that paper, photographs and textiles are damaged over time.",
        ],
        list: [
          "Mats and backing made from cotton or purified fiber board, not ordinary wood-pulp board that turns acidic and browns the art touching it.",
          "Reversible mounting. The piece is held with hinges made from tissue and a starch paste that can be released with moisture, never with pressure-sensitive tape or permanent adhesive.",
          "UV-filtering glazing, because light is one of the main causes of fading and the Texas sun is strong.",
          "A mat or spacer so the art never touches the glass.",
          "A sealed back that keeps out dust and insects.",
        ],
      },
      {
        h: "Dry mounting and valuable pieces",
        p: [
          "Dry mounting bonds a print flat to a board with heat and adhesive. It gives a very flat result and is fine for posters and many modern prints. It cannot be reversed, so it is not what we recommend for an original, an old photograph or anything with value to a collector. If you are unsure, ask before anyone mounts your piece.",
        ],
      },
      {
        h: "Certified, and why it matters here",
        p: [
          "Cherie Flanagan is a certified picture framer. Conservation choices are where that training shows, because most of them are invisible on the wall and only pay off years later.",
        ],
      },
      {
        h: "Not sure whether yours needs it?",
        p: [
          "Family documents, photographs, originals, anything signed or irreplaceable are good candidates. Send a photo through Start framing and say what the piece is. We will tell you what we would do and why.",
        ],
      },
    ],
    related: ["/services/memorial-framing", "/guides/float-mount-vs-mat", "/guides/how-much-does-custom-framing-cost"],
    published: PUB,
  },
  {
    kind: "service",
    slug: "mirror-framing",
    path: "/services/mirror-framing",
    title: "Mirror Framing in Salado, TX | Salado Village Framer",
    description:
      "Mirror framing in Salado, Texas. Custom frames for bathroom, entry and statement mirrors, built for the weight and hung securely. Send a photo to begin.",
    h1: "Framing a mirror, and hanging it so it stays up.",
    intro:
      "A plain mirror in a good frame looks like it was always part of the room. The part nobody sees is the weight, and it is the part we plan first.",
    image: "arched-window-gallery",
    imageAlt: "An arched window and framed pieces in the gallery",
    blocks: [
      {
        h: "Weight is the real question",
        p: [
          "Quarter-inch glass weighs roughly three pounds per square foot. A mirror three feet by five feet is about fifteen square feet, which is around fifty pounds before the frame is added. That is why we decide how it hangs before we choose how it looks.",
        ],
      },
      {
        h: "Bathroom and entry mirrors",
        p: [
          "In a bathroom, moisture reaches the edge of the mirror and the back of the frame. A sealed finish and a frame that holds the glass without trapping water against it help the pair last. For an entry or hall mirror, the frame can carry more of the style, and a mirror hung at eye level reads best when the frame is not much wider than the wall space allows.",
        ],
      },
      {
        h: "What to bring or send",
        p: [
          "The mirror's width and height, its thickness, and what it is attached to now if it is already mounted. If it is a bathroom mirror glued to a wall, tell us before you try to remove it. We can talk through whether to frame it where it is or to start with a new piece.",
        ],
      },
      {
        h: "Hanging",
        p: [
          "Mirrors this size hang best on a French cleat or other rated hardware anchored into studs. We will tell you what hardware the piece needs, and what your wall can take.",
        ],
      },
    ],
    related: ["/services/oversized-framing", "/guides/how-to-measure-for-framing", "/guides/how-much-does-custom-framing-cost"],
    published: PUB,
  },
  {
    kind: "service",
    slug: "memorial-framing",
    path: "/services/memorial-framing",
    title: "Memorial Framing in Salado, TX | Salado Village Framer",
    description:
      "Memorial framing in Salado, Texas. Photographs, programs, flags and keepsakes arranged with care and protected for the long term. Send a photo to begin.",
    h1: "Memorial framing, done with care and without hurry.",
    intro:
      "When you are framing something for someone you have lost, there is no deadline that matters more than getting it right. Bring what you have, and we will help you decide what belongs together.",
    image: "historic-photo-fitting",
    imageAlt: "A historic photograph being fitted into a frame",
    blocks: [
      {
        h: "What people bring",
        p: [
          "A favorite photograph, a service program, a military flag, medals, a letter, a name tag, a handful of small objects. A memorial piece can be a single portrait or a shadow box that tells a life in a few things.",
        ],
      },
      {
        h: "Protecting what cannot be replaced",
        p: [
          "Originals deserve the same protection as any treasured piece: archival materials, hinges that can be undone, and glazing that filters ultraviolet light. Newsprint, programs and some old photographs are acidic and fade fast, so we keep them from touching better paper and we may suggest a copy of the original for display, so the original can be kept safe.",
          "Please do not tape, glue or laminate anything before you come in. Those steps are hard or impossible to reverse.",
        ],
      },
      {
        h: "Arranging a layout",
        p: [
          "Start with the one thing that matters most and build outward. We usually try a few arrangements on a table before any cutting begins, so you can move things until it feels right. Flags and larger objects need a deeper frame; we will tell you how much depth the group needs.",
        ],
      },
      {
        h: "Take the time you need",
        p: [
          "You can start with a photo and a note about what you have, or simply come by. Nothing is ordered until you say so, and we will confirm the design and price with you first.",
        ],
      },
    ],
    related: ["/services/shadow-box-framing", "/services/conservation-framing", "/guides/float-mount-vs-mat"],
    published: PUB,
  },
];

export const guides: Article[] = [
  {
    kind: "guide",
    slug: "how-much-does-custom-framing-cost",
    path: "/guides/how-much-does-custom-framing-cost",
    title: "How Much Does Custom Framing Cost? A Framer's Guide",
    description:
      "What drives the price of custom picture framing: size, moulding, mat, glass and mounting. A Texas framer explains where the money goes and how to plan a budget.",
    h1: "How much does custom framing cost?",
    intro:
      "Most custom framing projects at our shop start around $350, and large pieces run $1,000 and up. Here is what moves the number, so you can decide where to spend and where to save.",
    image: "moulding-wall",
    imageAlt: "Rows of moulding samples on the shop wall",
    blocks: [
      {
        h: "The five things that set the price",
        p: ["A custom frame is built from parts, and each part has its own cost."],
        list: [
          "Size. The bigger the piece, the more moulding, mat board and glass it takes. Cost climbs quickly as pieces get larger.",
          "Moulding. Frame mouldings range from simple and slim to deep, carved and finished by hand. This is usually the biggest single choice.",
          "Mat. A single mat is the baseline. Extra layers, special colors and fabric-wrapped mats cost more, as does a wide border on a big piece.",
          "Glazing. Standard glass is the starting point. Glass or acrylic that filters ultraviolet light, reduces glare or is lighter for large frames costs more, and is often worth it.",
          "Mounting and labor. Hinging, float mounting, shadow boxes and anything with objects take more of the framer's time than a flat print.",
        ],
      },
      {
        h: "Where to spend and where to save",
        p: [
          "Spend on glazing if the piece will hang in sun, and on mounting if it is an original or a photograph you cannot replace. Save by choosing a simpler moulding or a single mat. A good mat and a quiet frame often beat an elaborate one.",
          "Be wary of a price that seems far below others for the same size. It usually means standard glass, a standard mat that will yellow, or permanent mounting.",
        ],
      },
      {
        h: "Large pieces",
        p: [
          "Oversized work adds cost for stronger construction, lighter glazing and safer hanging. That is the reason we say $1,000 and up for big pieces, and why it is worth talking before you commit to a size.",
        ],
      },
      {
        h: "Get a ballpark in two minutes",
        p: [
          "Our Start framing preview shows your own photo in real frames and gives a range for your size, frame and mat. It is a ballpark, not a quote. The exact price comes after we have seen the piece.",
        ],
      },
    ],
    related: ["/guides/how-to-measure-for-framing", "/guides/float-mount-vs-mat", "/services/oversized-framing"],
    published: PUB,
  },
  {
    kind: "guide",
    slug: "how-to-measure-for-framing",
    path: "/guides/how-to-measure-for-framing",
    title: "How to Measure Art for Framing: A Simple Step Guide",
    description:
      "How to measure a print, photo, canvas or object for custom framing: width, height, depth, what to do if it is already framed, and the sizes stores stock.",
    h1: "How to measure your piece for framing.",
    intro:
      "You do not need to be exact. A good measurement in inches gets us started, and we confirm every size in the shop. Here is how to get a useful one in a few minutes.",
    image: "small-artwork-consultation",
    imageAlt: "A small artwork being measured and discussed at the design table",
    blocks: [
      {
        h: "What you need",
        p: ["A hard tape measure or ruler, a flat surface and your phone for a photo. Use inches, since frames and mat board are cut in inches."],
      },
      {
        h: "Step by step",
        p: ["Work in this order every time."],
        list: [
          "Lay the piece flat. Do not measure a rolled print until it has been flattened.",
          "Measure the width, edge to edge, then the height. Write them as width by height.",
          "Round up to the nearest quarter inch.",
          "Measure the art itself, not an old mat or border. We cut the mat opening slightly smaller than the art, usually about a quarter inch of overlap on each side, so the art is held in place.",
          "For canvas, objects or anything with thickness, measure the depth, front to back, at its thickest point.",
        ],
      },
      {
        h: "If it is already framed",
        p: [
          "You do not have to take it apart. Measure the outside of the frame, say that is what you measured, and add a photo of the front and the back. We will work out the art size when we see it.",
        ],
      },
      {
        h: "About standard sizes",
        p: [
          "Store-bought frames come in a handful of sizes such as 8 by 10, 11 by 14, 16 by 20, 18 by 24 and 24 by 36. If your piece is one of those it is easier to buy off the shelf. Custom framing is for everything else, and for pieces you want matted and mounted properly.",
        ],
      },
      {
        h: "Not sure? Send a photo",
        p: [
          "Lay a tape measure along the edge of the piece, take a straight-on photo, and upload it in Start framing. We can usually read the size from it, and we confirm it before any cutting.",
        ],
      },
    ],
    related: ["/guides/how-much-does-custom-framing-cost", "/guides/float-mount-vs-mat", "/services/oversized-framing"],
    published: PUB,
  },
  {
    kind: "guide",
    slug: "float-mount-vs-mat",
    path: "/guides/float-mount-vs-mat",
    title: "Float Mount vs Mat: Which Frame Style Suits Your Art?",
    description:
      "Float mounting or a traditional mat? A certified picture framer explains how each works, what each costs in look and care, and which suits your piece.",
    h1: "Float mount or mat? How to choose.",
    intro:
      "Both are ways to hold art inside a frame. The difference is what you see: a mat covers the edges of the art with a window, while a float lets the edges show.",
    image: "careful-detail-work",
    imageAlt: "Careful hand work on a framing project",
    blocks: [
      {
        h: "What a mat does",
        p: [
          "A mat is a board with a window cut into it that sits over the art. It gives the piece breathing room, keeps the art off the glass, and adds a color or a border. Mats are the classic choice for photographs, prints and drawings.",
        ],
      },
      {
        h: "What a float mount does",
        p: [
          "In a float, the art is attached to a backing board so it appears to hover, with a small gap around it and the whole edge visible. It is how we show a deckled edge, a torn edge, an irregular shape or a piece where the edge is part of the work.",
        ],
      },
      {
        h: "Choosing between them",
        p: ["A few rules of thumb we use at the bench."],
        list: [
          "Photographs and prints with a clean edge: a mat is usually the better fit.",
          "Original work on paper with a deckled or torn edge: float it, so the edge can be seen.",
          "Irregular or hand-cut shapes: float.",
          "Anything you want protected from touching the glass: both can do it; a mat does it automatically and a float needs a spacer.",
          "Tight budget: a single mat is usually the less expensive of the two, because a float takes more labor to build well.",
        ],
      },
      {
        h: "The mat that suits a big piece",
        p: [
          "Mat width should grow with the piece. A wide border gives a large artwork room to breathe and makes a small one feel important. If you are unsure, try both on a photo of your piece in our Start framing preview and see which feels right.",
        ],
      },
      {
        h: "Care",
        p: [
          "Either way, ask for archival materials and glazing that filters ultraviolet light if the piece matters to you. Those choices do more to protect it than the style does.",
        ],
      },
    ],
    related: ["/guides/how-much-does-custom-framing-cost", "/services/conservation-framing", "/guides/how-to-measure-for-framing"],
    published: PUB,
  },
];

export const all = [...services, ...guides];
export const byPath = (p: string) => all.find((a) => a.path === p);

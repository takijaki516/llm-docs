import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

export const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
      HTMLAttributes: {
        class: "heading-node",
      },
    },
    paragraph: {
      HTMLAttributes: {
        class: "text-node",
      },
    },
    dropcursor: false,
  }),
  TextStyle,
  Color,
];

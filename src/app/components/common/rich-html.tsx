"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => undefined;

export default function RichHtml({ content, className = "" }: { content: string; className?: string }) {
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);
  return <div
    className={`${className} space-y-3 leading-7 text-[#3f5e51] [&_a]:font-bold [&_a]:text-[#12613f] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#a9d7a0] [&_blockquote]:pl-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl [&_li]:ml-5 [&_ol]:list-decimal [&_p]:leading-7 [&_ul]:list-disc`}
    dangerouslySetInnerHTML={{ __html: isHydrated ? sanitizeRichHtml(content) : "" }}
  />;
}

function sanitizeRichHtml(content: string): string {
  const document = new DOMParser().parseFromString(content, "text/html");
  document.querySelectorAll("script, style, iframe, object, embed, link, meta, form, input, button, textarea, select, svg, math")
    .forEach((element) => element.remove());
  const allowedTags = new Set(["a", "b", "blockquote", "br", "code", "div", "em", "figcaption", "figure", "h1", "h2", "h3", "h4", "hr", "i", "img", "li", "ol", "p", "pre", "s", "span", "strong", "sub", "sup", "table", "tbody", "td", "th", "thead", "tr", "u", "ul"]);
  Array.from(document.body.querySelectorAll("*")).forEach((element) => {
    const tag = element.tagName.toLowerCase();
    if (!allowedTags.has(tag)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }
    const allowedAttributes = tag === "a"
      ? new Set(["href", "target", "title"])
      : tag === "img"
        ? new Set(["src", "alt", "title", "width", "height"])
        : tag === "td" || tag === "th"
          ? new Set(["colspan", "rowspan", "scope"])
          : new Set<string>();
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      if (!allowedAttributes.has(name)) {
        element.removeAttribute(attribute.name);
        continue;
      }
      if ((name === "href" || name === "src") && !isSafeRichContentUrl(attribute.value)) {
        element.removeAttribute(attribute.name);
      }
    }
    if (tag === "a") element.setAttribute("rel", "noopener noreferrer");
  });
  return document.body.innerHTML;
}

function isSafeRichContentUrl(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized.startsWith("http://")
    || normalized.startsWith("https://")
    || normalized.startsWith("mailto:")
    || normalized.startsWith("tel:")
    || normalized.startsWith("/")
    || normalized.startsWith("#");
}

"use client";

import Image from "next/image";
import parse, {
  HTMLReactParserOptions,
  Element,
  DOMNode,
} from "html-react-parser";

interface BlogContentProps {
  html: string;
  className?: string;
}

/**
 * Renders blog HTML content and replaces <img> tags with Next.js <Image>
 * components for automatic WebP/AVIF serving, lazy loading, and CLS prevention.
 */
export default function BlogContent({ html, className }: BlogContentProps) {
  const options: HTMLReactParserOptions = {
    replace(domNode: DOMNode) {
      if (!(domNode instanceof Element) || domNode.name !== "img") return;

      const { src, alt, width, height, class: cls } = domNode.attribs;
      if (!src) return;

      const w = parseInt(width, 10) || 800;
      const h = parseInt(height, 10) || 600;

      return (
        <Image
          src={src}
          alt={alt || ""}
          width={w}
          height={h}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 768px"
          className={cls || "rounded-xl shadow-xl max-w-full h-auto mx-auto my-4"}
          style={{ aspectRatio: `${w}/${h}`, height: "auto" }}
        />
      );
    },
  };

  return (
    <div className={className}>
      {parse(html, options)}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface TermsOfUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function getTodayUtcKey(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `terms_accepted_${year}-${month}-${day}`;
}

const FALLBACK_TERMS = `# Terms of Use

**Version 2.98**
**Effective date:** 2026-07-07
**Domains:** stability.nexus and its subdomains.
**Repositories:** all repositories within https://github.com/StabilityNexus.

---

## Summary

This summary is not part of these Terms. It has no legal effect. Read the full Terms below.

- We are independent researchers and developers. We are not a company.
- We publish research papers and source code.
- We deploy Blockchain Applications and Interfaces based on our source code.
- We do not operate a service for you.
- You use everything at your own risk. We give no warranty of any kind.
- We never hold your assets. We never ask for your keys.
- We do not give financial, legal, or tax advice.
- Blockchain transactions are final. Nobody can reverse them.
- You are responsible for obeying the law that applies to you.
- If you are a consumer, your local consumer rights still apply. These Terms do not remove them.

---

## 1. About these Terms
1.1 These Terms apply to your use of the Works, as defined in clause 3.
1.2 Read these Terms before you use any Work. If you do not agree with these Terms, do not use the Works.
1.3 These Terms are dated and versioned. The version at the top of this document is the current version. Earlier versions stay available in the repositories named at the top of this document.
1.4 You accept these Terms when you tick the acceptance box in an Interface.
1.5 You may use a Work without an Interface. You may use a Work without ticking an acceptance box. In that case these Terms still apply to you as a notice and as conditions of the licence. Clause 32 explains this.
1.6 The version of these Terms that you last accepted governs your use of a Work until you accept a later version.

---

## 2. Important notice
2.1 The Works are experimental. They may contain errors.
2.2 You may lose all of the value of any asset that you use with a Work.
2.3 Nobody supports the Works. Nobody is obliged to fix an error. Nobody can recover your assets.
2.4 Nobody is liable for any loss that you suffer from your use of a Work, subject to consumer rights that cannot be excluded by law.
2.5 Blockchain transactions are final and irreversible.
2.6 Blockchains can fail, split, halt, or be attacked. We do not control any blockchain.
2.7 The regulatory status of tokens and blockchain technology is uncertain. Laws may change and may affect your use of a Work.
2.8 Nothing in any Work is financial, investment, legal, tax, or other professional advice.

---

## 3. Definitions
In these Terms:
- **"Blockchain Application"** means a set of smart contracts deployed on a blockchain.
- **"Interface"** means a website, web app, graphical user interface, API, or software tool through which you may interact with a Blockchain Application.
- **"Works"** means the Research, the Source Code, the Blockchain Applications, and the Interfaces, or any of them.
- **"We"** or **"us"** means the independent researchers and software developers who create, maintain, or publish the Works.
- **"You"** means any person who uses a Work.

---

## 4. No service, no contract for services
4.1 We publish software. We do not operate a service for you.
4.2 When you use an Interface, you are using software running locally in your browser or on your machine.
4.3 When you interact with a Blockchain Application, you are interacting directly with an autonomous smart contract on a blockchain.
4.4 No contract for the provision of services exists between you and us.
4.5 We have no fiduciary duty to you.

---

For the full detailed terms, visit: https://github.com/StabilityNexus/Info/blob/main/TermsOfUse.md`;

// Inline text renderer for links, bold, italic, and code tokens
function renderInlineMarkdown(text: string) {
  // Tokenize bold, italic, inline code, markdown links, and raw URLs
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="text-zinc-200 italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Code: `code`
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="px-1.5 py-0.5 rounded bg-white/10 text-primary font-mono text-[11px]">
          {part.slice(1, -1)}
        </code>
      );
    }

    // Markdown Link: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline underline-offset-2 break-all font-medium inline-flex items-center gap-0.5"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // Raw URL: https://...
    if (part.startsWith("http://") || part.startsWith("https://")) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline underline-offset-2 break-all font-medium inline-flex items-center gap-0.5"
        >
          {part}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

// Full Markdown document renderer
function MarkdownDocumentRenderer({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];
  let currentListItems: string[] = [];

  const flushList = () => {
    if (currentListItems.length > 0) {
      const listKey = `ul-${elements.length}`;
      elements.push(
        <ul key={listKey} className="my-3 space-y-2 pl-2">
          {currentListItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-zinc-300 text-xs sm:text-sm leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>{renderInlineMarkdown(item)}</div>
            </li>
          ))}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Horizontal Rule: --- or ***
    if (trimmed === "---" || trimmed === "***") {
      flushList();
      elements.push(<hr key={`hr-${index}`} className="border-white/10 my-4" />);
      return;
    }

    // Heading 1: # Heading
    if (trimmed.startsWith("# ")) {
      flushList();
      elements.push(
        <h1 key={`h1-${index}`} className="text-lg sm:text-xl font-bold text-white tracking-tight pb-2.5 border-b border-white/10 mt-2 mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
          {renderInlineMarkdown(trimmed.slice(2))}
        </h1>
      );
      return;
    }

    // Heading 2: ## Heading
    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={`h2-${index}`} className="text-sm sm:text-base font-semibold text-white tracking-tight mt-6 mb-3 pt-3 border-t border-white/5">
          {renderInlineMarkdown(trimmed.slice(3))}
        </h2>
      );
      return;
    }

    // Heading 3: ### Heading
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={`h3-${index}`} className="text-xs sm:text-sm font-semibold text-zinc-200 mt-4 mb-2">
          {renderInlineMarkdown(trimmed.slice(4))}
        </h3>
      );
      return;
    }

    // List Item: - item or * item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      currentListItems.push(trimmed.slice(2));
      return;
    }

    // Empty Line
    if (trimmed === "") {
      flushList();
      return;
    }

    // Numbered Clause / Standard Paragraph
    flushList();
    const clauseMatch = trimmed.match(/^(\d+\.\d+|\d+\.)\s+(.+)$/);
    if (clauseMatch) {
      elements.push(
        <div key={`p-${index}`} className="my-2.5 flex items-start gap-2 text-zinc-300 text-xs sm:text-sm leading-relaxed">
          <span className="font-mono text-xs font-semibold text-primary/90 bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 shrink-0 select-none">
            {clauseMatch[1]}
          </span>
          <div className="flex-1">
            {renderInlineMarkdown(clauseMatch[2])}
          </div>
        </div>
      );
    } else {
      elements.push(
        <p key={`p-${index}`} className="my-2.5 text-zinc-300 text-xs sm:text-sm leading-relaxed">
          {renderInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  flushList();

  return <div className="space-y-1 font-sans">{elements}</div>;
}

export default function TermsOfUseModal({ isOpen, onClose, onAccept }: TermsOfUseModalProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [agreed, setAgreed] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    fetch("https://raw.githubusercontent.com/StabilityNexus/Info/main/TermsOfUse.md")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch terms");
        return res.text();
      })
      .then((text) => {
        if (isMounted) {
          setContent(text);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching Terms of Use from GitHub:", err);
        if (isMounted) {
          setContent(FALLBACK_TERMS);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (!agreed) return;
    localStorage.setItem(getTodayUtcKey(), "true");
    onAccept();
  };

  return (
    <div
      className="fixed inset-0 bg-black/85 flex items-center justify-center z-[1000] p-4 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950/95 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-md max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-end items-center px-6 py-4 border-b border-white/5">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 text-2xl leading-none w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

          {/* Body: Rendered Markdown Document */}
          <div className="p-6 flex-grow flex flex-col overflow-hidden space-y-5">
            
            <div className="flex-grow overflow-y-auto max-h-[50vh] p-5 sm:p-6 bg-black/60 border border-white/10 rounded-2xl select-text shadow-inner scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="font-mono text-xs">Fetching latest Terms of Use from GitHub...</span>
                </div>
              ) : (
                <MarkdownDocumentRenderer markdown={content} />
              )}
            </div>

            {/* Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                id="terms-agreement-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-zinc-900 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary"
              />
              <label
                htmlFor="terms-agreement-checkbox"
                className="text-xs text-slate-200 cursor-pointer select-none font-sans leading-normal"
              >
                I have carefully read and I accept the Terms of Use.
              </label>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end items-center pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto h-11 px-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full hover:border-white/20 transition-all duration-300 active:scale-[0.98] font-mono text-xs tracking-wider uppercase font-medium cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleAccept}
                disabled={!agreed}
                className={`w-full sm:w-auto h-11 px-8 rounded-full font-mono text-xs tracking-wider uppercase font-bold transition-all duration-300 shadow-md flex items-center justify-center space-x-2 ${
                  agreed
                    ? "bg-white text-black hover:bg-zinc-200 active:scale-[0.98] cursor-pointer shadow-xl"
                    : "bg-white/10 text-zinc-500 border border-white/5 cursor-not-allowed opacity-60"
                }`}
              >
                Accept Terms of Use
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

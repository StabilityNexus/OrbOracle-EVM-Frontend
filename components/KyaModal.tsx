"use client";

import { useEffect, useRef } from "react";
import { useKYAModal } from "@/context/KYAModalContext";

export default function KyaModal() {
  const { isOpen, close } = useKYAModal();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const modal = dialogRef.current;
    if (!modal) return;

    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUnderstand = () => {
    localStorage.setItem("kya_seen_v1", "1");
    close();
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kya-modal-title"
        tabIndex={-1}
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg shadow-xl focus:outline-none"
        style={{ backgroundColor: "#1A1B1F" }}
      >
        <div className="flex items-center justify-between p-6">
          <h2 id="kya-modal-title" className="text-xl font-bold text-slate-100">
            Know Your Assumptions
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close Know Your Assumptions modal"
            className="flex h-8 w-8 items-center justify-center text-2xl leading-none text-slate-300 transition-colors hover:text-slate-100"
          >
            x
          </button>
        </div>

        <div className="space-y-4 p-6 text-sm leading-relaxed text-slate-200">
          <p>
            This decentralized application is composed of smart contracts running on a blockchain
            and a website that eases your interaction with the smart contracts.
          </p>

          <p>
            The smart contracts and the website were developed by The Stable Order, an organization
            dedicated to making the world more stable.
          </p>

          <p>
            The source code of the smart contracts and of the website can be found in{" "}
            <a
              href="https://github.com/StabilityNexus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline transition-colors hover:text-blue-300"
            >
              https://github.com/StabilityNexus
            </a>
            . We strongly recommend that you do your own research and inspect the source code of
            any blockchain application that you wish to interact with. The source code is the only
            source of truth about the applications that you use.
          </p>

          <p className="font-semibold text-slate-100">Please note:</p>

          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>
                When you interact with any smart contract on any blockchain through any application,
                your transactions are recorded anonymously forever on the blockchain.
              </strong>
              <ul className="mt-1 list-circle pl-6">
                <li>
                  Transactions are final and irreversible once they are confirmed on the blockchain.
                </li>
              </ul>
            </li>
            <li>
              <strong>
                The smart contracts made by The Stable Order are immutable and autonomous.
              </strong>
              <ul className="mt-1 list-circle pl-6">
                <li>
                  No one can change or update the smart contracts deployed on the blockchain.
                </li>
                <li>
                  The smart contracts are executed autonomously by the blockchain's block validators.
                </li>
              </ul>
            </li>
            <li>
              <strong>
                The websites made by The Stable Order are lean static serverless frontends.
              </strong>
              <ul className="mt-1 list-circle pl-6">
                <li>They do not collect your data on any server.</li>
                <li>
                  They rely solely on data available publicly on blockchains or on data stored
                  locally in your own device.
                </li>
                <li>
                  You may run the websites locally in your own computer. So, even if, for any
                  reason, the websites deployed in our own domains become unavailable, you can still
                  interact with the smart contracts.
                </li>
              </ul>
            </li>
            <li>
              Some of our projects may depend on external infrastructure, such as oracles and
              blockchain explorers.
            </li>
          </ul>

          <p>
            Interacting with blockchain applications may involve risks such as the following
            (non-exhaustively):
          </p>

          <ul className="list-disc space-y-2 pl-6">
            <li>
              You may lose your wallet password, recovery phrases or private keys, thereby losing
              access to your assets.
            </li>
            <li>
              Hackers may succeed in obtaining your wallet password, recovery phrases or private
              keys, thereby gaining access to your assets.
            </li>
            <li>
              The blockchain may become congested or unavailable, resulting in delays in the
              confirmation of your transactions.
            </li>
            <li>
              If you are interacting with a centralized blockchain (a.k.a. "L2", "sidechain",
              "Proof-of-Authority blockchain", ...), the block validators may decide to stop
              operating the blockchain.
            </li>
            <li>
              The external infrastructure on which a decentralized application depends may
              experience issues or become unavailable.
              <ul className="mt-1 list-circle pl-6">
                <li>Oracles, in particular, may suffer delays or manipulations.</li>
              </ul>
            </li>
            <li>
              The source code of the smart contracts and the website may contain bugs that may cause
              the application to behave unexpectedly and unfavourably.
            </li>
            <li>
              The algorithms and protocols implemented by the code may have unforeseen behaviors.
            </li>
          </ul>

          <p>
            While we do our best to ensure that we implement good algorithms and protocols, that the
            implementations are free from bugs, and that the deployed applications are fully or
            minimally dependent on external infrastructure, you use the applications at your own
            risk. You are solely responsible for your assets. You are solely responsible for the
            security of your wallet (and its password, recovery phrase and private keys). The Stable
            Order does not operate any blockchain, server or external infrastructure on which the
            application depends, and hence The Stable Order is not responsible for their operation.
          </p>

          <p>
            We will never ask for your password, recovery phrase or private keys. Anyone asking this
            information from you is almost certainly a scammer.
          </p>

          <p>
            We do not provide support of any kind. We do research and development. Uses of the
            algorithms, protocols, smart contracts, websites and applications that result from our
            research and development are at your own risk.
          </p>

          <p>
            By using this application, you confirm that you understand and agree with everything
            stated above and with our detailed{" "}
            <a
              href="https://terms.stability.nexus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline transition-colors hover:text-blue-300"
            >
              Terms and Conditions
            </a>
            .
          </p>

          <div className="flex justify-end gap-3 border-t border-blue-100 pt-4">
            <button
              type="button"
              onClick={handleUnderstand}
              className="rounded-md bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              I understand and I agree.
            </button>
            <button
              type="button"
              onClick={close}
              className="rounded-md bg-slate-700 px-6 py-2 font-medium text-white transition-colors hover:bg-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

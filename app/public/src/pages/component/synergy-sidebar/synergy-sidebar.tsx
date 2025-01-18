import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./synergy-sidebar.css";
import TypesBar from "./types-bar";
import PokemonList from "./pokemon-list";

interface SynergySidebarProps {
  show: boolean;
  onClose?: () => void;
  header?: JSX.Element | string;
}

export default function SynergySidebar(props: SynergySidebarProps) {
  const { show, onClose = () => {}, header } = props;
  const ref = useRef<HTMLDialogElement | null>(null);
  const [selectedSynergies, setSelectedSynergies] = useState([]);
  const close = () => {
    setSelectedSynergies([]);
    ref.current?.close();
    onClose();
  };

  useEffect(() => {
    if (show) {
      ref.current?.showModal();
    } else {
      close();
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      const dialog = ref.current!;
      dialog.addEventListener("click", function (event) {
        const rect = dialog.getBoundingClientRect();
        const isInDialog =
          (rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width) ||
          ["OPTION", "SELECT"].includes((event.target as any).tagName);
        if (!isInDialog) {
          close();
        }
      });
    }
  }, [show]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      close();
    }
  };

  return show
    ? ReactDOM.createPortal(
        <dialog
          ref={ref}
          onCancel={close}
          className="modal my-container synergy-sidebar"
          onKeyDown={handleKeyDown}
        >
          {header && (
            <header>
              {header}
              <button className="close-btn" onClick={close}>
                🗙
              </button>
            </header>
          )}
          <div className="modal-body">
            <PokemonList selectedSynergies={selectedSynergies} />
            <TypesBar
              selectedSynergies={selectedSynergies}
              setSelectedSynergies={setSelectedSynergies}
            />
          </div>
        </dialog>,
        document.querySelector("#modal-root")!
      )
    : null;
}

import React, { useEffect, useRef } from "react"
import ReactDOM from "react-dom"
import { useTranslation } from "react-i18next"
import { cc } from "../../utils/jsx"
import "./modal.css"

interface ModalProps {
  show: boolean
  onClose: () => void
  className?: string
  header?: JSX.Element | string
  body?: JSX.Element | string
  footer?: JSX.Element
  children?: JSX.Element | JSX.Element[]
  confirmText?: string
}

export function Modal(props: ModalProps) {
  const { show, onClose = () => { }, className = "", children, confirmText, header, body, footer } = props
  const ref = useRef<HTMLDialogElement | null>(null);
  const { t } = useTranslation()

  const close = () => {
    ref.current?.close();
    onClose();
  }

  useEffect(() => {
    if (show) {
      ref.current?.showModal();
    } else {
      close()
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      const dialog = ref.current!
      dialog.addEventListener('click', function (event) {
        var rect = dialog.getBoundingClientRect();
        var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
          close();
        }
      });
    }
  }, [show])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      close()
    }
  }

  return show ? ReactDOM.createPortal(
    <dialog ref={ref} onCancel={close} className={cc("modal", "my-container", className)} onKeyDown={handleKeyDown}>
      {header && <header>{header}</header>}
      <div className="modal-body">{body || children}</div>
      {(footer || confirmText) && (
        <footer>
          {footer}
          {confirmText && <><button className="secondary" onClick={close}>
            {t("close")}
          </button>
            <button className="primary" onClick={close}>
              {confirmText}
            </button></>}
        </footer>
      )}
    </dialog>,
    document.querySelector("#modal-root")!
  ) : null
}

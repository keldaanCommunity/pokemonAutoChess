import React from "react"

export default function PolicyButton() {
  function handlePrivacyPolicyClick() {
    window.location.href =
      "https://pokemonautochess-b18fb.web.app/privacy-policy.html"
  }
  return (
    <button
      type="button"
      className="bubbly"
      onClick={() => {
        handlePrivacyPolicyClick()
      }}
    >
      Policy
    </button>
  )
}

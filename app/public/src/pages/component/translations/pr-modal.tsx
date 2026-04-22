import { useState } from "react"
import { Language } from "../../../../../types/enum/Language"
import "./pr-modal.css"

const REPO_OWNER = "keldaanCommunity"
const REPO_NAME = "pokemonAutoChess"
const TRANSLATION_FILE_PATH = (lang: Language) =>
  `app/public/dist/client/locales/${lang}/translation.json`

export async function submitTranslationPR(
  token: string,
  lang: Language,
  langName: string,
  content: string,
  onProgress: (msg: string) => void
): Promise<string> {
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json"
  }

  // 1. Identify the authenticated user
  onProgress("Verifying GitHub token…")
  const userRes = await fetch("https://api.github.com/user", { headers })
  if (!userRes.ok) throw new Error("Invalid token or GitHub API error.")
  const user = await userRes.json()
  const username: string = user.login

  // 2. Ensure a fork exists under the user's account
  onProgress(`Checking for fork under ${username}…`)
  const forkCheckRes = await fetch(
    `https://api.github.com/repos/${username}/${REPO_NAME}`,
    { headers }
  )
  if (forkCheckRes.status === 404) {
    onProgress("Forking repository (this may take a moment)…")
    const forkRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/forks`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ default_branch_only: true })
      }
    )
    if (!forkRes.ok) throw new Error("Failed to fork the repository.")
    // Wait for fork to initialise
    await new Promise((r) => setTimeout(r, 6000))
  } else if (!forkCheckRes.ok) {
    throw new Error("Could not verify fork status.")
  }

  // 3. Get the SHA of master on the fork
  onProgress("Reading fork branch reference…")
  const refRes = await fetch(
    `https://api.github.com/repos/${username}/${REPO_NAME}/git/ref/heads/master`,
    { headers }
  )
  if (!refRes.ok)
    throw new Error(
      "Failed to read master branch from fork. Try syncing your fork."
    )
  const refData = await refRes.json()
  const masterSha: string = refData.object.sha

  // 4. Create a new branch on the fork
  const branchName = `translation/${lang}-${Date.now()}`
  onProgress(`Creating branch ${branchName}…`)
  const branchRes = await fetch(
    `https://api.github.com/repos/${username}/${REPO_NAME}/git/refs`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: masterSha
      })
    }
  )
  if (!branchRes.ok) throw new Error("Failed to create branch on fork.")

  // 5. Get current file SHA (required by the API to update an existing file)
  onProgress("Reading current translation file…")
  const filePath = TRANSLATION_FILE_PATH(lang)
  const fileRes = await fetch(
    `https://api.github.com/repos/${username}/${REPO_NAME}/contents/${filePath}?ref=${branchName}`,
    { headers }
  )
  let existingSha: string | undefined
  if (fileRes.ok) {
    const fileData = await fileRes.json()
    existingSha = fileData.sha
  }

  // 6. Commit the updated file
  onProgress("Committing updated translation file…")
  // btoa doesn't handle multi-byte chars; use TextEncoder + base64 instead
  const bytes = new TextEncoder().encode(content)
  const binary = Array.from(bytes, (b) => String.fromCodePoint(b)).join("")
  const encoded = btoa(binary)
  const commitBody: Record<string, unknown> = {
    message: `translation(${lang}): update ${langName} translations`,
    content: encoded,
    branch: branchName
  }
  if (existingSha) commitBody.sha = existingSha
  const commitRes = await fetch(
    `https://api.github.com/repos/${username}/${REPO_NAME}/contents/${filePath}`,
    { method: "PUT", headers, body: JSON.stringify(commitBody) }
  )
  if (!commitRes.ok) {
    const err = await commitRes.json()
    throw new Error(`Failed to commit file: ${err.message ?? "unknown error"}`)
  }

  // 7. Open the pull request against the upstream repo
  onProgress("Opening pull request…")
  const prRes = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: `Translations: update ${langName} (${lang})`,
        body: `Community translation contribution for **${langName}** (\`${lang}\`).\n\nSubmitted via the in-game translation editor.`,
        head: `${username}:${branchName}`,
        base: "master"
      })
    }
  )
  if (!prRes.ok) {
    const err = await prRes.json()
    throw new Error(`Failed to open PR: ${err.message ?? "unknown error"}`)
  }
  const pr = await prRes.json()
  return pr.html_url as string
}

export interface PRModalProps {
  lang: Language
  langName: string
  onClose: () => void
  onSubmit: (token: string) => void
  progress: string
  error: string
  prUrl: string
  submitting: boolean
}

export function PRModal({
  lang,
  langName,
  onClose,
  onSubmit,
  progress,
  error,
  prUrl,
  submitting
}: PRModalProps) {
  const [token, setToken] = useState("")

  return (
    <div className="pr-modal-overlay" onClick={onClose}>
      <div className="pr-modal my-box" onClick={(e) => e.stopPropagation()}>
        <h3>Submit Pull Request</h3>
        {prUrl ? (
          <>
            <p className="pr-modal-success">
              ✓ Pull request created successfully!
            </p>
            <a
              className="pr-modal-link"
              href={prUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {prUrl}
            </a>
            <div className="pr-modal-actions">
              <button className="bubbly blue" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              This will fork the repository (if needed), create a branch, commit
              your <strong>{langName}</strong> ({lang}) translation changes, and
              open a pull request against{" "}
              <code>
                {REPO_OWNER}/{REPO_NAME}
              </code>
              .
            </p>
            <label htmlFor="gh-token">
              GitHub Personal Access Token
              <a
                href="https://github.com/settings/personal-access-tokens/new"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: 8, fontSize: "0.8em" }}
              >
                (click here to create one)
              </a>
            </label>
            <p className="pr-modal-hint">
              Requires <code>repo</code> (or <code>public_repo</code>) scope.
              The token is only kept in memory and never stored, so it's up to
              you to save it securely.
            </p>
            <input
              id="gh-token"
              type="password"
              className="pr-modal-token-input"
              placeholder="ghp_…"
              value={token}
              onChange={(e) => setToken(e.currentTarget.value)}
              autoComplete="off"
            />
            {progress && <p className="pr-modal-progress">{progress}</p>}
            {error && <p className="pr-modal-error">{error}</p>}
            <div className="pr-modal-actions">
              <button
                className="bubbly"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="bubbly blue"
                disabled={!token.trim() || submitting}
                onClick={() => onSubmit(token.trim())}
              >
                {submitting ? "Submitting…" : "Submit Pull Request"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

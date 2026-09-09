"use client"

import { useState, FormEvent } from "react"

export default function CapturePage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)

    if (formData.get("website")) {
      setSubmitted(true)
      return
    }

    const data = {
      name: `${formData.get("firstName")} ${formData.get("lastName")}`.trim(),
      email: formData.get("email"),
      phone: formData.get("phone") || "",
      message: "In-person visitor — captured via QR code",
      source: "in-person-qr",
      website: "",
    }

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Network error")
      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again or ask staff for help.")
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#faf8f5",
        padding: "24px",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8e2d8",
          borderRadius: "12px",
          padding: "32px 24px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 2px 12px rgba(92,61,26,.05)",
        }}
      >
        {submitted ? (
          <div>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>&#x2713;</div>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.5rem",
                color: "#5c3d1a",
                marginBottom: "8px",
              }}
            >
              Thank You
            </h2>
            <p style={{ color: "#8a7e70", fontSize: "0.9rem" }}>
              We appreciate your visit. We will be in touch with framing tips and updates.
            </p>
          </div>
        ) : (
          <>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: "1.6rem",
                color: "#5c3d1a",
                marginBottom: "4px",
              }}
            >
              Salado Village Framer
            </h1>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#8a7e70",
                marginBottom: "24px",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
              }}
            >
              Custom framing in Salado since 2000
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input name="firstName" type="text" required placeholder="First name" autoComplete="given-name" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input name="lastName" type="text" required placeholder="Last name" autoComplete="family-name" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input name="email" type="email" required placeholder="you@example.com" autoComplete="email" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>
                  Phone <span style={{ color: "#c0b5a8" }}>(optional)</span>
                </label>
                <input name="phone" type="tel" placeholder="(555) 555-5555" autoComplete="tel" style={inputStyle} />
              </div>
              <input type="text" name="website" style={{ position: "absolute", left: "-9999px" }} tabIndex={-1} autoComplete="off" />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "14px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#5c3d1a",
                  color: "#fff",
                  fontSize: "1rem",
                  fontWeight: 500,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? "Submitting…" : "Stay in Touch"}
              </button>
              {error && <p style={{ color: "#c45", fontSize: "0.8rem", textAlign: "center" }}>{error}</p>}
              <p style={{ fontSize: "0.7rem", color: "#a09486", marginTop: "8px", textAlign: "center", lineHeight: 1.4 }}>
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </main>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#8a7e70",
  display: "block",
  marginBottom: "4px",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #e8e2d8",
  borderRadius: "8px",
  background: "#faf7f3",
  color: "#2a2520",
  fontSize: "1rem",
}

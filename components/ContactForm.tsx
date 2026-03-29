"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ nom: "", email: "", telephone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="form-card">
      <h2>Nous contacter</h2>

      <div className="field">
        <label>Nom *</label>
        <input name="nom" value={form.nom} onChange={handleChange} placeholder="Jean Dupont" />
      </div>

      <div className="field">
        <label>Email *</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jean@exemple.fr" />
      </div>

      <div className="field">
        <label>Téléphone</label>
        <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="+33 6 00 00 00 00" />
      </div>

      <div className="field">
        <label>Message *</label>
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Votre message..." rows={5} />
      </div>

      <button onClick={handleSubmit} disabled={status === "loading"} className="btn-submit">
        {status === "loading" ? "Envoi en cours..." : "Envoyer"}
      </button>

      {status === "success" && <p className="msg success">✅ Message envoyé avec succès !</p>}
      {status === "error" && <p className="msg error">❌ Une erreur est survenue. Réessayez.</p>}
    </div>
  );
}

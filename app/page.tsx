import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main>
      <div className="container">
        <div className="header">
          <h1>Formulaire<br />de Contact</h1>
          <p>Remplissez le formulaire ci-dessous, nous vous répondrons rapidement.</p>
        </div>
        <ContactForm />
        <div className="export-section">
          <a href="/api/export" className="btn-export">⬇ Exporter les données (CSV)</a>
        </div>
      </div>
    </main>
  );
}

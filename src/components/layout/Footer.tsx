
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/5bdd954f-63dd-4a66-8c3f-96d62e366662.png" 
                alt="Pets Flow Logo" 
                className="w-6 h-6"
              />
              <span className="text-lg font-bold text-primary">ExpertZwierzaki</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Platforma CRM dla specjalistów opiekujących się zwierzętami, z publicznym katalogiem usług.
            </p>
            <p className="text-sm text-muted-foreground">© 2025 ExpertZwierzaki. Wszelkie prawa zastrzeżone.</p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Platforma</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary">O Platformie</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-primary">Cennik</Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-primary">Katalog Specjalistów</Link>
              </li>
              <li>
                <Link to="/become-specialist" className="hover:text-primary">Zostań Specjalistą</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Wsparcie</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="hover:text-primary">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">Kontakt</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary">Polityka Prywatności</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary">Warunki Korzystania</Link>
              </li>
              <li>
                <Link to="/regulamin" className="hover:text-primary">Regulamin</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Kontakt</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>+48 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>kontakt@expertzwierzaki.pl</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Warszawa, Polska</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

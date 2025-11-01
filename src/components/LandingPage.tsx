import { useEffect, useState } from "react";
import { SignInForm } from "../SignInForm";

export function LandingPage({ onSignInClick }: { onSignInClick: () => void }) {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<"signIn" | "signUp">("signIn");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gray-900 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">N</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Noto</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAuthMode("signIn");
                setShowAuthForm(true);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Giriş Yap
            </button>
            <button
              onClick={() => {
                setAuthMode("signUp");
                setShowAuthForm(true);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Başlayın
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`flex-1 flex items-center justify-center px-6 py-20 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Düşüncelerinizi düzenleyin
          </h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Notlarınızı alın, düzenleyin ve ekibinizle paylaşın. 
            Her şey bir arada, sade ve güçlü.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setAuthMode("signUp");
                setShowAuthForm(true);
              }}
              className="px-6 py-3 text-base font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Ücretsiz Başlayın
            </button>
            <button
              onClick={() => {
                setAuthMode("signIn");
                setShowAuthForm(true);
              }}
              className="px-6 py-3 text-base font-medium text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Giriş Yapın
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              İhtiyacınız olan her şey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Düşüncelerinizi yapılandırmak için gereken tüm araçlar
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Gerçek zamanlı senkronizasyon",
                desc: "Tüm cihazlarınızda anında güncellenen notlar",
              },
              {
                title: "Güvenli ve özel",
                desc: "Verileriniz şifrelenmiş ve güvende",
              },
              {
                title: "Ekip işbirliği",
                desc: "Ekibinizle birlikte çalışın ve paylaşın",
              },
            ].map(({ title, desc }, i) => (
              <div key={i} className="bg-white rounded-lg p-8 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Bugün başlayın
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Ücretsiz hesap oluşturun ve düşüncelerinizi organize etmeye başlayın
          </p>
          <button
            onClick={() => {
              setAuthMode("signUp");
              setShowAuthForm(true);
            }}
            className="px-6 py-3 text-base font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Ücretsiz Başlayın
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center">
              <span className="text-white font-semibold text-xs">N</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">Noto</span>
          </div>
          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Noto. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthForm && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAuthForm(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAuthForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded bg-gray-900 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold text-lg">N</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {authMode === "signIn" ? "Tekrar hoş geldiniz" : "Hesap oluşturun"}
              </h2>
              <p className="text-gray-600">
                {authMode === "signIn" ? "Hesabınıza giriş yapın" : "Noto'yu kullanmaya başlayın"}
              </p>
            </div>
            <SignInForm />
            <p className="mt-6 text-center text-sm text-gray-600">
              {authMode === "signIn" ? (
                <>
                  Hesabınız yok mu?{" "}
                  <button
                    onClick={() => setAuthMode("signUp")}
                    className="text-gray-900 hover:underline font-medium"
                  >
                    Kayıt olun
                  </button>
                </>
              ) : (
                <>
                  Zaten hesabınız var mı?{" "}
                  <button
                    onClick={() => setAuthMode("signIn")}
                    className="text-gray-900 hover:underline font-medium"
                  >
                    Giriş yapın
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
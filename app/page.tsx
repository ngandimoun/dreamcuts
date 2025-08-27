"use client"

// Imports de React et des états
import { useState, useEffect } from "react";

// Imports pour Supabase, Zustand et les composants d'authentification
import { supabase } from "@/lib/supabase/client";
import { useAppStore } from "@/store/useStore";
import LoginModal from "@/components/auth/LoginModal";
import UserProfile from "@/components/auth/UserProfile";

// Imports des composants UI et des icônes
import { Button } from "@/components/ui/button";
import { Crown, Folder, FileText, Sparkles, X } from "lucide-react";

// Import du composant de chat
import ChatInterface from "@/components/chat/ChatInterface";
// Import du composant d'authentification automatique
import AuthPrompt from "@/components/auth/AuthPrompt";
// Import du composant unifié
import UnifiedInput from "@/components/UnifiedInput";
import { MediaItem } from "@/components/chat/mediaTypes";


export default function AIDesignToolV2() {
  // États locaux pour le prompt et la visibilité de la modale de connexion
  const [prompt, setPrompt] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  
  // Accès au store Zustand pour l'état global (utilisateur, prompt sauvegardé)
  const { user, setUser, promptBeforeLogin, setPromptBeforeLogin } = useAppStore();

  // Effet pour gérer l'état d'authentification et restaurer le prompt après connexion
  useEffect(() => {
    // Si un prompt a été sauvegardé avant la redirection de connexion, on le restaure
    if (promptBeforeLogin) {
      setPrompt(promptBeforeLogin);
      setPromptBeforeLogin(''); // Nettoyer le store après la restauration
    }

    // Récupérer la session initiale au chargement de la page
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Écouter les changements d'état d'authentification (connexion, déconnexion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Met toujours à jour l'état de l'utilisateur, quel que soit l'événement
      setUser(session?.user ?? null);

      // CORRECTION : Ne ferme la modale que lors d'un événement de connexion réussie.
      // Cela empêche la modale de se fermer lors des vérifications de session initiales.
      if (event === 'SIGNED_IN') {
        setShowLoginModal(false);
      }
    });

    // Nettoyer l'abonnement quand le composant est démonté pour éviter les fuites de mémoire
    return () => {
      subscription?.unsubscribe();
    };
  }, [setUser, promptBeforeLogin, setPromptBeforeLogin]);

  // Effet pour gérer le scroll global quand l'interface de chat est active
  useEffect(() => {
    if (showChatInterface) {
      document.body.classList.add('chat-active');
    } else {
      document.body.classList.remove('chat-active');
    }

    return () => {
      document.body.classList.remove('chat-active');
    };
  }, [showChatInterface]);


  // Gère l'envoi authentifié du prompt
  const handleAuthenticatedSend = (promptText: string, media: MediaItem[]) => {
    console.log("Utilisateur connecté. Envoi du prompt :", promptText);
    console.log("Médias sélectionnés :", media);
    // Afficher l'interface de chat
    setShowChatInterface(true);
  };

  return (
    <>
      {/* Affiche conditionnellement la modale de connexion par-dessus le reste de l'application */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      
      {/* Affiche conditionnellement l'interface de chat */}
      {showChatInterface && (
        <ChatInterface 
          initialPrompt={prompt} 
          onBack={() => setShowChatInterface(false)} 
        />
      )}


      
      {/* Interface par défaut - masquée pendant le chat */}
      {!showChatInterface && (
        <div className="min-h-screen font-sans bg-background">
        {/* Conteneur du header avec masque de fondu */}
        <div
          className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-r from-[#abf4fd] via-blue-100 to-purple-300"
          style={{ maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)' }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header Section */}
          <header className="flex justify-between items-center p-6">
            <div className="flex-1" />
            
            {/* Affiche le profil de l'utilisateur s'il est connecté, sinon le bouton "Upgrade" */}
            {user ? (
              <div className="flex items-center gap-2">
                <UserProfile />
                <Button className="bg-purple-100 cursor-pointer hover:bg-purple-200/80 text-purple-800 rounded-lg px-4 py-2 font-medium shadow-sm border border-purple-200/50">
                  <Crown className="w-4 h-4 mr-2 text-yellow-500" /> Upgrade your plan
                </Button>
              </div>
            ) : (
              <Button className="bg-purple-100 hover:bg-purple-200/80 text-purple-800 rounded-lg px-4 py-2 font-medium shadow-sm border border-purple-200/50">
                <Crown className="w-4 h-4 mr-2 text-yellow-500" /> Upgrade your plan
              </Button>
            )}
          </header>

          {/* Main Content */}
          <main className="flex flex-col items-center px-6 pb-10 pt-16">
            <div className="text-center mb-12">
              <h1 className="text-5xl ibarra-real-nova bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 bg-clip-text text-transparent mb-10">
                What will you design today?
              </h1>

              {/* Tab Navigation */}
              <div className="flex justify-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                  <Folder className="w-4 h-4" /> Your designs
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                  <FileText className="w-4 h-4" /> Templates
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-purple-800 bg-gradient-to-r from-cyan-100/70 to-purple-200/70 shadow-sm border border-purple-200/50">
                  <Sparkles className="w-4 h-4 text-purple-600" /> Canva AI <X className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>

            {/* AI Prompt Section */}
            <div className="w-full max-w-3xl mb-12">
              <UnifiedInput
                value={prompt}
                onChange={setPrompt}
                onAuthenticatedSend={handleAuthenticatedSend}
                showLoginModal={() => setShowLoginModal(true)}
                placeholder="Describe your idea, and I'll bring it to life"
                mediaPreviewSize="small"
              />
              <p className="text-center text-xs text-gray-500/80 mt-4">
                Canva AI can make mistakes. Please check for accuracy.{" "}
                <button className="underline hover:no-underline">See terms</button>
                {" • "}
                <button className="underline hover:no-underline">Give feedback</button>
              </p>
            </div>
          </main>
        </div>
      </div>
        )}

      {/* Modal d'authentification automatique - affiché uniquement pour les utilisateurs non connectés */}
      {!user && <AuthPrompt />}
      
    </>
  )
}
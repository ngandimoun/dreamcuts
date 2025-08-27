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
import { Crown, Plus, Mic, ArrowRight, Folder, FileText, Sparkles, X, ExternalLink, Video, Music } from "lucide-react";

// Import du composant de chat
import ChatInterface from "@/components/chat/ChatInterface";
// Import du composant d'authentification automatique
import AuthPrompt from "@/components/auth/AuthPrompt";
// Import du modal des médias
import MediaModal from "@/components/chat/MediaModal";
import MediaPreviewModal from "@/components/chat/MediaPreviewModal";
import SelectedMedia from "@/components/chat/SelectedMedia";
import { MediaItem } from "@/components/chat/mediaTypes";
import AspectRatioSelector from "@/components/ui/aspect-ratio-selector";
import ModelSelector from "@/components/ui/model-selector";


export default function AIDesignToolV2() {
  // États locaux pour le prompt et la visibilité de la modale de connexion
  const [prompt, setPrompt] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [selectedModel, setSelectedModel] = useState("claude-4-sonnet");
  
  // Accès au store Zustand pour l'état global (utilisateur, prompt sauvegardé)
  const { user, setUser, promptBeforeLogin, setPromptBeforeLogin } = useAppStore();

  // Détermine si le bouton d'envoi doit être actif
  const isArrowActive = prompt.trim().length > 0 || selectedMedia.length > 0;

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


  // Gère le clic sur le bouton d'envoi du prompt
  const handleSubmit = () => {
    if (!isArrowActive) return;

    if (user) {
      // Si l'utilisateur est connecté, on peut traiter le prompt
      console.log("Utilisateur connecté. Envoi du prompt :", prompt);
      console.log("Médias sélectionnés :", selectedMedia);
      // Afficher l'interface de chat
      setShowChatInterface(true);
      
    } else {
      // Si l'utilisateur n'est pas connecté :
      // 1. Sauvegarder le prompt actuel dans le store Zustand
      setPromptBeforeLogin(prompt);
      // 2. Ouvrir la modale de connexion
      setShowLoginModal(true);
    }
  };

  const handleSelectMedia = (media: MediaItem) => {
    setSelectedMedia(prev => [...prev, media]);
    setShowMediaModal(false);
  };

  const removeSelectedMedia = (mediaId: string) => {
    setSelectedMedia(prev => prev.filter(media => media.id !== mediaId));
  };

  const handleMediaPreview = (media: MediaItem, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPreviewMedia(media);
    setPreviewPosition({ x: rect.left + rect.width / 2, y: rect.top });
    setShowPreviewModal(true);
  };

  const handleMediaPreviewClose = () => {
    setShowPreviewModal(false);
    setPreviewMedia(null);
    setPreviewPosition(null);
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

      {/* Modal des médias */}
      <MediaModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onSelectMedia={handleSelectMedia}
      />

      {/* Modal de preview des médias */}
      <MediaPreviewModal
        isOpen={showPreviewModal}
        media={previewMedia}
        position={previewPosition}
      />
      
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
              <div className="relative">
                <div
                  className="absolute inset-x-4 top-5 h-full bg-gradient-to-r from-cyan-200 to-purple-300 rounded-2xl filter blur-2xl opacity-50 -z-10"
                  aria-hidden="true"
                />
                <div className="relative rounded-2xl bg-gradient-to-r from-[#d1f5fa] to-purple-200 p-[1.5px]">
                  <div className="bg-background backdrop-blur-lg rounded-[15px] p-4">
                    <div className="relative">
                      {/* Le textarea est un composant contrôlé lié à l'état `prompt` */}
                      <textarea
                        placeholder="Describe your idea, and I'll bring it to life"
                        className="w-full border-0 bg-transparent text-sm placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 py-1 resize-none min-h-[3rem]"
                        rows={2.5}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setShowMediaModal(true)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full h-8 w-8 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <AspectRatioSelector
                            value={aspectRatio}
                            onChange={setAspectRatio}
                          />
                          <ModelSelector
                            value={selectedModel}
                            onChange={setSelectedModel}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="bg-gray-100 hover:bg-gray-200 rounded-full p-2"><Mic className="w-5 h-5 text-gray-700" /></button>
                          
                          {/* Le bouton flèche est maintenant dynamique et gère l'envoi */}
                          <button 
                            onClick={handleSubmit}
                            disabled={!isArrowActive}
                            className={`rounded-full p-2 transition-colors ${
                              isArrowActive 
                                ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Zone des previews des médias (remplace les boutons de suggestion) */}
                      {selectedMedia.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 bg-gradient-to-r from-[#defbff] to-purple-100 -mx-4 -mb-4 px-4 pb-4 pt-3 rounded-b-2xl">
                          {selectedMedia.map((media) => (
                            <div key={media.id} className="relative group">
                              <div 
                                className="w-10 h-10 bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                                onMouseEnter={(e) => handleMediaPreview(media, e)}
                                onMouseLeave={handleMediaPreviewClose}
                              >
                                {media.type === 'image' ? (
                                  <img
                                    src={media.thumbnail || media.url}
                                    alt={media.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                    {media.type === 'video' ? (
                                      <Video className="w-6 h-6 text-gray-500" />
                                    ) : media.type === 'audio' ? (
                                      <Music className="w-6 h-6 text-gray-500" />
                                    ) : (
                                      <FileText className="w-6 h-6 text-gray-500" />
                                    )}
                                  </div>
                                )}
                              </div>
                              {/* Bouton de suppression */}
                              <button
                                onClick={() => removeSelectedMedia(media.id)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
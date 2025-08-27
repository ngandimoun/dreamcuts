"use client"

import { useEffect, useState } from "react";
import { Sparkles, Image, Video, FileText, Download, Share2 } from "lucide-react";

interface ResultColumnProps {
  isGenerating: boolean;
  generationSteps: string[];
  currentStep: number;
  finalResult: string | null;
}

export default function ResultColumn({
  isGenerating,
  generationSteps,
  currentStep,
  finalResult,
}: ResultColumnProps) {
  const [animationPhase, setAnimationPhase] = useState(0);

  // Gérer les phases d'animation
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 4);
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  // Déterminer le type de contenu basé sur le prompt (simulation)
  const getContentType = () => {
    // En réalité, cela serait déterminé par l'IA
    return "image"; // ou "video", "text"
  };

  const contentType = getContentType();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header de la colonne */}
      <div className="border-b border-gray-200 p-4 bg-background flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-50">Résultat de la génération</h3>
        <p className="text-sm text-gray-600 dark:text-gray-50">
          {isGenerating ? "Génération en cours..." : "Résultat final"}
        </p>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-6 overflow-hidden">
        {isGenerating ? (
          // État de génération avec animations
          <div className="h-full flex flex-col items-center justify-center">
            {/* Animation principale */}
            <div className="relative mb-8">
              {/* Cercle de base */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-200 to-blue-200 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-300 to-blue-300 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Particules animées */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-purple-400 rounded-full animate-ping"
                  style={{
                    top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`,
                    left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '1.5s'
                  }}
                />
              ))}
            </div>

            {/* Barre de progression */}
            <div className="w-full max-w-md mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-50 mb-2">
                <span>Progression</span>
                <span>{Math.round((currentStep / generationSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / generationSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Étape actuelle */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  {generationSteps[currentStep - 1] || "Initialisation..."}
                </span>
              </div>
            </div>

            {/* Animation secondaire */}
            <div className="mt-8 flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    animationPhase === i ? 'bg-purple-500 scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          // Résultat final
          <div className="h-full flex flex-col">
            {finalResult ? (
              <>
                {/* Aperçu du résultat */}
                <div className="flex-1 bg-background rounded-lg mb-4 flex items-center justify-center">
                  {contentType === "image" ? (
                    <div className="text-center">
                      <Image className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-50">Image générée</p>
                    </div>
                  ) : contentType === "video" ? (
                    <div className="text-center">
                      <Video className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-50">Vidéo générée</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-50">Contenu généré</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Télécharger
                  </button>
                  
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Partager
                  </button>
                </div>

                {/* Détails du résultat */}
                <div className="mt-4 p-4 bg-background rounded-lg">
                  <h4 className="font-medium text-gray-800 dark:text-gray-50 mb-2">Détails de la génération</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-50">
                    {finalResult}
                  </p>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-50">
                <p>En attente du résultat...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

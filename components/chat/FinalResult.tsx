"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  RotateCcw,
  Crop,
  Scissors,
  Palette,
  PaintBucket,
  FlipHorizontal,
  Maximize2,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  borderColor: string
}

interface ResultColumnProps {
  images?: GeneratedImage[]
  prompt?: string
}

export function FinalResult({
  images = [
    {
      id: "1",
      url: "/cute-little-girl-in-blue-hat-and-blue-dress-with-f.png",
      prompt: "Cute little girl in blue hat and blue dress with floral pattern",
      borderColor: "border-lime-400",
    },
    {
      id: "2",
      url: "/cute-anime-girl-in-green-dress-with-floral-pattern.png",
      prompt: "Cute anime girl in green dress with floral pattern and hat",
      borderColor: "border-yellow-400",
    },
  ],
  prompt = "Cute little girl in blue hat and blue dress with floral pattern",
}: ResultColumnProps) {
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set())
  const [dislikedImages, setDislikedImages] = useState<Set<string>>(new Set())
  const [activeTool, setActiveTool] = useState<string>("Cut")

  const handleLike = (imageId: string) => {
    const newLiked = new Set(likedImages)
    const newDisliked = new Set(dislikedImages)

    if (likedImages.has(imageId)) {
      newLiked.delete(imageId)
    } else {
      newLiked.add(imageId)
      newDisliked.delete(imageId)
    }

    setLikedImages(newLiked)
    setDislikedImages(newDisliked)
  }

  const handleDislike = (imageId: string) => {
    const newLiked = new Set(likedImages)
    const newDisliked = new Set(dislikedImages)

    if (dislikedImages.has(imageId)) {
      newDisliked.delete(imageId)
    } else {
      newDisliked.add(imageId)
      newLiked.delete(imageId)
    }

    setLikedImages(newLiked)
    setDislikedImages(newDisliked)
  }

  const editingTools = [
    { icon: Crop, label: "Crop", action: () => setActiveTool("Crop") },
    { icon: Scissors, label: "Cut", action: () => setActiveTool("Cut") },
    { icon: Palette, label: "Color", action: () => setActiveTool("Color") },
    { icon: PaintBucket, label: "Fill", action: () => setActiveTool("Fill") },
    { icon: FlipHorizontal, label: "Flip", action: () => setActiveTool("Flip") },
    { icon: Maximize2, label: "Expand", action: () => setActiveTool("Expand") },
  ]

  return (
    <div className="h-full flex flex-col p-6 bg-white dark:bg-gray-900">
      {/* Header avec prompt - Design moderne */}
      <div className="flex items-center gap-3 mb-6 flex-shrink-0">
        <div className="w-8 h-8 bg-lime-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-lime-500 rounded-full" />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
          {prompt}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Info className="w-4 h-4" />
        </Button>
      </div>

      {/* Generated Images Grid - Optimisé pour l'espace */}
      <div className="flex-1 min-h-0 mb-6">
        <div className="grid grid-cols-2 gap-4 h-full">
          {images.map((image) => (
            <Card
              key={image.id}
              className={cn(
                "relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 h-full flex flex-col",
                image.borderColor,
              )}
            >
              <div className="flex-1 relative overflow-hidden rounded-xl bg-white/80 dark:bg-black/20">
                <img 
                  src={image.url || "/placeholder.svg"} 
                  alt={image.prompt} 
                  className="w-full h-full object-cover rounded-xl"
                />
                {/* Overlay pour les interactions */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 rounded-xl" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Buttons - Design moderne et compact */}
      <div className="flex items-center justify-center gap-3 mb-6 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-12 h-12 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200",
            likedImages.size > 0 && "bg-green-100 dark:bg-green-900/30 shadow-md",
          )}
          onClick={() => images.forEach((img) => handleLike(img.id))}
        >
          <ThumbsUp
            className={cn(
              "w-5 h-5 transition-all duration-200", 
              likedImages.size > 0 ? "text-green-600 fill-current scale-110" : "text-gray-500 dark:text-gray-400"
            )}
          />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-12 h-12 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200",
            dislikedImages.size > 0 && "bg-red-100 dark:bg-red-900/30 shadow-md",
          )}
          onClick={() => images.forEach((img) => handleDislike(img.id))}
        >
          <ThumbsDown
            className={cn(
              "w-5 h-5 transition-all duration-200", 
              dislikedImages.size > 0 ? "text-red-600 fill-current scale-110" : "text-gray-500 dark:text-gray-400"
            )}
          />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200"
          onClick={() => console.log("Share")}
        >
          <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          onClick={() => console.log("Regenerate")}
        >
          <RotateCcw className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Button>
      </div>

      {/* Editing Tools Bar - Design moderne et professionnel */}
      <div className="flex justify-center flex-shrink-0">
        <div className="bg-gray-900 dark:bg-gray-800 rounded-full px-4 py-2 flex items-center gap-4 shadow-lg">
          {editingTools.map((tool, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center gap-1 text-white hover:bg-white/10 h-auto py-2 px-3 rounded-full transition-all duration-200",
                activeTool === tool.label && "bg-white/20 shadow-inner"
              )}
              onClick={tool.action}
            >
              <tool.icon className="w-4 h-4" />
              <span className="text-xs font-medium">{tool.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

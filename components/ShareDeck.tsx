import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Share2, Copy, Check, GitCommit, GitPullRequestIcon as GitPush } from "lucide-react"

interface ShareDeckProps {
  deckId: string
  deckName: string
  onCommit: () => void
  onPush: () => void
}

export function ShareDeck({ deckId, deckName, onCommit, onPush }: ShareDeckProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const shareableLink = `${window.location.origin}/shared/${deckId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share "{deckName}"</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input value={shareableLink} readOnly />
            <Button onClick={handleCopy}>
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button onClick={onCommit}>
              <GitCommit className="mr-2 h-4 w-4" />
              Commit Changes
            </Button>
            <Button onClick={onPush}>
              <GitPush className="mr-2 h-4 w-4" />
              Push Changes
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

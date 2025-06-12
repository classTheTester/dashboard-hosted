import { Button } from "@/components/ui/button"

interface ImagePositionPresetsProps {
  onPositionSelect: (position: string) => void
}

export function ImagePositionPresets({ onPositionSelect }: ImagePositionPresetsProps) {
  const positions = [
    { name: "Top Left", value: "top-left" },
    { name: "Top Center", value: "top-center" },
    { name: "Top Right", value: "top-right" },
    { name: "Center", value: "center" },
    { name: "Bottom Left", value: "bottom-left" },
    { name: "Bottom Center", value: "bottom-center" },
    { name: "Bottom Right", value: "bottom-right" },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {positions.map((position) => (
        <Button
          key={position.value}
          variant="outline"
          size="sm"
          onClick={() => onPositionSelect(position.value)}
          className="bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]"
        >
          {position.name}
        </Button>
      ))}
    </div>
  )
}


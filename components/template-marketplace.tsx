import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { ResumeTemplate } from "./types"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface TemplateMarketplaceProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templates: ResumeTemplate[]
  selectedTemplate: string
  onSelectTemplate: (template: ResumeTemplate) => void
}

export function TemplateMarketplace({
  open,
  onOpenChange,
  templates,
  selectedTemplate,
  onSelectTemplate,
}: TemplateMarketplaceProps) {
  const categories = Array.from(new Set(templates.map(t => t.category)))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 py-4">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates
                  .filter(t => t.category === category)
                  .map(template => (
                    <div
                      key={template.id}
                      className={cn(
                        "relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                        selectedTemplate === template.id
                          ? "border-blue-600"
                          : "border-transparent hover:border-gray-200"
                      )}
                      onClick={() => onSelectTemplate(template)}
                    >
                      <Image
                        src={template.preview}
                        alt={template.name}
                        width={300}
                        height={400}
                        className="w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-center text-white p-4">
                          <h4 className="font-semibold mb-2">{template.name}</h4>
                          <p className="text-sm text-gray-200">{template.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 
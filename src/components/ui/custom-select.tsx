import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  children?: React.ReactNode
  className?: string
}

export const CustomSelect = React.forwardRef<
  HTMLDivElement,
  CustomSelectProps
>(({ value, onValueChange, placeholder = "Select...", children, className }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value || "")
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (val: string) => {
    setSelectedValue(val)
    onValueChange?.(val)
    setIsOpen(false)
  }

  const options = React.Children.toArray(children).filter(
    (child): child is React.ReactElement =>
      React.isValidElement(child) && child.type === CustomSelectItem
  )

  const selectedOption = options.find((option) => option.props.value === selectedValue)

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.props.children : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full min-w-[8rem] rounded-md border bg-popover text-popover-foreground shadow-md"
        >
          <div className="max-h-60 overflow-y-auto p-1">
            {options.map((option) => (
              <button
                key={option.props.value}
                type="button"
                onClick={() => handleSelect(option.props.value)}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  selectedValue === option.props.value && "bg-accent"
                )}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {selectedValue === option.props.value && (
                    <Check className="h-4 w-4" />
                  )}
                </span>
                {option.props.children}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

CustomSelect.displayName = "CustomSelect"

interface CustomSelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export const CustomSelectItem: React.FC<CustomSelectItemProps> = ({
  children,
  className,
}) => {
  return <div className={className}>{children}</div>
}

CustomSelectItem.displayName = "CustomSelectItem"

export const CustomSelectTrigger = CustomSelect
export const CustomSelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const CustomSelectValue = ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>
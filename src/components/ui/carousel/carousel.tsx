
import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@/lib/utils"
import { 
  CarouselContext, 
  type CarouselApi, 
  type CarouselProps as CarouselContextProps 
} from "./carousel-context"
import { CarouselContent, CarouselItem } from "./carousel-content"
import { CarouselPrevious, CarouselNext } from "./carousel-navigation"

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselContextProps & {
    randomStart?: boolean;
    autoplay?: boolean;
    autoplayDelay?: number;
  }
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      randomStart = false,
      autoplay = false,
      autoplayDelay = 3000,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
        loop: true,
        startIndex: randomStart ? Math.floor(Math.random() * (children?.props?.children?.length || 8)) : 0
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)
    const [isPlaying, setIsPlaying] = React.useState(autoplay)
    const autoplayRef = React.useRef<NodeJS.Timeout | null>(null)

    const startAutoplay = React.useCallback(() => {
      if (!autoplay || !api) return
      
      autoplayRef.current = setInterval(() => {
        api.scrollNext()
      }, autoplayDelay)
      setIsPlaying(true)
    }, [api, autoplay, autoplayDelay])

    const stopAutoplay = React.useCallback(() => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
      setIsPlaying(false)
    }, [])

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    const handleMouseEnter = React.useCallback(() => {
      if (autoplay && isPlaying) {
        stopAutoplay()
      }
    }, [autoplay, isPlaying, stopAutoplay])

    const handleMouseLeave = React.useCallback(() => {
      if (autoplay) {
        startAutoplay()
      }
    }, [autoplay, startAutoplay])

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    React.useEffect(() => {
      if (autoplay && api) {
        startAutoplay()
      }

      return () => {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current)
        }
      }
    }, [autoplay, api, startAutoplay])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext }

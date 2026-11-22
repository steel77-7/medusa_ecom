import { clx } from "@modules/common/components/ui"
import Image from "next/image"
import React from "react"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url?: string }[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  alt?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "full",
  isFeatured: _isFeatured,
  className,
  alt = "",
  "data-testid": dataTestid,
}) => {
  let initialImage = thumbnail || images?.[0]?.url
  let secondaryImage = images && images.length > 1 ? images[1]?.url : null

  const normalizeUrl = (url?: string | null): string | undefined => {
    if (!url) return undefined
    const figmaIdx = url.indexOf("/figma/")
    if (figmaIdx !== -1) return url.substring(figmaIdx)
    return url
  }

  initialImage = normalizeUrl(initialImage)
  secondaryImage = normalizeUrl(secondaryImage) || null

  return (
    <div
      className={clx(
        "relative w-full aspect-square overflow-hidden bg-[#F0EEED] rounded-[20px] group transition-all duration-500 shadow-xs hover:shadow-md",
        className
      )}
      data-testid={dataTestid}
    >
      {initialImage ? (
        <>
          <Image
            src={initialImage}
            alt={alt ?? "Product image"}
            className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-[1.08] will-change-transform"
            draggable={false}
            quality={85}
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 600px"
            fill
          />
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${alt} alternate view`}
              className="absolute inset-0 h-full w-full object-contain p-4 opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-[1.08] will-change-transform"
              draggable={false}
              quality={85}
              sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 600px"
              fill
            />
          )}
        </>
      ) : (
        <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-[#F0EEED] text-neutral-400">
          <PlaceholderImage size={size === "small" ? 16 : 28} />
        </div>
      )}
    </div>
  )
}

export default Thumbnail

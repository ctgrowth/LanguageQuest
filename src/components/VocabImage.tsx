export function VocabImage({
  src,
  alt,
}: {
  src?: string
  alt: string
}) {
  if (!src) return null
  return (
    <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-white/70 ring-1 ring-navy/10">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}


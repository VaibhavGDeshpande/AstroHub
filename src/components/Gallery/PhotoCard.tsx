import Image from 'next/image';

export type GalleryPhoto = {
  id: string;
  title: string;
  photographer: string;
  image_url: string;
  width: number;
  height: number;
  target: string | null;
  telescope: string | null;
  camera: string | null;
  mount: string | null;
  exposure: string | null;
  location: string | null;
  captured_on: string | null;
  description: string | null;
};

const DETAILS: [keyof GalleryPhoto, string][] = [
  ['target', 'Target'],
  ['telescope', 'Telescope / lens'],
  ['camera', 'Camera'],
  ['mount', 'Mount'],
  ['exposure', 'Exposure'],
  ['location', 'Location'],
];

// Shared by the public gallery and the admin moderation queue, so admins see exactly what will be published.
export default function PhotoCard({ photo, children }: { photo: GalleryPhoto; children?: React.ReactNode }) {
  return (
    <figure className="break-inside-avoid mb-6 rounded-lg overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-600/40">
      <a href={photo.image_url} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size image of ${photo.title}`}>
        <Image
          src={photo.image_url}
          alt={`${photo.title}${photo.target ? `, ${photo.target}` : ''} by ${photo.photographer}`}
          width={photo.width}
          height={photo.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="w-full h-auto"
        />
      </a>
      <figcaption className="p-4 space-y-3">
        <div>
          <h2 className="font-semibold text-white leading-snug">{photo.title}</h2>
          <p className="text-sm text-slate-400">
            by {photo.photographer}
            {photo.captured_on && ` · ${new Date(`${photo.captured_on}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          </p>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
          {DETAILS.filter(([key]) => photo[key]).map(([key, label]) => (
            <div key={key} className="contents">
              <dt className="text-slate-500">{label}</dt>
              <dd className="text-slate-300 break-words">{photo[key]}</dd>
            </div>
          ))}
        </dl>
        {photo.description && <p className="text-sm text-slate-300 whitespace-pre-line">{photo.description}</p>}
        {children}
      </figcaption>
    </figure>
  );
}

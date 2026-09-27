import type { AcademicSubject } from '../content'
import { PatternVisual } from './PatternVisual'
import { ImageUpload } from './editor/ImageUpload'
import { GenericVisual, ObservationVisual, OrbitVisual } from './SubjectVisuals'

function DefaultVisual({ subject }: { subject: AcademicSubject }) {
  if (subject.id === 'mathematics') return <PatternVisual />
  if (subject.id === 'physics') return <OrbitVisual />
  if (subject.id === 'biology') return <ObservationVisual />
  return <GenericVisual />
}

export function SubjectMedia({ subject, index }: { subject: AcademicSubject; index: number }) {
  return (
    <div className="subject-media">
      {subject.image ? (
        <figure className="subject-photo">
          <img src={subject.image} alt={`${subject.project} — ${subject.title}`} />
        </figure>
      ) : (
        <DefaultVisual subject={subject} />
      )}
      <ImageUpload
        path={`academics.${index}.image`}
        label={subject.project}
        hasImage={!!subject.image}
        className="overlay"
        addText="Use a picture instead"
      />
    </div>
  )
}
